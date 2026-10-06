// =====================================================
// Configuration
// =====================================================

const ADD_STUDENT_API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Authentication
// =====================================================

const currentUser = requireSchoolLogin();

if (!currentUser) {
    throw new Error("School login required.");
}


const institutionId =
    getActiveInstitutionId();

if (!institutionId) {
    throw new Error("Institution access denied.");
}


// =====================================================
// Institution
// =====================================================

const institution = {

    id:
        currentUser.institutionId || institutionId,

    type:
        currentUser.institutionType || "",

    name:
        currentUser.institutionName || "",

    phone:
        currentUser.institutionPhone || "",

    email:
        currentUser.institutionEmail || "",

    licenseStart:
        currentUser.licenseStart || "",

    licenseEnd:
        currentUser.licenseEnd || "",

    status:
        "active",

    sheetId:
        currentUser.sheetId || ""

};


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

const addStudentForm =
    document.getElementById(
        "addStudentForm"
    );

const studentNumberInput =
    document.getElementById(
        "studentNumber"
    );

const studentNameInput =
    document.getElementById(
        "studentName"
    );

const stageInput =
    document.getElementById(
        "stage"
    );

const classInput =
    document.getElementById(
        "className"
    );

const registrationDateInput =
    document.getElementById(
        "registrationDate"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const cancelButton =
    document.getElementById(
        "cancelButton"
    );

const languageSelect =
    document.getElementById(
        "languageSelect"
    );


// =====================================================
// Translations
// =====================================================

const translations = {

    en: {

        addStudent:
            "Add Student",

        registerNewStudent:
            "Register a new student",

        language:
            "Language",

        back:
            "Back",

        schoolInformation:
            "School Information",

        institutionId:
            "Institution ID",

        schoolName:
            "School Name",

        studentInformation:
            "Student Information",

        academicYear:
            "Academic Year",

        selectAcademicYear:
            "Select academic year",

        academicYearHelp:
            "The student number is generated separately for each academic year.",

        studentNumber:
            "Student Number",

        studentNumberPlaceholder:
            "Select academic year, stage and class",

        studentNumberHelp:
            "Automatically generated according to the academic year, stage, class and registration order.",

        studentName:
            "Student Name",

        studentNamePlaceholder:
            "Enter student name",

        stage:
            "Stage",

        selectStage:
            "Select stage",

        primary:
            "Primary",

        preparatory:
            "Preparatory",

        secondary:
            "Secondary",

        class:
            "Class",

        selectClass:
            "Select class",

        registrationDate:
            "Registration Date",

        cancel:
            "Cancel",

        registerStudent:
            "Register Student",

        classLabel:
            "Class",

        selectYear:
            "Please select the academic year.",

        enterName:
            "Please enter the student name.",

        selectStageError:
            "Please select the stage.",

        selectClassError:
            "Please select the class.",

        selectDate:
            "Please select the registration date.",

        generating:
            "Generating...",

        registering:
            "Registering student...",

        success:
            "Student registered successfully.",

        studentNumberMessage:
            "Student Number",

        academicYearMessage:
            "Academic Year",

        schoolNotFound:
            "School not found.",

        unableGenerate:
            "Unable to generate the student number.",

        unableConnect:
            "Unable to connect to server.",

        registrationFailed:
            "Student registration failed."

    },


    ar: {

        addStudent:
            "إضافة طالب",

        registerNewStudent:
            "تسجيل طالب جديد",

        language:
            "اللغة",

        back:
            "رجوع",

        schoolInformation:
            "معلومات المؤسسة",

        institutionId:
            "رقم المؤسسة",

        schoolName:
            "اسم المدرسة",

        studentInformation:
            "معلومات الطالب",

        academicYear:
            "السنة الدراسية",

        selectAcademicYear:
            "اختر السنة الدراسية",

        academicYearHelp:
            "يتم إنشاء رقم الطالب بشكل مستقل لكل سنة دراسية.",

        studentNumber:
            "رقم الطالب",

        studentNumberPlaceholder:
            "اختر السنة الدراسية والمرحلة والفصل",

        studentNumberHelp:
            "يتم إنشاء الرقم تلقائيًا حسب السنة الدراسية والمرحلة والفصل وترتيب التسجيل.",

        studentName:
            "اسم الطالب",

        studentNamePlaceholder:
            "أدخل اسم الطالب",

        stage:
            "المرحلة",

        selectStage:
            "اختر المرحلة",

        primary:
            "التعليم الأساسي",

        preparatory:
            "الإعدادية",

        secondary:
            "الثانوية",

        class:
            "الفصل",

        selectClass:
            "اختر الفصل",

        registrationDate:
            "تاريخ التسجيل",

        cancel:
            "إلغاء",

        registerStudent:
            "تسجيل الطالب",

        classLabel:
            "الفصل",

        selectYear:
            "يرجى اختيار السنة الدراسية.",

        enterName:
            "يرجى إدخال اسم الطالب.",

        selectStageError:
            "يرجى اختيار المرحلة.",

        selectClassError:
            "يرجى اختيار الفصل.",

        selectDate:
            "يرجى اختيار تاريخ التسجيل.",

        generating:
            "جارٍ إنشاء الرقم...",

        registering:
            "جارٍ تسجيل الطالب...",

        success:
            "تم تسجيل الطالب بنجاح.",

        studentNumberMessage:
            "رقم الطالب",

        academicYearMessage:
            "السنة الدراسية",

        schoolNotFound:
            "لم يتم العثور على المدرسة.",

        unableGenerate:
            "تعذر إنشاء رقم الطالب.",

        unableConnect:
            "تعذر الاتصال بالخادم.",

        registrationFailed:
            "فشل تسجيل الطالب."

    },


    fr: {

        addStudent:
            "Ajouter un élève",

        registerNewStudent:
            "Enregistrer un nouvel élève",

        language:
            "Langue",

        back:
            "Retour",

        schoolInformation:
            "Informations de l'établissement",

        institutionId:
            "ID de l'établissement",

        schoolName:
            "Nom de l'école",

        studentInformation:
            "Informations de l'élève",

        academicYear:
            "Année scolaire",

        selectAcademicYear:
            "Sélectionner l'année scolaire",

        academicYearHelp:
            "Le numéro de l'élève est généré séparément pour chaque année scolaire.",

        studentNumber:
            "Numéro de l'élève",

        studentNumberPlaceholder:
            "Sélectionnez l'année, le niveau et la classe",

        studentNumberHelp:
            "Généré automatiquement selon l'année scolaire, le niveau, la classe et l'ordre d'inscription.",

        studentName:
            "Nom de l'élève",

        studentNamePlaceholder:
            "Entrez le nom de l'élève",

        stage:
            "Niveau",

        selectStage:
            "Sélectionner le niveau",

        primary:
            "Primaire",

        preparatory:
            "Collège",

        secondary:
            "Secondaire",

        class:
            "Classe",

        selectClass:
            "Sélectionner la classe",

        registrationDate:
            "Date d'inscription",

        cancel:
            "Annuler",

        registerStudent:
            "Enregistrer l'élève",

        classLabel:
            "Classe",

        selectYear:
            "Veuillez sélectionner l'année scolaire.",

        enterName:
            "Veuillez entrer le nom de l'élève.",

        selectStageError:
            "Veuillez sélectionner le niveau.",

        selectClassError:
            "Veuillez sélectionner la classe.",

        selectDate:
            "Veuillez sélectionner la date d'inscription.",

        generating:
            "Génération...",

        registering:
            "Enregistrement de l'élève...",

        success:
            "Élève enregistré avec succès.",

        studentNumberMessage:
            "Numéro de l'élève",

        academicYearMessage:
            "Année scolaire",

        schoolNotFound:
            "École introuvable.",

        unableGenerate:
            "Impossible de générer le numéro de l'élève.",

        unableConnect:
            "Impossible de se connecter au serveur.",

        registrationFailed:
            "L'enregistrement de l'élève a échoué."

    }

};


// =====================================================
// Language
// =====================================================

let currentLanguage =
    localStorage.getItem(
        "bmpLanguage"
    ) || "en";


if (
    !translations[currentLanguage]
) {
    currentLanguage = "en";
}


function t(key) {

    return (
        translations[currentLanguage] &&
        translations[currentLanguage][key]
    ) || key;

}


function applyLanguage() {

    document.documentElement.lang =
        currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";


    if (languageSelect) {

        languageSelect.value =
            currentLanguage;

    }


    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(
            element => {

                const key =
                    element.getAttribute(
                        "data-i18n"
                    );

                if (
                    translations[currentLanguage][key]
                ) {

                    element.textContent =
                        translations[currentLanguage][key];

                }

            }
        );


    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach(
            element => {

                const key =
                    element.getAttribute(
                        "data-i18n-placeholder"
                    );

                if (
                    translations[currentLanguage][key]
                ) {

                    element.placeholder =
                        translations[currentLanguage][key];

                }

            }
        );


    loadClasses(false);

}


if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        function () {

            currentLanguage =
                this.value;

            localStorage.setItem(
                "bmpLanguage",
                currentLanguage
            );

            applyLanguage();

        }
    );

}


// =====================================================
// Check Institution
// =====================================================

if (
    !institution.id ||
    !institution.name
) {

    alert(
        t("schoolNotFound")
    );

    window.location.href =
        "school.html?id=" +
        encodeURIComponent(
            institutionId
        );

}
else {

    initializePage();

}


// =====================================================
// Initialize Page
// =====================================================

function initializePage() {

    institutionIdElement.textContent =
        institution.id || "-";

    institutionNameElement.textContent =
        institution.name || "-";


    applyLanguage();

    loadAcademicYears();

    setTodayDate();

}


// =====================================================
// Load Academic Years
// =====================================================

function loadAcademicYears() {

    const currentYear =
        new Date().getFullYear();


    academicYearInput.innerHTML = `
        <option value="" data-i18n="selectAcademicYear">
            ${t("selectAcademicYear")}
        </option>
    `;


    /*
        Current year - 1
        Current year
        Current year + 1
        Current year + 2
        Current year + 3
    */

    for (
        let i = -1;
        i <= 3;
        i++
    ) {

        const startYear =
            currentYear + i;

        const endYear =
            startYear + 1;

        const value =
            `${startYear}-${endYear}`;


        const option =
            document.createElement(
                "option"
            );

        option.value =
            value;

        option.textContent =
            value;

        academicYearInput.appendChild(
            option
        );

    }


    academicYearInput.value =
        `${currentYear}-${currentYear + 1}`;

}


// =====================================================
// Set Today's Date
// =====================================================

function setTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    registrationDateInput.value =
        `${year}-${month}-${day}`;

}


// =====================================================
// Get Stage Letter
// =====================================================

function getStageLetter(stage) {

    if (
        stage === "primary"
    ) {

        return "A";

    }


    if (
        stage === "preparatory"
    ) {

        return "B";

    }


    if (
        stage === "secondary"
    ) {

        return "C";

    }


    return "";

}


// =====================================================
// Load Classes
// =====================================================

function loadClasses(
    clearSelection = true
) {

    const selectedStage =
        stageInput.value;


    classInput.innerHTML = `
        <option value="">
            ${t("selectClass")}
        </option>
    `;


    let numberOfClasses = 0;


    if (
        selectedStage ===
        "primary"
    ) {

        numberOfClasses = 6;

    }
    else if (
        selectedStage ===
        "preparatory"
    ) {

        numberOfClasses = 4;

    }
    else if (
        selectedStage ===
        "secondary"
    ) {

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


        option.value =
            String(i);


        option.textContent =
            `${t("classLabel")} ${i}`;


        classInput.appendChild(
            option
        );

    }


    if (clearSelection) {

        studentNumberInput.value =
            "";

    }

}


// =====================================================
// Preview Student Number
// =====================================================

/*
    The final student number is generated
    by the backend.

    This function only clears the field
    until all required selections are made.
*/

function prepareStudentNumber() {

    const academicYear =
        academicYearInput.value;

    const stage =
        stageInput.value;

    const classNumber =
        classInput.value;


    if (
        !academicYear ||
        !stage ||
        !classNumber
    ) {

        studentNumberInput.value =
            "";

        return;

    }


    studentNumberInput.value =
        t("generating");

}


// =====================================================
// Academic Year Changed
// =====================================================

academicYearInput.addEventListener(
    "change",
    function () {

        prepareStudentNumber();

    }
);


// =====================================================
// Stage Changed
// =====================================================

stageInput.addEventListener(
    "change",
    function () {

        loadClasses();

    }
);


// =====================================================
// Class Changed
// =====================================================

classInput.addEventListener(
    "change",
    function () {

        prepareStudentNumber();

    }
);


// =====================================================
// Back
// =====================================================

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `students.html?id=${encodeURIComponent(
                institution.id
            )}`;

    }
);


// =====================================================
// Cancel
// =====================================================

cancelButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `students.html?id=${encodeURIComponent(
                institution.id
            )}`;

    }
);


// =====================================================
// Register Student
// =====================================================

addStudentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const academicYear =
            academicYearInput.value;

        const studentName =
            studentNameInput.value.trim();

        const stage =
            stageInput.value;

        const classNumber =
            classInput.value;

        const registrationDate =
            registrationDateInput.value;


        // -------------------------------------------------
        // Validation
        // -------------------------------------------------

        if (!academicYear) {

            alert(
                t("selectYear")
            );

            academicYearInput.focus();

            return;

        }


        if (!studentName) {

            alert(
                t("enterName")
            );

            studentNameInput.focus();

            return;

        }


        if (!stage) {

            alert(
                t("selectStageError")
            );

            stageInput.focus();

            return;

        }


        if (!classNumber) {

            alert(
                t("selectClassError")
            );

            classInput.focus();

            return;

        }


        if (!registrationDate) {

            alert(
                t("selectDate")
            );

            registrationDateInput.focus();

            return;

        }


        // -------------------------------------------------
        // Disable button during request
        // -------------------------------------------------

        const submitButton =
            addStudentForm.querySelector(
                'button[type="submit"]'
            );


        const originalButtonText =
            submitButton.textContent;


        submitButton.disabled =
            true;


        submitButton.textContent =
            t("registering");


        studentNumberInput.value =
            t("generating");


        // -------------------------------------------------
        // Backend Request
        // -------------------------------------------------

        try {

            const response =
                await fetch(
                    ADD_STUDENT_API_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body:
                            JSON.stringify({

                                action:
                                    "addStudent",

                                institutionId:
                                    institution.id,

                                username:
                                    currentUser.username,

                                academicYear:
                                    academicYear,

                                name:
                                    studentName,

                                stage:
                                    stage,

                                classNumber:
                                    classNumber,

                                registrationDate:
                                    registrationDate

                            })

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }


            const result =
                await response.json();


            // -------------------------------------------------
            // Backend Error
            // -------------------------------------------------

            if (
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    t("registrationFailed")
                );

            }


            // -------------------------------------------------
            // Success
            // -------------------------------------------------

            const registeredStudent =
                result.student || {};


            const finalStudentNumber =
                registeredStudent.studentNumber ||
                result.studentNumber ||
                "";


            studentNumberInput.value =
                finalStudentNumber;


            alert(
                `${t("success")}\n\n` +
                `${t("studentNumberMessage")}: ${finalStudentNumber}\n` +
                `${t("academicYearMessage")}: ${academicYear}`
            );


            // -------------------------------------------------
            // Return to Students
            // -------------------------------------------------

            window.location.href =
                `students.html?id=${encodeURIComponent(
                    institution.id
                )}`;

        }
        catch (error) {

            console.error(
                "Add student error:",
                error
            );


            studentNumberInput.value =
                "";


            if (
                error.message ===
                "Failed to fetch"
            ) {

                alert(
                    t("unableConnect")
                );

            }
            else {

                alert(
                    error.message ||
                    t("registrationFailed")
                );

            }

        }
        finally {

            submitButton.disabled =
                false;

            submitButton.textContent =
                originalButtonText;

        }

    }
);
