// =====================================================
// BMP · Classes & Stages
// ===================================================== 


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// State
// =====================================================

let currentUser   = null;
let institutionId = null;

let currentLanguage = "ar";

let allStudents = [];
let allClasses  = [];

const CACHE_KEY_STUDENTS = () => "bmp_students_" + institutionId;
const CACHE_KEY_CLASSES  = () => "bmp_classes_"  + institutionId;


// =====================================================
// Translations
// =====================================================

const TRANSLATIONS = {

    en: {
        pageTitle: "Classes & Stages",
        pageSubtitle: "Manage academic stages and classes.",
        back: "Back",
        loading: "Loading...",

        institutionId: "Institution ID",
        schoolName: "School Name",
        academicYearLabel: "Academic Year",

        primaryEducation: "Primary Education",
        preparatoryEducation: "Preparatory Education",
        secondaryEducation: "Secondary Education",

        sixClasses: "6 Classes",
        fourClasses: "4 Classes",
        threeClasses: "3 Classes",

        studentsWord: "students",
        classLabel: "Class",
        codeLabel: "Code",
        noClasses: "No classes found."
    },

    ar: {
        pageTitle: "المراحل والأقسام",
        pageSubtitle: "إدارة المراحل الدراسية والأقسام.",
        back: "رجوع",
        loading: "جارٍ التحميل...",

        institutionId: "معرّف المؤسسة",
        schoolName: "اسم المدرسة",
        academicYearLabel: "السنة الدراسية",

        primaryEducation: "التعليم الابتدائي",
        preparatoryEducation: "التعليم الإعدادي",
        secondaryEducation: "التعليم الثانوي",

        sixClasses: "6 أقسام",
        fourClasses: "4 أقسام",
        threeClasses: "3 أقسام",

        studentsWord: "طالب",
        classLabel: "القسم",
        codeLabel: "الرمز",
        noClasses: "لا توجد أقسام."
    },

    fr: {
        pageTitle: "Classes et niveaux",
        pageSubtitle: "Gérer les niveaux et les classes.",
        back: "Retour",
        loading: "Chargement...",

        institutionId: "ID de l'établissement",
        schoolName: "Nom de l'école",
        academicYearLabel: "Année scolaire",

        primaryEducation: "Enseignement primaire",
        preparatoryEducation: "Enseignement préparatoire",
        secondaryEducation: "Enseignement secondaire",

        sixClasses: "6 classes",
        fourClasses: "4 classes",
        threeClasses: "3 classes",

        studentsWord: "élèves",
        classLabel: "Classe",
        codeLabel: "Code",
        noClasses: "Aucune classe trouvée."
    }

};


// =====================================================
// Translation helper
// =====================================================

function t(key) {
    const language = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    const parts = String(key).split(".");
    let value = language;

    for (const part of parts) {
        if (value && Object.prototype.hasOwnProperty.call(value, part)) {
            value = value[part];
        } else {
            return key;
        }
    }

    return value;
}


// =====================================================
// Loader
// =====================================================

function showLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.classList.remove("hidden");
}

function hideLoaderAfterPaint() {
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            const loader = document.getElementById("pageLoader");
            if (loader) loader.classList.add("hidden");
        });
    });
}


// =====================================================
// Language
// =====================================================

function getSavedLanguage() {
    const value = localStorage.getItem("bmpLanguage");
    if (value && ["en", "ar", "fr"].includes(value.toLowerCase())) {
        return value.toLowerCase();
    }
    return "ar";
}

function setLanguage(language) {
    language = String(language || "ar").toLowerCase().trim();
    if (!TRANSLATIONS[language]) language = "ar";

    currentLanguage = language;
    localStorage.setItem("bmpLanguage", language);
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

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });

    // Re-render to update embedded text
    if (allClasses.length > 0) {
        renderClasses(allClasses);
    } else {
        renderDefaultClasses();
    }
}


// =====================================================
// Authentication
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
    if (!institutionId) return false;

    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get("id") || urlParams.get("institutionId");
    if (urlId && urlId !== institutionId) {
        window.location.href =
            "classes.html?id=" + encodeURIComponent(institutionId);
        return false;
    }

    return true;
}

function getCurrentUsername() {
    if (currentUser && currentUser.username) return String(currentUser.username).trim();
    if (currentUser && currentUser.userName) return String(currentUser.userName).trim();
    if (currentUser && currentUser.name) return String(currentUser.name).trim();
    return "";
}


// =====================================================
// Academic year — YYYY-YY
// =====================================================

function getCurrentAcademicYear() {
    const now = new Date();
    let startYear = now.getFullYear();
    if (now.getMonth() < 9) startYear--;
    return startYear + "-" + String(startYear + 1).slice(-2);
}


// =====================================================
// API request with timeout + retry
// =====================================================

async function apiRequest(action, data, attempt) {

    data = data || {};
    attempt = attempt || 1;

    if (!institutionId) throw new Error("Institution missing");
    const username = getCurrentUsername();
    if (!username) throw new Error("User missing");

    const payload = Object.assign({
        action: action,
        institutionId: institutionId,
        username: username
    }, data);

    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, 12000);

    let response;
    try {
        response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
    } catch (error) {
        clearTimeout(timeoutId);

        if (attempt < 2) {
            await new Promise(function (r) { setTimeout(r, 800); });
            return apiRequest(action, data, attempt + 1);
        }
        throw new Error("Connection error");
    }

    const text = await response.text();

    if (!response.ok) {
        if (attempt < 2 && response.status >= 500) {
            await new Promise(function (r) { setTimeout(r, 800); });
            return apiRequest(action, data, attempt + 1);
        }
        throw new Error("Server error: " + response.status);
    }

    let result;
    try {
        result = JSON.parse(text);
    } catch (error) {
        throw new Error("Invalid response");
    }

    if (!result.success) {
        throw new Error(result.message || "Request failed");
    }

    return result;
}


// =====================================================
// HTML escape
// =====================================================

function escapeHtml(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// Institution display
// =====================================================

function displayInstitution() {
    const idEl   = document.getElementById("institutionId");
    const nameEl = document.getElementById("institutionName");
    const yearEl = document.getElementById("academicYearValue");

    if (idEl)   idEl.textContent = institutionId || "-";
    if (nameEl) nameEl.textContent =
        (currentUser && (currentUser.institutionName || currentUser.schoolName)) || "-";
    if (yearEl) yearEl.textContent = getCurrentAcademicYear();
}


// =====================================================
// Student count per stage+class
// =====================================================

function buildStudentCountMap() {

    // key: "<stage>|<classNumber>" → count
    const map = {};

    const academicYear = getCurrentAcademicYear();

    allStudents.forEach(function (student) {

        // Only count students from current academic year
        const studentYear = String(student.academicYear || "").trim();
        if (studentYear && studentYear !== academicYear) return;

        const stage = String(student.stage || "").trim().toLowerCase();
        const cls   = String(student.class || student.classNumber || "").trim();

        if (!stage || !cls) return;

        const key = stage + "|" + cls;
        map[key] = (map[key] || 0) + 1;
    });

    return map;
}


function getStudentCount(studentCountMap, stage, classNumber) {
    const key = String(stage).toLowerCase() + "|" + String(classNumber);
    return studentCountMap[key] || 0;
}


function updateStageTotals(studentCountMap) {

    const primaryTotalEl     = document.getElementById("primaryTotalStudents");
    const preparatoryTotalEl = document.getElementById("preparatoryTotalStudents");
    const secondaryTotalEl   = document.getElementById("secondaryTotalStudents");

    const stages = ["primary", "preparatory", "secondary"];
    const totals = { primary: 0, preparatory: 0, secondary: 0 };

    Object.keys(studentCountMap).forEach(function (key) {
        const parts = key.split("|");
        const stage = parts[0];
        if (totals.hasOwnProperty(stage)) {
            totals[stage] += studentCountMap[key];
        }
    });

    if (primaryTotalEl)     primaryTotalEl.textContent     = String(totals.primary);
    if (preparatoryTotalEl) preparatoryTotalEl.textContent = String(totals.preparatory);
    if (secondaryTotalEl)   secondaryTotalEl.textContent   = String(totals.secondary);
}


// =====================================================
// Load data (parallel: classes + students)
// =====================================================

async function loadData() {

    try {

        // Show loading placeholders
        showLoading(primaryClasses);
        showLoading(preparatoryClasses);
        showLoading(secondaryClasses);

        // Parallel fetch
        const [classesResult, studentsResult] = await Promise.all([
            apiRequest("getClasses"),
            apiRequest("getStudents")
        ]);

        // ----- Classes -----
        allClasses = Array.isArray(classesResult.classes) ? classesResult.classes : [];

        try {
            sessionStorage.setItem(CACHE_KEY_CLASSES(), JSON.stringify(allClasses));
        } catch (e) {}

        // ----- Students -----
        allStudents = Array.isArray(studentsResult.students) ? studentsResult.students : [];

        try {
            sessionStorage.setItem(CACHE_KEY_STUDENTS(), JSON.stringify(allStudents));
        } catch (e) {}

        // Institution info from classes response (has canonical name)
        if (classesResult.institution) {
            const idEl   = document.getElementById("institutionId");
            const nameEl = document.getElementById("institutionName");

            if (idEl && classesResult.institution.id) {
                idEl.textContent = classesResult.institution.id;
            }
            if (nameEl && classesResult.institution.name) {
                nameEl.textContent = classesResult.institution.name;
                document.title = classesResult.institution.name + " - Classes & Stages";
            }
        }

        // Render
        if (allClasses.length > 0) {
            renderClasses(allClasses);
        } else {
            renderDefaultClasses();
        }

    } catch (error) {

        console.error("Classes loading error:", error);

        // Fallback — still show default classes
        renderDefaultClasses();

    }

}


// =====================================================
// Cache-first load
// =====================================================

function loadFromCache() {
    try {
        const classesCache  = sessionStorage.getItem(CACHE_KEY_CLASSES());
        const studentsCache = sessionStorage.getItem(CACHE_KEY_STUDENTS());

        let hasAnything = false;

        if (classesCache) {
            const parsed = JSON.parse(classesCache);
            if (Array.isArray(parsed)) {
                allClasses = parsed;
                hasAnything = true;
            }
        }

        if (studentsCache) {
            const parsed = JSON.parse(studentsCache);
            if (Array.isArray(parsed)) {
                allStudents = parsed;
            }
        }

        if (hasAnything) {
            if (allClasses.length > 0) {
                renderClasses(allClasses);
            } else {
                renderDefaultClasses();
            }
        }

        return hasAnything;
    } catch (e) {
        return false;
    }
}


// =====================================================
// Render classes from backend
// =====================================================

function renderClasses(classes) {

    const studentCountMap = buildStudentCountMap();

    const primary     = classes.filter(c => String(c.stage || "").toLowerCase() === "primary");
    const preparatory = classes.filter(c => String(c.stage || "").toLowerCase() === "preparatory");
    const secondary   = classes.filter(c => String(c.stage || "").toLowerCase() === "secondary");

    renderStageClasses(primaryClasses,     primary,     studentCountMap);
    renderStageClasses(preparatoryClasses, preparatory, studentCountMap);
    renderStageClasses(secondaryClasses,   secondary,   studentCountMap);

    updateStageTotals(studentCountMap);
}


function renderStageClasses(container, classes, studentCountMap) {

    if (!container) return;

    container.innerHTML = "";

    if (!classes || classes.length === 0) {
        const empty = document.createElement("div");
        empty.className = "class-item";
        empty.innerHTML =
            '<div class="class-info"><div><div class="class-name">' +
            escapeHtml(t("noClasses")) +
            '</div></div></div>';
        container.appendChild(empty);
        return;
    }

    classes.sort(function (a, b) {
        return Number(a.classNumber || 0) - Number(b.classNumber || 0);
    });

    classes.forEach(function (item) {

        const classNumber = String(item.classNumber || "");
        const className   = String(item.className || "");
        const classCode   = String(item.classCode || "");
        const stage       = String(item.stage || "");

        const count = getStudentCount(studentCountMap, stage, classNumber);

        const classItem = document.createElement("div");
        classItem.className = "class-item";

        classItem.innerHTML =
            '<div class="class-info">' +
                '<span class="class-number">' + escapeHtml(classNumber) + '</span>' +
                '<div>' +
                    '<div class="class-name">' + escapeHtml(className) + '</div>' +
                    '<div class="class-code">' + escapeHtml(t("codeLabel")) + ': ' + escapeHtml(classCode) + '</div>' +
                '</div>' +
            '</div>' +
            '<span class="class-students' + (count === 0 ? " empty" : "") + '">' +
                '<i class="fas fa-user"></i>' +
                '<span>' + count + ' ' + escapeHtml(t("studentsWord")) + '</span>' +
            '</span>';

        attachClassClick(classItem, stage, classNumber);

        container.appendChild(classItem);
    });
}


// =====================================================
// Render default classes (fallback when backend has none)
// =====================================================

function renderDefaultClasses() {

    const studentCountMap = buildStudentCountMap();

    renderDefaultStageClasses(primaryClasses,     "primary",     "A", 6, studentCountMap);
    renderDefaultStageClasses(preparatoryClasses, "preparatory", "B", 4, studentCountMap);
    renderDefaultStageClasses(secondaryClasses,   "secondary",   "C", 3, studentCountMap);

    updateStageTotals(studentCountMap);
}


function renderDefaultStageClasses(container, stage, stageLetter, numberOfClasses, studentCountMap) {

    if (!container) return;

    container.innerHTML = "";

    for (let classNumber = 1; classNumber <= numberOfClasses; classNumber++) {

        const count = getStudentCount(studentCountMap, stage, String(classNumber));

        const classItem = document.createElement("div");
        classItem.className = "class-item";

        classItem.innerHTML =
            '<div class="class-info">' +
                '<span class="class-number">' + classNumber + '</span>' +
                '<div>' +
                    '<div class="class-name">' +
                        escapeHtml(t("classLabel")) + ' ' + classNumber +
                    '</div>' +
                    '<div class="class-code">' +
                        escapeHtml(t("codeLabel")) + ': ' +
                        stageLetter + classNumber +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<span class="class-students' + (count === 0 ? " empty" : "") + '">' +
                '<i class="fas fa-user"></i>' +
                '<span>' + count + ' ' + escapeHtml(t("studentsWord")) + '</span>' +
            '</span>';

        attachClassClick(classItem, stage, classNumber);

        container.appendChild(classItem);
    }
}


// =====================================================
// Class click → navigate
// =====================================================

function attachClassClick(classItem, stage, classNumber) {
    classItem.addEventListener("click", function () {
        window.location.href =
            "./school-class.html" +
            "?stage=" + encodeURIComponent(stage) +
            "&class=" + encodeURIComponent(classNumber) +
            "&institutionId=" + encodeURIComponent(institutionId);
    });
}


// =====================================================
// Loading placeholder
// =====================================================

function showLoading(container) {
    if (!container) return;
    container.innerHTML =
        '<div class="class-item">' +
            '<div class="class-info"><div>' +
                '<div class="class-name">' +
                    '<span class="skeleton-line" style="display:inline-block;width:120px;height:14px;"></span>' +
                '</div>' +
            '</div></div>' +
        '</div>';
}


// =====================================================
// Event listeners
// =====================================================

function setupEventListeners() {

    document.getElementById("backButton")?.addEventListener("click", function () {
        window.location.href = "school.html?id=" + encodeURIComponent(institutionId);
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            setLanguage(btn.dataset.lang);
        });
    });
}


// =====================================================
// Initialize
// =====================================================

async function initializePage() {

    showLoader();

    const authenticated = initializeAuthentication();
    if (!authenticated) {
        hideLoaderAfterPaint();
        return;
    }

    displayInstitution();

    // 1) Cache-first render
    const hadCache = loadFromCache();
    if (hadCache) {
        hideLoaderAfterPaint();
    }

    // 2) Network refresh (parallel)
    await loadData();

    if (!hadCache) hideLoaderAfterPaint();
}


// =====================================================
// Start
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    currentLanguage = getSavedLanguage();
    applyLanguage();

    setupEventListeners();
    initializePage();

});
