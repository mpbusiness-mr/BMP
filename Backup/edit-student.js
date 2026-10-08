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
        academicYearReadonly:
            "The academic year cannot be changed after registration.",

        studentNumber: "Student Number",
        studentNumberReadonly:
            "The student number cannot be changed.",

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

        cancel: "Cancel",
        saveChanges: "Save Changes",

        loading: "Loading...",
        saving: "Saving...",

        studentNotFound: "Student not found.",
        institutionNotFound: "Institution not found.",

        completeFields:
            "Please complete all required fields.",

        networkError:
            "Unable to connect to the server. Please check your internet connection.",

        saveError:
            "Unable to update student information.",

        success:
            "Student information updated successfully.",

        serverError:
            "The server returned an invalid response.",

        loginRequired:
            "School login required."

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
        academicYearReadonly:
            "لا يمكن تغيير السنة الدراسية بعد تسجيل الطالب.",

        studentNumber: "رقم الطالب",
        studentNumberReadonly:
            "لا يمكن تغيير رقم الطالب.",

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

        cancel: "إلغاء",
        saveChanges: "حفظ التغييرات",

        loading: "جارٍ التحميل...",
        saving: "جارٍ الحفظ...",

        studentNotFound:
            "لم يتم العثور على الطالب.",

        institutionNotFound:
            "لم يتم العثور على المؤسسة.",

        completeFields:
            "يرجى إكمال جميع الحقول المطلوبة.",

        networkError:
            "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.",

        saveError:
            "تعذر تحديث معلومات الطالب.",

        success:
            "تم تحديث معلومات الطالب بنجاح.",

        serverError:
            "أعاد الخادم استجابة غير صالحة.",

        loginRequired:
            "يجب تسجيل الدخول إلى المؤسسة."

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
        academicYearReadonly:
            "L'année scolaire ne peut pas être modifiée après l'inscription.",

        studentNumber: "Numéro de l'élève",
        studentNumberReadonly:
            "Le numéro de l'élève ne peut pas être modifié.",

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

        cancel: "Annuler",
        saveChanges: "Enregistrer",

        loading: "Chargement...",
        saving: "Enregistrement...",

        studentNotFound:
            "Élève introuvable.",

        institutionNotFound:
            "Établissement introuvable.",

        completeFields:
            "Veuillez remplir tous les champs obligatoires.",

        networkError:
            "Impossible de contacter le serveur. Vérifiez votre connexion Internet.",

        saveError:
            "Impossible de mettre à jour les informations de l'élève.",

        success:
            "Les informations de l'élève ont été mises à jour avec succès.",

        serverError:
            "Le serveur a renvoyé une réponse invalide.",

        loginRequired:
            "Connexion à l'établissement requise."

    }

};


// =====================================================
// Language
// =====================================================

let currentLanguage =
    localStorage.getItem("bmpLanguage") || "en";


function t(key) {

    return (
        translations[currentLanguage] &&
        translations[currentLanguage][key]
    ) ||
    translations.en[key] ||
    key;

}


function applyLanguage() {

    const html =
        document.documentElement;

    html.lang =
        currentLanguage;

    html.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";


    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            element.textContent =
                t(key);

        });


    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {

            const key =
                element.dataset.i18nPlaceholder;

            element.placeholder =
                t(key);

        });


    if (languageSelect) {

        languageSelect.value =
            currentLanguage;

    }


    if (stageSelect && classSelect) {

        loadClasses(
            classSelect.value
        );

    }

}


// =====================================================
// Authentication
// =====================================================

const currentUser =
    requireSchoolLogin();


if (!currentUser) {

    alert(t("loginRequired"));

    throw new Error(
        "School login required."
    );

}


// =====================================================
// Institution
// =====================================================

const institutionId =
    getActiveInstitutionId();


if (!institutionId) {

    alert(
        t("institutionNotFound")
    );

    throw new Error(
        "Institution access denied."
    );

}


// =====================================================
// Student ID
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const studentId =
    urlParams.get("id");


if (!studentId) {

    alert(
        t("studentNotFound")
    );

    window.location.href =
        `students.html?id=${encodeURIComponent(
            institutionId
        )}`;

    throw new Error(
        "Student ID missing."
    );

}


// =====================================================
// Elements
// =====================================================

const institutionIdElement =
    document.getElementById(
        "institutionId"
    );

const institutionNameElement =
    document.getElementById(
        "institutionName"
    );

const academicYearInput =
    document.getElementById(
        "academicYear"
    );

const studentNumberInput =
    document.getElementById(
        "studentNumber"
    );

const studentNameInput =
    document.getElementById(
        "studentName"
    );

const stageSelect =
    document.getElementById(
        "stage"
    );

const classSelect =
    document.getElementById(
        "className"
    );

const registrationDateInput =
    document.getElementById(
        "registrationDate"
    );

const editStudentForm =
    document.getElementById(
        "editStudentForm"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const cancelButton =
    document.getElementById(
        "cancelButton"
    );

const saveButton =
    document.getElementById(
        "saveButton"
    );

const languageSelect =
    document.getElementById(
        "languageSelect"
    );


// =====================================================
// Load Classes
// =====================================================

function loadClasses(
    selectedClass = ""
) {

    if (!stageSelect || !classSelect) {

        return;

    }


    const stage =
        String(
            stageSelect.value || ""
        )
        .trim()
        .toLowerCase();


    classSelect.innerHTML = "";


    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        t("selectClass");

    classSelect.appendChild(
        defaultOption
    );


    let numberOfClasses = 0;


    if (stage === "primary") {

        numberOfClasses = 6;

    }

    else if (stage === "preparatory") {

        numberOfClasses = 4;

    }

    else if (stage === "secondary") {

        numberOfClasses = 3;

    }


    for (
        let i = 1;
        i <= numberOfClasses;
        i++
    ) {

        const option =
            document.createElement(
                "option"
            );

        option.value = i;

        option.textContent =
            `${t("class")} ${i}`;


        if (
            String(i) ===
            String(selectedClass)
        ) {

            option.selected =
                true;

        }


        classSelect.appendChild(
            option
        );

    }

}


// =====================================================
// API Request
// =====================================================

async function apiRequest(payload) {

    const response =
        await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(payload)
            }
        );


    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}`
        );

    }


    const text =
        await response.text();


    if (!text) {

        throw new Error(
            "Empty server response."
        );

    }


    let result;


    try {

        result =
            JSON.parse(text);

    }

    catch (error) {

        console.error(
            "Invalid server response:",
            text
        );

        throw new Error(
            "Invalid JSON response."
        );

    }


    return result;

}


// =====================================================
// Load Student
// =====================================================

async function loadStudent() {

    try {

        const result =
            await apiRequest({

                action:
                    "getStudents",

                institutionId:
                    institutionId,

                username:
                    currentUser.username

            });


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result &&
                result.message
                    ? result.message
                    : t("studentNotFound")
            );

        }


        const students =
            Array.isArray(
                result.students
            )
                ? result.students
                : [];


        const student =
            students.find(
                item =>
                    String(
                        item.studentId
                    ) ===
                    String(studentId)
            );


        if (!student) {

            alert(
                t("studentNotFound")
            );

            goBackToStudents();

            return;

        }


        displayStudent(
            student
        );

    }

    catch (error) {

        console.error(
            "Load student error:",
            error
        );


        if (
            error instanceof TypeError &&
            error.message
                .toLowerCase()
                .includes("fetch")
        ) {

            alert(
                t("networkError")
            );

        }

        else {

            alert(
                error.message ||
                t("studentNotFound")
            );

        }

    }

}


// =====================================================
// Normalize Stage
// =====================================================

function normalizeStage(value) {

    const stage =
        String(
            value || ""
        )
        .trim()
        .toLowerCase();


    if (
        stage === "primary" ||
        stage === "primary education" ||
        stage === "الابتدائية" ||
        stage === "ابتدائي"
    ) {

        return "primary";

    }


    if (
        stage === "preparatory" ||
        stage === "preparatory education" ||
        stage === "الإعدادية" ||
        stage === "إعدادي"
    ) {

        return "preparatory";

    }


    if (
        stage === "secondary" ||
        stage === "secondary education" ||
        stage === "الثانوية" ||
        stage === "ثانوي"
    ) {

        return "secondary";

    }


    return stage;

}


// =====================================================
// Display Student
// =====================================================

function displayStudent(student) {

    institutionIdElement.textContent =
        currentUser.institutionId ||
        institutionId ||
        "—";


    institutionNameElement.textContent =
        currentUser.institutionName ||
        currentUser.name ||
        "—";


    academicYearInput.value =
        student.academicYear || "";


    studentNumberInput.value =
        student.studentNumber || "";


    studentNameInput.value =
        student.name || "";


    const normalizedStage =
        normalizeStage(
            student.stage
        );


    stageSelect.value =
        normalizedStage;


    loadClasses(
        student.classNumber ||
        student.class ||
        ""
    );


    registrationDateInput.value =
        normalizeDate(
            student.registrationDate
        );

}


// =====================================================
// Date Normalization
// =====================================================

function normalizeDate(value) {

    if (!value) {

        return "";

    }


    const stringValue =
        String(value);


    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            stringValue
        )
    ) {

        return stringValue;

    }


    const date =
        new Date(stringValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// =====================================================
// Save Changes
// =====================================================

async function saveChanges() {

    const updatedName =
        studentNameInput.value.trim();


    const updatedStage =
        normalizeStage(
            stageSelect.value
        );


    const updatedClassNumber =
        classSelect.value;


    const updatedRegistrationDate =
        registrationDateInput.value;


    if (
        !updatedName ||
        !updatedStage ||
        !updatedClassNumber ||
        !updatedRegistrationDate
    ) {

        alert(
            t("completeFields")
        );

        return;

    }


    saveButton.disabled =
        true;

    saveButton.textContent =
        t("saving");


    try {

        const result =
            await apiRequest({

                action:
                    "updateStudent",

                institutionId:
                    institutionId,

                username:
                    currentUser.username,

                studentId:
                    studentId,

                name:
                    updatedName,

                stage:
                    updatedStage,

                classNumber:
                    Number(
                        updatedClassNumber
                    ),

                registrationDate:
                    updatedRegistrationDate

            });


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result &&
                result.message
                    ? result.message
                    : t("saveError")
            );

        }


        alert(
            t("success")
        );


        goBackToStudent();

    }

    catch (error) {

        console.error(
            "Update student error:",
            error
        );


        if (
            error instanceof TypeError &&
            error.message
                .toLowerCase()
                .includes("fetch")
        ) {

            alert(
                t("networkError")
            );

        }

        else {

            alert(
                error.message ||
                t("saveError")
            );

        }


        saveButton.disabled =
            false;

        saveButton.textContent =
            t("saveChanges");

    }

}


// =====================================================
// Navigation
// =====================================================

function goBackToStudent() {

    window.location.href =
        `student.html?id=${encodeURIComponent(
            studentId
        )}&institutionId=${encodeURIComponent(
            institutionId
        )}`;

}


function goBackToStudents() {

    window.location.href =
        `students.html?id=${encodeURIComponent(
            institutionId
        )}`;

}


// =====================================================
// Events
// =====================================================

if (stageSelect) {

    stageSelect.addEventListener(
        "change",
        function () {

            loadClasses();

        }
    );

}


if (editStudentForm) {

    editStudentForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            saveChanges();

        }
    );

}


if (backButton) {

    backButton.addEventListener(
        "click",
        goBackToStudent
    );

}


if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        goBackToStudent
    );

}


if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        function() {

            currentLanguage =
                languageSelect.value;

            localStorage.setItem(
                "bmpLanguage",
                currentLanguage
            );

            applyLanguage();

        }
    );

}


// =====================================================
// Initialize
// =====================================================

applyLanguage();

loadStudent();
