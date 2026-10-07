// =====================================================
// BMP School Settings
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


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


    if (
        month >= 10
    ) {

        return (
            `${year}-${year + 1}`
        );

    }


    return (
        `${year - 1}-${year}`
    );

}


// =====================================================
// Load Settings From Backend
// =====================================================

async function loadSettings() {

    try {

        showMessage(
            "Loading settings...",
            "info"
        );


        const response =
            await fetch(
                API_URL,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "getSchoolSettings",

                            institutionId:
                                institutionId,

                            username:
                                currentUser.username

                        })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to connect to the server."
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Failed to load school settings."
            );

        }


        const settings =
            result.settings ||
            {};


        // =============================================
        // Institution ID
        // =============================================

        if (
            institutionIdInput
        ) {

            institutionIdInput.value =
                settings.institutionId ||
                institutionId;

        }


        // =============================================
        // School Name
        // =============================================

        if (
            schoolNameInput
        ) {

            schoolNameInput.value =
                settings.schoolName ||
                "";

        }


        // =============================================
        // Phone
        // =============================================

        if (
            schoolPhoneInput
        ) {

            schoolPhoneInput.value =
                settings.schoolPhone ||
                "";

        }


        // =============================================
        // Email
        // =============================================

        if (
            schoolEmailInput
        ) {

            schoolEmailInput.value =
                settings.schoolEmail ||
                "";

        }


        // =============================================
        // Academic Year
        // =============================================

        if (
            academicYearInput
        ) {

            academicYearInput.value =
                settings.academicYear ||
                getCurrentAcademicYear();

        }


        // =============================================
        // Monthly Fee
        // =============================================

        if (
            monthlyFeeInput
        ) {

            monthlyFeeInput.value =
                settings.monthlyFee !==
                    undefined &&
                settings.monthlyFee !==
                    null
                    ? settings.monthlyFee
                    : "";

        }


        // =============================================
        // Currency
        // =============================================

        if (
            currencyInput
        ) {

            currencyInput.value =
                settings.currency ||
                "MRU";

        }


        // =============================================
        // Browser Title
        // =============================================

        document.title =
            `${settings.schoolName || "School"} - School Settings`;


        // Clear loading message

        clearMessage();

    }

    catch (error) {

        console.error(
            "Settings loading error:",
            error
        );


        showMessage(
            error.message ||
            "Failed to load school settings.",
            "error"
        );

    }

}


// =====================================================
// Show Message
// =====================================================

function showMessage(
    text,
    type
) {

    if (!message) {

        return;

    }


    message.textContent =
        text;


    message.className =
        `message ${type}`;


}


// =====================================================
// Clear Message
// =====================================================

function clearMessage() {

    if (!message) {

        return;

    }


    message.textContent =
        "";


    message.className =
        "message";

}


// =====================================================
// Save Settings To Backend
// =====================================================

async function saveSettings() {

    const schoolName =
        schoolNameInput
            ? schoolNameInput.value.trim()
            : "";


    const schoolPhone =
        schoolPhoneInput
            ? schoolPhoneInput.value.trim()
            : "";


    const schoolEmail =
        schoolEmailInput
            ? schoolEmailInput.value.trim()
            : "";


    const academicYear =
        academicYearInput
            ? academicYearInput.value.trim()
            : "";


    const monthlyFeeText =
        monthlyFeeInput
            ? monthlyFeeInput.value.trim()
            : "";


    const currency =
        currencyInput
            ? currencyInput.value.trim()
            : "";


    let monthlyFee =
        0;


    // =============================================
    // Validation
    // =============================================

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
        monthlyFeeText !== ""
    ) {

        monthlyFee =
            Number(
                monthlyFeeText
            );


        if (
            Number.isNaN(
                monthlyFee
            ) ||
            monthlyFee < 0
        ) {

            showMessage(
                "Monthly fee must be a valid amount.",
                "error"
            );

            return;

        }

    }


    if (!currency) {

        showMessage(
            "Currency is required.",
            "error"
        );

        return;

    }


    // =============================================
    // Disable Button
    // =============================================

    if (
        saveButton
    ) {

        saveButton.disabled =
            true;

    }


    showMessage(
        "Saving settings...",
        "info"
    );


    try {

        const response =
            await fetch(
                API_URL,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "updateSchoolSettings",

                            institutionId:
                                institutionId,

                            username:
                                currentUser.username,

                            schoolName:
                                schoolName,

                            schoolPhone:
                                schoolPhone,

                            schoolEmail:
                                schoolEmail,

                            academicYear:
                                academicYear,

                            monthlyFee:
                                monthlyFee,

                            currency:
                                currency

                        })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to connect to the server."
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Failed to save settings."
            );

        }


        const settings =
            result.settings ||
            {};


        // =============================================
        // Update Fields With Saved Values
        // =============================================

        if (
            institutionIdInput
        ) {

            institutionIdInput.value =
                settings.institutionId ||
                institutionId;

        }


        if (
            schoolNameInput
        ) {

            schoolNameInput.value =
                settings.schoolName ||
                schoolName;

        }


        if (
            schoolPhoneInput
        ) {

            schoolPhoneInput.value =
                settings.schoolPhone ||
                schoolPhone;

        }


        if (
            schoolEmailInput
        ) {

            schoolEmailInput.value =
                settings.schoolEmail ||
                schoolEmail;

        }


        if (
            academicYearInput
        ) {

            academicYearInput.value =
                settings.academicYear ||
                academicYear;

        }


        if (
            monthlyFeeInput
        ) {

            monthlyFeeInput.value =
                settings.monthlyFee ??
                monthlyFee;

        }


        if (
            currencyInput
        ) {

            currencyInput.value =
                settings.currency ||
                currency;

        }


        document.title =
            `${settings.schoolName || schoolName} - School Settings`;


        showMessage(
            result.message ||
            "Settings saved successfully.",
            "success"
        );


        setTimeout(
            function () {

                clearMessage();

            },
            3000
        );

    }

    catch (error) {

        console.error(
            "Settings save error:",
            error
        );


        showMessage(
            error.message ||
            "Failed to save settings.",
            "error"
        );

    }

    finally {

        if (
            saveButton
        ) {

            saveButton.disabled =
                false;

        }

    }

}


// =====================================================
// Save Button
// =====================================================

if (
    saveButton
) {

    saveButton.addEventListener(
        "click",
        function () {

            saveSettings();

        }
    );

}


// =====================================================
// Back
// =====================================================

if (
    backButton
) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                `school.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );

}


// =====================================================
// Initialize
// =====================================================

loadSettings();
