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
// Translations
// =====================================================

const translations = {

    en: {

        language: "Language",

        schoolLogin: "School Login",

        loginDescription:
            "Sign in to your school account.",

        username:
            "Username",

        usernamePlaceholder:
            "Enter username",

        password:
            "Password",

        passwordPlaceholder:
            "Enter password",

        login:
            "Login",

        signingIn:
            "Signing in...",

        pleaseEnterCredentials:
            "Please enter username and password.",

        serverError:
            "Server returned an error.",

        loginFailed:
            "Login failed.",

        invalidResponse:
            "Invalid login response.",

        unableToConnect:
            "Unable to connect to server."

    },


    ar: {

        language:
            "اللغة",

        schoolLogin:
            "تسجيل دخول المدرسة",

        loginDescription:
            "قم بتسجيل الدخول إلى حساب مدرستك.",

        username:
            "اسم المستخدم",

        usernamePlaceholder:
            "أدخل اسم المستخدم",

        password:
            "كلمة المرور",

        passwordPlaceholder:
            "أدخل كلمة المرور",

        login:
            "تسجيل الدخول",

        signingIn:
            "جاري تسجيل الدخول...",

        pleaseEnterCredentials:
            "يرجى إدخال اسم المستخدم وكلمة المرور.",

        serverError:
            "حدث خطأ في الخادم.",

        loginFailed:
            "فشل تسجيل الدخول.",

        invalidResponse:
            "استجابة تسجيل الدخول غير صالحة.",

        unableToConnect:
            "تعذر الاتصال بالخادم."

    },


    fr: {

        language:
            "Langue",

        schoolLogin:
            "Connexion de l'école",

        loginDescription:
            "Connectez-vous à votre compte scolaire.",

        username:
            "Nom d'utilisateur",

        usernamePlaceholder:
            "Entrez le nom d'utilisateur",

        password:
            "Mot de passe",

        passwordPlaceholder:
            "Entrez le mot de passe",

        login:
            "Connexion",

        signingIn:
            "Connexion en cours...",

        pleaseEnterCredentials:
            "Veuillez saisir le nom d'utilisateur et le mot de passe.",

        serverError:
            "Le serveur a renvoyé une erreur.",

        loginFailed:
            "Échec de la connexion.",

        invalidResponse:
            "Réponse de connexion invalide.",

        unableToConnect:
            "Impossible de se connecter au serveur."

    }

};


// =====================================================
// Current Language
// =====================================================

let currentLanguage =
    localStorage.getItem(
        "bmpLanguage"
    ) || "en";


// =====================================================
// Elements
// =====================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );

const usernameInput =
    document.getElementById(
        "username"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const loginButton =
    document.getElementById(
        "loginButton"
    );

const errorMessage =
    document.getElementById(
        "errorMessage"
    );

const languageSelect =
    document.getElementById(
        "languageSelect"
    );


// =====================================================
// Apply Language
// =====================================================

function applyLanguage(
    language
) {

    if (
        !translations[language]
    ) {

        language =
            "en";
    }


    currentLanguage =
        language;


    localStorage.setItem(
        "bmpLanguage",
        language
    );


    // =================================================
    // HTML Direction
    // =================================================

    document.documentElement.lang =
        language;

    document.documentElement.dir =
        language === "ar"
            ? "rtl"
            : "ltr";


    // =================================================
    // Text
    // =================================================

    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(
            function (element) {

                const key =
                    element.getAttribute(
                        "data-i18n"
                    );


                if (
                    translations[language][key]
                ) {

                    element.textContent =
                        translations[
                            language
                        ][key];

                }

            }
        );


    // =================================================
    // Placeholders
    // =================================================

    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach(
            function (element) {

                const key =
                    element.getAttribute(
                        "data-i18n-placeholder"
                    );


                if (
                    translations[language][key]
                ) {

                    element.placeholder =
                        translations[
                            language
                        ][key];

                }

            }
        );


    // =================================================
    // Language Selector
    // =================================================

    if (languageSelect) {

        languageSelect.value =
            language;

    }


    // =================================================
    // Login Button
    // =================================================

    if (
        loginButton &&
        !loginButton.disabled
    ) {

        loginButton.textContent =
            translations[
                language
            ].login;

    }

}


// =====================================================
// Change Language
// =====================================================

if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        function () {

            applyLanguage(
                languageSelect.value
            );

        }
    );

}


// =====================================================
// Check Existing Session
// =====================================================

let currentUser = null;


try {

    const savedUser =
        localStorage.getItem(
            "bmpCurrentUser"
        );


    if (savedUser) {

        currentUser =
            JSON.parse(
                savedUser
            );

    }

} catch (error) {

    console.error(
        "Invalid saved session:",
        error
    );


    localStorage.removeItem(
        "bmpCurrentUser"
    );


    currentUser =
        null;
}


// =====================================================
// Validate Existing Session
// =====================================================

if (currentUser) {

    const role =
        String(
            currentUser.role || ""
        )
        .trim()
        .toLowerCase();


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
            encodeURIComponent(
                currentUser.institutionId
            );

    } else {

        localStorage.removeItem(
            "bmpCurrentUser"
        );

        currentUser =
            null;
    }
}


// =====================================================
// Login
// =====================================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const username =
            usernameInput.value.trim();


        const password =
            passwordInput.value;


        errorMessage.textContent =
            "";


        // =================================================
        // Validate Fields
        // =================================================

        if (
            !username ||
            !password
        ) {

            errorMessage.textContent =
                translations[
                    currentLanguage
                ].pleaseEnterCredentials;

            return;
        }


        // =================================================
        // Disable Button
        // =================================================

        loginButton.disabled =
            true;


        loginButton.textContent =
            translations[
                currentLanguage
            ].signingIn;


        try {

            // =============================================
            // Send Login Request
            // =============================================

            const response =
                await fetch(
                    SCHOOL_API_URL,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "text/plain;charset=utf-8"

                        },

                        body:
                            JSON.stringify({

                                action:
                                    "schoolLogin",

                                username:
                                    username,

                                password:
                                    password

                            })

                    }
                );


            // =============================================
            // HTTP Error
            // =============================================

            if (!response.ok) {

                throw new Error(
                    translations[
                        currentLanguage
                    ].serverError
                );

            }


            // =============================================
            // Read JSON
            // =============================================

            const result =
                await response.json();


            // =============================================
            // Login Failed
            // =============================================

            if (
                !result ||
                !result.success
            ) {

                errorMessage.textContent =
                    result &&
                    result.message
                        ? result.message
                        : translations[
                            currentLanguage
                        ].loginFailed;


                loginButton.disabled =
                    false;


                loginButton.textContent =
                    translations[
                        currentLanguage
                    ].login;


                return;
            }


            // =============================================
            // Validate User
            // =============================================

            if (
                !result.user ||
                !result.user.institutionId ||
                !result.user.username
            ) {

                throw new Error(
                    translations[
                        currentLanguage
                    ].invalidResponse
                );

            }


            // =============================================
            // Normalize Role
            // =============================================

            const role =
                String(
                    result.user.role || ""
                )
                .trim();


            if (
                !role
            ) {

                throw new Error(
                    translations[
                        currentLanguage
                    ].invalidResponse
                );

            }


            // =============================================
            // Normalize Status
            // =============================================

            const status =
                String(
                    result.user.status ||
                    "active"
                )
                .trim()
                .toLowerCase();


            if (
                status !== "active"
            ) {

                errorMessage.textContent =
                    "This account is not active.";


                loginButton.disabled =
                    false;


                loginButton.textContent =
                    translations[
                        currentLanguage
                    ].login;


                return;
            }


            // =============================================
            // Save Authenticated Session
            // =============================================

            const authenticatedUser = {

                ...result.user,

                role:
                    role,

                status:
                    status

            };


            localStorage.setItem(

                "bmpCurrentUser",

                JSON.stringify(
                    authenticatedUser
                )

            );


            // =============================================
            // Go To School Dashboard
            // =============================================

            window.location.href =
                "school.html?id=" +
                encodeURIComponent(
                    authenticatedUser.institutionId
                );

        }


        catch (error) {

            console.error(
                "School Login Error:",
                error
            );


            errorMessage.textContent =
                error.message &&
                error.message !==
                    "Failed to fetch"
                    ? error.message
                    : translations[
                        currentLanguage
                    ].unableToConnect;


            loginButton.disabled =
                false;


            loginButton.textContent =
                translations[
                    currentLanguage
                ].login;

        }

    }
);


// =====================================================
// Initialize Language
// =====================================================

applyLanguage(
    currentLanguage
);
