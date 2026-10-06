const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";

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
        serverError: "Unable to register the student."
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
        serverError: "تعذر تسجيل الطالب."
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
        serverError: "Impossible d'inscrire l'élève."
    }
};

let currentLanguage =
    localStorage.getItem("bmpLanguage") || "en";

let currentUser = null;

try {
    currentUser = JSON.parse(
        localStorage.getItem("bmpCurrentUser")
    );
} catch (error) {
    currentUser = null;
}

if (
    !currentUser ||
    !currentUser.institutionId ||
    currentUser.status !== "active"
) {
    window.location.href = "school-login.html";
}

const urlParams =
    new URLSearchParams(window.location.search);

const urlInstitutionId =
    urlParams.get("id");

if (
    urlInstitutionId &&
    urlInstitutionId !== currentUser.institutionId
) {
    window.location.href =
        "school.html?id=" +
        encodeURIComponent(currentUser.institutionId);
}

const activeInstitutionId =
    currentUser.institutionId;

const institutionIdElement =
    document.getElementById("institutionId");

const institutionNameElement =
    document.getElementById("institutionName");

const academicYearSelect =
    document.getElementById("academicYear");

const studentNumberInput =
    document.getElementById("studentNumber");

const studentNameInput =
    document.getElementById("studentName");

const stageSelect =
    document.getElementById("stage");

const classSelect =
    document.getElementById("className");

const registrationDateInput =
    document.getElementById("registrationDate");

const studentForm =
    document.getElementById("studentForm");

const backButton =
    document.getElementById("backButton");

const cancelButton =
    document.getElementById("cancelButton");

const registerButton =
    document.getElementById("registerButton");

const languageSelect =
    document.getElementById("languageSelect");

institutionIdElement.textContent =
    currentUser.institutionId;

institutionNameElement.textContent =
    currentUser.institutionName || "";

function applyLanguage(language) {
    if (!translations[language]) {
        language = "en";
    }

    currentLanguage = language;

    localStorage.setItem(
        "bmpLanguage",
        language
    );

    document.documentElement.lang =
        language;

    document.documentElement.dir =
        language === "ar" ? "rtl" : "ltr";

    document
        .querySelectorAll("[data-i18n]")
        .forEach(function(element) {
            const key =
                element.getAttribute("data-i18n");

            if (translations[language][key]) {
                element.textContent =
                    translations[language][key];
            }
        });

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(function(element) {
            const key =
                element.getAttribute(
                    "data-i18n-placeholder"
                );

            if (translations[language][key]) {
                element.placeholder =
                    translations[language][key];
            }
        });

    if (languageSelect) {
        languageSelect.value = language;
    }

    loadClasses();
}

function loadAcademicYears() {
    const currentYear =
        new Date().getFullYear();

    academicYearSelect.innerHTML = "";

    for (
        let year = currentYear - 1;
        year <= currentYear + 1;
        year++
    ) {
        const value =
            `${year}-${String(year + 1).slice(-2)}`;

        const option =
            document.createElement("option");

        option.value = value;
        option.textContent = value;

        academicYearSelect.appendChild(option);
    }
}

function loadClasses() {
    const stage =
        stageSelect.value;

    classSelect.innerHTML = "";

    const placeholder =
        document.createElement("option");

    placeholder.value = "";
    placeholder.textContent =
        translations[currentLanguage].selectClass;

    classSelect.appendChild(placeholder);

    let count = 0;

    if (stage === "primary") {
        count = 6;
    } else if (stage === "preparatory") {
        count = 4;
    } else if (stage === "secondary") {
        count = 3;
    }

    for (let i = 1; i <= count; i++) {
        const option =
            document.createElement("option");

        option.value = String(i);

        option.textContent =
            `${translations[currentLanguage].class} ${i}`;

        classSelect.appendChild(option);
    }
}

function setRegistrationDate() {
    const today =
        new Date();

    registrationDateInput.value =
        today.toISOString().split("T")[0];
}

function updateStudentNumberPreview() {
    const stage =
        stageSelect.value;

    const classNumber =
        classSelect.value;

    if (!stage || !classNumber) {
        studentNumberInput.value = "";
        return;
    }

    const letters = {
        primary: "A",
        preparatory: "B",
        secondary: "C"
    };

    studentNumberInput.value =
        `${letters[stage]}${classNumber}XXX`;
}

async function registerStudent() {
    const t =
        translations[currentLanguage];

    const name =
        studentNameInput.value.trim();

    const academicYear =
        academicYearSelect.value;

    const stage =
        stageSelect.value;

    const classNumber =
        classSelect.value;

    const registrationDate =
        registrationDateInput.value;

    if (!name) {
        alert(t.studentNameRequired);
        studentNameInput.focus();
        return;
    }

    if (!stage) {
        alert(t.stageRequired);
        stageSelect.focus();
        return;
    }

    if (!classNumber) {
        alert(t.classRequired);
        classSelect.focus();
        return;
    }

    if (!registrationDate) {
        alert(t.registrationDateRequired);
        registrationDateInput.focus();
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = t.registering;

    try {
        const response =
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },
                body: JSON.stringify({
                    action: "addStudent",
                    institutionId:
                        activeInstitutionId,
                    username:
                        currentUser.username,
                    academicYear,
                    name,
                    stage,
                    classNumber,
                    registrationDate
                })
            });

        const result =
            await response.json();

        if (!result.success) {
            throw new Error(
                result.message || t.serverError
            );
        }

        alert(t.studentRegistered);

        window.location.href =
            "students.html?id=" +
            encodeURIComponent(
                activeInstitutionId
            );

    } catch (error) {
        alert(
            error.message ||
            t.serverError
        );

        registerButton.disabled = false;
        registerButton.textContent =
            t.registerStudent;
    }
}

stageSelect.addEventListener(
    "change",
    function() {
        loadClasses();
        updateStudentNumberPreview();
    }
);

classSelect.addEventListener(
    "change",
    updateStudentNumberPreview
);

academicYearSelect.addEventListener(
    "change",
    updateStudentNumberPreview
);

studentForm.addEventListener(
    "submit",
    function(event) {
        event.preventDefault();
        registerStudent();
    }
);

backButton.addEventListener(
    "click",
    function() {
        window.location.href =
            "students.html?id=" +
            encodeURIComponent(
                activeInstitutionId
            );
    }
);

cancelButton.addEventListener(
    "click",
    function() {
        window.location.href =
            "students.html?id=" +
            encodeURIComponent(
                activeInstitutionId
            );
    }
);

languageSelect.addEventListener(
    "change",
    function() {
        applyLanguage(
            languageSelect.value
        );
    }
);

loadAcademicYears();
setRegistrationDate();
applyLanguage(currentLanguage);
updateStudentNumberPreview();
