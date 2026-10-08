// =====================================================
// BMP · School Settings
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// State
// =====================================================

let currentUser    = null;
let institutionId  = null;

let currentLanguage = "ar";


// =====================================================
// Translations
// =====================================================

const TRANSLATIONS = {

    en: {
        pageTitle: "School Settings",
        pageSubtitle: "Manage school information and settings.",
        back: "Back",

        schoolInformation: "School Information",
        schoolInformationSubtitle: "Basic information about this school.",
        academicSettings: "Academic Settings",
        academicSettingsSubtitle: "Configure the current academic year.",

        institutionId: "Institution ID",
        schoolName: "School Name",
        schoolNamePlaceholder: "School name",
        phone: "Phone",
        phonePlaceholder: "School phone",
        email: "Email",
        emailPlaceholder: "School email",

        currentAcademicYear: "Current Academic Year",
        academicYearPlaceholder: "2026-27",

        saveSettings: "Save Settings",
        saving: "Saving...",

        loadingSettings: "Loading settings...",

        schoolNameRequired: "School name is required.",
        academicYearRequired: "Academic year is required.",

        settingsSaved: "Settings saved successfully.",
        settingsFailed: "Failed to save settings.",
        loadFailed: "Failed to load school settings.",
        connectionError: "Unable to connect to the server."
    },

    ar: {
        pageTitle: "إعدادات المدرسة",
        pageSubtitle: "إدارة معلومات وإعدادات المدرسة.",
        back: "رجوع",

        schoolInformation: "معلومات المدرسة",
        schoolInformationSubtitle: "المعلومات الأساسية لهذه المدرسة.",
        academicSettings: "الإعدادات الدراسية",
        academicSettingsSubtitle: "ضبط السنة الدراسية الحالية.",

        institutionId: "معرّف المؤسسة",
        schoolName: "اسم المدرسة",
        schoolNamePlaceholder: "اسم المدرسة",
        phone: "الهاتف",
        phonePlaceholder: "هاتف المدرسة",
        email: "البريد الإلكتروني",
        emailPlaceholder: "بريد المدرسة",

        currentAcademicYear: "السنة الدراسية الحالية",
        academicYearPlaceholder: "2026-27",

        saveSettings: "حفظ الإعدادات",
        saving: "جارٍ الحفظ...",

        loadingSettings: "جارٍ تحميل الإعدادات...",

        schoolNameRequired: "اسم المدرسة مطلوب.",
        academicYearRequired: "السنة الدراسية مطلوبة.",

        settingsSaved: "تم حفظ الإعدادات بنجاح.",
        settingsFailed: "تعذر حفظ الإعدادات.",
        loadFailed: "تعذر تحميل إعدادات المدرسة.",
        connectionError: "تعذر الاتصال بالخادم."
    },

    fr: {
        pageTitle: "Paramètres de l'école",
        pageSubtitle: "Gérer les informations et paramètres de l'école.",
        back: "Retour",

        schoolInformation: "Informations de l'école",
        schoolInformationSubtitle: "Informations de base sur cette école.",
        academicSettings: "Paramètres académiques",
        academicSettingsSubtitle: "Configurer l'année scolaire actuelle.",

        institutionId: "ID de l'établissement",
        schoolName: "Nom de l'école",
        schoolNamePlaceholder: "Nom de l'école",
        phone: "Téléphone",
        phonePlaceholder: "Téléphone de l'école",
        email: "E-mail",
        emailPlaceholder: "E-mail de l'école",

        currentAcademicYear: "Année scolaire actuelle",
        academicYearPlaceholder: "2026-27",

        saveSettings: "Enregistrer",
        saving: "Enregistrement...",

        loadingSettings: "Chargement des paramètres...",

        schoolNameRequired: "Le nom de l'école est requis.",
        academicYearRequired: "L'année scolaire est requise.",

        settingsSaved: "Paramètres enregistrés avec succès.",
        settingsFailed: "Échec de l'enregistrement.",
        loadFailed: "Impossible de charger les paramètres.",
        connectionError: "Impossible de se connecter au serveur."
    }

};


// =====================================================
// Translation helper
// =====================================================

function t(key) {
    const lang = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    const parts = String(key).split(".");
    let value = lang;

    for (let i = 0; i < parts.length; i++) {
        if (value && Object.prototype.hasOwnProperty.call(value, parts[i])) {
            value = value[parts[i]];
        } else {
            return key;
        }
    }

    return value;
}


// =====================================================
// Language
// =====================================================

function getSavedLanguage() {
    const v = localStorage.getItem("bmpLanguage");
    if (v && ["en", "ar", "fr"].indexOf(v.toLowerCase()) !== -1) {
        return v.toLowerCase();
    }
    return "ar";
}

function setLanguage(language) {
    language = String(language || "ar").toLowerCase().trim();
    if (!TRANSLATIONS[language]) language = "ar";

    currentLanguage = language;
    try { localStorage.setItem("bmpLanguage", language); } catch (e) {}

    applyLanguage();
}

function applyLanguage() {

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir  = currentLanguage === "ar" ? "rtl" : "ltr";

    document.body.classList.remove("lang-ar", "lang-fr", "lang-en");
    document.body.classList.add("lang-" + currentLanguage);

    document.title = t("pageTitle") + " - BMP";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const key = el.getAttribute("data-i18n");
        const value = TRANSLATIONS[currentLanguage][key];
        if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
        const key = el.getAttribute("data-i18n-placeholder");
        const value = TRANSLATIONS[currentLanguage][key];
        if (value !== undefined) el.placeholder = value;
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });
}


// =====================================================
// Authentication — session only
// =====================================================

function initializeAuthentication() {

    try {
        if (typeof requireSchoolLogin === "function") {
            currentUser = requireSchoolLogin();
        }
    } catch (error) {
        console.error("Authentication error:", error);
    }

    if (!currentUser) {
        try {
            currentUser = JSON.parse(localStorage.getItem("bmpCurrentUser") || "null");
        } catch (error) {
            currentUser = null;
        }
    }

    if (!currentUser) return false;

    institutionId = String(currentUser.institutionId || "").trim();
    return Boolean(institutionId);
}

function getCurrentUsername() {
    if (currentUser && currentUser.username) return String(currentUser.username).trim();
    if (currentUser && currentUser.userName) return String(currentUser.userName).trim();
    if (currentUser && currentUser.name)     return String(currentUser.name).trim();
    return "";
}


// =====================================================
// Current academic year — YYYY-YY
// =====================================================

function getCurrentAcademicYear() {
    const now = new Date();
    let startYear = now.getFullYear();
    if (now.getMonth() < 9) startYear--;
    return startYear + "-" + String(startYear + 1).slice(-2);
}


// =====================================================
// API request
// =====================================================

function apiRequest(action, data) {
    return new Promise(function (resolve, reject) {

        if (!institutionId) return reject(new Error("Institution missing"));
        const username = getCurrentUsername();
        if (!username) return reject(new Error("User missing"));

        const payload = Object.assign({
            action: action,
            institutionId: institutionId,
            username: username
        }, data || {});

        const controller = new AbortController();
        const timeoutId = setTimeout(function () { controller.abort(); }, 12000);

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload),
            signal: controller.signal
        })
        .then(function (response) {
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(t("connectionError"));
            return response.text();
        })
        .then(function (text) {
            let result;
            try { result = JSON.parse(text); }
            catch (e) { throw new Error("Invalid response"); }
            if (!result.success) throw new Error(result.message || "Request failed");
            resolve(result);
        })
        .catch(function (error) {
            clearTimeout(timeoutId);
            reject(error);
        });

    });
}


// =====================================================
// Element refs
// =====================================================

const institutionIdInput = document.getElementById("institutionId");
const schoolNameInput    = document.getElementById("schoolName");
const schoolPhoneInput   = document.getElementById("schoolPhone");
const schoolEmailInput   = document.getElementById("schoolEmail");
const academicYearInput  = document.getElementById("academicYear");
const saveButton         = document.getElementById("saveButton");
const backButton         = document.getElementById("backButton");
const message            = document.getElementById("message");


// =====================================================
// Messages
// =====================================================

function showMessage(text, type) {
    if (!message) return;
    message.textContent = text;
    message.className = "message " + (type || "info");
}

function clearMessage() {
    if (!message) return;
    message.textContent = "";
    message.className = "message";
}


// =====================================================
// Load settings
// =====================================================

function loadSettings() {

    showMessage(t("loadingSettings"), "info");

    apiRequest("getSchoolSettings", {})
        .then(function (result) {

            const settings = result.settings || {};

            if (institutionIdInput) {
                institutionIdInput.value = settings.institutionId || institutionId;
            }
            if (schoolNameInput) {
                schoolNameInput.value = settings.schoolName || "";
            }
            if (schoolPhoneInput) {
                schoolPhoneInput.value = settings.schoolPhone || "";
            }
            if (schoolEmailInput) {
                schoolEmailInput.value = settings.schoolEmail || "";
            }
            if (academicYearInput) {
                academicYearInput.value = settings.academicYear || getCurrentAcademicYear();
            }

            document.title = (settings.schoolName || "School") + " · " + t("pageTitle") + " - BMP";

            clearMessage();
        })
        .catch(function (error) {
            console.error("Settings loading error:", error);
            showMessage(error.message || t("loadFailed"), "error");
        });
}


// =====================================================
// Save settings
// =====================================================

function saveSettings() {

    const schoolName   = schoolNameInput ? schoolNameInput.value.trim() : "";
    const schoolPhone  = schoolPhoneInput ? schoolPhoneInput.value.trim() : "";
    const schoolEmail  = schoolEmailInput ? schoolEmailInput.value.trim() : "";
    const academicYear = academicYearInput ? academicYearInput.value.trim() : "";

    if (!schoolName) {
        showMessage(t("schoolNameRequired"), "error");
        schoolNameInput && schoolNameInput.focus();
        return;
    }

    if (!academicYear) {
        showMessage(t("academicYearRequired"), "error");
        academicYearInput && academicYearInput.focus();
        return;
    }

    if (saveButton) {
        saveButton.disabled = true;
        const label = saveButton.querySelector(".btn-label");
        if (label) label.textContent = t("saving");
    }

    showMessage(t("saving"), "info");

    apiRequest("updateSchoolSettings", {
        schoolName: schoolName,
        schoolPhone: schoolPhone,
        schoolEmail: schoolEmail,
        academicYear: academicYear
    })
    .then(function (result) {

        const settings = result.settings || {};

        if (institutionIdInput) institutionIdInput.value = settings.institutionId || institutionId;
        if (schoolNameInput)    schoolNameInput.value    = settings.schoolName || schoolName;
        if (schoolPhoneInput)   schoolPhoneInput.value   = settings.schoolPhone || schoolPhone;
        if (schoolEmailInput)   schoolEmailInput.value   = settings.schoolEmail || schoolEmail;
        if (academicYearInput)  academicYearInput.value  = settings.academicYear || academicYear;

        document.title = (settings.schoolName || schoolName) + " · " + t("pageTitle") + " - BMP";

        // Clear caches so other pages see the new values
        try {
            Object.keys(sessionStorage).forEach(function (key) {
                if (key.indexOf("bmp_") === 0 &&
                    key.indexOf(institutionId) !== -1) {
                    sessionStorage.removeItem(key);
                }
            });
            // Also clear the current academic year value
            sessionStorage.removeItem("bmp_reports_" + institutionId + "_" + getCurrentAcademicYear());
        } catch (e) {}

        // Update session user so other pages see new school name
        try {
            const stored = JSON.parse(localStorage.getItem("bmpCurrentUser") || "null");
            if (stored) {
                stored.institutionName = schoolName;
                stored.institutionPhone = schoolPhone;
                stored.institutionEmail = schoolEmail;
                localStorage.setItem("bmpCurrentUser", JSON.stringify(stored));
            }
        } catch (e) {}

        showMessage(result.message || t("settingsSaved"), "success");

        setTimeout(clearMessage, 3000);
    })
    .catch(function (error) {
        console.error("Settings save error:", error);
        showMessage(error.message || t("settingsFailed"), "error");
    })
    .then(function () {
        if (saveButton) {
            saveButton.disabled = false;
            const label = saveButton.querySelector(".btn-label");
            if (label) label.textContent = t("saveSettings");
        }
    });
}


// =====================================================
// Event listeners
// =====================================================

function setupEventListeners() {

    if (saveButton) {
        saveButton.addEventListener("click", saveSettings);
    }

    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "school.html?id=" + encodeURIComponent(institutionId);
        });
    }

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            setLanguage(btn.dataset.lang || "ar");
        });
    });
}


// =====================================================
// Initialize
// =====================================================

function initializePage() {

    const authenticated = initializeAuthentication();
    if (!authenticated) return;

    loadSettings();
}


document.addEventListener("DOMContentLoaded", function () {
    currentLanguage = getSavedLanguage();
    applyLanguage();
    setupEventListeners();
    initializePage();
});
