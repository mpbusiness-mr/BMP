// =====================================================
// BMP · Classes & Stages — Speed-optimized
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Config
// =====================================================

const CACHE_TTL = 2 * 60 * 1000;   // 2 minutes


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
// Cache helpers — TTL aware, wrap data with timestamp
// =====================================================

function readCache(key, ttl) {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return { data: null, fresh: false };

        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.data) return { data: null, fresh: false };

        const age = Date.now() - (parsed.ts || 0);
        const fresh = ttl ? age < ttl : true;

        return { data: parsed.data, fresh: fresh };
    } catch (e) {
        return { data: null, fresh: false };
    }
}

function writeCache(key, data) {
    try {
        sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: data }));
    } catch (e) {}
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

    // Re-render with new language labels
    renderAll();
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
        window.location.href = "classes.html?id=" + encodeURIComponent(institutionId);
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
// API request — timeout + retry
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
// Student counts
// =====================================================

let studentCountMap = {};

function buildStudentCountMap() {

    const map = {};
    const academicYear = getCurrentAcademicYear();

    for (let i = 0; i < allStudents.length; i++) {

        const student = allStudents[i];

        const studentYear = String(student.academicYear || "").trim();
        if (studentYear && studentYear !== academicYear) continue;

        const stage = String(student.stage || "").trim().toLowerCase();
        const cls   = String(student.class || student.classNumber || "").trim();
        if (!stage || !cls) continue;

        const key = stage + "|" + cls;
        map[key] = (map[key] || 0) + 1;
    }

    studentCountMap = map;
    return map;
}

function getStudentCount(stage, classNumber) {
    const key = String(stage).toLowerCase() + "|" + String(classNumber);
    return studentCountMap[key] || 0;
}

function updateStageTotals() {

    const primaryTotalEl     = document.getElementById("primaryTotalStudents");
    const preparatoryTotalEl = document.getElementById("preparatoryTotalStudents");
    const secondaryTotalEl   = document.getElementById("secondaryTotalStudents");

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
// Render — single source of truth
// =====================================================

function renderAll() {

    if (allClasses.length > 0) {
        renderClasses(allClasses);
    } else {
        renderDefaultClasses();
    }
}


function renderClasses(classes) {

    buildStudentCountMap();

    const primary     = classes.filter(c => String(c.stage || "").toLowerCase() === "primary");
    const preparatory = classes.filter(c => String(c.stage || "").toLowerCase() === "preparatory");
    const secondary   = classes.filter(c => String(c.stage || "").toLowerCase() === "secondary");

    renderStageClasses(primaryClasses,     primary);
    renderStageClasses(preparatoryClasses, preparatory);
    renderStageClasses(secondaryClasses,   secondary);

    updateStageTotals();
}


function renderStageClasses(container, classes) {

    if (!container) return;

    const fragment = document.createDocumentFragment();

    if (!classes || classes.length === 0) {
        const empty = document.createElement("div");
        empty.className = "class-item";
        empty.innerHTML =
            '<div class="class-info"><div><div class="class-name">' +
            escapeHtml(t("noClasses")) +
            '</div></div></div>';
        fragment.appendChild(empty);
        container.replaceChildren(fragment);
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

        const count = getStudentCount(stage, classNumber);

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
        fragment.appendChild(classItem);
    });

    container.replaceChildren(fragment);
}


function renderDefaultClasses() {

    buildStudentCountMap();

    renderDefaultStageClasses(primaryClasses,     "primary",     "A", 6);
    renderDefaultStageClasses(preparatoryClasses, "preparatory", "B", 4);
    renderDefaultStageClasses(secondaryClasses,   "secondary",   "C", 3);

    updateStageTotals();
}


function renderDefaultStageClasses(container, stage, stageLetter, numberOfClasses) {

    if (!container) return;

    const fragment = document.createDocumentFragment();

    for (let classNumber = 1; classNumber <= numberOfClasses; classNumber++) {

        const count = getStudentCount(stage, String(classNumber));

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
        fragment.appendChild(classItem);
    }

    container.replaceChildren(fragment);
}


// =====================================================
// Update only the count badges (fast partial update)
// =====================================================

function updateCountBadgesOnly() {

    buildStudentCountMap();

    document.querySelectorAll(".class-item").forEach(function (item) {

        const codeEl = item.querySelector(".class-code");
        if (!codeEl) return;

        // Extract classCode from "Code: A1"
        const codeText = codeEl.textContent || "";
        const match = codeText.match(/:\s*([A-Z])(\d+)/);
        if (!match) return;

        const stageLetter = match[1];
        const classNumber = match[2];

        const stageMap = { A: "primary", B: "preparatory", C: "secondary" };
        const stage = stageMap[stageLetter];
        if (!stage) return;

        const count = getStudentCount(stage, classNumber);

        const badge = item.querySelector(".class-students");
        if (!badge) return;

        badge.classList.toggle("empty", count === 0);
        const badgeText = badge.querySelector("span");
        if (badgeText) {
            badgeText.textContent = count + " " + t("studentsWord");
        }
    });

    updateStageTotals();
}


// =====================================================
// Class click
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

function showLoadingPlaceholders() {
    const skeletonHtml =
        '<div class="class-item">' +
            '<div class="class-info"><div>' +
                '<div class="class-name">' +
                    '<span style="display:inline-block;width:120px;height:14px;background:rgba(15,43,75,0.08);border-radius:6px;"></span>' +
                '</div>' +
            '</div></div>' +
        '</div>';

    if (primaryClasses)     primaryClasses.innerHTML     = skeletonHtml;
    if (preparatoryClasses) preparatoryClasses.innerHTML = skeletonHtml;
    if (secondaryClasses)   secondaryClasses.innerHTML   = skeletonHtml;
}


// =====================================================
// Background fetchers — do not block render
// =====================================================

async function refreshClassesInBackground() {

    try {

        const result = await apiRequest("getClasses");
        const newClasses = Array.isArray(result.classes) ? result.classes : [];

        // Institution info
        if (result.institution) {
            const idEl   = document.getElementById("institutionId");
            const nameEl = document.getElementById("institutionName");
            if (idEl && result.institution.id)   idEl.textContent   = result.institution.id;
            if (nameEl && result.institution.name) {
                nameEl.textContent = result.institution.name;
                document.title = result.institution.name + " - Classes & Stages";
            }
        }

        // Only re-render if the classes actually changed
        const changed = JSON.stringify(newClasses) !== JSON.stringify(allClasses);

        allClasses = newClasses;
        writeCache(CACHE_KEY_CLASSES(), allClasses);

        if (changed && allClasses.length > 0) {
            renderClasses(allClasses);
        } else if (changed && allClasses.length === 0) {
            renderDefaultClasses();
        }

    } catch (error) {
        console.error("Classes refresh failed:", error);
    }
}


async function refreshStudentsInBackground() {

    try {

        const result = await apiRequest("getStudents");
        const newStudents = Array.isArray(result.students) ? result.students : [];

        const changed = JSON.stringify(newStudents) !== JSON.stringify(allStudents);

        allStudents = newStudents;
        writeCache(CACHE_KEY_STUDENTS(), allStudents);

        if (changed) {
            // Only patch count badges — no full re-render
            updateCountBadgesOnly();
        }

    } catch (error) {
        console.error("Students refresh failed:", error);
    }
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
// Initialize — cache-first, non-blocking refresh
// =====================================================

async function initializePage() {

    // Authenticate
    const authenticated = initializeAuthentication();
    if (!authenticated) {
        hideLoaderAfterPaint();
        return;
    }

    displayInstitution();

    // ---- STEP 1: Read both caches (fast, synchronous) ----
    const classesCache  = readCache(CACHE_KEY_CLASSES(), CACHE_TTL);
    const studentsCache = readCache(CACHE_KEY_STUDENTS(), CACHE_TTL);

    const hasClasses  = Array.isArray(classesCache.data) && classesCache.data.length > 0;
    const hasStudents = Array.isArray(studentsCache.data) && studentsCache.data.length > 0;

    // Reuse the students cache written by other pages (students.html, school-payments.html, etc.)
    if (hasStudents) {
        allStudents = studentsCache.data;
    }

    // ---- STEP 2: Render as fast as possible ----
    if (hasClasses) {
        // Classes already known → paint immediately with counts if we have students
        allClasses = classesCache.data;
        buildStudentCountMap();
        renderClasses(allClasses);
        hideLoaderAfterPaint();
    } else if (hasStudents) {
        // No classes cached yet, but we have students → draw default classes with counts
        buildStudentCountMap();
        renderDefaultClasses();
        hideLoaderAfterPaint();
    } else {
        // Cold start → show loader + placeholders
        showLoader();
        showLoadingPlaceholders();
    }

    // ---- STEP 3: Network refresh (non-blocking) ----

    const classesStale  = !classesCache.fresh;
    const studentsStale = !studentsCache.fresh;

    // Fetch classes only if stale OR missing
    const classesPromise = classesStale
        ? refreshClassesInBackground()
        : Promise.resolve();

    // Fetch students only if stale AND we don't already have a fresh copy from another page
    const studentsPromise = studentsStale
        ? refreshStudentsInBackground()
        : Promise.resolve();

    await Promise.all([classesPromise, studentsPromise]);

    // Cold start — first fetch just completed → now hide loader
    if (!hasClasses && !hasStudents) {
        hideLoaderAfterPaint();
    }
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
