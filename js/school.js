// =====================================================
// BMP School Dashboard
// =====================================================


// =====================================================
// Translations
// =====================================================

const translations = {

    ar: {
        schoolDashboard:        "لوحة تحكم المدرسة",
        manageSchoolOperations: "إدارة عمليات المدرسة",
        active:                 "نشطة",
        disabled:               "معطلة",
        expired:                "منتهية",
        school:                 "المدرسة"
    },

    fr: {
        schoolDashboard:        "Tableau de bord de l'école",
        manageSchoolOperations: "Gérer les opérations de l'école",
        active:                 "Active",
        disabled:               "Désactivée",
        expired:                "Expirée",
        school:                 "École"
    },

    en: {
        schoolDashboard:        "School Dashboard",
        manageSchoolOperations: "Manage school operations",
        active:                 "Active",
        disabled:               "Disabled",
        expired:                "Expired",
        school:                 "School"
    }

};


// =====================================================
// Current Language
// =====================================================

const DEFAULT_LANG = "ar";

let currentLanguage =
    localStorage.getItem("bmpLanguage") || DEFAULT_LANG;


// =====================================================
// Check Session
// =====================================================

const currentUser = requireSchoolLogin();

if (!currentUser) {
    throw new Error("School login required.");
}


// =====================================================
// Get Institution ID
// =====================================================

const urlParams = new URLSearchParams(window.location.search);
const institutionId = urlParams.get("id");


// =====================================================
// Prevent Access To Another Institution
// =====================================================

if (
    institutionId &&
    institutionId !== currentUser.institutionId
) {
    window.location.href =
        "school.html?id=" +
        encodeURIComponent(currentUser.institutionId);

    throw new Error("Institution access denied.");
}


// =====================================================
// Use Session Institution
// =====================================================

const activeInstitutionId = currentUser.institutionId;


// =====================================================
// Build Institution From Current Session
// =====================================================

const institution = {
    id:           currentUser.institutionId,
    type:         currentUser.institutionType  || "",
    name:         currentUser.institutionName  || "",
    phone:        currentUser.institutionPhone || "",
    email:        currentUser.institutionEmail || "",
    licenseStart: currentUser.licenseStart     || "",
    licenseEnd:   currentUser.licenseEnd       || "",
    status:       "active",
    sheetId:      currentUser.sheetId          || ""
};


// =====================================================
// Institution Data Validation
// =====================================================

if (!institution.id || !institution.name) {
    localStorage.removeItem("bmpCurrentUser");
    window.location.href = "school-login.html";
    throw new Error("Invalid institution session.");
}


// =====================================================
// Check Institution Status
// =====================================================

function getInstitutionStatus(institution) {

    if (institution.status === "disabled") {
        return "disabled";
    }

    if (institution.licenseEnd) {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const licenseEnd = new Date(institution.licenseEnd);
        licenseEnd.setHours(0, 0, 0, 0);

        if (!isNaN(licenseEnd.getTime()) && licenseEnd < today) {
            return "expired";
        }
    }

    return "active";
}


// =====================================================
// Translate Status
// =====================================================

function translateStatus(status) {
    const key = String(status || "").toLowerCase();
    return translations[currentLanguage][key] || status;
}


// =====================================================
// Elements
// =====================================================

const schoolName             = document.getElementById("schoolName");
const schoolInfo             = document.getElementById("schoolInfo");
const institutionIdElement   = document.getElementById("institutionId");
const statusElement          = document.getElementById("institutionStatus");
const institutionNameElement = document.getElementById("institutionName");
const usersButton            = document.getElementById("usersButton");
const pageLoader             = document.getElementById("pageLoader");
const langButtons            = document.querySelectorAll(".lang-btn");


// =====================================================
// Apply Language
// =====================================================

function applyLanguage(language) {

    if (!translations[language]) language = DEFAULT_LANG;

    currentLanguage = language;
    localStorage.setItem("bmpLanguage", language);

    // Direction
    document.documentElement.lang = language;
    document.documentElement.dir  = (language === "ar") ? "rtl" : "ltr";

    // Font swap
    document.body.classList.remove("lang-ar", "lang-fr", "lang-en");
    document.body.classList.add("lang-" + language);

    // Static text
    document.querySelectorAll("[data-ar]").forEach(function (el) {
        const value = el.dataset[language];
        if (value !== undefined) el.textContent = value;
    });

    // Active lang button
    langButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === language);
    });

    // Dynamic: school info line
    if (schoolInfo) {
        schoolInfo.textContent =
            institution.phone ||
            institution.email ||
            translations[language].manageSchoolOperations;
    }

    // Dynamic: school name
    if (schoolName) {
        schoolName.textContent =
            institution.name ||
            translations[language].schoolDashboard;
    }

    // Dynamic: status
    if (statusElement) {
        statusElement.textContent =
            translateStatus(getInstitutionStatus(institution));
    }
}


// =====================================================
// Language Switcher
// =====================================================

langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        applyLanguage(btn.dataset.lang);
    });
});


// =====================================================
// Display Institution
// =====================================================

if (schoolName) {
    schoolName.textContent =
        institution.name ||
        translations[currentLanguage].school;
}

if (schoolInfo) {
    schoolInfo.textContent =
        institution.phone ||
        institution.email ||
        translations[currentLanguage].manageSchoolOperations;
}

if (institutionIdElement) {
    institutionIdElement.textContent = institution.id;
}

if (institutionNameElement) {
    institutionNameElement.textContent = institution.name;
}

if (statusElement) {
    statusElement.textContent =
        translateStatus(getInstitutionStatus(institution));
}


// =====================================================
// Back Button
// =====================================================

const backButton = document.getElementById("backButton");

if (backButton) {
    backButton.addEventListener("click", function () {
        window.history.back();
    });
}


// =====================================================
// Logout
// =====================================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        logoutUser();
    });
}


// =====================================================
// Dashboard Buttons
// =====================================================

document.getElementById("studentsButton")?.addEventListener("click", function () {
    window.location.href =
        "students.html?id=" +
        encodeURIComponent(activeInstitutionId);
});

document.getElementById("paymentsButton")?.addEventListener("click", function () {
    window.location.href =
        "school-payments.html?id=" +
        encodeURIComponent(activeInstitutionId);
});

document.getElementById("receiptsButton")?.addEventListener("click", function () {
    window.location.href =
        "school-receipt.html?id=" +
        encodeURIComponent(activeInstitutionId);
});

document.getElementById("reportsButton")?.addEventListener("click", function () {
    window.location.href =
        "school-reports.html?id=" +
        encodeURIComponent(activeInstitutionId);
});

document.getElementById("classesButton")?.addEventListener("click", function () {
    window.location.href =
        "classes.html?id=" +
        encodeURIComponent(activeInstitutionId);
});


// =====================================================
// Users Button — Director Only
// =====================================================

if (usersButton) {

    const role = String(currentUser.role || "").trim().toLowerCase();

    if (role !== "director") {
        usersButton.style.display = "none";
    } else {
        usersButton.addEventListener("click", function () {
            window.location.href =
                "users.html?id=" +
                encodeURIComponent(activeInstitutionId);
        });
    }
}


// =====================================================
// Settings Button
// =====================================================

document.getElementById("settingsButton")?.addEventListener("click", function () {
    window.location.href =
        "school-settings.html?id=" +
        encodeURIComponent(activeInstitutionId);
});


// =====================================================
// Initialize Language + Hide Loader
// =====================================================

applyLanguage(currentLanguage);

// Hide the loading overlay after everything is initialized
if (pageLoader) {
    requestAnimationFrame(function () {
        setTimeout(function () {
            pageLoader.classList.add("hidden");
        }, 250);
    });
}
