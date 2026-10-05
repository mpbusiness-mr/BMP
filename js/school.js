// =====================================================
// BMP School Dashboard
// =====================================================


// Get institution ID from URL
const urlParams =
    new URLSearchParams(
        window.location.search
    );

const institutionId =
    urlParams.get("id");


// Get institutions
const institutions =
    JSON.parse(
        localStorage.getItem("bmpInstitutions")
    ) || [];


// Find institution
const institution =
    institutions.find(
        item =>
            item.id === institutionId
    );


// =====================================================
// Elements
// =====================================================

const schoolName =
    document.getElementById("schoolName");

const schoolInfo =
    document.getElementById("schoolInfo");

const institutionIdElement =
    document.getElementById("institutionId");

const institutionNameElement =
    document.getElementById("institutionName");

const institutionStatusElement =
    document.getElementById("institutionStatus");

const backButton =
    document.getElementById("backButton");

const studentsButton =
    document.getElementById("studentsButton");

const paymentsButton =
    document.getElementById("paymentsButton");

const receiptsButton =
    document.getElementById("receiptsButton");

const reportsButton =
    document.getElementById("reportsButton");

const classesButton =
    document.getElementById("classesButton");

const usersButton =
    document.getElementById("usersButton");

const settingsButton =
    document.getElementById("settingsButton");


// =====================================================
// Check Institution
// =====================================================

if (!institution) {

    alert("School not found.");

    window.location.href =
        "institutions.html";

} else {

    initializeSchool();
}


// =====================================================
// Initialize School
// =====================================================

function initializeSchool() {

    schoolName.textContent =
        institution.name || "School Dashboard";


    schoolInfo.textContent =
        "Manage school operations";


    institutionIdElement.textContent =
        institution.id || "-";


    institutionNameElement.textContent =
        institution.name || "-";


    institutionStatusElement.textContent =
        getInstitutionStatus();


    // Update browser title
    document.title =
        `${institution.name} - BMP`;
}


// =====================================================
// Get Institution Status
// =====================================================

function getInstitutionStatus() {

    if (
        institution.status ===
        "disabled"
    ) {

        return "Disabled";
    }


    if (institution.licenseEnd) {

        const today =
            new Date();

        const endDate =
            new Date(
                institution.licenseEnd
            );


        if (endDate < today) {

            return "Expired";
        }
    }


    return "Active";
}


// =====================================================
// Back
// =====================================================

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `institution.html?id=${encodeURIComponent(
                institution.id
            )}`;
    }
);


// =====================================================
// Students
// =====================================================

studentsButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `students.html?id=${encodeURIComponent(
                institution.id
            )}`;
    }
);


// =====================================================
// Payments
// =====================================================

// =====================================================
// Payments
// =====================================================

paymentsButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `school-payments.html?id=${encodeURIComponent(
                institution.id
            )}`;
    }
);

// =====================================================
// Receipts
// =====================================================

receiptsButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `receipts.html?id=${encodeURIComponent(
                institution.id
            )}`;
    }
);


// =====================================================
// Reports
// =====================================================

reportsButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `reports.html?id=${encodeURIComponent(
                institution.id
            )}`;
    }
);


// =====================================================
// Classes & Stages
// =====================================================

classesButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `classes.html?id=${encodeURIComponent(
                institution.id
            )}`;
    }
);


// =====================================================
// Users
// =====================================================

usersButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `users.html?id=${encodeURIComponent(
                institution.id
            )}`;
    }
);


// =====================================================
// Settings
// =====================================================

settingsButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `school-settings.html?id=${encodeURIComponent(
                institution.id
            )}`;
    }
);
