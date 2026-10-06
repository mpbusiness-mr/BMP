// =====================================================
// BMP School Login
// =====================================================


// =====================================================
// Backend API
// =====================================================

const SCHOOL_API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


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


// =====================================================
// Check Existing Session
// =====================================================

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "bmpCurrentUser"
        )
    );


if (
    currentUser &&
    currentUser.institutionId &&
    (
        currentUser.role === "Director" ||
        currentUser.role === "Manager" ||
        currentUser.role === "User"
    ) &&
    currentUser.status === "active"
) {

    window.location.href =
        "school.html?id=" +
        encodeURIComponent(
            currentUser.institutionId
        );

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


        if (!username || !password) {

            errorMessage.textContent =
                "Please enter username and password.";

            return;

        }


        loginButton.disabled =
            true;

        loginButton.textContent =
            "Signing in...";


        try {

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


            const result =
                await response.json();


            // =========================================
            // Login Failed
            // =========================================

            if (!result.success) {

                errorMessage.textContent =
                    result.message ||
                    "Login failed.";

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Login";

                return;

            }


            // =========================================
            // Save Session
            // =========================================

            localStorage.setItem(

                "bmpCurrentUser",

                JSON.stringify(
                    result.user
                )

            );


            // =========================================
            // Go To Dashboard
            // =========================================

            window.location.href =
                "school.html?id=" +
                encodeURIComponent(
                    result.user.institutionId
                );


        } catch (error) {

            console.error(
                error
            );


            errorMessage.textContent =
                "Unable to connect to server.";


            loginButton.disabled =
                false;

            loginButton.textContent =
                "Login";

        }

    }
);
