// =====================================================
// BMP · Record School Payment
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
let institution    = null;

let students        = [];
let selectedStudent = null;

let pageInitialized = false;

let currentLanguage = "ar";

let searchDebounceTimer = null;

const CACHE_KEY_STUDENTS = () => "bmp_students_" + institutionId;


// =====================================================
// Translations
// =====================================================

const TRANSLATIONS = {

    en: {
        pageTitle: "Record School Payment",
        pageSubtitle: "Register a monthly student payment",
        back: "Back",
        loading: "Loading...",

        schoolInformation: "School Information",
        institutionId: "Institution ID",
        schoolName: "School Name",

        paymentInformation: "Payment Information",
        academicYear: "Academic Year",
        selectAcademicYear: "Select Academic Year",

        searchByStudentNumber: "Search by Student Number",
        studentNumber: "Student Number",
        studentNumberDisplay: "Student Number",
        enterStudentNumber: "Enter student number",
        search: "Search",

        studentName: "Student Name",
        searchForStudent: "Search for a student",

        stage: "Stage",
        class: "Class",

        month: "Month",
        selectMonth: "Select Month",

        amount: "Amount",
        enterAmount: "Enter amount",

        paymentDate: "Payment Date",
        receiptNumber: "Receipt Number",
        generatedAfterSaving: "Generated after saving",

        recordedBy: "Recorded By",
        currentUser: "Current user",

        notes: "Notes",
        optionalNotes: "Optional notes",

        cancel: "Cancel",
        recordPayment: "Record Payment",
        recording: "Recording...",

        loadingStudents: "Loading students...",
        paymentRecorded: "Payment recorded successfully.",
        receipt: "Receipt",

        studentFound: "Student found",
        studentNotFound: "Student not found for this academic year.",
        duplicateStudentNumber: "More than one student has this student number. Please contact the administrator.",
        selectAcademicYearFirst: "Please select an academic year first.",
        enterStudentNumberFirst: "Please enter the student number.",
        validStudent: "Please search and select a valid student first.",
        selectMonthError: "Please select a month.",
        validAmount: "Please enter a valid payment amount.",
        selectPaymentDate: "Please select the payment date.",
        studentNotFoundSelectedYear: "Student not found for the selected academic year.",
        authenticationFailed: "School authentication failed. Please log in again.",
        noStudents: "No students were found for this school.",
        institutionMissing: "Institution ID is missing.",
        userMissing: "Current user is missing.",
        connectionError: "Could not connect to the BMP server.",
        invalidResponse: "The server returned an invalid response.",
        requestFailed: "The request failed.",
        paymentFailed: "Failed to record payment.",

        language: "Language",
        unknown: "-",
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
        pageTitle: "تسجيل دفعة مدرسية",
        pageSubtitle: "تسجيل دفعة شهرية للطالب",
        back: "رجوع",
        loading: "جارٍ التحميل...",

        schoolInformation: "معلومات المدرسة",
        institutionId: "معرّف المؤسسة",
        schoolName: "اسم المدرسة",

        paymentInformation: "معلومات الدفع",
        academicYear: "السنة الدراسية",
        selectAcademicYear: "اختر السنة الدراسية",

        searchByStudentNumber: "البحث برقم الطالب",
        studentNumber: "رقم الطالب",
        studentNumberDisplay: "رقم الطالب",
        enterStudentNumber: "أدخل رقم الطالب",
        search: "بحث",

        studentName: "اسم الطالب",
        searchForStudent: "ابحث عن طالب",

        stage: "المرحلة",
        class: "القسم",

        month: "الشهر",
        selectMonth: "اختر الشهر",

        amount: "المبلغ",
        enterAmount: "أدخل المبلغ",

        paymentDate: "تاريخ الدفع",
        receiptNumber: "رقم الإيصال",
        generatedAfterSaving: "يتم إنشاؤه بعد الحفظ",

        recordedBy: "سجلها المستخدم",
        currentUser: "المستخدم الحالي",

        notes: "ملاحظات",
        optionalNotes: "ملاحظات اختيارية",

        cancel: "إلغاء",
        recordPayment: "تسجيل الدفعة",
        recording: "جارٍ التسجيل...",

        loadingStudents: "جارٍ تحميل الطلاب...",
        paymentRecorded: "تم تسجيل الدفعة بنجاح.",
        receipt: "الإيصال",

        studentFound: "تم العثور على الطالب",
        studentNotFound: "لم يتم العثور على الطالب في هذه السنة الدراسية.",
        duplicateStudentNumber: "يوجد أكثر من طالب بهذا الرقم. يرجى الاتصال بالمسؤول.",
        selectAcademicYearFirst: "يرجى اختيار السنة الدراسية أولاً.",
        enterStudentNumberFirst: "يرجى إدخال رقم الطالب.",
        validStudent: "يرجى البحث عن طالب صالح واختياره أولاً.",
        selectMonthError: "يرجى اختيار الشهر.",
        validAmount: "يرجى إدخال مبلغ دفع صحيح.",
        selectPaymentDate: "يرجى اختيار تاريخ الدفع.",
        studentNotFoundSelectedYear: "لم يتم العثور على الطالب في السنة المحددة.",
        authenticationFailed: "فشل تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.",
        noStudents: "لم يتم العثور على طلاب لهذه المدرسة.",
        institutionMissing: "معرّف المؤسسة غير موجود.",
        userMissing: "المستخدم الحالي غير موجود.",
        connectionError: "تعذر الاتصال بخادم النظام.",
        invalidResponse: "أعاد الخادم استجابة غير صالحة.",
        requestFailed: "فشل تنفيذ الطلب.",
        paymentFailed: "فشل تسجيل الدفعة.",

        language: "اللغة",
        unknown: "-",
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
        pageTitle: "Enregistrer un paiement scolaire",
        pageSubtitle: "Enregistrer un paiement mensuel de l'élève",
        back: "Retour",
        loading: "Chargement...",

        schoolInformation: "Informations sur l'établissement",
        institutionId: "Identifiant de l'établissement",
        schoolName: "Nom de l'établissement",

        paymentInformation: "Informations de paiement",
        academicYear: "Année scolaire",
        selectAcademicYear: "Sélectionner l'année scolaire",

        searchByStudentNumber: "Rechercher par numéro d'élève",
        studentNumber: "Numéro de l'élève",
        studentNumberDisplay: "Numéro de l'élève",
        enterStudentNumber: "Entrer le numéro de l'élève",
        search: "Rechercher",

        studentName: "Nom de l'élève",
        searchForStudent: "Rechercher un élève",

        stage: "Cycle",
        class: "Classe",

        month: "Mois",
        selectMonth: "Sélectionner le mois",

        amount: "Montant",
        enterAmount: "Entrer le montant",

        paymentDate: "Date du paiement",
        receiptNumber: "Numéro du reçu",
        generatedAfterSaving: "Généré après l'enregistrement",

        recordedBy: "Enregistré par",
        currentUser: "Utilisateur actuel",

        notes: "Notes",
        optionalNotes: "Notes facultatives",

        cancel: "Annuler",
        recordPayment: "Enregistrer le paiement",
        recording: "Enregistrement...",

        loadingStudents: "Chargement des élèves...",
        paymentRecorded: "Paiement enregistré avec succès.",
        receipt: "Reçu",

        studentFound: "Élève trouvé",
        studentNotFound: "Aucun élève trouvé pour cette année scolaire.",
        duplicateStudentNumber: "Plusieurs élèves portent ce numéro. Contactez l'administrateur.",
        selectAcademicYearFirst: "Veuillez d'abord sélectionner une année scolaire.",
        enterStudentNumberFirst: "Veuillez entrer le numéro de l'élève.",
        validStudent: "Veuillez rechercher et sélectionner un élève valide.",
        selectMonthError: "Veuillez sélectionner un mois.",
        validAmount: "Veuillez entrer un montant valide.",
        selectPaymentDate: "Veuillez sélectionner la date du paiement.",
        studentNotFoundSelectedYear: "Élève introuvable pour l'année sélectionnée.",
        authenticationFailed: "Échec de l'authentification. Veuillez vous reconnecter.",
        noStudents: "Aucun élève trouvé pour cet établissement.",
        institutionMissing: "L'identifiant de l'établissement est manquant.",
        userMissing: "L'utilisateur actuel est introuvable.",
        connectionError: "Impossible de se connecter au serveur BMP.",
        invalidResponse: "Le serveur a renvoyé une réponse invalide.",
        requestFailed: "La requête a échoué.",
        paymentFailed: "Échec de l'enregistrement du paiement.",

        language: "Langue",
        unknown: "-",
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
// Language handling
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

    // Static text via data-i18n
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const key = el.getAttribute("data-i18n");
        const value = TRANSLATIONS[currentLanguage][key];
        if (value !== undefined) el.textContent = value;
    });

    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
        const key = el.getAttribute("data-i18n-placeholder");
        const value = TRANSLATIONS[currentLanguage][key];
        if (value !== undefined) el.placeholder = value;
    });

    // Active lang button
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });

    // Rebuild options
    updateMonthOptions();
    updateAcademicYearFirstOption();

    // Language label
    const selector = document.getElementById("bmpLanguageSelector");
    if (selector) selector.value = currentLanguage;
}


function updateMonthOptions() {
    const select = document.getElementById("month");
    if (!select) return;

    select.querySelectorAll("option").forEach(function (option) {
        if (!option.value) {
            option.textContent = t("selectMonth");
            return;
        }
        if (TRANSLATIONS.en.months[option.value]) {
            option.textContent = t("months." + option.value);
        }
    });
}

function updateAcademicYearFirstOption() {
    const select = document.getElementById("academicYear");
    if (!select) return;
    const first = select.querySelector('option[value=""]');
    if (first) first.textContent = t("selectAcademicYear");
}


// =====================================================
// API request — with timeout + single retry
// =====================================================

async function apiRequest(action, data, attempt) {

    data = data || {};
    attempt = attempt || 1;

    if (!institutionId) throw new Error(t("institutionMissing"));

    const username = getCurrentUsername();
    if (!username) throw new Error(t("userMissing"));

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

        if (error.name === "AbortError") throw new Error(t("connectionError"));
        throw new Error(t("connectionError"));
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
        throw new Error(t("invalidResponse"));
    }

    if (!result.success) {
        throw new Error(translateBackendError(result.message));
    }

    return result;
}


function translateBackendError(message) {

    if (!message) return t("requestFailed");

    const text = String(message);
    const lower = text.toLowerCase();

    const known = [
        { keys: ["institution id is missing", "institution is missing"], key: "institutionMissing" },
        { keys: ["current user is missing"], key: "userMissing" },
        { keys: ["authentication failed", "school authentication failed"], key: "authenticationFailed" },
        { keys: ["could not connect"], key: "connectionError" },
        { keys: ["invalid response"], key: "invalidResponse" }
    ];

    for (const item of known) {
        if (item.keys.some(k => lower.includes(k))) {
            return t(item.key);
        }
    }

    return text;
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
            "school-record-payment.html?id=" + encodeURIComponent(institutionId);
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
// Institution
// =====================================================

function loadInstitution() {
    institution = {
        id: institutionId,
        name: currentUser.institutionName || currentUser.schoolName || currentUser.institution || institutionId
    };

    const idEl = document.getElementById("institutionId");
    const nameEl = document.getElementById("institutionName");

    if (idEl) idEl.textContent = institution.id || t("unknown");
    if (nameEl) nameEl.textContent = institution.name || t("unknown");
}


// =====================================================
// Academic year — YYYY-YY format
// =====================================================

function getCurrentAcademicYear() {
    const now = new Date();
    let startYear = now.getFullYear();
    if (now.getMonth() < 9) startYear--;
    return startYear + "-" + String(startYear + 1).slice(-2);
}

function getAvailableAcademicYears() {
    const years = new Set();

    students.forEach(function (student) {
        if (student.academicYear) years.add(String(student.academicYear).trim());
    });

    years.add(getCurrentAcademicYear());

    return Array.from(years).filter(Boolean).sort().reverse();
}

function loadAcademicYears() {

    const select = document.getElementById("academicYear");
    if (!select) return;

    const currentValue = select.value;
    const years = getAvailableAcademicYears();

    select.innerHTML = "";

    const firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = t("selectAcademicYear");
    select.appendChild(firstOption);

    years.forEach(function (year) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        select.appendChild(option);
    });

    const currentYear = getCurrentAcademicYear();

    if (currentValue && years.includes(currentValue)) {
        select.value = currentValue;
    } else if (years.includes(currentYear)) {
        select.value = currentYear;
    }
}


// =====================================================
// Students — cache first, then network
// =====================================================

async function loadStudentsFromBackend() {
    try {
        const result = await apiRequest("getStudents");
        students = Array.isArray(result.students) ? result.students : [];

        students = students.filter(function (student) {
            if (!student.institutionId) return true;
            return String(student.institutionId) === String(institutionId);
        });

        try {
            sessionStorage.setItem(CACHE_KEY_STUDENTS(), JSON.stringify(students));
        } catch (e) {}

        return true;
    } catch (error) {
        console.error("Failed to load students:", error);
        return false;
    }
}

function loadStudentsFromCache() {
    try {
        const cached = sessionStorage.getItem(CACHE_KEY_STUDENTS());
        if (!cached) return false;
        const parsed = JSON.parse(cached);
        if (!Array.isArray(parsed)) return false;
        students = parsed;
        return true;
    } catch (e) {
        return false;
    }
}


// =====================================================
// Student helpers
// =====================================================

function getStudentId(student) {
    return String(student.studentId || student.id || "").trim();
}

function getInstitutionStudents() {
    return students.filter(function (student) {
        if (!student.institutionId) return true;
        return String(student.institutionId) === String(institutionId);
    });
}

function normalizeStudentNumber(value) {
    return String(value || "").trim().toLowerCase();
}


// =====================================================
// Student search — auto-filter as you type
// =====================================================

function findStudentByNumber(studentNumber, academicYear) {

    const matches = getInstitutionStudents().filter(function (student) {

        const sameYear =
            String(student.academicYear || "").trim() === academicYear;

        const number =
            normalizeStudentNumber(student.studentNumber);

        return sameYear && number === studentNumber;
    });

    return matches;
}


function onSearchInput() {

    clearError();

    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(function () {
        performAutoSearch();
    }, 200);
}


function performAutoSearch() {

    const academicYearEl = document.getElementById("academicYear");
    const searchEl       = document.getElementById("studentNumberSearch");

    const academicYear = academicYearEl ? String(academicYearEl.value || "").trim() : "";
    const studentNumber = searchEl ? normalizeStudentNumber(searchEl.value) : "";

    // If either is empty → clear result quietly
    if (!academicYear || !studentNumber) {
        clearStudentInformation();
        clearStudentSearchResult();
        return;
    }

    const matches = findStudentByNumber(studentNumber, academicYear);

    if (matches.length === 0) {
        clearStudentInformation();
        showStudentSearchResult(t("studentNotFound"), true);
        return;
    }

    if (matches.length > 1) {
        clearStudentInformation();
        showStudentSearchResult(t("duplicateStudentNumber"), true);
        return;
    }

    applyStudentToForm(matches[0]);
}


function applyStudentToForm(student) {

    selectedStudent = student;

    const idEl     = document.getElementById("studentId");
    const nameEl   = document.getElementById("studentName");
    const numberEl = document.getElementById("studentNumber");
    const stageEl  = document.getElementById("stage");
    const classEl  = document.getElementById("className");

    if (idEl)     idEl.value     = getStudentId(student);
    if (nameEl)   nameEl.value   = student.name || "";
    if (numberEl) numberEl.value = student.studentNumber || "";
    if (stageEl)  stageEl.value  = formatStage(student.stage);
    if (classEl)  classEl.value  = student.className || student.class || student.classNumber || "";

    showStudentSearchResult(t("studentFound") + ": " + (student.name || t("unknown")));
}


function showStudentSearchResult(message, isError) {
    const el = document.getElementById("studentSearchResult");
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("error", Boolean(isError));
    el.style.display = "block";
}

function clearStudentSearchResult() {
    const el = document.getElementById("studentSearchResult");
    if (!el) return;
    el.textContent = "";
    el.classList.remove("error");
    el.style.display = "none";
}


function clearStudentInformation() {
    selectedStudent = null;

    ["studentId", "studentName", "studentNumber", "stage", "className"].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    clearStudentSearchResult();
}


// =====================================================
// Stage formatting
// =====================================================

function formatStage(stage) {
    if (!stage) return t("unknown");

    const value = String(stage).trim().toLowerCase();

    const stages = {
        primary:     t("primary"),
        preparatory: t("preparatory"),
        secondary:   t("secondary")
    };

    return stages[value] || stage;
}


// =====================================================
// Current user info
// =====================================================

function loadCurrentUser() {
    const el = document.getElementById("recordedBy");
    if (el) el.value = getCurrentUsername() || t("unknown");
}


// =====================================================
// Receipt
// =====================================================

function setReceiptNumber(receiptNumber) {
    const el = document.getElementById("receiptNumber");
    if (!el) return;
    el.value = receiptNumber || "";
    if (!receiptNumber) el.placeholder = t("generatedAfterSaving");
}


// =====================================================
// Messages
// =====================================================

function clearError() {
    const el = document.getElementById("errorMessage");
    if (el) {
        el.style.display = "none";
        el.textContent = "";
    }
}

function showError(message) {
    const errorEl   = document.getElementById("errorMessage");
    const successEl = document.getElementById("successMessage");

    if (successEl) {
        successEl.style.display = "none";
        successEl.textContent = "";
    }

    if (errorEl) {
        errorEl.textContent = String(message || t("requestFailed"));
        errorEl.style.display = "block";
    }

    console.error("BMP Error:", message);
}

function showSuccess(message) {
    const errorEl   = document.getElementById("errorMessage");
    const successEl = document.getElementById("successMessage");

    if (errorEl) {
        errorEl.style.display = "none";
        errorEl.textContent = "";
    }

    if (successEl) {
        successEl.textContent = String(message);
        successEl.style.display = "block";
    }
}


// =====================================================
// Save payment
// =====================================================

async function savePayment(event) {

    event.preventDefault();
    clearError();

    const academicYear = document.getElementById("academicYear")?.value.trim();
    const studentId    = document.getElementById("studentId")?.value.trim();
    const month        = document.getElementById("month")?.value.trim();
    const amount       = Number(document.getElementById("amount")?.value);
    const paymentDate  = document.getElementById("paymentDate")?.value;
    const notes        = document.getElementById("notes")?.value.trim() || "";

    // ----- Validation -----
    if (!academicYear) { showError(t("selectAcademicYearFirst")); return; }
    if (!studentId || !selectedStudent) { showError(t("validStudent")); return; }
    if (!month) { showError(t("selectMonthError")); return; }
    if (!Number.isFinite(amount) || amount <= 0) { showError(t("validAmount")); return; }
    if (!paymentDate) { showError(t("selectPaymentDate")); return; }

    const student = students.find(function (item) {
        return getStudentId(item) === studentId
            && String(item.academicYear || "").trim() === academicYear;
    });

    if (!student) { showError(t("studentNotFoundSelectedYear")); return; }

    // ----- Disable button + spinner -----
    const button = document.getElementById("recordPaymentButton");
    const label  = button ? button.querySelector(".btn-label") : null;

    if (button) {
        button.disabled = true;
        button.classList.add("loading");
    }
    if (label) label.textContent = t("recording");

    try {

        const result = await apiRequest("addPayment", {
            studentId: studentId,
            academicYear: academicYear,
            month: month,
            amount: amount,
            paymentDate: paymentDate,
            notes: notes
        });

        const payment       = result.payment || {};
        const receiptNumber = payment.receiptNumber || result.receiptNumber || "";

        if (receiptNumber) setReceiptNumber(receiptNumber);

        let successMsg = t("paymentRecorded");
        if (receiptNumber) successMsg += " " + t("receipt") + ": " + receiptNumber;

        showSuccess(successMsg);

        // Clear stale caches so school-payments.html fetches fresh
        try {
            sessionStorage.removeItem("bmp_payments_" + institutionId);
            sessionStorage.removeItem("bmp_students_" + institutionId);
            sessionStorage.removeItem("bmp_student_" + institutionId + "_" + studentId);
        } catch (e) {}

        setTimeout(function () {
            // Cache-buster forces reload + fresh fetch on the target page
            const ts = Date.now();
            window.location.href =
                "school-payments.html?id=" + encodeURIComponent(institutionId) +
                "&reload=" + ts;
        }, 900);

    } catch (error) {

        console.error("Payment error:", error);
        showError(error.message || t("paymentFailed"));

        if (button) {
            button.disabled = false;
            button.classList.remove("loading");
        }
        if (label) label.textContent = t("recordPayment");
    }
}


// =====================================================
// Navigation
// =====================================================

function goBack() {
    const id = institutionId || (currentUser && currentUser.institutionId) || "";
    if (id) {
        window.location.href = "school-payments.html?id=" + encodeURIComponent(id);
    } else {
        window.location.href = "school-payments.html";
    }
}


// =====================================================
// Event listeners
// =====================================================

function setupEventListeners() {

    // Academic year change → re-run search
    const academicYearEl = document.getElementById("academicYear");
    if (academicYearEl) {
        academicYearEl.addEventListener("change", function () {
            clearError();
            performAutoSearch();
        });
    }

    // Auto-filter on typing
    const searchInput = document.getElementById("studentNumberSearch");
    if (searchInput) {
        searchInput.addEventListener("input", onSearchInput);
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
                performAutoSearch();
            }
        });
    }

    // Form submit
    const form = document.getElementById("paymentForm");
    if (form) {
        form.addEventListener("submit", savePayment);
    }

    // Back / Cancel
    document.getElementById("backButton")?.addEventListener("click", goBack);
    document.getElementById("cancelButton")?.addEventListener("click", goBack);

    // Language switcher
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

    if (pageInitialized) return;
    pageInitialized = true;

    showLoader();

    const authenticated = initializeAuthentication();
    if (!authenticated) {
        hideLoaderAfterPaint();
        showError(t("authenticationFailed"));
        return;
    }

    loadInstitution();
    loadCurrentUser();

    // Set payment date to today
    const paymentDateEl = document.getElementById("paymentDate");
    if (paymentDateEl && !paymentDateEl.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        paymentDateEl.value = yyyy + "-" + mm + "-" + dd;
    }

    setReceiptNumber();

    // 1) Cache-first
    const hadCache = loadStudentsFromCache();
    if (hadCache) {
        loadAcademicYears();
        applyLanguage();
        hideLoaderAfterPaint();
    }

    // 2) Network refresh (parallel is not needed — only 1 call)
    const ok = await loadStudentsFromBackend();

    if (!ok && !hadCache) {
        hideLoaderAfterPaint();
        showError(t("noStudents"));
        return;
    }

    loadAcademicYears();
    applyLanguage();

    if (!hadCache) hideLoaderAfterPaint();

    // Quiet notice if no students
    if (!students.length) {
        showError(t("noStudents"));
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
