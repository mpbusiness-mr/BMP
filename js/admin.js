
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

