// =====================================================
// BMP Add Institution User
// Google Sheets / Apps Script Version
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Check School Session
// =====================================================

const currentUser =
    requireSchoolLogin();

if (!currentUser) {
    throw new Error(
        "School login required."
    );
}


// =====================================================
// Institution
// =====================================================

const institutionId =
    getActiveInstitutionId();

if (!institutionId) {
    throw new Error(
        "Institution access denied."
    );
}


// =====================================================
// Only Director Can Add Users
// =====================================================

if (
    String(currentUser.role || "")
        .trim()
        .toLowerCase() !== "director"
) {

    alert(
        "Only the Director can add users."
    );

    window.location.href =
        `school.html?id=${encodeURIComponent(
            institutionId
        )}`;

    throw new Error(
        "Director access required."
    );
}


// =====================================================
// Elements
// =====================================================

const institutionIdElement =
    document.getElementById(
        "institutionId"
    );

const institutionNameElement =
    document.getElementById(
        "institutionName"
    );

const institutionTypeElement =
    document.getElementById(
        "institutionType"
    );

const addUserForm =
    document.getElementById(
        "addUserForm"
    );

const usernameInput =
    document.getElementById(
        "username"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const cancelButton =
    document.getElementById(
        "cancelButton"
    );


// =====================================================
// Display Institution Information
// =====================================================

institutionIdElement.textContent =
    institutionId || "-";


institutionNameElement.textContent =
    currentUser.institutionName || "-";


institutionTypeElement.textContent =
    "School";


// =====================================================
// API Request
// =====================================================

async function apiRequest(
    payload
) {

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const result =
            await response.json();


        return result;

    } catch (error) {

        console.error(
            "API Error:",
            error
        );

        throw error;
    }
}


// =====================================================
// Back Button
// =====================================================

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `users.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);


// =====================================================
// Cancel Button
// =====================================================

cancelButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `users.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);


// =====================================================
// Create User
// =====================================================

addUserForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const username =
            usernameInput.value.trim();


        const password =
            passwordInput.value;


        // =================================================
        // Validate Username
        // =================================================

        if (!username) {

            alert(
                "Please enter a username."
            );

            usernameInput.focus();

            return;
        }


        // =================================================
        // Validate Password
        // =================================================

        if (!password) {

            alert(
                "Please enter a password."
            );

            passwordInput.focus();

            return;
        }


        // =================================================
        // Basic Username Validation
        // =================================================

        if (
            username.length < 3
        ) {

            alert(
                "Username must contain at least 3 characters."
            );

            usernameInput.focus();

            return;
        }


        // =================================================
        // Basic Password Validation
        // =================================================

        if (
            password.length < 4
        ) {

            alert(
                "Password must contain at least 4 characters."
            );

            passwordInput.focus();

            return;
        }


        // =================================================
        // Disable Form
        // =================================================

        const submitButton =
            addUserForm.querySelector(
                'button[type="submit"]'
            );


        const originalText =
            submitButton
                ? submitButton.textContent
                : "";


        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Creating...";
        }


        try {

            // =============================================
            // Send to Google Apps Script
            // =============================================

            const result =
                await apiRequest({

                    action:
                        "addUser",

                    // Director performing the action
                    institutionId:
                        institutionId,

                    username:
                        currentUser.username,

                    // New user's credentials
                    newUsername:
                        username,

                    newPassword:
                        password
                });


            // =============================================
            // Backend Error
            // =============================================

            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Failed to create user."
                );
            }


            // =============================================
            // Success
            // =============================================

            alert(
                "User created successfully."
            );


            // =============================================
            // Return to Users Page
            // =============================================

            window.location.href =
                `users.html?id=${encodeURIComponent(
                    institutionId
                )}`;


        } catch (error) {

            console.error(
                "Create User Error:",
                error
            );


            alert(
                error.message ||
                "Failed to create user."
            );


            // Restore button
            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    originalText;
            }
        }
    }
);
