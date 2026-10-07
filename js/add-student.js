// =====================================================
// BMP · Add Student
// =====================================================


// =====================================================
// Backend API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Translations
// =====================================================

const translations = {

    en: {
        back: "Back",
        pageTitle: "Add Student",
        pageSubtitle: "Register a new student",
        schoolInformation: "School Information",
        institutionId: "Institution ID",
        institutionName: "Institution Name",
        studentInformation: "Student Information",
        academicYear: "Academic Year",
        studentNumber: "Student Number",
        generatedAutomatically: "Generated automatically",
        studentName: "Student Name",
        enterStudentName: "Enter student name",
        stage: "Stage",
        selectStage: "Select Stage",
        primary: "Primary",
        preparatory: "Preparatory",
        secondary: "Secondary",
        class: "Class",
        selectClass: "Select Class",
        registrationDate: "Registration Date",
        cancel: "Cancel",
        registerStudent: "Register Student",
        registering: "Registering...",
        studentRegistered: "Student registered successfully.",
        studentNameRequired: "Please enter the student name.",
        stageRequired: "Please select a stage.",
        classRequired: "Please select a class.",
        registrationDateRequired: "Please select the registration date.",
        networkError: "Unable to connect to the server. Please check your internet connection and try again.",
        serverError: "Unable to register the student.",
        invalidResponse: "The server returned an invalid response."
    },

    ar: {
        back: "رجوع",
        pageTitle: "إضافة طالب",
        pageSubtitle: "تسجيل طالب جديد",
        schoolInformation: "معلومات المدرسة",
        institutionId: "رقم المؤسسة",
        institutionName: "اسم المؤسسة",
        studentInformation: "معلومات الطالب",
        academicYear: "السنة الدراسية",
        studentNumber: "رقم الطالب",
        generatedAutomatically: "يتم إنشاؤه تلقائياً",
        studentName: "اسم الطالب",
        enterStudentName: "أدخل اسم الطالب",
        stage: "المرحلة الدراسية",
        selectStage: "اختر المرحلة",
        primary: "التعليم الابتدائي",
        preparatory: "التعليم الإعدادي",
        secondary: "التعليم الثانوي",
        class: "القسم",
        selectClass: "اختر القسم",
        registrationDate: "تاريخ التسجيل",
        cancel: "إلغاء",
        registerStudent: "تسجيل الطالب",
        registering: "جاري التسجيل...",
        studentRegistered: "تم تسجيل الطالب بنجاح.",
        studentNameRequired: "يرجى إدخال اسم الطالب.",
        stageRequired: "يرجى اختيار المرحلة الدراسية.",
        classRequired: "يرجى اختيار القسم.",
        registrationDateRequired: "يرجى اختيار تاريخ التسجيل.",
        networkError: "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
        serverError: "تعذر تسجيل الطالب.",
        invalidResponse: "الخادم أرسل استجابة غير صالحة."
    },

    fr: {
        back: "Retour",
        pageTitle: "Ajouter un élève",
        pageSubtitle: "Inscrire un nouvel élève",
        schoolInformation: "Informations de l'établissement",
        institutionId: "ID de l'établissement",
        institutionName: "Nom de l'établissement",
        studentInformation: "Informations de l'élève",
        academicYear: "Année scolaire",
        studentNumber: "Numéro de l'élève",
        generatedAutomatically: "Généré automatiquement",
        studentName: "Nom de l'élève",
        enterStudentName: "Entrez le nom de l'élève",
        stage: "Niveau scolaire",
        selectStage: "Sélectionner le niveau",
        primary: "Primaire",
        preparatory: "Collège",
        secondary: "Secondaire",
        class: "Classe",
        selectClass: "Sélectionner la classe",
        registrationDate: "Date d'inscription",
        cancel: "Annuler",
        registerStudent: "Inscrire l'élève",
        registering: "Inscription...",
        studentRegistered: "Élève inscrit avec succès.",
        studentNameRequired: "Veuillez saisir le nom de l'élève.",
        stageRequired: "Veuillez sélectionner le niveau.",
        classRequired: "Veuillez sélectionner la classe.",
        registrationDateRequired: "Veuillez sélectionner la date d'inscription.",
        networkError: "Impossible de se connecter au serveur. Vérifiez votre connexion Internet et réessayez.",
        serverError: "Impossible d'inscrire l'élève.",
        invalidResponse: "Le serveur a renvoyé une réponse invalide."
    }
};


// =====================================================
// Current Language
// =====================================================

const DEFAULT_LANG = "ar";

let currentLanguage =
    localStorage.getItem("bmpLanguage") || DEFAULT_LANG;


// =====================================================
// Current User
// =====================================================

let currentUser = null;

try {
    const storedUser = localStorage.getItem("bmpCurrentUser");
    if (storedUser) currentUser = JSON.parse(storedUser);
} catch (error) {
    console.error("Unable to read current user:", error);
    currentUser = null;
}


// =====================================================
// Authentication Check
// =====================================================

if (
    !currentUser ||
    !currentUser.institutionId ||
    !currentUser.username ||
    String(currentUser.status).toLowerCase() !== "active"
) {
    window.location.href = "school-login.html";
    throw new Error("No valid school user session.");
}


// =====================================================
// URL Institution Check
// =====================================================

const urlParams = new URLSearchParams(window.location.search);
const urlInstitutionId = urlParams.get("id");

if (urlInstitutionId && urlInstitutionId !== currentUser.institutionId) {
    window.location.href =
        "school.html?id=" +
        encodeURIComponent(currentUser.institutionId);
    throw new Error("Invalid institution ID.");
}


// =====================================================
// DOM Elements
// =====================================================

const institutionIdElement    = document.getElementById("institutionId");
const institutionNameElement  = document.getElementById("institutionName");
const academicYearSelect      = document.getElementById("academicYear");
const studentNumberInput      = document.getElementById("studentNumber");
const studentNameInput        = document.getElementById("studentName");
const stageSelect             = document.getElementById("stage");
const classSelect             = document.getElementById("className");
const registrationDateInput   = document.getElementById("registrationDate");
const studentForm             = document.getElementById("studentForm");
const backButton              = document.getElementById("backButton");
const cancelButton            = document.getElementById("cancelButton");
const registerButton          = document.getElementById("registerButton");
const langButtons             = document.querySelectorAll(".lang-btn");


// =====================================================
// Validate DOM
// =====================================================

const requiredElements = [
    institutionIdElement,
    institutionNameElement,
    academicYearSelect,
    studentNumberInput,
    studentNameInput,
    stageSelect,
    classSelect,
    registrationDateInput,
    studentForm,
    backButton,
    cancelButton,
    registerButton
];

if (requiredElements.some(el => !el)) {
    console.error("Add Student page: one or more HTML elements are missing.");
    throw new Error("Add Student page could not initialize.");
}


// =====================================================
// Display Institution
// =====================================================

institutionIdElement.textContent   = currentUser.institutionId;
institutionNameElement.textContent = currentUser.institutionName || "";


// =====================================================
// Inline Error Helpers
// =====================================================

function showFieldError(fieldId, messageKey) {
    const field = document.getElementById(fieldId);
    const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);
    if (!field || !errorEl) return;

    const message = translations[currentLanguage][messageKey] || "";
    errorEl.textContent = message;
    errorEl.classList.add("visible");

    const group = field.closest(".form-group");
    if (group) group.classList.add("has-error");
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);
    if (!field || !errorEl) return;

    errorEl.textContent = "";
    errorEl.classList.remove("visible");

    const group = field.closest(".form-group");
    if (group) group.classList.remove("has-error");
}

function clearAllErrors() {
    ["academicYear", "studentName", "stage", "className", "registrationDate"]
        .forEach(clearFieldError);
}


// =====================================================
// Apply Language
// =====================================================

function applyLanguage(language) {

    if (!Object.prototype.hasOwnProperty.call(translations, language)) {
        language = DEFAULT_LANG;
    }

    currentLanguage = language;
    localStorage.setItem("bmpLanguage", language);

    document.documentElement.lang = language;
    document.documentElement.dir  = (language === "ar") ? "rtl" : "ltr";

    document.body.classList.remove("lang-ar", "lang-fr", "lang-en");
    document.body.classList.add("lang-" + language);

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
        const key = element.getAttribute("data-i18n");
        const value = translations[language][key];
        if (value !== undefined) element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
        const key = element.getAttribute("data-i18n-placeholder");
        const value = translations[language][key];
        if (value !== undefined) element.placeholder = value;
    });

    langButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === language);
    });

    const selectedClass = classSelect.value;
    loadClasses(selectedClass);
    updateStudentNumberPreview();
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
// Academic Years
// =====================================================

function loadAcademicYears() {

    const currentYear = new Date().getFullYear();
    academicYearSelect.innerHTML = "";

    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
        const value = `${year}-${String(year + 1).slice(-2)}`;
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        academicYearSelect.appendChild(option);
    }

    const currentAcademicYear = `${currentYear}-${String(currentYear + 1).slice(-2)}`;
    academicYearSelect.value = currentAcademicYear;
}


// =====================================================
// Classes
// =====================================================

function loadClasses(selectedClass = "") {

    const stage = stageSelect.value;
    classSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = translations[currentLanguage].selectClass;
    classSelect.appendChild(placeholder);

    let count = 0;
    if (stage === "primary")          count = 6;
    else if (stage === "preparatory") count = 4;
    else if (stage === "secondary")   count = 3;

    for (let i = 1; i <= count; i++) {
        const option = document.createElement("option");
        option.value = String(i);
        option.textContent = `${translations[currentLanguage].class} ${i}`;
        classSelect.appendChild(option);
    }

    if (selectedClass && Number(selectedClass) >= 1 && Number(selectedClass) <= count) {
        classSelect.value = selectedClass;
    }
}


// =====================================================
// Student Number Preview
// =====================================================

function updateStudentNumberPreview() {

    const stage = stageSelect.value;
    const classNumber = classSelect.value;

    if (!stage || !classNumber) {
        studentNumberInput.value = "";
        return;
    }

    const letters = { primary: "A", preparatory: "B", secondary: "C" };
    const letter = letters[stage];

    if (!letter) {
        studentNumberInput.value = "";
        return;
    }

    studentNumberInput.value = `${letter}${classNumber}XXX`;
}


// =====================================================
// Registration Date
// =====================================================

function setRegistrationDate() {
    const today = new Date();
    const year  = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day   = String(today.getDate()).padStart(2, "0");
    registrationDateInput.value = `${year}-${month}-${day}`;
}


// =====================================================
// Register Student
// =====================================================

async function registerStudent() {

    const t = translations[currentLanguage];

    const name             = studentNameInput.value.trim();
    const academicYear     = academicYearSelect.value;
    const stage            = stageSelect.value;
    const classNumber      = classSelect.value;
    const registrationDate = registrationDateInput.value;

    clearAllErrors();

    let hasError = false;

    if (!name) {
        showFieldError("studentName", "studentNameRequired");
        hasError = true;
    }

    if (!stage) {
        showFieldError("stage", "stageRequired");
        hasError = true;
    }

    if (!classNumber) {
        showFieldError("className", "classRequired");
        hasError = true;
    }

    if (!registrationDate) {
        showFieldError("registrationDate", "registrationDateRequired");
        hasError = true;
    }

    if (hasError) {
        const firstError = document.querySelector(".form-group.has-error input, .form-group.has-error select");
        if (firstError) firstError.focus();
        return;
    }

    // Disable button + spinner
    registerButton.disabled = true;
    registerButton.classList.add("loading");

    const label = registerButton.querySelector(".btn-label");
    if (label) label.textContent = t.registering;

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action:           "addStudent",
                institutionId:    currentUser.institutionId,
                username:         currentUser.username,
                academicYear:     academicYear,
                name:             name,
                stage:            stage,
                classNumber:      classNumber,
                registrationDate: registrationDate
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}.`);
        }

        const responseText = await response.text();

        if (!responseText) {
            throw new Error(t.invalidResponse);
        }

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("Invalid JSON returned by server:", jsonError);
            throw new Error(t.invalidResponse);
        }

        if (!result.success) {
            throw new Error(result.message || t.serverError);
        }

        if (!result.student || !result.student.studentNumber) {
            throw new Error(t.invalidResponse);
        }

        studentNumberInput.value = result.student.studentNumber;

        // Show success briefly
        if (label) label.textContent = t.studentRegistered;

        // Redirect after short delay so user sees the generated number
        setTimeout(function () {
            window.location.href =
                "students.html?id=" +
                encodeURIComponent(currentUser.institutionId);
        }, 700);

    } catch (error) {

        console.error("Register student error:", error);

        let message = error.message || t.serverError;

        if (
            error instanceof TypeError &&
            String(error.message).toLowerCase().includes("fetch")
        ) {
            message = t.networkError;
        }

        alert(message);

        registerButton.disabled = false;
        registerButton.classList.remove("loading");
        if (label) label.textContent = t.registerStudent;
    }
}


// =====================================================
// Events
// =====================================================

stageSelect.addEventListener("change", function () {
    clearFieldError("stage");
    loadClasses();
    updateStudentNumberPreview();
});

classSelect.addEventListener("change", function () {
    clearFieldError("className");
    updateStudentNumberPreview();
});

academicYearSelect.addEventListener("change", function () {
    updateStudentNumberPreview();
});

studentNameInput.addEventListener("input", function () {
    clearFieldError("studentName");
});

registrationDateInput.addEventListener("change", function () {
    clearFieldError("registrationDate");
});

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!registerButton.disabled) registerStudent();
});

backButton.addEventListener("click", function () {
    window.location.href =
        "students.html?id=" +
        encodeURIComponent(currentUser.institutionId);
});

cancelButton.addEventListener("click", function () {
    window.location.href =
        "students.html?id=" +
        encodeURIComponent(currentUser.institutionId);
});


// =====================================================
// Initialize
// =====================================================

loadAcademicYears();
setRegistrationDate();
loadClasses();
applyLanguage(currentLanguage);
updateStudentNumberPreview();

// Auto-focus on name field
requestAnimationFrame(function () {
    studentNameInput.focus();
});
