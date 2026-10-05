// =====================================================
// BMP Admin Login
// =====================================================

// Elements
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("errorMessage");


// =====================================================
// Temporary Authentication Data
// =====================================================

// TEMPORARY ONLY
// Later this data will come from the Admin Authentication Sheet.

const ADMIN_ACCOUNT = {
    id: "ADMIN-001",
    username: "owner",
    password: "1234",
    role: "Admin",
    status: "active"
};


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
    window.location.href = "admin.html";
}


// =====================================================
// Authentication Function
// =====================================================

function authenticateAdmin(username, password) {

    // Later:
    // This function will request the Authentication Sheet
    // instead of checking local data.

    if (
        username === ADMIN_ACCOUNT.username &&
        password === ADMIN_ACCOUNT.password &&
        ADMIN_ACCOUNT.status === "active"
    ) {

        return {
            success: true,
            user: {
                id: ADMIN_ACCOUNT.id,
                username: ADMIN_ACCOUNT.username,
                role: ADMIN_ACCOUNT.role,
                status: ADMIN_ACCOUNT.status,
                institutionId: null,
                loginTime:
                    new Date().toISOString()
            }
        };
    }

    return {
        success: false,
        user: null
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
        loginButton.textContent = "Signing in...";


        // Authenticate
        const result =
            authenticateAdmin(
                username,
                password
            );


        // Login successful
        if (result.success) {

            localStorage.setItem(
                "bmpCurrentUser",
                JSON.stringify(result.user)
            );

            window.location.href =
                "admin.html";

            return;
        }


        // Login failed
        errorMessage.textContent =
            "Invalid username or password.";

        loginButton.disabled = false;
        loginButton.textContent =
            "Login";
    }
);
