// =====================================================
// BMP Students
// =====================================================


// =====================================================
// Backend API
// =====================================================

const STUDENTS_API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Translations
// =====================================================

const translations = {

    en: {
        language: "Language",
        loading: "Loading...",
        back: "Back",
        addStudent: "+ Add Student",
        students: "Students",
        manageStudents: "Manage school students",
        institutionId: "Institution ID",
        school: "School",
        studentsInSelectedYear: "Students in Selected Year",
        studentList: "Student List",
        searchAndFilter: "Search and filter students",
        academicYear: "Academic Year",
        allAcademicYears: "All Academic Years",
        search: "Search",
        searchPlaceholder: "Search by name or student number...",
        stage: "Stage",
        allStages: "All Stages",
        primary: "Primary",
        preparatory: "Preparatory",
        secondary: "Secondary",
        class: "Class",
        allClasses: "All Classes",
        studentNumber: "Student Number",
        studentName: "Student Name",
        registrationDate: "Registration Date",
        actions: "Actions",
        view: "View",
        edit: "Edit",
        noStudentsFound: "No Students Found",
        noStudentsDescription: "There are no students matching your search or filters.",
        classNumber: "Class",
        serverConnectionFailed: "Server connection failed.",
        unableToLoadStudents: "Unable to load students.",
        institutionAccessDenied: "Institution access denied."
    },

    ar: {
        language: "اللغة",
        loading: "جاري التحميل...",
        back: "رجوع",
        addStudent: "+ إضافة طالب",
        students: "الطلاب",
        manageStudents: "إدارة طلاب المدرسة",
        institutionId: "رقم المؤسسة",
        school: "المدرسة",
        studentsInSelectedYear: "الطلاب في السنة المحددة",
        studentList: "قائمة الطلاب",
        searchAndFilter: "البحث عن الطلاب وتصفيتهم",
        academicYear: "السنة الدراسية",
        allAcademicYears: "جميع السنوات الدراسية",
        search: "بحث",
        searchPlaceholder: "البحث بالاسم أو رقم الطالب...",
        stage: "المرحلة",
        allStages: "جميع المراحل",
        primary: "التعليم الابتدائي",
        preparatory: "التعليم الإعدادي",
        secondary: "التعليم الثانوي",
        class: "القسم",
        allClasses: "جميع الأقسام",
        studentNumber: "رقم الطالب",
        studentName: "اسم الطالب",
        registrationDate: "تاريخ التسجيل",
        actions: "الإجراءات",
        view: "عرض",
        edit: "تعديل",
        noStudentsFound: "لم يتم العثور على طلاب",
        noStudentsDescription: "لا يوجد طلاب يطابقون البحث أو عوامل التصفية المحددة.",
        classNumber: "القسم",
        serverConnectionFailed: "فشل الاتصال بالخادم.",
        unableToLoadStudents: "تعذر تحميل الطلاب.",
        institutionAccessDenied: "تم رفض الوصول إلى المؤسسة."
    },

    fr: {
        language: "Langue",
        loading: "Chargement...",
        back: "Retour",
        addStudent: "+ Ajouter un élève",
        students: "Élèves",
        manageStudents: "Gérer les élèves de l'école",
        institutionId: "ID de l'établissement",
        school: "École",
        studentsInSelectedYear: "Élèves pour l'année sélectionnée",
        studentList: "Liste des élèves",
        searchAndFilter: "Rechercher et filtrer les élèves",
        academicYear: "Année scolaire",
        allAcademicYears: "Toutes les années scolaires",
        search: "Recherche",
        searchPlaceholder: "Rechercher par nom ou numéro d'élève...",
        stage: "Niveau",
        allStages: "Tous les niveaux",
        primary: "Primaire",
        preparatory: "Collège",
        secondary: "Secondaire",
        class: "Classe",
        allClasses: "Toutes les classes",
        studentNumber: "Numéro d'élève",
        studentName: "Nom de l'élève",
        registrationDate: "Date d'inscription",
        actions: "Actions",
        view: "Voir",
        edit: "Modifier",
        noStudentsFound: "Aucun élève trouvé",
        noStudentsDescription: "Aucun élève ne correspond à votre recherche ou à vos filtres.",
        classNumber: "Classe",
        serverConnectionFailed: "Échec de la connexion au serveur.",
        unableToLoadStudents: "Impossible de charger les élèves.",
        institutionAccessDenied: "Accès à l'établissement refusé."
    }

};


// =====================================================
// Current Language
// =====================================================

const DEFAULT_LANG = "ar";

let currentLanguage =
    localStorage.getItem("bmpLanguage") || DEFAULT_LANG;


// =====================================================
// Authentication
// =====================================================

const currentUser = requireSchoolLogin();

if (!currentUser) {
    throw new Error("School login required.");
}

const institutionId = getActiveInstitutionId();

if (!institutionId) {
    throw new Error("Institution access denied.");
}


// =====================================================
// Institution
// =====================================================

const institution = {
    id:    currentUser.institutionId    || "",
    name:  currentUser.institutionName  || "",
    phone: currentUser.institutionPhone || "",
    email: currentUser.institutionEmail || ""
};

if (institution.id !== institutionId) {
    alert(translations[currentLanguage].institutionAccessDenied);
    window.location.href = "school-login.html";
}


// =====================================================
// Role
// =====================================================

const isDirector =
    String(currentUser.role || "").trim().toLowerCase() === "director";


// =====================================================
// Elements
// =====================================================

const pageTitle               = document.getElementById("pageTitle");
const pageSubtitle            = document.getElementById("pageSubtitle");
const institutionIdElement    = document.getElementById("institutionId");
const institutionNameElement  = document.getElementById("institutionName");
const totalStudentsElement    = document.getElementById("totalStudents");
const academicYearFilter      = document.getElementById("academicYearFilter");
const searchStudent           = document.getElementById("searchStudent");
const stageFilter             = document.getElementById("stageFilter");
const classFilter             = document.getElementById("classFilter");
const studentsTableBody       = document.getElementById("studentsTableBody");
const emptyState              = document.getElementById("emptyState");
const addStudentButton        = document.getElementById("addStudentButton");
const emptyAddStudentButton   = document.getElementById("emptyAddStudentButton");
const backButton              = document.getElementById("backButton");
const pageLoader              = document.getElementById("pageLoader");
const langButtons             = document.querySelectorAll(".lang-btn");


// =====================================================
// Students data
// =====================================================

let students = [];


// =====================================================
// Loader
// =====================================================

function showLoader() {
    if (pageLoader) pageLoader.classList.remove("hidden");
}

function hideLoader() {
    if (pageLoader) pageLoader.classList.add("hidden");
}


// =====================================================
// Apply Language
// =====================================================

function applyLanguage(language) {

    if (!translations[language]) language = DEFAULT_LANG;

    currentLanguage = language;
    localStorage.setItem("bmpLanguage", language);

    document.documentElement.lang = language;
    document.documentElement.dir  = (language === "ar") ? "rtl" : "ltr";

    document.body.classList.remove("lang-ar", "lang-fr", "lang-en");
    document.body.classList.add("lang-" + language);

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
        const key = element.getAttribute("data-i18n");
        if (translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
        const key = element.getAttribute("data-i18n-placeholder");
        if (translations[language][key]) {
            element.placeholder = translations[language][key];
        }
    });

    if (pageSubtitle) {
        pageSubtitle.textContent =
            institution.name
                ? translations[language].manageStudents + " - " + institution.name
                : translations[language].manageStudents;
    }

    langButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === language);
    });

    loadClassFilter();
    loadAcademicYearFilter();
    renderStudents();
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
// Initialize
// =====================================================

async function initializeStudents() {

    showLoader();

    pageTitle.textContent = translations[currentLanguage].students;

    pageSubtitle.textContent =
        institution.name
            ? translations[currentLanguage].manageStudents + " - " + institution.name
            : translations[currentLanguage].manageStudents;

    institutionIdElement.textContent   = institution.id;
    institutionNameElement.textContent = institution.name;

    applyLanguage(currentLanguage);

    // Role-based UI
    if (!isDirector) {
        if (addStudentButton)      addStudentButton.style.display = "none";
        if (emptyAddStudentButton) emptyAddStudentButton.style.display = "none";
    }

    await loadStudents();

    hideLoader();
}


// =====================================================
// Load students from Backend
// =====================================================

async function loadStudents() {

    studentsTableBody.innerHTML = "";
    totalStudentsElement.textContent = "0";

    try {

        const response = await fetch(STUDENTS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "getStudents",
                institutionId: institution.id,
                username: currentUser.username
            })
        });

        if (!response.ok) {
            throw new Error(translations[currentLanguage].serverConnectionFailed);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message || translations[currentLanguage].unableToLoadStudents
            );
        }

        students = (result.students || []).map(normalizeStudent);

        loadAcademicYearFilter();
        renderStudents();

    } catch (error) {

        console.error("Students loading error:", error);

        students = [];
        renderStudents();

        alert(error.message || translations[currentLanguage].unableToLoadStudents);
    }
}


// =====================================================
// Normalize student data
// =====================================================

function normalizeStudent(student) {
    return {
        id:               student.studentId || "",
        studentNumber:    student.studentNumber || "",
        academicYear:     student.academicYear || "",
        name:             student.name || "",
        stage:            student.stage || "",
        classNumber:      student.class || student.classNumber || "",
        className:        student.class
            ? translations[currentLanguage].classNumber + " " + student.class
            : "",
        registrationDate: student.createdAt || ""
    };
}


// =====================================================
// Load academic years
// =====================================================

function loadAcademicYearFilter() {

    const selectedValue = academicYearFilter.value;

    const academicYears = [
        ...new Set(
            students.map(s => s.academicYear).filter(y => y)
        )
    ];

    academicYears.sort(function (a, b) {
        return Number(b.split("-")[0]) - Number(a.split("-")[0]);
    });

    academicYearFilter.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = translations[currentLanguage].allAcademicYears;
    academicYearFilter.appendChild(allOption);

    academicYears.forEach(function (year) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        academicYearFilter.appendChild(option);
    });

    const currentYear = new Date().getFullYear();
    const currentAcademicYear = currentYear + "-" + (currentYear + 1);

    if (academicYears.includes(selectedValue)) {
        academicYearFilter.value = selectedValue;
    } else if (academicYears.includes(currentAcademicYear)) {
        academicYearFilter.value = currentAcademicYear;
    } else {
        academicYearFilter.value = "all";
    }
}


// =====================================================
// Load classes
// =====================================================

function loadClassFilter() {

    const selectedClass = classFilter.value;
    const stage = stageFilter.value;

    classFilter.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = translations[currentLanguage].allClasses;
    classFilter.appendChild(allOption);

    let numberOfClasses = 6;

    if (stage === "primary")          numberOfClasses = 6;
    else if (stage === "preparatory") numberOfClasses = 4;
    else if (stage === "secondary")   numberOfClasses = 3;

    for (let i = 1; i <= numberOfClasses; i++) {
        const option = document.createElement("option");
        option.value = String(i);
        option.textContent = translations[currentLanguage].classNumber + " " + i;
        classFilter.appendChild(option);
    }

    if (selectedClass && Number(selectedClass) <= numberOfClasses) {
        classFilter.value = selectedClass;
    } else {
        classFilter.value = "all";
    }
}


// =====================================================
// Render students
// =====================================================

function renderStudents() {

    const selectedAcademicYear = academicYearFilter.value;
    const selectedStage        = stageFilter.value;
    const selectedClass        = classFilter.value;
    const searchValue          = searchStudent.value.trim().toLowerCase();

    const filteredStudents = students.filter(function (student) {

        const studentName   = String(student.name || "").toLowerCase();
        const studentNumber = String(student.studentNumber || "").toLowerCase();

        const matchesSearch =
            studentName.includes(searchValue) ||
            studentNumber.includes(searchValue);

        const matchesAcademicYear =
            selectedAcademicYear === "all" ||
            student.academicYear === selectedAcademicYear;

        const matchesStage =
            selectedStage === "all" ||
            student.stage === selectedStage;

        const matchesClass =
            selectedClass === "all" ||
            String(student.classNumber) === String(selectedClass);

        return (
            matchesSearch &&
            matchesAcademicYear &&
            matchesStage &&
            matchesClass
        );
    });

    totalStudentsElement.textContent = filteredStudents.length;
    studentsTableBody.innerHTML = "";

    if (filteredStudents.length === 0) {
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    filteredStudents.sort(function (a, b) {
        return String(a.studentNumber || "").localeCompare(
            String(b.studentNumber || ""),
            undefined,
            { numeric: true }
        );
    });

    filteredStudents.forEach(function (student) {

        const row = document.createElement("tr");

        const registrationDate = student.registrationDate
            ? formatDate(student.registrationDate)
            : "-";

        const stageName = formatStage(student.stage);

        const className = student.classNumber
            ? translations[currentLanguage].classNumber + " " + student.classNumber
            : "-";

        const actionsHtml = isDirector
            ? `
                <button class="table-action" onclick="viewStudent('${escapeHtml(student.id)}')">
                    ${translations[currentLanguage].view}
                </button>
                <button class="table-action edit" onclick="editStudent('${escapeHtml(student.id)}')">
                    ${translations[currentLanguage].edit}
                </button>
              `
            : `
                <button class="table-action" onclick="viewStudent('${escapeHtml(student.id)}')">
                    ${translations[currentLanguage].view}
                </button>
              `;

        row.innerHTML = `
            <td><span class="student-number">${escapeHtml(student.studentNumber || "-")}</span></td>
            <td><span class="student-name">${escapeHtml(student.name || "-")}</span></td>
            <td><span class="class-badge">${escapeHtml(student.academicYear || "-")}</span></td>
            <td><span class="stage-badge">${escapeHtml(stageName)}</span></td>
            <td><span class="class-badge">${escapeHtml(className)}</span></td>
            <td>${escapeHtml(registrationDate)}</td>
            <td>${actionsHtml}</td>
        `;

        studentsTableBody.appendChild(row);
    });
}


// =====================================================
// Format stage
// =====================================================

function formatStage(stage) {
    if (stage === "primary")     return translations[currentLanguage].primary;
    if (stage === "preparatory") return translations[currentLanguage].preparatory;
    if (stage === "secondary")   return translations[currentLanguage].secondary;
    return stage || "-";
}


// =====================================================
// Format date
// =====================================================

function formatDate(dateValue) {

    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString(
        currentLanguage === "ar"
            ? "ar"
            : currentLanguage === "fr"
                ? "fr-FR"
                : "en-US"
    );
}


// =====================================================
// Navigation
// =====================================================

function viewStudent(studentId) {
    window.location.href =
        "student.html?id=" +
        encodeURIComponent(studentId) +
        "&institutionId=" +
        encodeURIComponent(institution.id);
}

function editStudent(studentId) {
    window.location.href =
        "edit-student.html?id=" +
        encodeURIComponent(studentId) +
        "&institutionId=" +
        encodeURIComponent(institution.id);
}

function openAddStudent() {
    window.location.href =
        "add-student.html?id=" +
        encodeURIComponent(institution.id);
}


// =====================================================
// Events
// =====================================================

if (addStudentButton) {
    addStudentButton.addEventListener("click", openAddStudent);
}

if (emptyAddStudentButton) {
    emptyAddStudentButton.addEventListener("click", openAddStudent);
}

academicYearFilter.addEventListener("change", renderStudents);
searchStudent.addEventListener("input", renderStudents);

stageFilter.addEventListener("change", function () {
    loadClassFilter();
    renderStudents();
});

classFilter.addEventListener("change", renderStudents);

backButton.addEventListener("click", function () {
    window.location.href =
        "school.html?id=" +
        encodeURIComponent(institution.id);
});


// =====================================================
// Escape HTML
// =====================================================

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// Boot
// =====================================================

initializeStudents();
