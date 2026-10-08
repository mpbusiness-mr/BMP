// =====================================================
// BMP · Class Students
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Config
// =====================================================

const STUDENTS_TTL = 30 * 1000;   // 30 seconds
const PAYMENTS_TTL = 30 * 1000;   // 30 seconds


// =====================================================
// Months
// =====================================================

const MONTHS = [
    "October", "November", "December",
    "January", "February", "March",
    "April", "May", "June"
];


// =====================================================
// State
// =====================================================

let currentUser   = null;
let institutionId = null;

let currentLanguage = "ar";

let students = [];
let payments = [];

let schoolName = "";

let studentsLoaded = false;
let paymentsLoaded = false;


// =====================================================
// Translations
// =====================================================

const TRANSLATIONS = {

    en: {
        pageTitle: "Class Students",
        pageSubtitle: "Student payment status",
        backToClasses: "Back to Classes",
        loading: "Loading...",
        loadingStudents: "Loading students...",

        institutionId: "Institution ID",
        schoolName: "School Name",
        academicYear: "Academic Year",
        allAcademicYears: "All Academic Years",
        stage: "Stage",
        class: "Class",
        students: "Students",

        month: "Month",
        allMonths: "All Months",
        paymentStatus: "Payment Status",
        allStudents: "All Students",
        paid: "Paid",
        unpaid: "Unpaid",

        paidLegend: "Payment recorded",
        unpaidLegend: "No payment recorded",

        printUnpaidList: "Print Unpaid List",
        studentNumber: "Student No.",
        studentName: "Student Name",
        status: "Status",

        noStudents: "No students found.",
        allPaid: "All students have paid.",
        selectMonthFirst: "Please select a month first.",

        primary: "Primary Education",
        preparatory: "Preparatory Education",
        secondary: "Secondary Education",

        months: {
            October: "October",
            November: "November",
            December: "December",
            January: "January",
            February: "February",
            March: "March",
            April: "April",
            May: "May",
            June: "June"
        }
    },

    ar: {
        pageTitle: "طلاب القسم",
        pageSubtitle: "حالة مدفوعات الطلاب",
        backToClasses: "رجوع إلى الأقسام",
        loading: "جارٍ التحميل...",
        loadingStudents: "جارٍ تحميل الطلاب...",

        institutionId: "معرّف المؤسسة",
        schoolName: "اسم المدرسة",
        academicYear: "السنة الدراسية",
        allAcademicYears: "جميع السنوات الدراسية",
        stage: "المرحلة",
        class: "القسم",
        students: "الطلاب",

        month: "الشهر",
        allMonths: "جميع الأشهر",
        paymentStatus: "حالة الدفع",
        allStudents: "جميع الطلاب",
        paid: "مدفوع",
        unpaid: "غير مدفوع",

        paidLegend: "تم تسجيل الدفع",
        unpaidLegend: "لم يتم تسجيل أي دفعة",

        printUnpaidList: "طباعة قائمة غير المدفوعين",
        studentNumber: "رقم الطالب",
        studentName: "اسم الطالب",
        status: "الحالة",

        noStudents: "لا يوجد طلاب.",
        allPaid: "جميع الطلاب قد دفعوا.",
        selectMonthFirst: "يرجى اختيار الشهر أولاً.",

        primary: "التعليم الابتدائي",
        preparatory: "التعليم الإعدادي",
        secondary: "التعليم الثانوي",

        months: {
            October: "أكتوبر",
            November: "نوفمبر",
            December: "ديسمبر",
            January: "يناير",
            February: "فبراير",
            March: "مارس",
            April: "أبريل",
            May: "مايو",
            June: "يونيو"
        }
    },

    fr: {
        pageTitle: "Élèves de la classe",
        pageSubtitle: "Statut de paiement des élèves",
        backToClasses: "Retour aux classes",
        loading: "Chargement...",
        loadingStudents: "Chargement des élèves...",

        institutionId: "ID de l'établissement",
        schoolName: "Nom de l'école",
        academicYear: "Année scolaire",
        allAcademicYears: "Toutes les années",
        stage: "Cycle",
        class: "Classe",
        students: "Élèves",

        month: "Mois",
        allMonths: "Tous les mois",
        paymentStatus: "Statut de paiement",
        allStudents: "Tous les élèves",
        paid: "Payé",
        unpaid: "Non payé",

        paidLegend: "Paiement enregistré",
        unpaidLegend: "Aucun paiement enregistré",

        printUnpaidList: "Imprimer la liste des impayés",
        studentNumber: "N° élève",
        studentName: "Nom de l'élève",
        status: "Statut",

        noStudents: "Aucun élève trouvé.",
        allPaid: "Tous les élèves ont payé.",
        selectMonthFirst: "Veuillez d'abord sélectionner un mois.",

        primary: "Enseignement primaire",
        preparatory: "Enseignement préparatoire",
        secondary: "Enseignement secondaire",

        months: {
            October: "Octobre",
            November: "Novembre",
            December: "Décembre",
            January: "Janvier",
            February: "Février",
            March: "Mars",
            April: "Avril",
            May: "Mai",
            June: "Juin"
        }
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
// Cache helpers
// =====================================================

function readCache(key, ttl) {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return { data: null, fresh: false };

        const parsed = JSON.parse(raw);
        if (!parsed || parsed.data === undefined) return { data: null, fresh: false };

        const age = Date.now() - (parsed.ts || 0);
        return { data: parsed.data, fresh: age < ttl };
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

    document.title = (pageTitle ? pageTitle.textContent : t("pageTitle")) + " - BMP";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const key = el.getAttribute("data-i18n");
        const value = TRANSLATIONS[currentLanguage][key];
        if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });

    // Rebuild month dropdown + table headers
    buildMonthFilter();
    buildMonthHeaders();

    // Re-render
    if (studentsLoaded) {
        renderStudents();
    }
}


// =====================================================
// URL parameters
// =====================================================

const urlParams = new URLSearchParams(window.location.search);

const selectedStage = String(urlParams.get("stage") || "").trim();
const selectedClass = String(urlParams.get("class") || "").trim();


// =====================================================
// Element refs
// =====================================================

const pageTitle             = document.getElementById("pageTitle");
const pageSubtitle          = document.getElementById("pageSubtitle");
const institutionIdElement  = document.getElementById("institutionId");
const institutionNameElement= document.getElementById("institutionName");
const academicYearFilter    = document.getElementById("academicYearFilter");
const stageNameElement      = document.getElementById("stageName");
const classNameElement      = document.getElementById("className");
const studentCountElement   = document.getElementById("studentCount");
const studentsTableBody     = document.getElementById("studentsTableBody");
const monthFilter           = document.getElementById("monthFilter");
const paymentStatusFilter   = document.getElementById("paymentStatusFilter");
const printUnpaidButton     = document.getElementById("printUnpaidButton");
const printSchoolName       = document.getElementById("printSchoolName");
const printClassTitle       = document.getElementById("printClassTitle");
const printPeriod           = document.getElementById("printPeriod");
const printUnpaidBody       = document.getElementById("printUnpaidBody");
const backButton            = document.getElementById("backButton");
const tableHeaderRow        = document.getElementById("tableHeaderRow");


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
    return Boolean(institutionId);
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
    if (now.getMonth() < 9) startYear--;   // before October → previous year
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
// Escape HTML
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
// Stage name
// =====================================================

function getStageName(stage) {
    const key = String(stage || "").toLowerCase();
    if (key === "primary")     return t("primary");
    if (key === "preparatory") return t("preparatory");
    if (key === "secondary")   return t("secondary");
    return stage || "-";
}


// =====================================================
// Update header
// =====================================================

function updateHeader() {

    const stageName = getStageName(selectedStage);

    const title = stageName + " · " + t("class") + " " + selectedClass;

    if (pageTitle)             pageTitle.textContent             = title;
    if (pageSubtitle)          pageSubtitle.textContent          = t("pageSubtitle");
    if (institutionIdElement)  institutionIdElement.textContent  = institutionId;
    if (institutionNameElement) institutionNameElement.textContent = schoolName || institutionId || "-";
    if (stageNameElement)      stageNameElement.textContent      = stageName;
    if (classNameElement)      classNameElement.textContent      = stageName + " " + selectedClass;

    document.title = title + " - BMP";
}


// =====================================================
// Build dropdowns
// =====================================================

function buildAcademicYearFilter() {

    if (!academicYearFilter) return;

    const years = [...new Set(
        students
            .map(s => String(s.academicYear || "").trim())
            .filter(Boolean)
    )].sort((a, b) => b.localeCompare(a));

    const currentYear = getCurrentAcademicYear();
    if (!years.includes(currentYear)) years.unshift(currentYear);

    const previousValue = academicYearFilter.value;

    academicYearFilter.innerHTML = "";

    const allOpt = document.createElement("option");
    allOpt.value = "";
    allOpt.textContent = t("allAcademicYears");
    academicYearFilter.appendChild(allOpt);

    years.forEach(function (year) {
        const opt = document.createElement("option");
        opt.value = year;
        opt.textContent = year;
        academicYearFilter.appendChild(opt);
    });

    // Priority: previously-selected → current year → all
    if (previousValue && years.includes(previousValue)) {
        academicYearFilter.value = previousValue;
    } else if (years.includes(currentYear)) {
        academicYearFilter.value = currentYear;
    } else {
        academicYearFilter.value = "";
    }
}


function buildMonthFilter() {

    if (!monthFilter) return;

    const previousValue = monthFilter.value;

    monthFilter.innerHTML = "";

    const allOpt = document.createElement("option");
    allOpt.value = "";
    allOpt.textContent = t("allMonths");
    monthFilter.appendChild(allOpt);

    MONTHS.forEach(function (month) {
        const opt = document.createElement("option");
        opt.value = month;
        opt.textContent = t("months." + month);
        monthFilter.appendChild(opt);
    });

    if (previousValue) monthFilter.value = previousValue;
}


function buildMonthHeaders() {

    if (!tableHeaderRow) return;

    // Remove existing month headers (keep first 2: Student No., Student Name)
    const existing = tableHeaderRow.querySelectorAll("th");
    existing.forEach(function (th, idx) {
        if (idx >= 2) th.remove();
    });

    MONTHS.forEach(function (month) {
        const th = document.createElement("th");
        th.textContent = t("months." + month);
        th.setAttribute("data-month", month);
        tableHeaderRow.appendChild(th);
    });
}


// =====================================================
// Filtering logic
// =====================================================

function getClassStudents() {

    return students.filter(function (student) {

        const stage       = String(student.stage || "").trim().toLowerCase();
        const classNumber = String(student.class || student.classNumber || "").trim();

        if (stage !== selectedStage.toLowerCase()) return false;
        if (classNumber !== selectedClass) return false;

        if (academicYearFilter && academicYearFilter.value) {
            if (String(student.academicYear || "").trim() !== academicYearFilter.value) {
                return false;
            }
        }

        return true;
    });
}


function isMonthPaid(studentId, academicYear, month) {

    const sid = String(studentId || "");
    const ay  = String(academicYear || "");

    for (let i = 0; i < payments.length; i++) {
        const p = payments[i];
        if (String(p.studentId || "") === sid
            && String(p.academicYear || "") === ay
            && String(p.month || "") === month) {
            return true;
        }
    }
    return false;
}


function getVisibleStudents() {

    const classStudents = getClassStudents();

    const selectedMonth  = monthFilter ? monthFilter.value : "";
    const selectedStatus = paymentStatusFilter ? paymentStatusFilter.value : "";

    if (!selectedMonth || !selectedStatus) {
        return classStudents;
    }

    return classStudents.filter(function (student) {

        const studentId    = student.studentId || student.id || "";
        const academicYear = String(student.academicYear || "");

        const paid = isMonthPaid(studentId, academicYear, selectedMonth);

        if (selectedStatus === "paid")   return paid;
        if (selectedStatus === "unpaid") return !paid;
        return true;
    });
}


// =====================================================
// Render students table
// =====================================================

function renderStudents() {

    if (!studentsTableBody) return;

    const visibleStudents = getVisibleStudents();

    if (studentCountElement) {
        studentCountElement.textContent = String(visibleStudents.length);
    }

    if (visibleStudents.length === 0) {
        studentsTableBody.innerHTML =
            '<tr><td colspan="11" class="empty-state">' +
            escapeHtml(t("noStudents")) +
            '</td></tr>';
        return;
    }

    visibleStudents.sort(function (a, b) {
        return String(a.studentNumber || "").localeCompare(
            String(b.studentNumber || ""),
            undefined,
            { numeric: true }
        );
    });

    const fragment = document.createDocumentFragment();

    visibleStudents.forEach(function (student) {

        const studentId    = student.studentId || student.id || "";
        const academicYear = String(student.academicYear || "");

        const row = document.createElement("tr");

        let cellsHtml =
            "<td>" + escapeHtml(student.studentNumber || "") + "</td>" +
            "<td>" + escapeHtml(student.name || "") + "</td>";

        MONTHS.forEach(function (month) {
            const paid = isMonthPaid(studentId, academicYear, month);
            cellsHtml +=
                '<td><span class="status-badge ' + (paid ? "paid" : "unpaid") + '">' +
                escapeHtml(paid ? t("paid") : t("unpaid")) +
                '</span></td>';
        });

        row.innerHTML = cellsHtml;
        fragment.appendChild(row);
    });

    studentsTableBody.replaceChildren(fragment);
}


// =====================================================
// Print unpaid list
// =====================================================

function printUnpaidList() {

    const selectedMonth = monthFilter ? monthFilter.value : "";

    if (!selectedMonth) {
        alert(t("selectMonthFirst"));
        return;
    }

    const unpaidStudents = getClassStudents().filter(function (student) {

        const studentId    = student.studentId || student.id || "";
        const academicYear = String(student.academicYear || "");

        return !isMonthPaid(studentId, academicYear, selectedMonth);
    });

    if (printSchoolName) printSchoolName.textContent = schoolName || "School";

    if (printClassTitle) {
        printClassTitle.textContent =
            getStageName(selectedStage) + " - " + t("class") + " " + selectedClass +
            " - " + t("unpaid");
    }

    if (printPeriod) {
        printPeriod.textContent =
            t("month") + ": " + t("months." + selectedMonth) +
            "  |  " + t("academicYear") + ": " +
            ((academicYearFilter && academicYearFilter.value)
                ? academicYearFilter.value
                : t("allAcademicYears"));
    }

    if (printUnpaidBody) printUnpaidBody.innerHTML = "";

    if (unpaidStudents.length === 0) {
        if (printUnpaidBody) {
            printUnpaidBody.innerHTML =
                '<tr><td colspan="6" style="text-align:center;">' +
                escapeHtml(t("allPaid")) +
                '</td></tr>';
        }
    } else {
        const fragment = document.createDocumentFragment();

        unpaidStudents.sort(function (a, b) {
            return String(a.studentNumber || "").localeCompare(
                String(b.studentNumber || ""),
                undefined,
                { numeric: true }
            );
        });

        unpaidStudents.forEach(function (student) {
            const row = document.createElement("tr");
            row.innerHTML =
                "<td>" + escapeHtml(student.studentNumber || "") + "</td>" +
                "<td>" + escapeHtml(student.name || "") + "</td>" +
                "<td>" + escapeHtml(selectedClass) + "</td>" +
                "<td>" + escapeHtml(student.academicYear || "") + "</td>" +
                "<td>" + escapeHtml(t("months." + selectedMonth)) + "</td>" +
                "<td>" + escapeHtml(t("unpaid")) + "</td>";
            fragment.appendChild(row);
        });

        printUnpaidBody.appendChild(fragment);
    }

    window.print();
}


// =====================================================
// Load data — parallel, cache-first
// =====================================================

async function loadData() {

    // ---- STEP 1: Try cache first ----
    const studentsCache = readCache("bmp_students_" + institutionId, STUDENTS_TTL);
    const paymentsCache = readCache("bmp_payments_" + institutionId, PAYMENTS_TTL);

    if (studentsCache.data) {
        students = studentsCache.data;
        studentsLoaded = true;
    }
    if (paymentsCache.data) {
        payments = paymentsCache.data;
        paymentsLoaded = true;
    }

    // If both fresh → render immediately, no network at all
    if (studentsCache.fresh && paymentsCache.fresh) {
        updateHeader();
        buildAcademicYearFilter();
        renderStudents();
        hideLoaderAfterPaint();
        return;
    }

    // If we have both (even stale) → render now, refresh in background
    if (studentsLoaded && paymentsLoaded) {
        updateHeader();
        buildAcademicYearFilter();
        renderStudents();
        hideLoaderAfterPaint();
    }

    // ---- STEP 2: Fetch what's missing or stale (in parallel) ----
    const promises = [];

    if (!studentsCache.fresh) {
        promises.push(
            apiRequest("getStudents").then(function (result) {
                students = Array.isArray(result.students) ? result.students : [];
                studentsLoaded = true;
                writeCache("bmp_students_" + institutionId, students);
            }).catch(function (error) {
                console.error("Students fetch failed:", error);
                studentsLoaded = true; // stop skeletons
            })
        );
    }

    if (!paymentsCache.fresh) {
        promises.push(
            apiRequest("getPayments").then(function (result) {
                payments = Array.isArray(result.payments) ? result.payments : [];
                paymentsLoaded = true;
                writeCache("bmp_payments_" + institutionId, payments);
            }).catch(function (error) {
                console.error("Payments fetch failed:", error);
                paymentsLoaded = true;
            })
        );
    }

    await Promise.all(promises);

    // ---- STEP 3: Final render ----
    updateHeader();
    buildAcademicYearFilter();
    renderStudents();
    hideLoaderAfterPaint();
}


// =====================================================
// Event listeners
// =====================================================

function setupEventListeners() {

    academicYearFilter?.addEventListener("change", renderStudents);
    monthFilter?.addEventListener("change", renderStudents);
    paymentStatusFilter?.addEventListener("change", renderStudents);

    printUnpaidButton?.addEventListener("click", printUnpaidList);

    backButton?.addEventListener("click", function () {
        window.location.href =
            "classes.html?id=" + encodeURIComponent(institutionId);
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

    const authenticated = initializeAuthentication();
    if (!authenticated) {
        hideLoaderAfterPaint();
        return;
    }

    schoolName =
        currentUser.institutionName ||
        currentUser.schoolName ||
        institutionId;

    if (!selectedStage || !selectedClass) {
        if (studentsTableBody) {
            studentsTableBody.innerHTML =
                '<tr><td colspan="11" class="empty-state">Class information is missing.</td></tr>';
        }
        hideLoaderAfterPaint();
        return;
    }

    updateHeader();
    buildMonthFilter();
    buildMonthHeaders();

    showLoader();

    // Skeleton rows while loading
    if (studentsTableBody) {
        let skeletonRow = '<tr>';
        skeletonRow += '<td><span class="skeleton-line"></span></td>';
        skeletonRow += '<td><span class="skeleton-line"></span></td>';
        for (let i = 0; i < MONTHS.length; i++) {
            skeletonRow += '<td><span class="skeleton-line" style="width:60%;"></span></td>';
        }
        skeletonRow += '</tr>';
        studentsTableBody.innerHTML = skeletonRow.repeat(5);
    }

    await loadData();
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
