// =====================================================
// BMP · Edit Student
// =====================================================


// =====================================================
// Configuration
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Translations
// =====================================================

const translations = {

    en: {
        pageTitle: "Edit Student",
        pageSubtitle: "Update student information",
        back: "Back",
        schoolInformation: "School Information",
        institutionId: "Institution ID",
        institutionName: "School Name",
        studentInformation: "Student Information",
        academicYear: "Academic Year",
        academicYearReadonly: "The academic year cannot be changed after registration.",
        studentNumber: "Student Number",
        studentNumberReadonly: "The student number cannot be changed.",
        studentName: "Student Name",
        enterStudentName: "Enter student name",
        stage: "Stage",
        selectStage: "Select stage",
        primary: "Primary",
        preparatory: "Preparatory",
        secondary: "Secondary",
        class: "Class",
        selectClass: "Select class",
        registrationDate: "Registration Date",
        guardianName: "Guardian Name",
        guardianPhone: "Guardian Phone",
        enterGuardianName: "Enter guardian name",
        enterGuardianPhone: "Enter guardian phone",
        cancel: "Cancel",
        saveChanges: "Save Changes",
        loading: "Loading...",
        saving: "Saving...",
        studentNotFound: "Student not found.",
        institutionNotFound: "Institution not found.",
        studentNameRequired: "Please enter the student name.",
        stageRequired: "Please select a stage.",
        classRequired: "Please select a class.",
        registrationDateRequired: "Please select the registration date.",
        networkError: "Unable to connect to the server. Please check your internet connection.",
        saveError: "Unable to update student information.",
        success: "Student information updated successfully.",
        serverError: "The server returned an invalid response.",
        loginRequired: "School login required."
    },

    ar: {
        pageTitle: "تعديل الطالب",
        pageSubtitle: "تحديث معلومات الطالب",
        back: "رجوع",
        schoolInformation: "معلومات المؤسسة",
        institutionId: "معرّف المؤسسة",
        institutionName: "اسم المؤسسة",
        studentInformation: "معلومات الطالب",
        academicYear: "السنة الدراسية",
        academicYearReadonly: "لا يمكن تغيير السنة الدراسية بعد تسجيل الطالب.",
        studentNumber: "رقم الطالب",
        studentNumberReadonly: "لا يمكن تغيير رقم الطالب.",
        studentName: "اسم الطالب",
        enterStudentName: "أدخل اسم الطالب",
        stage: "المرحلة",
        selectStage: "اختر المرحلة",
        primary: "الابتدائية",
        preparatory: "الإعدادية",
        secondary: "الثانوية",
        class: "القسم",
        selectClass: "اختر القسم",
        registrationDate: "تاريخ التسجيل",
        guardianName: "اسم ولي الأمر",
        guardianPhone: "رقم ولي الأمر",
        enterGuardianName: "أدخل اسم ولي الأمر",
        enterGuardianPhone: "أدخل رقم ولي الأمر",
        cancel: "إلغاء",
        saveChanges: "حفظ التغييرات",
        loading: "جارٍ التحميل...",
        saving: "جارٍ الحفظ...",
        studentNotFound: "لم يتم العثور على الطالب.",
        institutionNotFound: "لم يتم العثور على المؤسسة.",
        studentNameRequired: "يرجى إدخال اسم الطالب.",
        stageRequired: "يرجى اختيار المرحلة.",
        classRequired: "يرجى اختيار القسم.",
        registrationDateRequired: "يرجى اختيار تاريخ التسجيل.",
        networkError: "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.",
        saveError: "تعذر تحديث معلومات الطالب.",
        success: "تم تحديث معلومات الطالب بنجاح.",
        serverError: "أعاد الخادم استجابة غير صالحة.",
        loginRequired: "يجب تسجيل الدخول إلى المؤسسة."
    },

    fr: {
        pageTitle: "Modifier l'élève",
        pageSubtitle: "Mettre à jour les informations de l'élève",
        back: "Retour",
        schoolInformation: "Informations de l'établissement",
        institutionId: "ID de l'établissement",
        institutionName: "Nom de l'établissement",
        studentInformation: "Informations de l'élève",
        academicYear: "Année scolaire",
        academicYearReadonly: "L'année scolaire ne peut pas être modifiée après l'inscription.",
        studentNumber: "Numéro de l'élève",
        studentNumberReadonly: "Le numéro de l'élève ne peut pas être modifié.",
        studentName: "Nom de l'élève",
        enterStudentName: "Entrez le nom de l'élève",
        stage: "Niveau",
        selectStage: "Sélectionnez le niveau",
        primary: "Primaire",
        preparatory: "Collège",
        secondary: "Secondaire",
        class: "Classe",
        selectClass: "Sélectionnez la classe",
        registrationDate: "Date d'inscription",
        guardianName: "Nom du tuteur",
        guardianPhone: "Téléphone du tuteur",
        enterGuardianName: "Entrez le nom du tuteur",
        enterGuardianPhone: "Entrez le téléphone du tuteur",
        cancel: "Annuler",
        saveChanges: "Enregistrer",
        loading: "Chargement...",
        saving: "Enregistrement...",
        studentNotFound: "Élève introuvable.",
        institutionNotFound: "Établissement introuvable.",
        studentNameRequired: "Veuillez saisir le nom de l'élève.",
        stageRequired: "Veuillez sélectionner le niveau.",
        classRequired: "Veuillez sélectionner la classe.",
        registrationDateRequired: "Veuillez sélectionner la date d'inscription.",
        networkError: "Impossible de contacter le serveur. Vérifiez votre connexion Internet.",
        saveError: "Impossible de mettre à jour les informations de l'élève.",
        success: "Les informations de l'élève ont été mises à jour avec succès.",
        serverError: "Le serveur a renvoyé une réponse invalide.",
        loginRequired: "Connexion à l'établissement requise."
    }

};


// =====================================================
// Current Language
// =====================================================

const DEFAULT_LANG = "ar";

let currentLanguage =
    localStorage.getItem("bmpLanguage") || DEFAULT_LANG;


// =====================================================
// t() helper
// =====================================================

function t(key) {
    return (
        translations[currentLanguage] &&
        translations[currentLanguage][key]
    ) || translations.en[key] || key;
}


// =====================================================
// Inline Error Helpers
// =====================================================

function showFieldError(fieldId, messageKey) {
    const field = document.getElementById(fieldId);
    const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);
    if (!field || !errorEl) return;

    errorEl.textContent = t(messageKey);
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
    ["studentName", "stage", "className", "registrationDate",
     "guardianName", "guardianPhone"]
        .forEach(clearFieldError);
}


// =====================================================
// Apply Language
// =====================================================

function applyLanguage(language) {

    if (!translations[language]) language = DEFAULT_LANG;

    if (language) currentLanguage = language;
    localStorage.setItem("bmpLanguage", currentLanguage);

    const html = document.documentElement;
    html.lang = currentLanguage;
    html.dir  = currentLanguage === "ar" ? "rtl" : "ltr";

    document.body.classList.remove("lang-ar", "lang-fr", "lang-en");
    document.body.classList.add("lang-" + currentLanguage);

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
        const key = element.dataset.i18n;
        element.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
        const key = element.dataset.i18nPlaceholder;
        element.placeholder = t(key);
    });

    langButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });

    if (stageSelect && classSelect) {
        loadClasses(classSelect.value);
    }
}


// =====================================================
// Authentication
// =====================================================

const currentUser = requireSchoolLogin();

if (!currentUser) {
    alert(t("loginRequired"));
    throw new Error("School login required.");
}


// =====================================================
// Institution
// =====================================================

const institutionId = getActiveInstitutionId();

if (!institutionId) {
    alert(t("institutionNotFound"));
    throw new Error("Institution access denied.");
}


// =====================================================
// Role Check (Director only)
// =====================================================

const isDirector =
    String(currentUser.role || "").trim().toLowerCase() === "director";

if (!isDirector) {
    window.location.href =
        "students.html?id=" +
        encodeURIComponent(currentUser.institutionId);
    throw new Error("Only the Director can edit students.");
}


// =====================================================
// Student ID from URL
// =====================================================

const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get("id");

if (!studentId) {
    alert(t("studentNotFound"));
    window.location.href =
        "students.html?id=" +
        encodeURIComponent(institutionId);
    throw new Error("Student ID missing.");
}


// =====================================================
// Cache keys
// =====================================================

const CACHE_KEY_STUDENT =
    "bmp_student_" + institutionId + "_" + studentId;

const CACHE_KEY_STUDENTS_LIST =
    "bmp_students_" + institutionId;


// =====================================================
// DOM Elements
// =====================================================

const institutionIdElement   = document.getElementById("institutionId");
const institutionNameElement = document.getElementById("institutionName");
const academicYearInput      = document.getElementById("academicYear");
const studentNumberInput     = document.getElementById("studentNumber");
const studentNameInput       = document.getElementById("studentName");
const stageSelect            = document.getElementById("stage");
const classSelect            = document.getElementById("className");
const registrationDateInput  = document.getElementById("registrationDate");
const guardianNameInput      = document.getElementById("guardianName");
const guardianPhoneInput     = document.getElementById("guardianPhone");
const editStudentForm        = document.getElementById("editStudentForm");
const backButton             = document.getElementById("backButton");
const cancelButton           = document.getElementById("cancelButton");
const saveButton             = document.getElementById("saveButton");
const pageLoader             = document.getElementById("pageLoader");
const langButtons            = document.querySelectorAll(".lang-btn");


// =====================================================
// State
// =====================================================

let originalStudent = null;


// =====================================================
// Loader
// =====================================================

function hideLoaderAfterPaint() {
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            if (pageLoader) pageLoader.classList.add("hidden");
        });
    });
}


// =====================================================
// Load Classes
// =====================================================

function loadClasses(selectedClass = "") {

    if (!stageSelect || !classSelect) return;

    const stage = String(stageSelect.value || "").trim().toLowerCase();

    classSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = t("selectClass");
    classSelect.appendChild(defaultOption);

    let numberOfClasses = 0;
    if (stage === "primary")          numberOfClasses = 6;
    else if (stage === "preparatory") numberOfClasses = 4;
    else if (stage === "secondary")   numberOfClasses = 3;

    for (let i = 1; i <= numberOfClasses; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = t("class") + " " + i;
        if (String(i) === String(selectedClass)) {
            option.selected = true;
        }
        classSelect.appendChild(option);
    }
}


// =====================================================
// API Request
// =====================================================

async function apiRequest(payload) {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("HTTP " + response.status);
    }

    const text = await response.text();

    if (!text) {
        throw new Error("Empty server response.");
    }

    let result;
    try {
        result = JSON.parse(text);
    } catch (error) {
        console.error("Invalid server response:", text);
        throw new Error("Invalid JSON response.");
    }

    return result;
}


// =====================================================
// Normalize Stage
// =====================================================

function normalizeStage(value) {

    const stage = String(value || "").trim().toLowerCase();

    if (stage === "primary" ||
        stage === "primary education" ||
        stage === "الابتدائية" ||
        stage === "ابتدائي") return "primary";

    if (stage === "preparatory" ||
        stage === "preparatory education" ||
        stage === "الإعدادية" ||
        stage === "إعدادي") return "preparatory";

    if (stage === "secondary" ||
        stage === "secondary education" ||
        stage === "الثانوية" ||
        stage === "ثانوي") return "secondary";

    return stage;
}


// =====================================================
// Normalize Date for input[type=date]
// =====================================================

function normalizeDate(value) {

    if (!value) return "";

    const stringValue = String(value);

    if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
        return stringValue;
    }

    const date = new Date(stringValue);
    if (Number.isNaN(date.getTime())) return "";

    const year  = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day   = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}


// =====================================================
// Display Student
// =====================================================

function displayStudent(student) {

    originalStudent = student;

    institutionIdElement.textContent =
        currentUser.institutionId || institutionId || "—";

    institutionNameElement.textContent =
        currentUser.institutionName || currentUser.name || "—";

    academicYearInput.value  = student.academicYear || "";
    studentNumberInput.value = student.studentNumber || "";
    studentNameInput.value   = student.name || "";

    stageSelect.value = normalizeStage(student.stage);

    loadClasses(student.classNumber || student.class || "");

    registrationDateInput.value =
        normalizeDate(student.registrationDate || student.createdAt || "");

    guardianNameInput.value  = student.guardianName  || "";
    guardianPhoneInput.value = student.guardianPhone || "";
}


// =====================================================
// Load From Cache (instant paint)
// =====================================================

function tryLoadFromCache() {

    // 1) Individual student cache
    try {
        const cached = sessionStorage.getItem(CACHE_KEY_STUDENT);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.id) {
                displayStudent(parsed);
                return true;
            }
        }
    } catch (e) {}

    // 2) Fallback — students list cache
    try {
        const list = sessionStorage.getItem(CACHE_KEY_STUDENTS_LIST);
        if (list) {
            const parsed = JSON.parse(list);
            if (Array.isArray(parsed)) {
                const match = parsed.find(function (s) {
                    return String(s.id) === String(studentId);
                });
                if (match) {
                    displayStudent(match);
                    return true;
                }
            }
        }
    } catch (e) {}

    return false;
}


// =====================================================
// Load Student from Backend
// =====================================================

async function loadStudent() {

    try {

        const result = await apiRequest({
            action: "getStudents",
            institutionId: institutionId,
            username: currentUser.username
        });

        if (!result || !result.success) {
            throw new Error(
                result && result.message ? result.message : t("studentNotFound")
            );
        }

        const list = (result.students || []).map(function (s) {
            return {
                id:               s.studentId || "",
                studentNumber:    s.studentNumber || "",
                academicYear:     s.academicYear || "",
                name:             s.name || "",
                stage:            s.stage || "",
                classNumber:      s.class || s.classNumber || "",
                registrationDate: s.registrationDate || s.createdAt || "",
                guardianName:     s.guardianName  || "",
                guardianPhone:    s.guardianPhone || ""
            };
        });

        // Update list cache
        try {
            sessionStorage.setItem(CACHE_KEY_STUDENTS_LIST, JSON.stringify(list));
        } catch (e) {}

        const student = list.find(function (s) {
            return String(s.id) === String(studentId);
        });

        if (!student) {
            alert(t("studentNotFound"));
            goBackToStudents();
            return false;
        }

        // Update individual cache
        try {
            sessionStorage.setItem(CACHE_KEY_STUDENT, JSON.stringify(student));
        } catch (e) {}

        displayStudent(student);
        return true;

    } catch (error) {

        console.error("Load student error:", error);

        if (!originalStudent) {
            alert(t("networkError"));
            goBackToStudents();
        }

        return false;
    }
}


// =====================================================
// Save Changes
// =====================================================

async function saveChanges() {

    const updatedName             = studentNameInput.value.trim();
    const updatedStage            = normalizeStage(stageSelect.value);
    const updatedClassNumber      = classSelect.value;
    const updatedRegistrationDate = registrationDateInput.value;
    const updatedGuardianName     = guardianNameInput.value.trim();
    const updatedGuardianPhone    = guardianPhoneInput.value.trim();

    clearAllErrors();

    let hasError = false;

    if (!updatedName) {
        showFieldError("studentName", "studentNameRequired");
        hasError = true;
    }

    if (!updatedStage) {
        showFieldError("stage", "stageRequired");
        hasError = true;
    }

    if (!updatedClassNumber) {
        showFieldError("className", "classRequired");
        hasError = true;
    }

    if (!updatedRegistrationDate) {
        showFieldError("registrationDate", "registrationDateRequired");
        hasError = true;
    }

    if (hasError) {
        const first = document.querySelector(".form-group.has-error input, .form-group.has-error select");
        if (first) first.focus();
        return;
    }

    // Disable + spinner
    saveButton.disabled = true;
    saveButton.classList.add("loading");

    const label = saveButton.querySelector(".btn-label");
    if (label) label.textContent = t("saving");

    try {

        const result = await apiRequest({
            action: "updateStudent",
            institutionId: institutionId,
            username: currentUser.username,
            studentId: studentId,
            name: updatedName,
            stage: updatedStage,
            classNumber: Number(updatedClassNumber),
            registrationDate: updatedRegistrationDate,
            guardianName: updatedGuardianName,
            guardianPhone: updatedGuardianPhone
        });

        if (!result || !result.success) {
            throw new Error(
                result && result.message ? result.message : t("saveError")
            );
        }

        // Update cache with new values
        try {
            sessionStorage.setItem(
                CACHE_KEY_STUDENT,
                JSON.stringify({
                    id:               studentId,
                    studentNumber:    studentNumberInput.value,
                    academicYear:     academicYearInput.value,
                    name:             updatedName,
                    stage:            updatedStage,
                    classNumber:      updatedClassNumber,
                    registrationDate: updatedRegistrationDate,
                    guardianName:     updatedGuardianName,
                    guardianPhone:    updatedGuardianPhone
                })
            );
            // Invalidate the students list cache so it refetches
            sessionStorage.removeItem(CACHE_KEY_STUDENTS_LIST);
        } catch (e) {}

        if (label) label.textContent = t("success");

        // Redirect after short delay so user sees the success state
        setTimeout(function () {
            goBackToStudent();
        }, 600);

    } catch (error) {

        console.error("Update student error:", error);

        let message = error.message || t("saveError");

        if (
            error instanceof TypeError &&
            String(error.message).toLowerCase().includes("fetch")
        ) {
            message = t("networkError");
        }

        alert(message);

        saveButton.disabled = false;
        saveButton.classList.remove("loading");
        if (label) label.textContent = t("saveChanges");
    }
}


// =====================================================
// Navigation
// =====================================================

function goBackToStudent() {
    window.location.href =
        "student.html?id=" + encodeURIComponent(studentId) +
        "&institutionId=" + encodeURIComponent(institutionId);
}

function goBackToStudents() {
    window.location.href =
        "students.html?id=" + encodeURIComponent(institutionId);
}


// =====================================================
// Events
// =====================================================

stageSelect.addEventListener("change", function () {
    clearFieldError("stage");
    loadClasses();
});

classSelect.addEventListener("change", function () {
    clearFieldError("className");
});

studentNameInput.addEventListener("input", function () {
    clearFieldError("studentName");
});

registrationDateInput.addEventListener("change", function () {
    clearFieldError("registrationDate");
});

guardianNameInput.addEventListener("input", function () {
    clearFieldError("guardianName");
});

guardianPhoneInput.addEventListener("input", function () {
    clearFieldError("guardianPhone");
});

editStudentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!saveButton.disabled) saveChanges();
});

backButton.addEventListener("click", goBackToStudent);
cancelButton.addEventListener("click", goBackToStudent);

langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        applyLanguage(btn.dataset.lang);
    });
});


// =====================================================
// BOOT — cache-first + parallel fetch
// =====================================================

(function boot() {

    // 1) Apply language + paint UI immediately
    applyLanguage(currentLanguage);

    // 2) Render from cache if available (instant)
    const hadCache = tryLoadFromCache();
    if (hadCache) {
        hideLoaderAfterPaint();
    }

    // 3) Always refresh from network in the background
    loadStudent().then(function () {
        if (!hadCache) {
            hideLoaderAfterPaint();
        }
    });

})();
