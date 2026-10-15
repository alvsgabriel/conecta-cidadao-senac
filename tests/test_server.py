import http.cookiejar
import json
import tempfile
import threading
import unittest
from contextlib import closing
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import HTTPCookieProcessor, Request, build_opener

import server


class AuthenticationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.TemporaryDirectory()
        server.DB_PATH = Path(cls.temp_dir.name) / "users.sqlite3"
        server.initialize_database()
        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.AppHandler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.httpd.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join()
        cls.temp_dir.cleanup()

    def setUp(self):
        cookie_jar = http.cookiejar.CookieJar()
        self.client = build_opener(HTTPCookieProcessor(cookie_jar))

    def post_json(self, path, payload=None):
        data = json.dumps(payload or {}).encode("utf-8")
        request = Request(
            self.base_url + path,
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            response = self.client.open(request)
        except HTTPError as error:
            response = error
        return response.status, json.loads(response.read())

    def get_json(self, path):
        with self.client.open(self.base_url + path) as response:
            return response.status, json.loads(response.read())

    def register_user(self, username="cidada", password="senha-segura-123"):
        return self.post_json(
            "/api/auth/register",
            {
                "full_name": "Pessoa de Teste",
                "username": username,
                "password": password,
                "confirm_password": password,
            },
        )

    def test_registration_stores_password_hash_and_rejects_duplicate_username(self):
        status, result = self.register_user(username="teste.user")
        self.assertEqual(status, 201, result)

        with closing(server.connect_database()) as connection:
            stored = connection.execute(
                "SELECT password_salt, password_hash FROM users WHERE username = ?",
                ("teste.user",),
            ).fetchone()
        self.assertNotEqual(stored["password_hash"], b"senha-segura-123")
        self.assertEqual(len(stored["password_salt"]), 16)

        status, result = self.register_user(username="TESTE.USER")
        self.assertEqual(status, 409)
        self.assertIn("já está cadastrado", result["error"])

    def test_login_session_and_logout(self):
        self.assertEqual(self.register_user(username="cidada")[0], 201)
        status, result = self.post_json(
            "/api/auth/login", {"username": "CIDADA", "password": "senha-segura-123"}
        )
        self.assertEqual(status, 200, result)
        self.assertEqual(result["user"]["full_name"], "Pessoa de Teste")

        status, result = self.get_json("/api/auth/session")
        self.assertEqual(status, 200)
        self.assertEqual(result["user"]["username"], "cidada")

        status, result = self.post_json("/api/auth/logout")
        self.assertEqual(status, 200, result)
        self.assertIsNone(self.get_json("/api/auth/session")[1]["user"])

    def test_invalid_credentials_and_mismatched_password_confirmation(self):
        self.register_user(username="credenciais")
        status, result = self.post_json(
            "/api/auth/login", {"username": "credenciais", "password": "incorreta"}
        )
        self.assertEqual(status, 401)
        self.assertEqual(result["error"], "Usuário ou senha incorretos.")

        status, result = self.post_json(
            "/api/auth/register",
            {
                "full_name": "Outra Pessoa",
                "username": "outra.pessoa",
                "password": "senha-segura-123",
                "confirm_password": "senha-diferente",
            },
        )
        self.assertEqual(status, 400)
        self.assertEqual(result["error"], "As senhas não coincidem.")

    def test_local_pages_are_available_at_clean_routes(self):
        for route, expected in (("/login", b"Entrar"), ("/register", b"Criar cadastro")):
            with self.subTest(route=route), self.client.open(self.base_url + route) as response:
                self.assertEqual(response.status, 200)
                self.assertIn(expected, response.read())


if __name__ == "__main__":
    unittest.main()
