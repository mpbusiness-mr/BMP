// =====================================================
// BMP · School Payments
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

let allPayments    = [];
let allStudents    = [];

let pageInitialized = false;
let paymentsLoaded  = false;

let currentLanguage = "ar";

let searchDebounceTimer = null;

const CACHE_KEY_PAYMENTS = () => "bmp_payments_" + institutionId;
const CACHE_KEY_STUDENTS = () => "bmp_students_" + institutionId;


// =====================================================
// Translations
// =====================================================

const TRANSLATIONS = {

    en: {
        pageTitle: "Payments",
        pageSubtitle: "View and manage student payments",
        back: "Back",
        recordPayment: "Record Payment",
        academicYear: "Academic Year",
        all: "All",
        month: "Month",
        stage: "Stage",
        search: "Search",
        searchStudent: "Student name or number",
        reset: "Reset",
        totalPayments: "Total Payments",
        totalAmount: "Total Amount",
        displayedPayments: "Displayed Payments",
        loadingPayments: "Loading payments...",
        loading: "Loading...",
        errorLoading: "An error occurred while loading payments.",
        retry: "Retry",
        noPayments: "No Payments",
        noPaymentsDescription: "No payments matching your search were found.",
        paymentDetails: "Payment Details",
        studentNumber: "Student Number",
        studentName: "Student Name",
        paymentDate: "Payment Date",
        receiptNumber: "Receipt Number",
        recordedBy: "Recorded By",
        amount: "Amount",
        notes: "Notes",
        class: "Class",
        printReceipt: "Print Receipt",
        primary: "Primary",
        preparatory: "Preparatory",
        secondary: "Secondary",
        close: "Close",
        unknown: "-",
        language: "Language",
        english: "English",
        arabic: "Arabic",
        french: "French",
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
        },
        errors: {
            institutionMissing: "Institution ID is missing.",
            userMissing: "Current user is missing.",
            connection: "Could not connect to the BMP server.",
            invalidResponse: "The server returned an invalid response.",
            authentication: "School authentication failed. Please log in again.",
            unknownRequest: "The request failed.",
            failedPayments: "Failed to load payments.",
            timeout: "The server took too long to respond."
        }
    },

    ar: {
        pageTitle: "المدفوعات",
        pageSubtitle: "عرض وإدارة مدفوعات الطلاب",
        back: "رجوع",
        recordPayment: "تسجيل دفعة",
        academicYear: "السنة الدراسية",
        all: "الكل",
        month: "الشهر",
        stage: "المرحلة",
        search: "بحث",
        searchStudent: "اسم الطالب أو رقمه",
        reset: "إعادة تعيين",
        totalPayments: "إجمالي المدفوعات",
        totalAmount: "إجمالي المبلغ",
        displayedPayments: "المدفوعات المعروضة",
        loadingPayments: "جارٍ تحميل المدفوعات...",
        loading: "جارٍ التحميل...",
        errorLoading: "حدث خطأ أثناء تحميل المدفوعات.",
        retry: "إعادة المحاولة",
        noPayments: "لا توجد مدفوعات",
        noPaymentsDescription: "لم يتم العثور على مدفوعات مطابقة لبحثك.",
        paymentDetails: "تفاصيل الدفعة",
        studentNumber: "رقم الطالب",
        studentName: "اسم الطالب",
        paymentDate: "تاريخ الدفع",
        receiptNumber: "رقم الإيصال",
        recordedBy: "سجلها المستخدم",
        amount: "المبلغ",
        notes: "ملاحظات",
        class: "القسم",
        printReceipt: "طباعة الإيصال",
        primary: "الابتدائية",
        preparatory: "الإعدادية",
        secondary: "الثانوية",
        close: "إغلاق",
        unknown: "-",
        language: "اللغة",
        english: "الإنجليزية",
        arabic: "العربية",
        french: "الفرنسية",
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
        },
        errors: {
            institutionMissing: "معرّف المؤسسة غير موجود.",
            userMissing: "المستخدم الحالي غير موجود.",
            connection: "تعذر الاتصال بخادم النظام.",
            invalidResponse: "أعاد الخادم استجابة غير صالحة.",
            authentication: "فشل تسجيل دخول المدرسة. يرجى تسجيل الدخول مرة أخرى.",
            unknownRequest: "فشل تنفيذ الطلب.",
            failedPayments: "فشل تحميل المدفوعات.",
            timeout: "استغرق الخادم وقتًا طويلاً للرد."
        }
    },

    fr: {
        pageTitle: "Paiements",
        pageSubtitle: "Consulter et gérer les paiements des élèves",
        back: "Retour",
        recordPayment: "Enregistrer un paiement",
        academicYear: "Année scolaire",
        all: "Tous",
        month: "Mois",
        stage: "Cycle",
        search: "Rechercher",
        searchStudent: "Nom ou numéro de l'élève",
        reset: "Réinitialiser",
        totalPayments: "Total des paiements",
        totalAmount: "Montant total",
        displayedPayments: "Paiements affichés",
        loadingPayments: "Chargement des paiements...",
        loading: "Chargement...",
        errorLoading: "Une erreur s'est produite lors du chargement des paiements.",
        retry: "Réessayer",
        noPayments: "Aucun paiement",
        noPaymentsDescription: "Aucun paiement correspondant à votre recherche n'a été trouvé.",
        paymentDetails: "Détails du paiement",
        studentNumber: "Numéro de l'élève",
        studentName: "Nom de l'élève",
        paymentDate: "Date du paiement",
        receiptNumber: "Numéro du reçu",
        recordedBy: "Enregistré par",
        amount: "Montant",
        notes: "Notes",
        class: "Classe",
        printReceipt: "Imprimer le reçu",
        primary: "Primaire",
        preparatory: "Collège",
        secondary: "Secondaire",
        close: "Fermer",
        unknown: "-",
        language: "Langue",
        english: "Anglais",
        arabic: "Arabe",
        french: "Français",
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
        },
        errors: {
            institutionMissing: "L'identifiant de l'établissement est manquant.",
            userMissing: "L'utilisateur actuel est introuvable.",
            connection: "Impossible de se connecter au serveur BMP.",
            invalidResponse: "Le serveur a renvoyé une réponse invalide.",
            authentication: "L'authentification de l'école a échoué. Veuillez vous reconnecter.",
            unknownRequest: "La requête a échoué.",
            failedPayments: "Échec du chargement des paiements.",
            timeout: "Le serveur a mis trop de temps à répondre."
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
// Loader helpers
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
// Apply language
// =====================================================

function applyLanguage() {

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir  = currentLanguage === "ar" ? "rtl" : "ltr";

    document.body.classList.remove("lang-ar", "lang-fr", "lang-en");
    document.body.classList.add("lang-" + currentLanguage);

    document.title = t("pageTitle") + " - BMP";

    const pageTitle = document.getElementById("pageTitle");
    const pageSubtitle = document.getElementById("pageSubtitle");
    const backButton = document.getElementById("backButton");
    const recordPaymentButton = document.getElementById("recordPaymentPageBtn");

    if (pageTitle) pageTitle.textContent = t("pageTitle");
    if (pageSubtitle) pageSubtitle.textContent = t("pageSubtitle");

    if (backButton) {
        const label = backButton.querySelector("span");
        if (label) label.textContent = t("back");
    }

    if (recordPaymentButton) {
        const label = recordPaymentButton.querySelector("span");
        if (label) label.textContent = t("recordPayment");
    }

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const key = el.getAttribute("data-i18n");
        if (TRANSLATIONS[currentLanguage][key]) {
            el.textContent = TRANSLATIONS[currentLanguage][key];
        }
    });

    const searchInput = document.getElementById("studentSearch");
    if (searchInput) searchInput.placeholder = t("searchStudent");

    const loadingMessage = document.getElementById("loadingMessage");
    if (loadingMessage) loadingMessage.textContent = t("loadingPayments");

    const retryButton = document.getElementById("retryBtn");
    if (retryButton) retryButton.textContent = t("retry");

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });

    updateFilterOptions();
    updateTableHeaders();

    if (paymentsLoaded) {
        renderPayments(getFilteredPayments());
    }
}


// =====================================================
// Filter option translations
// =====================================================

function updateFilterOptions() {

    const academicYear = document.getElementById("academicYear");
    if (academicYear) {
        const currentValue = academicYear.value;
        const firstOption = academicYear.querySelector('option[value=""]');
        if (firstOption) firstOption.textContent = t("all");
        if (currentValue) academicYear.value = currentValue;
    }

    const paymentMonth = document.getElementById("paymentMonth");
    if (paymentMonth) {
        const allOption = paymentMonth.querySelector('option[value=""]');
        if (allOption) allOption.textContent = t("all");

        paymentMonth.querySelectorAll("option").forEach(function (option) {
            if (option.value && TRANSLATIONS.en.months[option.value]) {
                option.textContent = t("months." + option.value);
            }
        });
    }

    const stageFilter = document.getElementById("stageFilter");
    if (stageFilter) {
        stageFilter.querySelectorAll("option").forEach(function (option) {
            if (!option.value) {
                option.textContent = t("all");
                return;
            }
            const stageKey = String(option.value).trim().toLowerCase();
            if (TRANSLATIONS.en[stageKey]) {
                option.textContent = t(stageKey);
            }
        });
    }
}


// =====================================================
// Table headers translation
// =====================================================

function updateTableHeaders() {
    // Handled by data-i18n on <th>
}


// =====================================================
// API request — with timeout + single retry
// =====================================================

async function apiRequest(action, data, attempt) {

    data = data || {};
    attempt = attempt || 1;

    if (!institutionId) {
        throw new Error(t("errors.institutionMissing"));
    }

    const username = getCurrentUsername();
    if (!username) {
        throw new Error(t("errors.userMissing"));
    }

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

        if (error.name === "AbortError") {
            throw new Error(t("errors.timeout"));
        }
        throw new Error(t("errors.connection"));
    }

    const responseText = await response.text();

    if (!response.ok) {
        if (attempt < 2 && response.status >= 500) {
            await new Promise(function (r) { setTimeout(r, 800); });
            return apiRequest(action, data, attempt + 1);
        }
        throw new Error("Server error: " + response.status);
    }

    let result;
    try {
        result = JSON.parse(responseText);
    } catch (error) {
        throw new Error(t("errors.invalidResponse"));
    }

    if (!result.success) {
        throw new Error(translateBackendError(result.message));
    }

    return result;
}


// =====================================================
// Backend error translation
// =====================================================

function translateBackendError(message) {

    if (!message) return t("errors.unknownRequest");

    const text = String(message);
    const lower = text.toLowerCase();

    const known = [
        { keys: ["institution id is missing", "institution is missing"], translation: "errors.institutionMissing" },
        { keys: ["current user is missing"], translation: "errors.userMissing" },
        { keys: ["authentication failed", "school authentication failed"], translation: "errors.authentication" }
    ];

    for (const item of known) {
        if (item.keys.some(k => lower.includes(k))) {
            return t(item.translation);
        }
    }

    return text;
}


// =====================================================
// Authentication — session-based, no URL detection
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
            "school-payments.html?id=" + encodeURIComponent(institutionId);
        return false;
    }

    return true;
}


// =====================================================
// Username
// =====================================================

function getCurrentUsername() {
    if (currentUser && currentUser.username) return String(currentUser.username).trim();
    if (currentUser && currentUser.userName) return String(currentUser.userName).trim();
    if (currentUser && currentUser.name) return String(currentUser.name).trim();
    return "";
}


// =====================================================
// Current academic year — YYYY-YY format
// =====================================================

function getCurrentAcademicYear() {
    const now = new Date();
    let startYear = now.getFullYear();

    if (now.getMonth() < 9) {
        startYear--;
    }

    return startYear + "-" + String(startYear + 1).slice(-2);
}


// =====================================================
// Students
// =====================================================

async function loadStudents() {
    try {
        const result = await apiRequest("getStudents");
        allStudents = Array.isArray(result.students) ? result.students : [];

        allStudents = allStudents.filter(function (student) {
            if (!student.institutionId) return true;
            return String(student.institutionId) === String(institutionId);
        });

        try {
            sessionStorage.setItem(CACHE_KEY_STUDENTS(), JSON.stringify(allStudents));
        } catch (e) {}

        return true;
    } catch (error) {
        console.error("Students could not be loaded:", error);
        allStudents = [];
        return false;
    }
}

function loadStudentsFromCache() {
    try {
        const cached = sessionStorage.getItem(CACHE_KEY_STUDENTS());
        if (!cached) return false;
        const parsed = JSON.parse(cached);
        if (!Array.isArray(parsed)) return false;
        allStudents = parsed;
        return true;
    } catch (e) {
        return false;
    }
}


// =====================================================
// Payment helpers
// =====================================================

function getPaymentStudentId(p) {
    return String(p.studentId || p.studentID || p.student_id || "").trim();
}
function getPaymentStudentNumber(p) {
    return String(p.studentNumber || p.student_number || "").trim();
}
function getPaymentStudentName(p) {
    return String(p.studentName || p.student_name || p.name || "").trim();
}
function getPaymentAcademicYear(p) {
    return String(p.academicYear || p.academic_year || p.schoolYear || "").trim();
}
function getPaymentMonth(p) {
    return String(p.month || p.paidMonth || "").trim();
}
function getPaymentAmount(p) {
    const value = Number(p.amount);
    return Number.isFinite(value) ? value : 0;
}
function getPaymentDate(p) {
    return String(p.paymentDate || p.payment_date || p.date || "").trim();
}
function getReceiptNumber(p) {
    return String(p.receiptNumber || p.receipt_number || "").trim();
}
function getRecordedBy(p) {
    return String(p.recordedBy || p.recorded_by || "").trim();
}
function getPaymentId(p) {
    return String(p.paymentId || p.paymentID || p.payment_id || "").trim();
}


// =====================================================
// Student lookup
// =====================================================

function findStudentForPayment(payment) {

    const studentId = getPaymentStudentId(payment);
    const studentNumber = getPaymentStudentNumber(payment);

    if (studentId) {
        const byId = allStudents.find(function (s) {
            return String(s.studentId || s.id || "").trim() === studentId;
        });
        if (byId) return byId;
    }

    if (studentNumber) {
        const byNumber = allStudents.find(function (s) {
            return String(s.studentNumber || "").trim().toLowerCase() === studentNumber.toLowerCase()
                && String(s.academicYear || "").trim() === getPaymentAcademicYear(payment);
        });
        if (byNumber) return byNumber;
    }

    return null;
}


// =====================================================
// Stage
// =====================================================

function normalizeStage(stage) {
    return String(stage || "").trim().toLowerCase();
}

function getStageForPayment(payment) {
    if (payment.stage) return normalizeStage(payment.stage);
    const student = findStudentForPayment(payment);
    if (!student) return "";
    return normalizeStage(student.stage);
}

function formatStage(stage) {
    const value = normalizeStage(stage);
    const stages = {
        primary: t("primary"),
        preparatory: t("preparatory"),
        secondary: t("secondary")
    };
    return stages[value] || stage || t("unknown");
}


// =====================================================
// Display month
// =====================================================

function formatMonth(month) {
    if (!month) return t("unknown");
    const key = String(month).trim();
    if (TRANSLATIONS.en.months[key]) {
        return t("months." + key);
    }
    return key;
}


// =====================================================
// Load payments
// =====================================================

async function loadPayments() {

    const result = await apiRequest("getPayments");

    if (Array.isArray(result.payments)) {
        allPayments = result.payments;
    } else if (Array.isArray(result.data)) {
        allPayments = result.data;
    } else {
        allPayments = [];
    }

    try {
        sessionStorage.setItem(CACHE_KEY_PAYMENTS(), JSON.stringify(allPayments));
    } catch (e) {}

    paymentsLoaded = true;
    return true;
}

function loadPaymentsFromCache() {
    try {
        const cached = sessionStorage.getItem(CACHE_KEY_PAYMENTS());
        if (!cached) return false;
        const parsed = JSON.parse(cached);
        if (!Array.isArray(parsed)) return false;
        allPayments = parsed;
        paymentsLoaded = true;
        return true;
    } catch (e) {
        return false;
    }
}


// =====================================================
// Academic years — default to current year
// =====================================================

function loadAcademicYears() {

    const select = document.getElementById("academicYear");
    if (!select) return;

    const years = new Set();

    allPayments.forEach(function (payment) {
        const year = getPaymentAcademicYear(payment);
        if (year) years.add(year);
    });

    allStudents.forEach(function (student) {
        if (student.academicYear) years.add(String(student.academicYear).trim());
    });

    const currentYear = getCurrentAcademicYear();
    years.add(currentYear);

    const currentValue = select.value;
    select.innerHTML = '<option value="">' + escapeHtml(t("all")) + '</option>';

    Array.from(years).filter(Boolean).sort().reverse().forEach(function (year) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        select.appendChild(option);
    });

    // Priority: previously-selected → current academic year → all
    if (currentValue && years.has(currentValue)) {
        select.value = currentValue;
    } else if (years.has(currentYear)) {
        select.value = currentYear;
    } else {
        select.value = "";
    }

    // Debug — remove once confirmed working
    console.log("[BMP Payments] Years in data:", Array.from(years).sort());
    console.log("[BMP Payments] Current year:", currentYear);
    console.log("[BMP Payments] Selected:", select.value);
}


// =====================================================
// Lock Stage filter to "All"
// =====================================================

function lockStageFilter() {

    const stageFilter = document.getElementById("stageFilter");
    if (!stageFilter) return;

    // Force value to All
    stageFilter.value = "";

    // Disable interaction
    stageFilter.disabled = true;

    // Grey it out
    stageFilter.style.opacity = "0.6";
    stageFilter.style.cursor = "not-allowed";

    // Also grey the label
    const label = document.querySelector('label[for="stageFilter"]');
    if (label) label.style.opacity = "0.6";
}


// =====================================================
// Filtering
// =====================================================

function getFilteredPayments() {

    const academicYear = String(document.getElementById("academicYear")?.value || "").trim();
    const month = String(document.getElementById("paymentMonth")?.value || "").trim().toLowerCase();
    const search = String(document.getElementById("studentSearch")?.value || "").trim().toLowerCase();

    // Stage is locked to All → ignore
    return allPayments.filter(function (payment) {

        const paymentYear = getPaymentAcademicYear(payment);
        const paymentMonth = getPaymentMonth(payment).toLowerCase();
        const paymentStudentNumber = getPaymentStudentNumber(payment).toLowerCase();
        const paymentStudentName = getPaymentStudentName(payment).toLowerCase();

        if (academicYear && paymentYear !== academicYear) return false;
        if (month && paymentMonth !== month) return false;

        if (search) {
            const matches =
                paymentStudentNumber.includes(search) ||
                paymentStudentName.includes(search);
            if (!matches) return false;
        }

        return true;
    });
}


// =====================================================
// Sorting
// =====================================================

function sortPayments(payments) {
    return [...payments].sort(function (a, b) {
        const dateA = new Date(getPaymentDate(a) || 0).getTime();
        const dateB = new Date(getPaymentDate(b) || 0).getTime();
        return dateB - dateA;
    });
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
// Render payments
// =====================================================

function renderPayments(payments) {

    payments = payments || getFilteredPayments();

    const tbody = document.getElementById("paymentsTableBody");
    const tableSection = document.getElementById("paymentsTableSection");
    const emptyState = document.getElementById("emptyState");

    if (!tbody) return;

    tbody.innerHTML = "";

    const sorted = sortPayments(payments);

    if (tableSection) tableSection.style.display = sorted.length ? "block" : "none";
    if (emptyState) emptyState.style.display = sorted.length ? "none" : "block";

    const fragment = document.createDocumentFragment();

    sorted.forEach(function (payment) {

        const row = document.createElement("tr");

        const studentNumber = getPaymentStudentNumber(payment);
        const student = findStudentForPayment(payment);
        const studentName =
            getPaymentStudentName(payment) ||
            (student && (student.name || student.studentName)) ||
            t("unknown");
        const academicYear = getPaymentAcademicYear(payment);
        const month = getPaymentMonth(payment);
        const amount = getPaymentAmount(payment);
        const paymentDate = getPaymentDate(payment);
        const receiptNumber = getReceiptNumber(payment);
        const recordedBy = getRecordedBy(payment);

        row.innerHTML =
            "<td>" + escapeHtml(studentNumber || t("unknown")) + "</td>" +
            "<td>" + escapeHtml(studentName) + "</td>" +
            "<td>" + escapeHtml(academicYear || t("unknown")) + "</td>" +
            "<td>" + escapeHtml(formatMonth(month)) + "</td>" +
            "<td>" + escapeHtml(amount.toFixed(2)) + "</td>" +
            "<td>" + escapeHtml(paymentDate || t("unknown")) + "</td>" +
            "<td>" + escapeHtml(receiptNumber || t("unknown")) + "</td>" +
            "<td>" + escapeHtml(recordedBy || t("unknown")) + "</td>";

        row.addEventListener("click", function () {
            showPaymentDetails(payment);
        });

        fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
    updateSummary(payments);
}


// =====================================================
// Summary
// =====================================================

function updateSummary(displayedPayments) {

    const totalPaymentsElement = document.getElementById("totalPayments");
    const totalAmountElement = document.getElementById("totalAmount");
    const displayedPaymentsElement = document.getElementById("displayedPayments");

    const totalAmount = allPayments.reduce(function (sum, payment) {
        return sum + getPaymentAmount(payment);
    }, 0);

    if (totalPaymentsElement) totalPaymentsElement.textContent = String(allPayments.length);
    if (totalAmountElement) totalAmountElement.textContent = totalAmount.toFixed(2);
    if (displayedPaymentsElement) displayedPaymentsElement.textContent = String(displayedPayments.length);
}


// =====================================================
// Apply filters
// =====================================================

function applyFilters() {
    if (!paymentsLoaded) return;
    renderPayments(getFilteredPayments());
}


// =====================================================
// Reset filters — keeps current academic year
// =====================================================

function resetFilters() {

    const currentYear = getCurrentAcademicYear();

    document.getElementById("paymentMonth").value = "";
    document.getElementById("studentSearch").value = "";

    // Stage stays locked to All
    const stageFilter = document.getElementById("stageFilter");
    if (stageFilter) stageFilter.value = "";

    // Reset academic year to current year (if present in options)
    const academicYearSelect = document.getElementById("academicYear");
    if (academicYearSelect) {
        const option = academicYearSelect.querySelector('option[value="' + currentYear + '"]');
        if (option) {
            academicYearSelect.value = currentYear;
        } else {
            academicYearSelect.value = "";
        }
    }

    applyFilters();
}


// =====================================================
// Loading / error states
// =====================================================

function showLoading(message) {
    const loading = document.getElementById("loadingState");
    const messageEl = document.getElementById("loadingMessage");
    if (messageEl) messageEl.textContent = message || t("loading");
    if (loading) loading.style.display = "block";
}

function hideLoading() {
    const loading = document.getElementById("loadingState");
    if (loading) loading.style.display = "none";
}

function showError(message) {
    const errorState = document.getElementById("errorState");
    const errorMessage = document.getElementById("errorMessage");
    if (errorMessage) errorMessage.textContent = message || t("errorLoading");
    if (errorState) errorState.style.display = "block";
    console.error("BMP Payments Error:", message);
}

function hideError() {
    const errorState = document.getElementById("errorState");
    if (errorState) errorState.style.display = "none";
}


// =====================================================
// Payment details modal
// =====================================================

function showPaymentDetails(payment) {

    const modal = document.getElementById("paymentDetailsModal");
    const content = document.getElementById("paymentDetailsContent");
    if (!modal || !content) return;

    const student = findStudentForPayment(payment);
    const studentName =
        getPaymentStudentName(payment) ||
        (student && (student.name || student.studentName)) ||
        t("unknown");
    const stage = getStageForPayment(payment);
    const className =
        (student && (student.className || student.class || student.classNumber || student.class_name)) ||
        payment.className ||
        payment.class ||
        t("unknown");
    const studentNumber =
        getPaymentStudentNumber(payment) ||
        (student && student.studentNumber) ||
        t("unknown");
    const academicYear = getPaymentAcademicYear(payment) || t("unknown");
    const month = getPaymentMonth(payment);
    const amount = getPaymentAmount(payment);
    const paymentDate = getPaymentDate(payment) || t("unknown");
    const receiptNumber = getReceiptNumber(payment) || t("unknown");
    const recordedBy = getRecordedBy(payment) || t("unknown");
    const notes = String(payment.notes || "").trim();

    content.innerHTML =
        '<div class="info-grid">' +
            '<div class="info-item"><span>' + escapeHtml(t("studentName")) + '</span><strong>' + escapeHtml(studentName) + '</strong></div>' +
            '<div class="info-item"><span>' + escapeHtml(t("studentNumber")) + '</span><strong>' + escapeHtml(studentNumber) + '</strong></div>' +
            '<div class="info-item"><span>' + escapeHtml(t("academicYear")) + '</span><strong>' + escapeHtml(academicYear) + '</strong></div>' +
            '<div class="info-item"><span>' + escapeHtml(t("stage")) + '</span><strong>' + escapeHtml(formatStage(stage)) + '</strong></div>' +
            '<div class="info-item"><span>' + escapeHtml(t("class")) + '</span><strong>' + escapeHtml(className) + '</strong></div>' +
            '<div class="info-item"><span>' + escapeHtml(t("month")) + '</span><strong>' + escapeHtml(formatMonth(month)) + '</strong></div>' +
            '<div class="info-item"><span>' + escapeHtml(t("amount")) + '</span><strong>' + escapeHtml(amount.toFixed(2)) + '</strong></div>' +
            '<div class="info-item"><span>' + escapeHtml(t("paymentDate")) + '</span><strong>' + escapeHtml(paymentDate) + '</strong></div>' +
            '<div class="info-item"><span>' + escapeHtml(t("receiptNumber")) + '</span><strong>' + escapeHtml(receiptNumber) + '</strong></div>' +
            '<div class="info-item"><span>' + escapeHtml(t("recordedBy")) + '</span><strong>' + escapeHtml(recordedBy) + '</strong></div>' +
            (notes
                ? '<div class="info-item" style="grid-column: 1 / -1;"><span>' + escapeHtml(t("notes")) + '</span><strong>' + escapeHtml(notes) + '</strong></div>'
                : "") +
        '</div>' +
        '<div class="payment-detail-actions">' +
            '<button type="button" id="printPaymentReceiptBtn" class="btn btn-primary">' +
                '<i class="fas fa-print"></i> ' +
                escapeHtml(t("printReceipt")) +
            '</button>' +
        '</div>';

    modal.style.display = "flex";

    const printBtn = document.getElementById("printPaymentReceiptBtn");
    if (printBtn) {
        printBtn.addEventListener("click", function () {
            printPaymentReceipt(payment);
        });
    }
}


function closePaymentDetails() {
    const modal = document.getElementById("paymentDetailsModal");
    if (modal) modal.style.display = "none";
}


// =====================================================
// Receipt date
// =====================================================

function formatReceiptDate(value) {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    const locale = currentLanguage === "ar" ? "ar" : currentLanguage === "fr" ? "fr-FR" : "en-GB";
    return parsed.toLocaleDateString(locale);
}


// =====================================================
// Print payment receipt — title = school name
// =====================================================

async function printPaymentReceipt(selectedPayment) {

    try {

        if (!selectedPayment) throw new Error("Payment not found.");

        let payment = Object.assign({}, selectedPayment);
        let student = findStudentForPayment(selectedPayment);
        let institution = {};

        const selectedPaymentId = getPaymentId(selectedPayment);

        if (selectedPaymentId) {
            try {
                const receiptResult = await apiRequest("getReceipt", { paymentId: selectedPaymentId });

                if (receiptResult.payment) {
                    payment = Object.assign({}, selectedPayment, receiptResult.payment);
                }
                if (receiptResult.student) {
                    student = Object.assign({}, student || {}, receiptResult.student);
                }
                if (receiptResult.institution) {
                    institution = receiptResult.institution;
                }
            } catch (error) {
                console.warn("getReceipt failed. Using selected payment data:", error);
            }
        }

        const schoolName =
            (institution && institution.name) ||
            (currentUser && currentUser.institutionName) ||
            "BMP";

        const currency = institution.currency || payment.currency || "MRU";

        const studentName =
            getPaymentStudentName(payment) ||
            (student && (student.name || student.studentName)) ||
            "-";
        const studentNumber =
            getPaymentStudentNumber(payment) ||
            (student && student.studentNumber) ||
            "-";
        const academicYear = getPaymentAcademicYear(payment) || "-";
        const stageName = formatStage(getStageForPayment(payment));
        const className =
            (student && (student.className || student.class || student.classNumber || student.class_name)) ||
            payment.className ||
            payment.class ||
            "-";
        const paidMonth = formatMonth(getPaymentMonth(payment));
        const paymentAmount = getPaymentAmount(payment);
        const paidDate = getPaymentDate(payment) || "-";
        const receiptNumber = getReceiptNumber(payment) || "-";
        const recordedBy = getRecordedBy(payment) || "-";
        const notes = String(payment.notes || "").trim();

        const oldPrintReceipt = document.getElementById("bmpPrintReceipt");
        if (oldPrintReceipt) oldPrintReceipt.remove();

        const printArea = document.createElement("div");
        printArea.id = "bmpPrintReceipt";
        printArea.dir = currentLanguage === "ar" ? "rtl" : "ltr";

        printArea.innerHTML =
            '<div class="bmp-receipt-header">' +
                '<div class="bmp-receipt-title">' + escapeHtml(schoolName) + '</div>' +
            '</div>' +
            '<div class="bmp-receipt-divider"></div>' +
            '<div class="bmp-receipt-number">' +
                '<span>' + escapeHtml(t("receiptNumber")) + '</span>' +
                '<strong>' + escapeHtml(receiptNumber) + '</strong>' +
            '</div>' +
            '<div class="bmp-receipt-divider"></div>' +
            '<div class="bmp-receipt-section-title">' + escapeHtml(t("studentName")) + '</div>' +
            '<div class="bmp-receipt-main-name">' + escapeHtml(studentName) + '</div>' +
            '<div class="bmp-receipt-row"><span>' + escapeHtml(t("studentNumber")) + '</span><strong>' + escapeHtml(studentNumber) + '</strong></div>' +
            '<div class="bmp-receipt-row"><span>' + escapeHtml(t("academicYear")) + '</span><strong>' + escapeHtml(academicYear) + '</strong></div>' +
            '<div class="bmp-receipt-row"><span>' + escapeHtml(t("stage")) + '</span><strong>' + escapeHtml(stageName) + '</strong></div>' +
            '<div class="bmp-receipt-row"><span>' + escapeHtml(t("class")) + '</span><strong>' + escapeHtml(className) + '</strong></div>' +
            '<div class="bmp-receipt-divider"></div>' +
            '<div class="bmp-receipt-row"><span>' + escapeHtml(t("month")) + '</span><strong>' + escapeHtml(paidMonth) + '</strong></div>' +
            '<div class="bmp-receipt-amount">' +
                '<span>' + escapeHtml(t("amount")) + '</span>' +
                '<strong>' + escapeHtml(paymentAmount.toLocaleString(currentLanguage === "ar" ? "ar" : currentLanguage === "fr" ? "fr-FR" : "en-US")) + ' ' + escapeHtml(currency) + '</strong>' +
            '</div>' +
            '<div class="bmp-receipt-row"><span>' + escapeHtml(t("paymentDate")) + '</span><strong>' + escapeHtml(formatReceiptDate(paidDate)) + '</strong></div>' +
            '<div class="bmp-receipt-row"><span>' + escapeHtml(t("recordedBy")) + '</span><strong>' + escapeHtml(recordedBy) + '</strong></div>' +
            (notes
                ? '<div class="bmp-receipt-notes"><strong>' + escapeHtml(t("notes")) + '</strong><div>' + escapeHtml(notes) + '</div></div>'
                : "");

        document.body.appendChild(printArea);
        closePaymentDetails();

        window.addEventListener("afterprint", function cleanup() {
            const r = document.getElementById("bmpPrintReceipt");
            if (r) r.remove();
        }, { once: true });

        await new Promise(function (resolve) { setTimeout(resolve, 150); });

        window.print();

    } catch (error) {
        console.error("Receipt printing error:", error);
        alert(error.message || "Failed to prepare receipt.");
    }
}


// =====================================================
// Navigation
// =====================================================

function goBack() {
    if (institutionId) {
        window.location.href = "school.html?id=" + encodeURIComponent(institutionId);
    } else {
        window.location.href = "school.html";
    }
}

function goToRecordPayment() {
    if (institutionId) {
        window.location.href = "school-record-payment.html?id=" + encodeURIComponent(institutionId);
    } else {
        window.location.href = "school-record-payment.html";
    }
}


// =====================================================
// Debounced live search
// =====================================================

function onSearchInput() {

    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(function () {
        applyFilters();
    }, 150);
}


// =====================================================
// Event listeners
// =====================================================

function setupEventListeners() {

    document.getElementById("backButton")?.addEventListener("click", goBack);
    document.getElementById("recordPaymentPageBtn")?.addEventListener("click", goToRecordPayment);
    document.getElementById("applyFiltersBtn")?.addEventListener("click", applyFilters);
    document.getElementById("resetFiltersBtn")?.addEventListener("click", resetFilters);
    document.getElementById("retryBtn")?.addEventListener("click", initializePage);

    // Live search — filter as user types (debounced 150ms)
    const searchInput = document.getElementById("studentSearch");
    if (searchInput) {
        searchInput.addEventListener("input", onSearchInput);
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
                applyFilters();
            }
        });
    }

    document.getElementById("academicYear")?.addEventListener("change", applyFilters);
    document.getElementById("paymentMonth")?.addEventListener("change", applyFilters);

    // Stage is locked — no listener needed, but keep it harmless
    document.getElementById("stageFilter")?.addEventListener("change", applyFilters);

    document.getElementById("paymentDetailsCloseBtn")?.addEventListener("click", closePaymentDetails);
    document.getElementById("paymentDetailsOverlay")?.addEventListener("click", closePaymentDetails);

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closePaymentDetails();
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            currentLanguage = btn.dataset.lang || "ar";
            localStorage.setItem("bmpLanguage", currentLanguage);
            applyLanguage();
        });
    });
}


// =====================================================
// Language initialization
// =====================================================

function initializeLanguage() {
    const saved = localStorage.getItem("bmpLanguage");
    currentLanguage = (saved && TRANSLATIONS[saved]) ? saved : "ar";
    applyLanguage();
}


// =====================================================
// Initialize
// =====================================================

async function initializePage() {

    hideError();
    showLoader();

    const authenticated = initializeAuthentication();
    if (!authenticated) {
        hideLoaderAfterPaint();
        showError(t("errors.authentication"));
        return;
    }

    // Lock stage filter to All — always
    lockStageFilter();

    // 1) Instant paint from cache
    const hadPaymentsCache = loadPaymentsFromCache();
    loadStudentsFromCache();

    if (hadPaymentsCache) {
        loadAcademicYears();
        applyLanguage();
        applyFilters();
        hideLoaderAfterPaint();
    }

    // 2) Parallel network refresh
    try {
        await Promise.all([
            loadPayments(),
            loadStudents()
        ]);

        loadAcademicYears();
        applyLanguage();
        applyFilters();
        hideLoading();

        if (!hadPaymentsCache) {
            hideLoaderAfterPaint();
        }

    } catch (error) {
        console.error("Failed to load:", error);
        hideLoading();

        if (!hadPaymentsCache) {
            allPayments = [];
            renderPayments([]);
            updateSummary([]);
            showError(error.message || t("errors.failedPayments"));
            hideLoaderAfterPaint();
        }
    }

    pageInitialized = true;
}


// =====================================================
// Start
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    initializeLanguage();
    setupEventListeners();
    initializePage();
});
