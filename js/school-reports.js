// =====================================================
// BMP · School Reports
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

let students   = [];
let payments   = [];
let institution = null;

let dataLoaded = false;

const CACHE_KEY_REPORTS = () => "bmp_reports_" + institutionId + "_" + getCurrentAcademicYear();


// =====================================================
// Translations
// =====================================================

const TRANSLATIONS = {

    en: {
        pageTitle: "School Reports",
        pageSubtitle: "View school statistics and payment reports.",
        back: "Back",
        loading: "Loading...",
        loadingReports: "Loading reports...",

        institutionId: "Institution ID",
        schoolName: "School Name",
        academicYear: "Academic Year",
        allAcademicYears: "All Academic Years",

        totalStudents: "Total Students",
        totalPayments: "Total Payments",
        totalAmountPaid: "Total Amount Paid",
        studentsWithPayments: "Students With Payments",
        studentsWithoutPayments: "Students Without Payments",
        paidMonths: "Paid Months",

        paymentReport: "Payment Report",
        paymentReportSubtitle: "Monthly payment activity for the selected academic year.",
        studentReport: "Student Report",
        studentReportSubtitle: "Student payment status for the selected academic year.",

        printSave: "Print / Save PDF",

        month: "Month",
        payments: "Payments",
        students: "Students",
        totalAmount: "Total Amount",

        studentNumber: "Student Number",
        studentName: "Student Name",
        stage: "Stage",
        class: "Class",
        paidMonthsColumn: "Paid Months",
        totalPaid: "Total Paid",

        noStudents: "No students available.",

        primary: "Primary",
        preparatory: "Preparatory",
        secondary: "Secondary",

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
        pageTitle: "تقارير المدرسة",
        pageSubtitle: "عرض إحصائيات المدرسة وتقارير الدفع.",
        back: "رجوع",
        loading: "جارٍ التحميل...",
        loadingReports: "جارٍ تحميل التقارير...",

        institutionId: "معرّف المؤسسة",
        schoolName: "اسم المدرسة",
        academicYear: "السنة الدراسية",
        allAcademicYears: "جميع السنوات الدراسية",

        totalStudents: "إجمالي الطلاب",
        totalPayments: "إجمالي المدفوعات",
        totalAmountPaid: "إجمالي المبلغ المدفوع",
        studentsWithPayments: "طلاب لديهم مدفوعات",
        studentsWithoutPayments: "طلاب بدون مدفوعات",
        paidMonths: "الأشهر المدفوعة",

        paymentReport: "تقرير المدفوعات",
        paymentReportSubtitle: "نشاط الدفع الشهري للسنة الدراسية المحددة.",
        studentReport: "تقرير الطلاب",
        studentReportSubtitle: "حالة دفع الطلاب للسنة الدراسية المحددة.",

        printSave: "طباعة / حفظ PDF",

        month: "الشهر",
        payments: "المدفوعات",
        students: "الطلاب",
        totalAmount: "إجمالي المبلغ",

        studentNumber: "رقم الطالب",
        studentName: "اسم الطالب",
        stage: "المرحلة",
        class: "القسم",
        paidMonthsColumn: "الأشهر المدفوعة",
        totalPaid: "إجمالي المدفوع",

        noStudents: "لا يوجد طلاب.",

        primary: "الابتدائية",
        preparatory: "الإعدادية",
        secondary: "الثانوية",

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
        pageTitle: "Rapports scolaires",
        pageSubtitle: "Consulter les statistiques et rapports de paiement.",
        back: "Retour",
        loading: "Chargement...",
        loadingReports: "Chargement des rapports...",

        institutionId: "ID de l'établissement",
        schoolName: "Nom de l'école",
        academicYear: "Année scolaire",
        allAcademicYears: "Toutes les années",

        totalStudents: "Total des élèves",
        totalPayments: "Total des paiements",
        totalAmountPaid: "Montant total payé",
        studentsWithPayments: "Élèves avec paiements",
        studentsWithoutPayments: "Élèves sans paiements",
        paidMonths: "Mois payés",

        paymentReport: "Rapport des paiements",
        paymentReportSubtitle: "Activité mensuelle de paiement pour l'année sélectionnée.",
        studentReport: "Rapport des élèves",
        studentReportSubtitle: "Statut de paiement des élèves pour l'année sélectionnée.",

        printSave: "Imprimer / PDF",

        month: "Mois",
        payments: "Paiements",
        students: "Élèves",
        totalAmount: "Montant total",

        studentNumber: "N° élève",
        studentName: "Nom de l'élève",
        stage: "Cycle",
        class: "Classe",
        paidMonthsColumn: "Mois payés",
        totalPaid: "Total payé",

        noStudents: "Aucun élève disponible.",

        primary: "Primaire",
        preparatory: "Collège",
        secondary: "Secondaire",

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

    document.title = t("pageTitle") + " - BMP";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const key = el.getAttribute("data-i18n");
        const value = TRANSLATIONS[currentLanguage][key];
        if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });

    // Rebuild academic year dropdown labels
    buildAcademicYearFilter();

    // Re-render tables with new month names
    if (dataLoaded) {
        updateSummary();
        renderPaymentReport();
        renderStudentReport();
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
// Element refs
// =====================================================

const institutionIdElement   = document.getElementById("institutionId");
const institutionNameElement = document.getElementById("institutionName");
const academicYearFilter     = document.getElementById("academicYearFilter");
const totalStudentsElement   = document.getElementById("totalStudents");
const totalPaymentsElement   = document.getElementById("totalPayments");
const totalAmountElement     = document.getElementById("totalAmount");
const paidStudentsElement    = document.getElementById("paidStudents");
const unpaidStudentsElement  = document.getElementById("unpaidStudents");
const paidMonthsElement      = document.getElementById("paidMonths");
const paymentReportBody      = document.getElementById("paymentReportBody");
const studentReportBody      = document.getElementById("studentReportBody");
const backButton             = document.getElementById("backButton");
const printButton            = document.getElementById("printButton");


// =====================================================
// Stage name
// =====================================================

function formatStage(stage) {
    const key = String(stage || "").trim().toLowerCase();
    if (key === "primary")     return t("primary");
    if (key === "preparatory") return t("preparatory");
    if (key === "secondary")   return t("secondary");
    return stage || "-";
}


// =====================================================
// Format amount
// =====================================================

function formatAmount(amount) {
    const number = Number(amount || 0);
    return number.toLocaleString(
        currentLanguage === "ar" ? "ar" : currentLanguage === "fr" ? "fr-FR" : "en-US",
        { minimumFractionDigits: 0, maximumFractionDigits: 2 }
    );
}


// =====================================================
// Academic year filter
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

    if (previousValue && years.includes(previousValue)) {
        academicYearFilter.value = previousValue;
    } else if (years.includes(currentYear)) {
        academicYearFilter.value = currentYear;
    } else {
        academicYearFilter.value = "";
    }
}


// =====================================================
// Filtered data
// =====================================================

function getSelectedStudents() {

    const institutionMatch = s => String(s.institutionId || institutionId) === institutionId;

    if (!academicYearFilter || !academicYearFilter.value) {
        return students.filter(institutionMatch);
    }

    return students.filter(function (s) {
        if (!institutionMatch(s)) return false;
        return String(s.academicYear || "") === academicYearFilter.value;
    });
}


function getSelectedPayments() {

    const selectedStudents = getSelectedStudents();

    const studentIds = new Set(
        selectedStudents.map(s => String(s.studentId || s.id || ""))
    );

    return payments.filter(function (p) {

        const institutionMatch =
            String(p.institutionId || institutionId) === institutionId;
        if (!institutionMatch) return false;

        const sid = String(p.studentId || "");
        if (!studentIds.has(sid)) return false;

        if (academicYearFilter && academicYearFilter.value) {
            if (String(p.academicYear || "") !== academicYearFilter.value) {
                return false;
            }
        }

        return true;
    });
}


// =====================================================
// Summary
// =====================================================

function updateSummary() {

    const selectedStudents = getSelectedStudents();
    const selectedPayments = getSelectedPayments();

    if (totalStudentsElement) totalStudentsElement.textContent = String(selectedStudents.length);
    if (totalPaymentsElement) totalPaymentsElement.textContent = String(selectedPayments.length);

    const totalAmount = selectedPayments.reduce(
        (sum, p) => sum + Number(p.amount || 0), 0
    );
    if (totalAmountElement) totalAmountElement.textContent = formatAmount(totalAmount);

    const paidIds = new Set(
        selectedPayments.map(p => String(p.studentId || ""))
    );

    if (paidStudentsElement)   paidStudentsElement.textContent   = String(paidIds.size);
    if (unpaidStudentsElement) unpaidStudentsElement.textContent =
        String(Math.max(0, selectedStudents.length - paidIds.size));

    if (paidMonthsElement) paidMonthsElement.textContent = String(selectedPayments.length);
}


// =====================================================
// Payment report
// =====================================================

function renderPaymentReport() {

    if (!paymentReportBody) return;

    const selectedPayments = getSelectedPayments();
    const fragment = document.createDocumentFragment();

    MONTHS.forEach(function (month) {

        const monthPayments = selectedPayments.filter(
            p => String(p.month || "") === month
        );

        const studentIds = new Set(
            monthPayments.map(p => String(p.studentId || ""))
        );

        const totalAmount = monthPayments.reduce(
            (sum, p) => sum + Number(p.amount || 0), 0
        );

        const row = document.createElement("tr");
        row.innerHTML =
            "<td>" + escapeHtml(t("months." + month)) + "</td>" +
            "<td>" + monthPayments.length + "</td>" +
            "<td>" + studentIds.size + "</td>" +
            "<td>" + escapeHtml(formatAmount(totalAmount)) + "</td>";

        fragment.appendChild(row);
    });

    paymentReportBody.replaceChildren(fragment);
}


// =====================================================
// Student report
// =====================================================

function renderStudentReport() {

    if (!studentReportBody) return;

    const selectedStudents = getSelectedStudents();
    const selectedPayments = getSelectedPayments();

    if (selectedStudents.length === 0) {
        studentReportBody.innerHTML =
            '<tr><td colspan="6" class="empty-state">' +
            escapeHtml(t("noStudents")) +
            '</td></tr>';
        return;
    }

    const sortedStudents = [...selectedStudents].sort(function (a, b) {
        return String(a.studentNumber || "").localeCompare(
            String(b.studentNumber || ""),
            undefined,
            { numeric: true }
        );
    });

    const fragment = document.createDocumentFragment();

    sortedStudents.forEach(function (student) {

        const studentId = String(student.studentId || student.id || "");

        const studentPayments = selectedPayments.filter(
            p => String(p.studentId || "") === studentId
        );

        const totalPaid = studentPayments.reduce(
            (sum, p) => sum + Number(p.amount || 0), 0
        );

        const row = document.createElement("tr");
        row.innerHTML =
            "<td>" + escapeHtml(student.studentNumber || "") + "</td>" +
            "<td>" + escapeHtml(student.name || "") + "</td>" +
            "<td>" + escapeHtml(formatStage(student.stage)) + "</td>" +
            "<td>" + escapeHtml(student.className || student.class || "") + "</td>" +
            "<td>" + studentPayments.length + "</td>" +
            "<td>" + escapeHtml(formatAmount(totalPaid)) + "</td>";

        fragment.appendChild(row);
    });

    studentReportBody.replaceChildren(fragment);
}


// =====================================================
// Refresh all reports
// =====================================================

function refreshReports() {
    updateSummary();
    renderPaymentReport();
    renderStudentReport();
}


// =====================================================
// Skeleton
// =====================================================

function showSkeletons() {

    const skeletonRow4 =
        '<tr><td colspan="4"><span class="skeleton-line"></span></td></tr>' +
        '<tr><td colspan="4"><span class="skeleton-line" style="width:70%;"></span></td></tr>' +
        '<tr><td colspan="4"><span class="skeleton-line" style="width:50%;"></span></td></tr>';

    const skeletonRow6 =
        '<tr><td colspan="6"><span class="skeleton-line"></span></td></tr>' +
        '<tr><td colspan="6"><span class="skeleton-line" style="width:70%;"></span></td></tr>' +
        '<tr><td colspan="6"><span class="skeleton-line" style="width:50%;"></span></td></tr>';

    if (paymentReportBody) paymentReportBody.innerHTML = skeletonRow4;
    if (studentReportBody) studentReportBody.innerHTML = skeletonRow6;

    ["totalStudents", "totalPayments", "totalAmount",
     "paidStudents", "unpaidStudents", "paidMonths"].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.textContent = "…";
    });
}


// =====================================================
// Load data
// =====================================================

async function loadReports() {

    // ---- Cache first ----
    const cached = readCache(CACHE_KEY_REPORTS(), CACHE_TTL);

    if (cached.data) {
        students    = cached.data.students   || [];
        payments    = cached.data.payments   || [];
        institution = cached.data.institution || null;
        dataLoaded  = true;

        updateInstitutionInfo();
        buildAcademicYearFilter();
        refreshReports();
        hideLoaderAfterPaint();

        // If fresh, skip network
        if (cached.fresh) {
            return;
        }

        // Otherwise refresh in background — silently
        refreshFromNetwork();
        return;
    }

    // ---- Cold start ----
    showLoader();
    showSkeletons();

    await refreshFromNetwork();

    hideLoaderAfterPaint();
}


async function refreshFromNetwork() {
    try {

        const result = await apiRequest("getReports");

        students    = Array.isArray(result.students)   ? result.students   : [];
        payments    = Array.isArray(result.payments)   ? result.payments   : [];
        institution = result.institution || null;
        dataLoaded  = true;

        writeCache(CACHE_KEY_REPORTS(), {
            students: students,
            payments: payments,
            institution: institution
        });

        updateInstitutionInfo();
        buildAcademicYearFilter();
        refreshReports();

    } catch (error) {
        console.error("Reports loading error:", error);

        if (!dataLoaded) {
            if (paymentReportBody) {
                paymentReportBody.innerHTML =
                    '<tr><td colspan="4" class="empty-state">Failed to load reports.</td></tr>';
            }
            if (studentReportBody) {
                studentReportBody.innerHTML =
                    '<tr><td colspan="6" class="empty-state">Failed to load reports.</td></tr>';
            }
        }
    }
}


function updateInstitutionInfo() {

    if (institutionIdElement) {
        institutionIdElement.textContent =
            (institution && institution.id) || institutionId || "-";
    }

    if (institutionNameElement) {
        institutionNameElement.textContent =
            (institution && institution.name) ||
            (currentUser && currentUser.institutionName) ||
            "-";
    }

    if (institution && institution.name) {
        document.title = institution.name + " · " + t("pageTitle") + " - BMP";
    }
}


// =====================================================
// Event listeners
// =====================================================

function setupEventListeners() {

    academicYearFilter?.addEventListener("change", refreshReports);

    printButton?.addEventListener("click", function () {
        window.print();
    });

    backButton?.addEventListener("click", function () {
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

    const authenticated = initializeAuthentication();
    if (!authenticated) {
        hideLoaderAfterPaint();
        return;
    }

    updateInstitutionInfo();
    await loadReports();
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
