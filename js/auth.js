const authApi = async (path, payload, method = "POST") => {
    const response = await fetch(path, {
        method,
        headers: payload ? { "Content-Type": "application/json" } : {},
        body: payload ? JSON.stringify(payload) : undefined,
        credentials: "same-origin",
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || "Não foi possível concluir a operação.");
    }
    return result;
};

const showMessage = (element, message, isError = false) => {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("is-error", isError);
};

const updateLoginLink = (user) => {
    const link = document.querySelector(".nav-login");
    if (!link) return;
    const label = link.querySelector("span");
    link.classList.toggle("is-greeting", Boolean(user));
    if (label) {
        label.textContent = user ? `Olá, ${user.full_name}!` : "Login/Cadastro";
    }
    link.setAttribute("aria-label", user ? `Olá, ${user.full_name}!` : "Login/Cadastro");
    if (user) {
        link.title = `Olá, ${user.full_name}!`;
    } else {
        link.removeAttribute("title");
    }
};

const loadSession = async () => {
    try {
        const { user } = await authApi("/api/auth/session", null, "GET");
        updateLoginLink(user);
        return user;
    } catch (error) {
        console.error("Não foi possível verificar a sessão:", error);
        return null;
    }
};

const setupLogin = () => {
    const form = document.querySelector("#login-form");
    if (!form) return;

    const message = document.querySelector("#login-message");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        showMessage(message, "Entrando...");
        try {
            await authApi("/api/auth/login", {
                username: form.elements.username.value,
                password: form.elements.password.value,
            });
            window.location.assign("/");
        } catch (error) {
            showMessage(message, error.message, true);
        } finally {
            button.disabled = false;
        }
    });

    if (new URLSearchParams(window.location.search).has("registered")) {
        showMessage(message, "Cadastro realizado. Entre com seu usuário e senha.");
    }
};

const setupRegistration = () => {
    const form = document.querySelector("#register-form");
    if (!form) return;

    const message = document.querySelector("#register-message");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (form.elements.password.value !== form.elements.confirm_password.value) {
            showMessage(message, "As senhas não coincidem.", true);
            form.elements.confirm_password.focus();
            return;
        }

        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        showMessage(message, "Criando cadastro...");
        try {
            await authApi("/api/auth/register", {
                full_name: form.elements.full_name.value,
                username: form.elements.username.value,
                password: form.elements.password.value,
                confirm_password: form.elements.confirm_password.value,
            });
            window.location.assign("/login?registered=1");
        } catch (error) {
            showMessage(message, error.message, true);
        } finally {
            button.disabled = false;
        }
    });
};

const setupLoggedInView = async (user) => {
    const loggedInView = document.querySelector("#logged-in-view");
    if (!loggedInView || !user) return;

    document.querySelector("#login-view").hidden = true;
    loggedInView.hidden = false;
    document.querySelector("#logged-in-name").textContent = `Olá, ${user.full_name}!`;

    const logoutButton = document.querySelector("#logout-button");
    const message = document.querySelector("#logout-message");
    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        try {
            await authApi("/api/auth/logout");
            window.location.assign("/");
        } catch (error) {
            showMessage(message, error.message, true);
            logoutButton.disabled = false;
        }
    });
};

document.addEventListener("DOMContentLoaded", async () => {
    setupLogin();
    setupRegistration();
    const user = await loadSession();
    await setupLoggedInView(user);
});
