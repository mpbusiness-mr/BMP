// =====================================================
// BMP Admin Dashboard
// =====================================================


// =====================================================
// Check Admin Session
// =====================================================

const currentUser =
    JSON.parse(
        localStorage.getItem("bmpCurrentUser")
    );


// No valid Admin session
if (
    !currentUser ||
    currentUser.role !== "Admin" ||
    currentUser.status !== "active"
) {

    window.location.href =
        "admin-login.html";

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

            localStorage.removeItem(
                "bmpCurrentUser"
            );

            window.location.href =
                "admin-login.html";
        }
    );

}
