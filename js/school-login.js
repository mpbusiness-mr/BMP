// =====================================================
// BMP School Login
// Director + User
// =====================================================


// =====================================================
// Backend API
// =====================================================

const SCHOOL_API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Default language
// =====================================================

const DEFAULT_LANG = "ar";
const STORAGE_KEY_LANG = "bmpLanguage";
const STORAGE_KEY_USER = "bmpCurrentUser";


// =====================================================
// Translations
// =====================================================

const translations = {

    ar: {
        schoolLogin:            "تسجيل دخول المدرسة",
        loginDescription:       "قم بتسجيل الدخول إلى حساب مدرستك.",
        username:               "اسم المستخدم",
        usernamePlaceholder:    "أدخل اسم المستخدم",
        password:               "كلمة المرور",
        passwordPlaceholder:    "أدخل كلمة المرور",
        login:                  "تسجيل الدخول",
        signingIn:              "جاري تسجيل الدخول...",
        pleaseEnterCredentials: "يرجى إدخال اسم المستخدم وكلمة المرور.",
        serverError:            "حدث خطأ في الخادم.",
        loginFailed:            "فشل تسجيل الدخول.",
        invalidResponse:        "استجابة تسجيل الدخول غير صالحة.",
        unableToConnect:        "تعذر الاتصال بالخادم.",
        accountNotActive:       "هذا الحساب غير مفعّل."
    },

    fr: {
        schoolLogin:            "Connexion de l'école",
        loginDescription:       "Connectez-vous à votre compte scolaire.",
        username:               "Nom d'utilisateur",
        usernamePlaceholder:    "Entrez le nom d'utilisateur",
        password:               "Mot de passe",
        passwordPlaceholder:    "Entrez le mot de passe",
        login:                  "Connexion",
        signingIn:              "Connexion en cours...",
        pleaseEnterCredentials: "Veuillez saisir le nom d'utilisateur et le mot de passe.",
        serverError:            "Le serveur a renvoyé une erreur.",
        loginFailed:            "Échec de la connexion.",
        invalidResponse:        "Réponse de connexion invalide.",
        unableToConnect:        "Impossible de se connecter au serveur.",
        accountNotActive:       "Ce compte n'est pas actif."
    },

    en: {
        schoolLogin:            "School Login",
        loginDescription:       "Sign in to your school account.",
        username:               "Username",
        usernamePlaceholder:    "Enter username",
        password:               "Password",
        passwordPlaceholder:    "Enter password",
        login:                  "Login",
        signingIn:              "Signing in...",
        pleaseEnterCredentials: "Please enter username and password.",
        serverError:            "Server returned an error.",
        loginFailed:            "Login failed.",
        invalidResponse:        "Invalid login response.",
        unableToConnect:        "Unable to connect to server.",
        accountNotActive:       "This account is not active."
    }

};


// =====================================================
// Current language
// =====================================================

let currentLanguage =
    localStorage.getItem(STORAGE_KEY_LANG) || DEFAULT_LANG;


// =====================================================
// Elements
// =====================================================

const loginForm      = document.getElementById("loginForm");
const usernameInput  = document.getElementById("username");
const passwordInput  = document.getElementById("password");
const loginButton    = document.getElementById("loginButton");
const errorMessage   = document.getElementById("errorMessage");
const togglePassword = document.getElementById("togglePassword");
const langButtons    = document.querySelectorAll(".lang-btn");


// =====================================================
// Apply Language
// =====================================================

function applyLanguage(language) {

    if (!translations[language]) {
        language = DEFAULT_LANG;
    }

    currentLanguage = language;
    localStorage.setItem(STORAGE_KEY_LANG, language);

    document.documentElement.lang = language;
    document.documentElement.dir  = (language === "ar") ? "rtl" : "ltr";

    document.body.classList.remove("lang-ar", "lang-fr", "lang-en");
    document.body.classList.add("lang-" + language);

    document.querySelectorAll("[data-ar]").forEach(function (el) {
        const value = el.dataset[language];
        if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-ar-placeholder]").forEach(function (el) {
        const value = el.dataset[language + "Placeholder"];
        if (value !== undefined) el.placeholder = value;
    });

    langButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === language);
    });

    if (loginButton && !loginButton.classList.contains("loading")) {
        const label = loginButton.querySelector(".btn-label");
        if (label) label.textContent = translations[language].login;
    }
}


// =====================================================
// Language Switcher
// =====================================================

langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        applyLanguage(btn.dataset.lang);
    });
});


// =====================================================
// Show / Hide Password
// =====================================================

if (togglePassword) {
    togglePassword.addEventListener("click", function () {

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        const icon = togglePassword.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-eye",        !isPassword);
            icon.classList.toggle("fa-eye-slash",   isPassword);
        }
    });
}


// =====================================================
// Check Existing Session
// =====================================================

let currentUser = null;

try {
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
} catch (error) {
    console.error("Invalid saved session:", error);
    localStorage.removeItem(STORAGE_KEY_USER);
    currentUser = null;
}


// =====================================================
// Validate Existing Session
// =====================================================

if (currentUser) {

    const role = String(currentUser.role || "").trim().toLowerCase();

    const validRole =
        role === "director" ||
        role === "user" ||
        role === "manager";

    const validSession =
        currentUser.institutionId &&
        currentUser.username &&
        currentUser.status === "active" &&
        validRole;

    if (validSession) {
        window.location.href =
            "school.html?id=" +
            encodeURIComponent(currentUser.institutionId);
    } else {
        localStorage.removeItem(STORAGE_KEY_USER);
        currentUser = null;
    }
}


// =====================================================
// Login
// =====================================================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    errorMessage.textContent = "";

    if (!username || !password) {
        errorMessage.textContent =
            translations[currentLanguage].pleaseEnterCredentials;
        return;
    }

    loginButton.disabled = true;
    loginButton.classList.add("loading");

    const label = loginButton.querySelector(".btn-label");
    if (label) label.textContent = translations[currentLanguage].signingIn;

    try {

        const response = await fetch(SCHOOL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action:   "schoolLogin",
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error(translations[currentLanguage].serverError);
        }

        const result = await response.json();

        if (!result || !result.success) {
            errorMessage.textContent =
                (result && result.message)
                    ? result.message
                    : translations[currentLanguage].loginFailed;

            loginButton.disabled = false;
            loginButton.classList.remove("loading");
            if (label) label.textContent = translations[currentLanguage].login;
            return;
        }

        if (
            !result.user ||
            !result.user.institutionId ||
            !result.user.username
        ) {
            throw new Error(translations[currentLanguage].invalidResponse);
        }

        const role = String(result.user.role || "").trim();
        if (!role) {
            throw new Error(translations[currentLanguage].invalidResponse);
        }

        const status = String(result.user.status || "active")
            .trim()
            .toLowerCase();

        if (status !== "active") {
            errorMessage.textContent =
                translations[currentLanguage].accountNotActive;

            loginButton.disabled = false;
            loginButton.classList.remove("loading");
            if (label) label.textContent = translations[currentLanguage].login;
            return;
        }

        const authenticatedUser = {
            ...result.user,
            role: role,
            status: status
        };

        localStorage.setItem(
            STORAGE_KEY_USER,
            JSON.stringify(authenticatedUser)
        );

        window.location.href =
            "school.html?id=" +
            encodeURIComponent(authenticatedUser.institutionId);

    } catch (error) {

        console.error("School Login Error:", error);

        errorMessage.textContent =
            (error.message && error.message !== "Failed to fetch")
                ? error.message
                : translations[currentLanguage].unableToConnect;

        loginButton.disabled = false;
        loginButton.classList.remove("loading");
        if (label) label.textContent = translations[currentLanguage].login;
    }
});


// =====================================================
// Init
// =====================================================

applyLanguage(currentLanguage);
