// =====================================================
// BMP · Student Profile
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

let studentId      = null;

let currentLanguage = "ar";

let student  = null;
let payments = [];

let dataLoaded = false;


// =====================================================
// Translations
// =====================================================

const TRANSLATIONS = {

    en: {
        pageTitle: "Student Profile",
        pageSubtitle: "View student information and payment history",
        back: "Back",
        editStudent: "Edit Student",

        schoolInformation: "School Information",
        institutionId: "Institution ID",
        schoolName: "School Name",

        studentInformation: "Student Information",
        academicYear: "Academic Year",
        studentNumber: "Student Number",
        studentName: "Student Name",
        stage: "Stage",
        class: "Class",
        registrationDate: "Registration Date",
        guardianName: "Guardian Name",
        guardianPhone: "Guardian Phone",

        paymentSummary: "Payment Summary",
        paidMonths: "Paid Months",
        unpaidMonths: "Unpaid Months",
        totalPaid: "Total Paid",

        paymentHistory: "Payment History",
        month: "Month",
        amount: "Amount",
        paymentDate: "Payment Date",
        receiptNumber: "Receipt Number",
        recordedBy: "Recorded By",

        loadingPayments: "Loading payments...",
        noPayments: "No payment records found.",
        studentNotFound: "Student not found.",

        primary: "Primary",
        preparatory: "Preparatory",
        secondary: "Secondary",

        unknown: "-",

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
        pageTitle: "ملف الطالب",
        pageSubtitle: "عرض معلومات الطالب وسجل المدفوعات",
        back: "رجوع",
        editStudent: "تعديل الطالب",

        schoolInformation: "معلومات المدرسة",
        institutionId: "معرّف المؤسسة",
        schoolName: "اسم المدرسة",

        studentInformation: "معلومات الطالب",
        academicYear: "السنة الدراسية",
        studentNumber: "رقم الطالب",
        studentName: "اسم الطالب",
        stage: "المرحلة",
        class: "القسم",
        registrationDate: "تاريخ التسجيل",
        guardianName: "اسم ولي الأمر",
        guardianPhone: "رقم ولي الأمر",

        paymentSummary: "ملخص المدفوعات",
        paidMonths: "الأشهر المدفوعة",
        unpaidMonths: "الأشهر غير المدفوعة",
        totalPaid: "إجمالي المدفوع",

        paymentHistory: "سجل المدفوعات",
        month: "الشهر",
        amount: "المبلغ",
        paymentDate: "تاريخ الدفع",
        receiptNumber: "رقم الإيصال",
        recordedBy: "سجلها المستخدم",

        loadingPayments: "جارٍ تحميل المدفوعات...",
        noPayments: "لا توجد سجلات مدفوعات.",
        studentNotFound: "لم يتم العثور على الطالب.",

        primary: "الابتدائية",
        preparatory: "الإعدادية",
        secondary: "الثانوية",

        unknown: "-",

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
        pageTitle: "Profil de l'élève",
        pageSubtitle: "Consulter les informations et l'historique des paiements",
        back: "Retour",
        editStudent: "Modifier l'élève",

        schoolInformation: "Informations de l'école",
        institutionId: "ID de l'établissement",
        schoolName: "Nom de l'école",

        studentInformation: "Informations de l'élève",
        academicYear: "Année scolaire",
        studentNumber: "Numéro de l'élève",
        studentName: "Nom de l'élève",
        stage: "Cycle",
        class: "Classe",
        registrationDate: "Date d'inscription",
        guardianName: "Nom du tuteur",
        guardianPhone: "Téléphone du tuteur",

        paymentSummary: "Résumé des paiements",
        paidMonths: "Mois payés",
        unpaidMonths: "Mois impayés",
        totalPaid: "Total payé",

        paymentHistory: "Historique des paiements",
        month: "Mois",
        amount: "Montant",
        paymentDate: "Date du paiement",
        receiptNumber: "Numéro du reçu",
        recordedBy: "Enregistré par",

        loadingPayments: "Chargement des paiements...",
        noPayments: "Aucun paiement trouvé.",
        studentNotFound: "Élève introuvable.",

        primary: "Primaire",
        preparatory: "Collège",
        secondary: "Secondaire",

        unknown: "-",

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

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const key = el.getAttribute("data-i18n");
        const value = TRANSLATIONS[currentLanguage][key];
        if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });

    if (dataLoaded) {
        renderStudent();
        renderPaymentHistory();
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

function isDirector() {
    return String(currentUser && currentUser.role || "")
        .trim()
        .toLowerCase() === "director";
}


// =====================================================
// API request — clean, no abort controller
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

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        })
        .then(function (response) {
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
            reject(error);
        });
    });
}


// =====================================================
// Helpers
// =====================================================

function escapeHtml(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

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

function formatStage(stage) {
    const key = String(stage || "").trim().toLowerCase();
    if (key === "primary")     return t("primary");
    if (key === "preparatory") return t("preparatory");
    if (key === "secondary")   return t("secondary");
    return stage || t("unknown");
}

function formatMonth(month) {
    if (!month) return t("unknown");
    const key = String(month).trim();
    if (TRANSLATIONS.en.months[key]) {
        return t("months." + key);
    }
    return key;
}

function formatPaymentDate(value) {

    if (!value) return "-";

    const str = String(value).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

    const isoMatch = str.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) return isoMatch[1];

    const date = new Date(str);
    if (Number.isNaN(date.getTime())) return str;

    const y  = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, "0");
    const d  = String(date.getDate()).padStart(2, "0");

    return y + "-" + mo + "-" + d;
}


// =====================================================
// Element refs
// =====================================================

const institutionIdElement   = document.getElementById("institutionId");
const institutionNameElement = document.getElementById("institutionName");

const academicYearElement    = document.getElementById("academicYear");
const studentNumberElement   = document.getElementById("studentNumber");
const studentNameElement     = document.getElementById("studentName");
const stageElement           = document.getElementById("stage");
const classNameElement       = document.getElementById("className");
const registrationDateElement= document.getElementById("registrationDate");
const guardianNameElement    = document.getElementById("guardianName");
const guardianPhoneElement   = document.getElementById("guardianPhone");

const paidMonthsElement      = document.getElementById("paidMonths");
const unpaidMonthsElement    = document.getElementById("unpaidMonths");
const totalPaidElement       = document.getElementById("totalPaid");

const paymentHistoryBody     = document.getElementById("paymentHistoryBody");
const emptyPayments          = document.getElementById("emptyPayments");

const backButton             = document.getElementById("backButton");
const editButton             = document.getElementById("editButton");


// =====================================================
// Update header display
// =====================================================

function updateHeader() {
    if (institutionIdElement) {
        institutionIdElement.textContent = institutionId || "-";
    }
    if (institutionNameElement) {
        institutionNameElement.textContent =
            (currentUser && currentUser.institutionName) || "-";
    }
}


// =====================================================
// Render student info
// =====================================================

function renderStudent() {

    if (!student) return;

    if (academicYearElement)     academicYearElement.textContent     = student.academicYear || t("unknown");
    if (studentNumberElement)    studentNumberElement.textContent    = student.studentNumber || t("unknown");
    if (studentNameElement)      studentNameElement.textContent      = student.name || t("unknown");
    if (stageElement)            stageElement.textContent            = formatStage(student.stage);
    if (classNameElement)        classNameElement.textContent        =
        student.class ? (t("class") + " " + student.class) : t("unknown");
    if (registrationDateElement) registrationDateElement.textContent =
        formatPaymentDate(student.registrationDate) || t("unknown");

    if (guardianNameElement) {
        guardianNameElement.textContent = student.guardianName || t("unknown");
    }
    if (guardianPhoneElement) {
        guardianPhoneElement.textContent = student.guardianPhone || t("unknown");
    }

    // Document title
    if (student.name) {
        document.title = student.name + " · " + t("pageTitle") + " - BMP";
    }
}


// =====================================================
// Filter payments for this student
// =====================================================

function getStudentPayments() {
    if (!student) return [];

    const sid = String(student.studentId || student.id || "");
    const year = String(student.academicYear || "");

    return payments.filter(function (p) {
        const pSid  = String(p.studentId || "");
        const pYear = String(p.academicYear || "");
        return pSid === sid && (!year || pYear === year);
    });
}


// =====================================================
// Payment summary
// =====================================================

function renderPaymentSummary() {

    const studentPayments = getStudentPayments();

    const paidCount = studentPayments.length;
    const totalPaid = studentPayments.reduce(function (sum, p) {
        return sum + Number(p.amount || 0);
    }, 0);

    const totalMonths = MONTHS.length;   // 9
    const unpaidCount = Math.max(0, totalMonths - paidCount);

    if (paidMonthsElement)   paidMonthsElement.textContent   = String(paidCount);
    if (unpaidMonthsElement) unpaidMonthsElement.textContent = String(unpaidCount);
    if (totalPaidElement)    totalPaidElement.textContent    = formatAmount(totalPaid) + " MRU";
}


// =====================================================
// Payment history table
// =====================================================

function renderPaymentHistory() {

    if (!paymentHistoryBody) return;

    const studentPayments = getStudentPayments();

    paymentHistoryBody.innerHTML = "";

    if (studentPayments.length === 0) {
        if (emptyPayments) emptyPayments.style.display = "block";
        return;
    }

    if (emptyPayments) emptyPayments.style.display = "none";

    // Sort: by month order (Oct → Jun), then by date
    studentPayments.sort(function (a, b) {
        const ai = MONTHS.indexOf(String(a.month || ""));
        const bi = MONTHS.indexOf(String(b.month || ""));
        if (ai !== bi) return ai - bi;
        return String(a.paymentDate || "").localeCompare(String(b.paymentDate || ""));
    });

    const fragment = document.createDocumentFragment();

    studentPayments.forEach(function (p) {

        const row = document.createElement("tr");

        const month         = formatMonth(p.month);
        const amount        = formatAmount(p.amount) + " MRU";
        const paymentDate   = formatPaymentDate(p.paymentDate || p.date);
        const receiptNumber = p.receiptNumber || t("unknown");
        const recordedBy    = p.recordedBy || t("unknown");

        row.innerHTML =
            "<td>" + escapeHtml(month) + "</td>" +
            "<td>" + escapeHtml(amount) + "</td>" +
            "<td>" + escapeHtml(paymentDate) + "</td>" +
            "<td>" + escapeHtml(receiptNumber) + "</td>" +
            "<td>" + escapeHtml(recordedBy) + "</td>";

        fragment.appendChild(row);
    });

    paymentHistoryBody.appendChild(fragment);
}


// =====================================================
// Load data — parallel, cache-first
// =====================================================

function loadData() {

    // 1) Cache-first (students + payments)
    const studentsCache = readCache("bmp_students_" + institutionId, CACHE_TTL);
    const paymentsCache = readCache("bmp_payments_" + institutionId, CACHE_TTL);

    let students = [];

    if (studentsCache.data) {
        students = studentsCache.data;
    }

    if (paymentsCache.data) {
        payments = paymentsCache.data;
    }

    // Find student in cache
    if (students.length > 0) {
        const found = students.find(function (s) {
            return String(s.studentId || s.id || "") === String(studentId);
        });

        if (found) {
            student = normalizeStudent(found);
            dataLoaded = true;

            updateHeader();
            renderStudent();
            renderPaymentSummary();
            renderPaymentHistory();
        }
    }

    // 2) Network refresh — both calls in parallel
    const studentsPromise = studentsCache.fresh
        ? Promise.resolve()
        : apiRequest("getStudents").then(function (result) {
            const list = Array.isArray(result.students) ? result.students : [];
            writeCache("bmp_students_" + institutionId, list);
            return list;
        });

    const paymentsPromise = paymentsCache.fresh
        ? Promise.resolve()
        : apiRequest("getPayments").then(function (result) {
            const list = Array.isArray(result.payments) ? result.payments : [];
            writeCache("bmp_payments_" + institutionId, list);
            return list;
        });

    Promise.all([studentsPromise, paymentsPromise])
        .then(function (results) {

            const freshStudents = results[0];
            const freshPayments = results[1];

            if (Array.isArray(freshStudents) && freshStudents.length > 0) {
                students = freshStudents;
            }
            if (Array.isArray(freshPayments)) {
                payments = freshPayments;
            }

            const found = students.find(function (s) {
                return String(s.studentId || s.id || "") === String(studentId);
            });

            if (!found) {
                if (!student) {
                    alert(t("studentNotFound"));
                    window.location.href =
                        "students.html?id=" + encodeURIComponent(institutionId);
                }
                return;
            }

            student = normalizeStudent(found);
            dataLoaded = true;

            updateHeader();
            renderStudent();
            renderPaymentSummary();
            renderPaymentHistory();
        })
        .catch(function (error) {
            console.error("Student profile loading error:", error);

            if (!student) {
                alert(t("studentNotFound"));
                window.location.href =
                    "students.html?id=" + encodeURIComponent(institutionId);
            }
        });
}


// =====================================================
// Normalize student shape
// =====================================================

function normalizeStudent(s) {
    return {
        id:               s.studentId || s.id || "",
        studentId:        s.studentId || s.id || "",
        studentNumber:    s.studentNumber || "",
        academicYear:     s.academicYear || "",
        name:             s.name || "",
        stage:            s.stage || "",
        class:            s.class || s.classNumber || "",
        registrationDate: s.registrationDate || s.createdAt || "",
        guardianName:     s.guardianName || "",
        guardianPhone:    s.guardianPhone || ""
    };
}


// =====================================================
// Events
// =====================================================

function goBack() {
    window.location.href =
        "students.html?id=" + encodeURIComponent(institutionId);
}

function goEdit() {
    window.location.href =
        "edit-student.html?id=" + encodeURIComponent(studentId) +
        "&institutionId=" + encodeURIComponent(institutionId);
}


// =====================================================
// Initialize
// =====================================================

function initializePage() {

    // 1) URL params
    const params = new URLSearchParams(window.location.search);
    studentId = String(params.get("id") || "").trim();

    if (!studentId) {
        window.location.href = "students.html";
        return;
    }

    // 2) Auth
    const authenticated = initializeAuthentication();
    if (!authenticated) return;

    // 3) Language
    currentLanguage = getSavedLanguage();
    applyLanguage();

    // 4) Header/back/edit
    updateHeader();

    if (backButton) backButton.addEventListener("click", goBack);

    if (editButton) {
        if (isDirector()) {
            editButton.addEventListener("click", goEdit);
        } else {
            editButton.style.display = "none";
        }
    }

    // 5) Load data
    loadData();
}


document.addEventListener("DOMContentLoaded", initializePage);
