// =====================================================
// BMP Admin Authentication
// =====================================================


// =====================================================
// Get Current Admin
// =====================================================

function getCurrentAdmin() {

    return JSON.parse(
        localStorage.getItem(
            "bmpCurrentUser"
        )
    );

}


// =====================================================
// Require Admin Login
// =====================================================

function requireAdminLogin() {

    const currentAdmin =
        getCurrentAdmin();


    if (
        !currentAdmin ||
        currentAdmin.role !== "Admin" ||
        currentAdmin.status !== "active"
    ) {

        window.location.href =
            "admin-login.html";

        return null;
    }


    return currentAdmin;
}


// =====================================================
// Admin Logout
// =====================================================

function logoutAdmin() {

    localStorage.removeItem(
        "bmpCurrentUser"
    );

    window.location.href =
        "admin-login.html";
}
