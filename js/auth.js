// =====================================================
// BMP Authentication Helper
// =====================================================


// =====================================================
// Get Current User
// =====================================================

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem(
            "bmpCurrentUser"
        )
    );

}


// =====================================================
// Require School Login
// =====================================================

function requireSchoolLogin() {

    const currentUser =
        getCurrentUser();


    if (
        !currentUser ||
        !currentUser.institutionId ||
        (
            currentUser.role !== "Director" &&
            currentUser.role !== "Manager" &&
            currentUser.role !== "User"
        ) ||
        currentUser.status !== "active"
    ) {

        window.location.href =
            "school-login.html";

        return null;
    }


    return currentUser;
}


// =====================================================
// Get Active Institution ID
// =====================================================

function getActiveInstitutionId() {

    const currentUser =
        requireSchoolLogin();


    if (!currentUser) {
        return null;
    }


    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const requestedId =
        urlParams.get("id");


    // Prevent access to another institution
    if (
        requestedId &&
        requestedId !==
            currentUser.institutionId
    ) {

        window.location.href =
            "school.html?id=" +
            encodeURIComponent(
                currentUser.institutionId
            );

        return null;
    }


    return currentUser.institutionId;
}


// =====================================================
// Logout
// =====================================================

function logoutUser() {

    localStorage.removeItem(
        "bmpCurrentUser"
    );

    window.location.href =
        "school-login.html";
}
