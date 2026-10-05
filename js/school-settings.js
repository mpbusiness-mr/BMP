// =====================================================
// BMP School Settings
// =====================================================
// =====================================================
// Authentication
// =====================================================

const currentUser =
    requireSchoolLogin();

if (!currentUser) {
    throw new Error(
        "School login required."
    );
}


const institutionId =
    getActiveInstitutionId();

if (!institutionId) {
    throw new Error(
        "Institution access denied."
    );

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
// Storage
// =====================================================

let institutions =
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
        item =>
            item.id === institutionId
    );


// =====================================================
// Check Institution
// =====================================================

if (!institution) {

    alert("School not found.");

    window.location.href =
        "institutions.html";
}


// =====================================================
// Elements
// =====================================================

const institutionIdInput =
    document.getElementById(
        "institutionId"
    );

const schoolNameInput =
    document.getElementById(
        "schoolName"
    );

const schoolPhoneInput =
    document.getElementById(
        "schoolPhone"
    );

const schoolEmailInput =
    document.getElementById(
        "schoolEmail"
    );

const academicYearInput =
    document.getElementById(
        "academicYear"
    );

const monthlyFeeInput =
    document.getElementById(
        "monthlyFee"
    );

const currencyInput =
    document.getElementById(
        "currency"
    );

const saveButton =
    document.getElementById(
        "saveButton"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const message =
    document.getElementById(
        "message"
    );


// =====================================================
// Current Academic Year
// =====================================================

function getCurrentAcademicYear() {

    const today =
        new Date();

    const month =
        today.getMonth() + 1;

    const year =
        today.getFullYear();


    if (month >= 10) {

        return `${year}-${year + 1}`;

    }

    return `${year - 1}-${year}`;
}


// =====================================================
// Load Settings
// =====================================================

function loadSettings() {

    institutionIdInput.value =
        institution.id || "";


    schoolNameInput.value =
        institution.name || "";


    schoolPhoneInput.value =
        institution.phone || "";


    schoolEmailInput.value =
        institution.email || "";


    academicYearInput.value =
        institution.academicYear ||
        getCurrentAcademicYear();


    monthlyFeeInput.value =
        institution.monthlyFee ??
        "";


    currencyInput.value =
        institution.currency ||
        "MRU";


    document.title =
        `${institution.name} - School Settings`;
}


// =====================================================
// Show Message
// =====================================================

function showMessage(
    text,
    type
) {

    message.textContent =
        text;

    message.className =
        `message ${type}`;


    setTimeout(
        function () {

            message.textContent =
                "";

            message.className =
                "message";

        },
        3000
    );
}


// =====================================================
// Save Settings
// =====================================================

saveButton.addEventListener(
    "click",
    function () {

        const schoolName =
            schoolNameInput.value.trim();

        const schoolPhone =
            schoolPhoneInput.value.trim();

        const schoolEmail =
            schoolEmailInput.value.trim();

        const academicYear =
            academicYearInput.value.trim();

        const monthlyFee =
            Number(
                monthlyFeeInput.value
            );

        const currency =
            currencyInput.value.trim();


        // Validation

        if (!schoolName) {

            showMessage(
                "School name is required.",
                "error"
            );

            return;
        }


        if (!academicYear) {

            showMessage(
                "Academic year is required.",
                "error"
            );

            return;
        }


        if (
            monthlyFeeInput.value !== "" &&
            (
                Number.isNaN(monthlyFee) ||
                monthlyFee < 0
            )
        ) {

            showMessage(
                "Monthly fee must be a valid amount.",
                "error"
            );

            return;
        }


        if (!currency) {

            showMessage(
                "Currency is required.",
                "error"
            );

            return;
        }


        // Update institution

        institution.name =
            schoolName;

        institution.phone =
            schoolPhone;

        institution.email =
            schoolEmail;

        institution.academicYear =
            academicYear;

        institution.monthlyFee =
            monthlyFeeInput.value === ""
                ? 0
                : monthlyFee;

        institution.currency =
            currency;


        institution.updatedAt =
            new Date().toISOString();


        // Save

        localStorage.setItem(
            "bmpInstitutions",
            JSON.stringify(
                institutions
            )
        );


        // Update title

        document.title =
            `${institution.name} - School Settings`;


        showMessage(
            "Settings saved successfully.",
            "success"
        );
    }
);


// =====================================================
// Back
// =====================================================

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `school.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);


// =====================================================
// Initialize
// =====================================================

loadSettings();
