// Get institutions
const institutions =
    JSON.parse(localStorage.getItem("bmpInstitutions")) || [];


// Get institution ID from URL
const urlParams =
    new URLSearchParams(window.location.search);

const institutionId =
    urlParams.get("id");


// Find institution
const institution =
    institutions.find(
        item => item.id === institutionId
    );


// Elements
const institutionIdElement =
    document.getElementById("institutionId");

const institutionNameElement =
    document.getElementById("institutionName");

const institutionTypeElement =
    document.getElementById("institutionType");

const addUserForm =
    document.getElementById("addUserForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const backButton =
    document.getElementById("backButton");

const cancelButton =
    document.getElementById("cancelButton");


// Check institution
if (!institution) {

    alert("Institution not found.");

    window.location.href =
        "institutions.html";

} else {

    // Display institution information

    institutionIdElement.textContent =
        institution.id || "-";

    institutionNameElement.textContent =
        institution.name || "-";

    institutionTypeElement.textContent =
        institution.type === "school"
            ? "School"
            : "Restaurant";
}


// Get users
function getUsers() {

    return JSON.parse(
        localStorage.getItem("bmpUsers")
    ) || [];
}


// Save users
function saveUsers(users) {

    localStorage.setItem(
        "bmpUsers",
        JSON.stringify(users)
    );
}


// Back button
backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `users.html?id=${encodeURIComponent(institutionId)}`;
    }
);


// Cancel button
cancelButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `users.html?id=${encodeURIComponent(institutionId)}`;
    }
);


// Create user
addUserForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        // Validate username
        if (!username) {

            alert("Please enter a username.");

            usernameInput.focus();

            return;
        }


        // Validate password
        if (!password) {

            alert("Please enter a password.");

            passwordInput.focus();

            return;
        }


        // Get existing users
        const users =
            getUsers();


        // Check duplicate username
        const usernameExists =
            users.some(
                user =>
                    user.username.toLowerCase() ===
                    username.toLowerCase()
            );


        if (usernameExists) {

            alert(
                "This username is already in use."
            );

            usernameInput.focus();

            return;
        }


        // Create new user
        const newUser = {

            id:
                "USR-" +
                Date.now(),

            institutionId:
                institutionId,

            username:
                username,

            password:
                password,

            role:
                "user",

            status:
                "active",

            isMainUser:
                false,

            createdAt:
                new Date().toISOString(),

            permissions: {

                // Full operational access
                students:
                    true,

                payments:
                    true,

                reports:
                    true,

                receipts:
                    true,

                transactions:
                    true,

                // User management is Director/Manager only
                manageUsers:
                    false
            }
        };


        // Add user
        users.push(newUser);


        // Save users
        saveUsers(users);


        alert(
            "User created successfully."
        );


        // Return to users page
        window.location.href =
            `users.html?id=${encodeURIComponent(institutionId)}`;
    }
);
