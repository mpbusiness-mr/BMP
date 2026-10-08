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

const MONTHS = [
    "October", "November", "December",
    "January", "February", "March",
    "April", "May", "June"
];


// =====================================================
// State
// =====================================================

let currentUser    = null;
let institutionId  = null;

let currentLanguage = "ar";

let students    = [];
let payments    = [];
let institution = null;

let dataLoaded = false;


// =====================================================
// Translations
// =====================================================

const TRANSLATIONS = {

    en: {
        pageTitle: "School Reports",
        pageSubtitle: "View school statistics and payment reports.",
        back: "Back",
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
        failedToLoad: "Failed to load reports.",

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
        failedToLoad: "فشل تحميل التقارير.",

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
        failedToLoad: "Échec du chargement des rapports.",

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

    // Static text
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const key = el.getAttribute("data-i18n");
        const value = TRANSLATIONS[currentLanguage][key];
        if (value !== undefined) el.textContent = value;
    });

    // Active button
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });

    // Rebuild dynamic text (academic year dropdown + tables)
    if (dataLoaded) {
        loadAcademicYears();
        refreshReports();
    }
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

function getCacheKey() {
    return "bmp_reports_" + institutionId + "_" + getCurrentAcademicYear();
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
// API request — timeout + retry
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
            if (!response.ok) throw new Error("Server error: " + response.status);
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
// Elements
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
    const locale =
        currentLanguage === "ar" ? "ar" :
        currentLanguage === "fr" ? "fr-FR" : "en-US";
    return number.toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}


// =====================================================
// Academic Year dropdown
// =====================================================

function getAcademicYears() {
    const years = [];
    students.forEach(function (s) {
        const y = String(s.academicYear || "").trim();
        if (y && years.indexOf(y) === -1) years.push(y);
    });

    const currentYear = getCurrentAcademicYear();
    if (years.indexOf(currentYear) === -1) years.push(currentYear);

    years.sort(function (a, b) { return b.localeCompare(a); });
    return years;
}

function loadAcademicYears() {

    if (!academicYearFilter) return;

    const years = getAcademicYears();
    const previous = academicYearFilter.value;

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

    const currentYear = getCurrentAcademicYear();

    if (previous && years.indexOf(previous) !== -1) {
        academicYearFilter.value = previous;
    } else if (years.indexOf(currentYear) !== -1) {
        academicYearFilter.value = currentYear;
    } else {
        academicYearFilter.value = "";
    }
}


// =====================================================
// Data filters
// =====================================================

function getSelectedStudents() {

    return students.filter(function (s) {

        const sInstitution = String(s.institutionId || institutionId);
        if (sInstitution !== institutionId) return false;

        if (academicYearFilter && academicYearFilter.value) {
            if (String(s.academicYear || "") !== academicYearFilter.value) return false;
        }

        return true;
    });
}

function getSelectedPayments() {

    const selectedStudents = getSelectedStudents();
    const studentIds = {};

    selectedStudents.forEach(function (s) {
        const id = String(s.studentId || s.id || "");
        if (id) studentIds[id] = true;
    });

    return payments.filter(function (p) {

        const pInstitution = String(p.institutionId || institutionId);
        if (pInstitution !== institutionId) return false;

        const sid = String(p.studentId || "");
        if (!sid || !studentIds[sid]) return false;

        if (academicYearFilter && academicYearFilter.value) {
            if (String(p.academicYear || "") !== academicYearFilter.value) return false;
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

    let totalAmount = 0;
    selectedPayments.forEach(function (p) { totalAmount += Number(p.amount || 0); });

    if (totalAmountElement) totalAmountElement.textContent = formatAmount(totalAmount);

    const paidIds = {};
    selectedPayments.forEach(function (p) {
        const sid = String(p.studentId || "");
        if (sid) paidIds[sid] = true;
    });
    const paidCount = Object.keys(paidIds).length;

    if (paidStudentsElement)   paidStudentsElement.textContent   = String(paidCount);
    if (unpaidStudentsElement) unpaidStudentsElement.textContent =
        String(Math.max(0, selectedStudents.length - paidCount));

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

        let count = 0;
        let total = 0;
        const studentIds = {};

        selectedPayments.forEach(function (p) {
            if (String(p.month || "") !== month) return;
            count++;
            total += Number(p.amount || 0);
            const sid = String(p.studentId || "");
            if (sid) studentIds[sid] = true;
        });

        const row = document.createElement("tr");
        row.innerHTML =
            "<td>" + escapeHtml(t("months." + month)) + "</td>" +
            "<td>" + count + "</td>" +
            "<td>" + Object.keys(studentIds).length + "</td>" +
            "<td>" + escapeHtml(formatAmount(total)) + "</td>";

        fragment.appendChild(row);
    });

    paymentReportBody.innerHTML = "";
    paymentReportBody.appendChild(fragment);
}


// =====================================================
// Student report
// =====================================================

function renderStudentReport() {

    if (!studentReportBody) return;

    const selectedStudents = getSelectedStudents();
    const selectedPayments = getSelectedPayments();

    studentReportBody.innerHTML = "";

    if (selectedStudents.length === 0) {
        studentReportBody.innerHTML =
            '<tr><td colspan="6" class="empty-state">' +
            escapeHtml(t("noStudents")) +
            '</td></tr>';
        return;
    }

    const sortedStudents = selectedStudents.slice().sort(function (a, b) {
        return String(a.studentNumber || "").localeCompare(
            String(b.studentNumber || ""),
            undefined,
            { numeric: true }
        );
    });

    const fragment = document.createDocumentFragment();

    sortedStudents.forEach(function (student) {

        const studentId = String(student.studentId || student.id || "");

        let paidCount = 0;
        let totalPaid = 0;

        selectedPayments.forEach(function (p) {
            if (String(p.studentId || "") !== studentId) return;
            paidCount++;
            totalPaid += Number(p.amount || 0);
        });

        const row = document.createElement("tr");
        row.innerHTML =
            "<td>" + escapeHtml(student.studentNumber || "") + "</td>" +
            "<td>" + escapeHtml(student.name || "") + "</td>" +
            "<td>" + escapeHtml(formatStage(student.stage)) + "</td>" +
            "<td>" + escapeHtml(student.className || student.class || "") + "</td>" +
            "<td>" + paidCount + "</td>" +
            "<td>" + escapeHtml(formatAmount(totalPaid)) + "</td>";

        fragment.appendChild(row);
    });

    studentReportBody.appendChild(fragment);
}


// =====================================================
// Refresh all
// =====================================================

function refreshReports() {
    updateSummary();
    renderPaymentReport();
    renderStudentReport();
}


// =====================================================
// Update header
// =====================================================

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
}


// =====================================================
// Load — cache-first, non-blocking
// =====================================================

function loadReports() {

    // 1) Cache-first
    const cached = readCache(getCacheKey(), CACHE_TTL);

    if (cached.data) {
        students    = cached.data.students    || [];
        payments    = cached.data.payments    || [];
        institution = cached.data.institution || null;
        dataLoaded  = true;

        updateInstitutionInfo();
        loadAcademicYears();
        refreshReports();

        if (cached.fresh) {
            return;   // done, no network
        }
    }

    // 2) Fetch in background
    apiRequest("getReports", {})
        .then(function (result) {

            students    = Array.isArray(result.students) ? result.students : [];
            payments    = Array.isArray(result.payments) ? result.payments : [];
            institution = result.institution || null;
            dataLoaded  = true;

            writeCache(getCacheKey(), {
                students: students,
                payments: payments,
                institution: institution
            });

            updateInstitutionInfo();
            loadAcademicYears();
            refreshReports();
        })
        .catch(function (error) {
            console.error("Reports loading error:", error);

            if (!dataLoaded) {
                if (paymentReportBody) {
                    paymentReportBody.innerHTML =
                        '<tr><td colspan="4" class="empty-state">' +
                        escapeHtml(t("failedToLoad")) +
                        '</td></tr>';
                }
                if (studentReportBody) {
                    studentReportBody.innerHTML =
                        '<tr><td colspan="6" class="empty-state">' +
                        escapeHtml(t("failedToLoad")) +
                        '</td></tr>';
                }
            }
        });
}


// =====================================================
// Event listeners
// =====================================================

function setupEventListeners() {

    if (academicYearFilter) {
        academicYearFilter.addEventListener("change", function () {
            refreshReports();
        });
    }

    if (printButton) {
        printButton.addEventListener("click", function () {
            window.print();
        });
    }

    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "school.html?id=" + encodeURIComponent(institutionId);
        });
    }

    // Language switcher — buttons are wired with onclick in HTML,
    // but also bind here as a fallback
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

    updateInstitutionInfo();
    loadReports();
}


document.addEventListener("DOMContentLoaded", function () {
    currentLanguage = getSavedLanguage();
    applyLanguage();
    setupEventListeners();
    initializePage();
});
