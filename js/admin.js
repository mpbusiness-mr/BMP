
// =====================================================
// BMP Admin Dashboard
// =====================================================


// =====================================================
// Check Admin Session
// =====================================================

const currentAdmin =
    requireAdminLogin();

if (!currentAdmin) {
    throw new Error("Admin login required.");
}


// =====================================================
// Admin Dashboard
// =====================================================

const logoutButton =
    document.getElementById("logoutButton");


// =====================================================
// Logout
// =====================================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            logoutAdmin();

        }
    );

}



// =====================================================
// Navigation
// =====================================================

const institutionsButton =
    document.getElementById("institutionsButton");

const activityLogsButton =
    document.getElementById("activityLogsButton");


// =====================================================
// Institutions
// =====================================================

if (institutionsButton) {

    institutionsButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "institutions.html";

        }
    );

}


// =====================================================
// Activity Logs
// =====================================================

if (activityLogsButton) {

    activityLogsButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "activity-logs.html";

        }
    );

}
