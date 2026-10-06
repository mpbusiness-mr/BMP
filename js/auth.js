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


    // =================================================
    // Institution ID
    // =================================================

    /*
        Normal school pages:

        ?id=INSTITUTION_ID

        Edit student page:

        ?id=STUDENT_ID
        &institutionId=INSTITUTION_ID
    */

    const requestedInstitutionId =
        urlParams.get(
            "institutionId"
        );


    const requestedId =
        urlParams.get(
            "id"
        );


    // =================================================
    // Edit Student / pages using institutionId
    // =================================================

    if (
        requestedInstitutionId
    ) {

        // Prevent access to another institution
        if (
            requestedInstitutionId !==
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


    // =================================================
    // Normal pages using id
    // =================================================

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
