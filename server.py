#!/usr/bin/env python3
"""Local web server and SQLite-backed authentication for Conecta Cidadão."""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
import re
import secrets
import sqlite3
import time
from contextlib import closing
from http import HTTPStatus
from http.cookies import CookieError, SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "data" / "users.sqlite3"
HOST = "127.0.0.1"
PORT = 8000
PASSWORD_ITERATIONS = 600_000
SESSION_LIFETIME = 7 * 24 * 60 * 60
MAX_REQUEST_BYTES = 16_384
USERNAME_PATTERN = re.compile(r"^[A-Za-z0-9_.-]{3,32}$")
COOKIE_NAME = "conecta_session"
LOGGER = logging.getLogger("conecta-cidadao")


class RequestError(Exception):
    def __init__(self, status: HTTPStatus, message: str) -> None:
        self.status = status
        self.message = message


def connect_database() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database() -> None:
    with closing(connect_database()) as connection:
        with connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    full_name TEXT NOT NULL,
                    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
                    password_salt BLOB NOT NULL,
                    password_hash BLOB NOT NULL,
                    created_at INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS sessions (
                    token_hash TEXT PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    expires_at INTEGER NOT NULL
                );
                CREATE INDEX IF NOT EXISTS sessions_expires_at
                    ON sessions(expires_at);
                """
            )


def hash_password(password: str, salt: bytes | None = None) -> tuple[bytes, bytes]:
    actual_salt = salt if salt is not None else secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), actual_salt, PASSWORD_ITERATIONS
    )
    return actual_salt, digest


def token_digest(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def public_user(row: sqlite3.Row) -> dict[str, str]:
    return {"username": row["username"], "full_name": row["full_name"]}


def clean_expired_sessions(connection: sqlite3.Connection) -> None:
    connection.execute("DELETE FROM sessions WHERE expires_at <= ?", (int(time.time()),))


class AppHandler(SimpleHTTPRequestHandler):
    server_version = "ConectaCidadao/1.0"

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:
        parsed_path = urlsplit(self.path)
        path = parsed_path.path
        if path == "/api/auth/session":
            try:
                self.get_session()
            except sqlite3.Error:
                LOGGER.exception("Falha ao consultar a sessão no banco de dados.")
                self.send_json(
                    HTTPStatus.INTERNAL_SERVER_ERROR,
                    {"error": "Não foi possível verificar sua sessão."},
                )
            return
        if path in ("/login", "/register"):
            query = f"?{parsed_path.query}" if parsed_path.query else ""
            self.path = f"{path}/index.html{query}"
        super().do_GET()

    def do_POST(self) -> None:
        path = urlsplit(self.path).path
        try:
            if path == "/api/auth/register":
                self.register()
            elif path == "/api/auth/login":
                self.login()
            elif path == "/api/auth/logout":
                self.logout()
            else:
                self.send_json(HTTPStatus.NOT_FOUND, {"error": "Rota não encontrada."})
        except RequestError as error:
            self.send_json(error.status, {"error": error.message})
        except sqlite3.Error:
            LOGGER.exception("Falha ao acessar o banco de dados.")
            self.send_json(
                HTTPStatus.INTERNAL_SERVER_ERROR,
                {"error": "Não foi possível concluir a operação. Tente novamente."},
            )

    def read_json(self) -> dict[str, Any]:
        if self.headers.get_content_type() != "application/json":
            raise RequestError(HTTPStatus.UNSUPPORTED_MEDIA_TYPE, "Envie os dados em JSON.")

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError as error:
            raise RequestError(HTTPStatus.BAD_REQUEST, "Requisição inválida.") from error

        if content_length <= 0 or content_length > MAX_REQUEST_BYTES:
            self.close_connection = True
            raise RequestError(HTTPStatus.BAD_REQUEST, "Tamanho da requisição inválido.")

        try:
            payload = json.loads(self.rfile.read(content_length))
        except (json.JSONDecodeError, UnicodeDecodeError) as error:
            raise RequestError(HTTPStatus.BAD_REQUEST, "JSON inválido.") from error
        if not isinstance(payload, dict):
            raise RequestError(HTTPStatus.BAD_REQUEST, "Dados inválidos.")
        return payload

    @staticmethod
    def required_text(payload: dict[str, Any], key: str) -> str:
        value = payload.get(key)
        if not isinstance(value, str):
            raise RequestError(HTTPStatus.BAD_REQUEST, "Preencha todos os campos.")
        return value.strip()

    def register(self) -> None:
        payload = self.read_json()
        full_name = self.required_text(payload, "full_name")
        username = self.required_text(payload, "username")
        password = payload.get("password")
        confirm_password = payload.get("confirm_password")

        if not full_name or len(full_name) > 100:
            raise RequestError(HTTPStatus.BAD_REQUEST, "Informe um nome com até 100 caracteres.")
        if not USERNAME_PATTERN.fullmatch(username):
            raise RequestError(
                HTTPStatus.BAD_REQUEST,
                "O usuário deve ter de 3 a 32 caracteres: letras, números, ponto, hífen ou sublinhado.",
            )
        if not isinstance(password, str) or not 8 <= len(password) <= 256:
            raise RequestError(HTTPStatus.BAD_REQUEST, "A senha deve ter entre 8 e 256 caracteres.")
        if password != confirm_password:
            raise RequestError(HTTPStatus.BAD_REQUEST, "As senhas não coincidem.")

        salt, password_hash = hash_password(password)
        try:
            with closing(connect_database()) as connection:
                with connection:
                    clean_expired_sessions(connection)
                    connection.execute(
                        """
                        INSERT INTO users (full_name, username, password_salt, password_hash, created_at)
                        VALUES (?, ?, ?, ?, ?)
                        """,
                        (full_name, username, salt, password_hash, int(time.time())),
                    )
        except sqlite3.IntegrityError as error:
            raise RequestError(
                HTTPStatus.CONFLICT, "Esse usuário já está cadastrado."
            ) from error

        self.send_json(HTTPStatus.CREATED, {"message": "Cadastro criado com sucesso."})

    def login(self) -> None:
        payload = self.read_json()
        username = self.required_text(payload, "username")
        password = payload.get("password")
        if not username or not isinstance(password, str):
            raise RequestError(HTTPStatus.BAD_REQUEST, "Informe usuário e senha.")

        with closing(connect_database()) as connection:
            with connection:
                clean_expired_sessions(connection)
                user = connection.execute(
                    "SELECT * FROM users WHERE username = ? COLLATE NOCASE", (username,)
                ).fetchone()

        if user is None:
            salt, expected_hash = bytes(16), bytes(32)
        else:
            salt, expected_hash = user["password_salt"], user["password_hash"]
        _, provided_hash = hash_password(password, salt)
        if user is None or not hmac.compare_digest(provided_hash, expected_hash):
            raise RequestError(HTTPStatus.UNAUTHORIZED, "Usuário ou senha incorretos.")

        token = secrets.token_urlsafe(32)
        expires_at = int(time.time()) + SESSION_LIFETIME
        with closing(connect_database()) as connection:
            with connection:
                connection.execute(
                    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
                    (token_digest(token), user["id"], expires_at),
                )

        self.send_json(
            HTTPStatus.OK,
            {"user": public_user(user)},
            cookie=self.cookie_header(token, SESSION_LIFETIME),
        )

    def get_session(self) -> None:
        token = self.get_session_token()
        if token is None:
            self.send_json(HTTPStatus.OK, {"user": None})
            return

        with closing(connect_database()) as connection:
            with connection:
                clean_expired_sessions(connection)
                row = connection.execute(
                    """
                    SELECT users.username, users.full_name, sessions.expires_at
                    FROM sessions JOIN users ON users.id = sessions.user_id
                    WHERE sessions.token_hash = ?
                    """,
                    (token_digest(token),),
                ).fetchone()

        if row is None or row["expires_at"] <= int(time.time()):
            self.send_json(
                HTTPStatus.OK,
                {"user": None},
                cookie=self.cookie_header("", 0),
            )
            return
        self.send_json(HTTPStatus.OK, {"user": public_user(row)})

    def logout(self) -> None:
        token = self.get_session_token()
        if token is not None:
            with closing(connect_database()) as connection:
                with connection:
                    connection.execute(
                        "DELETE FROM sessions WHERE token_hash = ?", (token_digest(token),)
                    )
        self.send_json(
            HTTPStatus.OK,
            {"message": "Você saiu da sua conta."},
            cookie=self.cookie_header("", 0),
        )

    def get_session_token(self) -> str | None:
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get("Cookie", ""))
        except CookieError:
            LOGGER.warning("Cookie de sessão malformado recebido.")
            return None
        morsel = cookie.get(COOKIE_NAME)
        return morsel.value if morsel else None

    @staticmethod
    def cookie_header(token: str, max_age: int) -> str:
        return (
            f"{COOKIE_NAME}={token}; Path=/; HttpOnly; SameSite=Lax; "
            f"Max-Age={max_age}"
        )

    def send_json(
        self,
        status: HTTPStatus,
        payload: dict[str, Any],
        cookie: str | None = None,
    ) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        if cookie is not None:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    initialize_database()
    httpd = ThreadingHTTPServer((HOST, PORT), AppHandler)
    LOGGER.info("Conecta Cidadão disponível em http://%s:%s", HOST, PORT)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        LOGGER.info("Encerrando servidor.")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
