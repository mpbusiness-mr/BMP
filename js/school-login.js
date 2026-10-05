// =====================================================
// BMP School Login
// =====================================================

// Elements
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("errorMessage");


// =====================================================
// Check Existing Session
// =====================================================

const currentUser =
    JSON.parse(
        localStorage.getItem("bmpCurrentUser")
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
// Get Institutions
// =====================================================

function getInstitutions() {

    return JSON.parse(
        localStorage.getItem("bmpInstitutions")
    ) || [];
}


// =====================================================
// Get Users
// =====================================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem("bmpUsers")
    ) || [];
}


// =====================================================
// Authenticate School User
// =====================================================

function authenticateSchoolUser(
    username,
    password
) {

    const institutions =
        getInstitutions();

    const users =
        getUsers();


    // Find Director / Manager
    // stored inside the institution
    const institution =
        institutions.find(
            function (item) {

                return (
                    item.type === "school" &&
                    item.username === username &&
                    item.password === password
                );

            }
        );


    if (institution) {

        // Institution disabled
        if (
            institution.status ===
            "disabled"
        ) {

            return {
                success: false,
                message:
                    "This school account is disabled."
            };
        }


        // Create Director session
        return {

            success: true,

            user: {

                id:
                    "DIRECTOR-" +
                    institution.id,

                username:
                    institution.username,

                role:
                    "Director",

                status:
                    "active",

                institutionId:
                    institution.id,

                institutionType:
                    institution.type,

                loginTime:
                    new Date().toISOString()

            }

        };
    }


    // =================================================
    // Find Additional User
    // =================================================

    const user =
        users.find(
            function (item) {

                return (
                    item.institutionId &&
                    item.username === username &&
                    item.password === password
                );

            }
        );


    if (user) {

        // Disabled user
        if (
            user.status !== "active"
        ) {

            return {
                success: false,
                message:
                    "This user account is disabled."
            };
        }


        // Find institution
        const userInstitution =
            institutions.find(
                function (item) {

                    return (
                        item.id ===
                        user.institutionId
                    );

                }
            );


        if (!userInstitution) {

            return {
                success: false,
                message:
                    "Institution not found."
            };
        }


        // Institution disabled
        if (
            userInstitution.status ===
            "disabled"
        ) {

            return {
                success: false,
                message:
                    "This school is currently disabled."
            };
        }


        // Create user session
        return {

            success: true,

            user: {

                id:
                    user.id,

                username:
                    user.username,

                role:
                    user.role,

                status:
                    user.status,

                institutionId:
                    user.institutionId,

                institutionType:
                    userInstitution.type,

                loginTime:
                    new Date().toISOString()

            }

        };
    }


    // =================================================
    // Invalid Login
    // =================================================

    return {

        success: false,

        message:
            "Invalid username or password."

    };
}


// =====================================================
// Login
// =====================================================

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        errorMessage.textContent = "";


        loginButton.disabled = true;

        loginButton.textContent =
            "Signing in...";


        // Authenticate
        const result =
            authenticateSchoolUser(
                username,
                password
            );


        // Login failed
        if (!result.success) {

            errorMessage.textContent =
                result.message;

            loginButton.disabled =
                false;

            loginButton.textContent =
                "Login";

            return;
        }


        // =================================================
        // Save Session
        // =================================================

        localStorage.setItem(
            "bmpCurrentUser",
            JSON.stringify(
                result.user
            )
        );


        // =================================================
        // Go To School Dashboard
        // =================================================

        window.location.href =
            "school.html?id=" +
            encodeURIComponent(
                result.user.institutionId
            );

    }
);
