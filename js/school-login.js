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

let currentUser = null;

try {

    currentUser =
        JSON.parse(
            localStorage.getItem(
                "bmpCurrentUser"
            )
        );

} catch (error) {

    localStorage.removeItem(
        "bmpCurrentUser"
    );

    currentUser = null;

}


if (
    currentUser &&
    currentUser.institutionId &&
    currentUser.status === "active" &&
    (
        currentUser.role === "Director" ||
        currentUser.role === "Manager" ||
        currentUser.role === "User"
    )
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


        // =============================================
        // Validate Fields
        // =============================================

        if (
            !username ||
            !password
        ) {

            errorMessage.textContent =
                "Please enter username and password.";

            return;

        }


        // =============================================
        // Disable Button
        // =============================================

        loginButton.disabled =
            true;

        loginButton.textContent =
            "Signing in...";


        try {

            // =========================================
            // Send Login Request
            // =========================================

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


            // =========================================
            // Check HTTP Response
            // =========================================

            if (!response.ok) {

                throw new Error(
                    "Server returned an error."
                );

            }


            const result =
                await response.json();


            // =========================================
            // Login Failed
            // =========================================

            if (
                !result ||
                !result.success
            ) {

                errorMessage.textContent =
                    result &&
                    result.message
                        ? result.message
                        : "Login failed.";


                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Login";

                return;

            }


            // =========================================
            // Validate Returned User
            // =========================================

            if (
                !result.user ||
                !result.user.institutionId
            ) {

                throw new Error(
                    "Invalid login response."
                );

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
            // Go To School Dashboard
            // =========================================

            window.location.href =
                "school.html?id=" +
                encodeURIComponent(
                    result.user.institutionId
                );

        }
        catch (error) {

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
