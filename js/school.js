// =====================================================
// BMP School Dashboard
// =====================================================


// =====================================================
// Check Session
// =====================================================

let currentUser = null;

try {

    currentUser =
        JSON.parse(
            localStorage.getItem(
                "bmpCurrentUser"
            )
        );

} catch (error) {

    localStorage.removeItem(
        "bmpCurrentUser"
    );

    currentUser = null;

}


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


// =====================================================
// Use Session Institution
// =====================================================

const activeInstitutionId =
    currentUser.institutionId;


// =====================================================
// Build Institution From Current Session
// =====================================================

const institution = {

    id:
        currentUser.institutionId,

    type:
        currentUser.institutionType || "",

    name:
        currentUser.institutionName || "",

    phone:
        currentUser.institutionPhone || "",

    email:
        currentUser.institutionEmail || "",

    licenseStart:
        currentUser.licenseStart || "",

    licenseEnd:
        currentUser.licenseEnd || "",

    status:
        "active",

    sheetId:
        currentUser.sheetId || ""

};


// =====================================================
// Institution Data Validation
// =====================================================

if (
    !institution.id ||
    !institution.name
) {

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
            !isNaN(
                licenseEnd.getTime()
            ) &&
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
        "institutionStatus"
    );

const institutionNameElement =
    document.getElementById(
        "institutionName"
    );


// =====================================================
// Display Institution
// =====================================================

if (schoolName) {

    schoolName.textContent =
        institution.name ||
        "School";

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


if (institutionNameElement) {

    institutionNameElement.textContent =
        institution.name;

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


// =====================================================
// Dashboard Buttons
// =====================================================

document
    .getElementById("studentsButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "students.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


document
    .getElementById("paymentsButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "school-payments.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


document
    .getElementById("receiptsButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "school-receipt.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


document
    .getElementById("reportsButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "school-reports.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


document
    .getElementById("classesButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "classes.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


document
    .getElementById("usersButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "users.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


document
    .getElementById("settingsButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "school-settings.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );
