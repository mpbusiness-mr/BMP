// =====================================================
// BMP School Dashboard
// =====================================================


// =====================================================
// Check Session
// =====================================================

const currentUser =
    JSON.parse(
        localStorage.getItem("bmpCurrentUser")
    );


// =====================================================
// Validate User
// =====================================================

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

}


// =====================================================
// Get Institution ID
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const institutionId =
    urlParams.get("id");


// =====================================================
// Prevent Access To Another Institution
// =====================================================

if (
    institutionId &&
    institutionId !==
        currentUser.institutionId
) {

    window.location.href =
        "school.html?id=" +
        encodeURIComponent(
            currentUser.institutionId
        );

}


// Use session institution
// if no ID exists in URL
const activeInstitutionId =
    currentUser.institutionId;


// =====================================================
// Get Institutions
// =====================================================

const institutions =
    JSON.parse(
        localStorage.getItem(
            "bmpInstitutions"
        )
    ) || [];


// =====================================================
// Find Institution
// =====================================================

const institution =
    institutions.find(
        function (item) {

            return (
                item.id ===
                activeInstitutionId
            );

        }
    );


// Institution not found
if (!institution) {

    localStorage.removeItem(
        "bmpCurrentUser"
    );

    window.location.href =
        "school-login.html";

}


// =====================================================
// Check Institution Status
// =====================================================

function getInstitutionStatus(
    institution
) {

    if (
        institution.status ===
        "disabled"
    ) {

        return "Disabled";

    }


    if (
        institution.licenseEnd
    ) {

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const licenseEnd =
            new Date(
                institution.licenseEnd
            );

        licenseEnd.setHours(
            0,
            0,
            0,
            0
        );


        if (
            licenseEnd < today
        ) {

            return "Expired";

        }

    }


    return "Active";
}


// =====================================================
// Dashboard Elements
// =====================================================

const schoolName =
    document.getElementById(
        "schoolName"
    );

const schoolInfo =
    document.getElementById(
        "schoolInfo"
    );

const institutionIdElement =
    document.getElementById(
        "institutionId"
    );

const statusElement =
    document.getElementById(
        "status"
    );


// =====================================================
// Display Institution
// =====================================================

if (schoolName) {

    schoolName.textContent =
        institution.name || "School";

}


if (schoolInfo) {

    schoolInfo.textContent =
        institution.phone ||
        institution.email ||
        "";

}


if (institutionIdElement) {

    institutionIdElement.textContent =
        institution.id;

}


if (statusElement) {

    statusElement.textContent =
        getInstitutionStatus(
            institution
        );

}


// =====================================================
// Navigation Helper
// =====================================================

function openSchoolPage(
    page
) {

    window.location.href =
        page +
        "?id=" +
        encodeURIComponent(
            activeInstitutionId
        );

}


// =====================================================
// Logout
// =====================================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "bmpCurrentUser"
            );

            window.location.href =
                "school-login.html";

        }
    );

}
