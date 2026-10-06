// =====================================================
// BMP Admin Login
// =====================================================

// =====================================================
// Google Apps Script Backend
// =====================================================

const ADMIN_API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";

// =====================================================
// Elements
// =====================================================

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const errorMessage =
    document.getElementById("errorMessage");


// =====================================================
// Check Existing Session
// =====================================================

const currentUser =
    JSON.parse(
        localStorage.getItem("bmpCurrentUser")
    );

if (
    currentUser &&
    currentUser.role === "Admin" &&
    currentUser.status === "active"
) {

    window.location.href =
        "admin.html";

}


// =====================================================
// Authentication Function
// =====================================================

async function authenticateAdmin(
    username,
    password
) {

    try {

        const response =
    await fetch(
        ADMIN_API_URL,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body: JSON.stringify({

                action:
                    "adminLogin",

                username:
                    username,

                password:
                    password

            })
        }
    );


        const result =
            await response.json();


        // =============================================
        // Login Successful
        // =============================================

        if (
            result.success === true &&
            result.status === "active"
        ) {

            return {

                success: true,

                user: {

                    id:
                        result.id,

                    username:
                        username,

                    role:
                        "Admin",

                    status:
                        result.status,

                    institutionId:
                        null,

                    loginTime:
                        new Date().toISOString()

                }

            };

        }


        // =============================================
        // Login Failed
        // =============================================

        return {

            success: false,

            user: null

        };


    } catch (error) {

        console.error(
            "Admin login error:",
            error
        );

        return {

            success: false,

            user: null,

            error:
                "Unable to connect to server."

        };

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


        errorMessage.textContent = "";

        loginButton.disabled = true;

        loginButton.textContent =
            "Signing in...";


        // =============================================
        // Authenticate with Google Sheets
        // =============================================

        const result =
            await authenticateAdmin(
                username,
                password
            );


        // =============================================
        // Login Successful
        // =============================================

        if (result.success) {

            localStorage.setItem(
                "bmpCurrentUser",
                JSON.stringify(
                    result.user
                )
            );


            window.location.href =
                "admin.html";

            return;

        }


        // =============================================
        // Login Failed
        // =============================================

        if (result.error) {

            errorMessage.textContent =
                result.error;

        } else {

            errorMessage.textContent =
                "Invalid username or password.";

        }


        loginButton.disabled = false;

        loginButton.textContent =
            "Login";

    }
);
