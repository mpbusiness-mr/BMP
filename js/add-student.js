const translations = {

    en: {
        language: "Language",
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
        studentRegistered: "Student registered successfully.",
        studentNameRequired: "Please enter the student name.",
        stageRequired: "Please select a stage.",
        classRequired: "Please select a class.",
        registrationDateRequired: "Please select the registration date.",
        studentExists: "A student with this number already exists."
    },

    ar: {
        language: "اللغة",
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
        studentRegistered: "تم تسجيل الطالب بنجاح.",
        studentNameRequired: "يرجى إدخال اسم الطالب.",
        stageRequired: "يرجى اختيار المرحلة الدراسية.",
        classRequired: "يرجى اختيار القسم.",
        registrationDateRequired: "يرجى اختيار تاريخ التسجيل.",
        studentExists: "يوجد طالب بهذا الرقم بالفعل."
    },

    fr: {
        language: "Langue",
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
        studentRegistered: "Élève inscrit avec succès.",
        studentNameRequired: "Veuillez saisir le nom de l'élève.",
        stageRequired: "Veuillez sélectionner le niveau.",
        classRequired: "Veuillez sélectionner la classe.",
        registrationDateRequired: "Veuillez sélectionner la date d'inscription.",
        studentExists: "Un élève avec ce numéro existe déjà."
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

    localStorage.removeItem("bmpCurrentUser");
    currentUser = null;

}


if (
    !currentUser ||
    !currentUser.institutionId ||
    (
        currentUser.role !== "Director" &&
        currentUser.role !== "Manager" &&
        currentUser.role !== "User"
    ) ||
    currentUser.status !== "active"
) {

    window.location.href = "school-login.html";

}


const urlParams =
    new URLSearchParams(window.location.search);

const institutionId =
    urlParams.get("id");


if (
    institutionId &&
    institutionId !== currentUser.institutionId
) {

    window.location.href =
        "school.html?id=" +
        encodeURIComponent(
            currentUser.institutionId
        );

}


const activeInstitutionId =
    currentUser.institutionId;


const institution = {

    id: currentUser.institutionId,

    type: currentUser.institutionType || "",

    name: currentUser.institutionName || "",

    phone: currentUser.institutionPhone || "",

    email: currentUser.institutionEmail || "",

    licenseStart: currentUser.licenseStart || "",

    licenseEnd: currentUser.licenseEnd || "",

    status: "active",

    sheetId: currentUser.sheetId || ""

};


if (
    !institution.id ||
    !institution.name
) {

    localStorage.removeItem("bmpCurrentUser");

    window.location.href =
        "school-login.html";

}


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


if (institutionIdElement) {
    institutionIdElement.textContent =
        institution.id;
}


if (institutionNameElement) {
    institutionNameElement.textContent =
        institution.name;
}


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

            if (
                translations[language][key]
            ) {

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

            if (
                translations[language][key]
            ) {

                element.placeholder =
                    translations[language][key];

            }

        });


    if (languageSelect) {
        languageSelect.value = language;
    }

}


function getStudents() {

    try {

        const students =
            JSON.parse(
                localStorage.getItem(
                    "bmpStudents"
                )
            );

        return Array.isArray(students)
            ? students
            : [];

    } catch (error) {

        return [];

    }

}


function saveStudents(students) {

    localStorage.setItem(
        "bmpStudents",
        JSON.stringify(students)
    );

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

        const option =
            document.createElement("option");

        option.value =
            `${year}-${String(year + 1).slice(-2)}`;

        option.textContent =
            option.value;

        academicYearSelect.appendChild(
            option
        );

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

    classSelect.appendChild(
        placeholder
    );


    let count = 0;

    if (stage === "primary") {
        count = 6;
    }

    if (stage === "preparatory") {
        count = 4;
    }

    if (stage === "secondary") {
        count = 3;
    }


    for (
        let i = 1;
        i <= count;
        i++
    ) {

        const option =
            document.createElement("option");

        option.value =
            String(i);

        option.textContent =
            `${translations[currentLanguage].class} ${i}`;

        classSelect.appendChild(
            option
        );

    }

}


function generateStudentNumber() {

    const academicYear =
        academicYearSelect.value;

    const stage =
        stageSelect.value;

    const classNumber =
        classSelect.value;

    if (
        !academicYear ||
        !stage ||
        !classNumber
    ) {

        studentNumberInput.value = "";

        return;

    }


    const stageLetters = {
        primary: "A",
        preparatory: "B",
        secondary: "C"
    };


    const letter =
        stageLetters[stage];

    const students =
        getStudents();


    const count =
        students.filter(function(student) {

            return (
                student.institutionId ===
                    activeInstitutionId &&

                student.academicYear ===
                    academicYear &&

                student.stage ===
                    stage &&

                String(
                    student.classNumber
                ) ===
                    String(classNumber)
            );

        }).length;


    const nextNumber =
        count + 1;


    studentNumberInput.value =
        `${letter}${classNumber}${String(
            nextNumber
        ).padStart(3, "0")}`;

}


function setRegistrationDate() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    registrationDateInput.value =
        `${year}-${month}-${day}`;

}


stageSelect.addEventListener(
    "change",
    function() {

        loadClasses();
        generateStudentNumber();

    }
);


classSelect.addEventListener(
    "change",
    function() {

        generateStudentNumber();

    }
);


academicYearSelect.addEventListener(
    "change",
    function() {

        generateStudentNumber();

    }
);


studentForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

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

            alert(
                t.registrationDateRequired
            );

            registrationDateInput.focus();

            return;

        }


        generateStudentNumber();


        const studentNumber =
            studentNumberInput.value;


        const students =
            getStudents();


        const duplicate =
            students.some(function(student) {

                return (
                    student.institutionId ===
                        activeInstitutionId &&

                    student.academicYear ===
                        academicYear &&

                    student.studentNumber ===
                        studentNumber
                );

            });


        if (duplicate) {

            alert(t.studentExists);

            return;

        }


        const student = {

            id:
                "STU-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8),

            institutionId:
                activeInstitutionId,

            academicYear:
                academicYear,

            studentNumber:
                studentNumber,

            name:
                name,

            stage:
                stage,

            classNumber:
                classNumber,

            className:
                `${t.class} ${classNumber}`,

            registrationDate:
                registrationDate,

            createdAt:
                new Date().toISOString()

        };


        students.push(student);

        saveStudents(students);


        if (
            typeof logActivity ===
            "function"
        ) {

            logActivity({

                institutionId:
                    activeInstitutionId,

                userId:
                    currentUser.id || "",

                username:
                    currentUser.username || "",

                role:
                    currentUser.role || "",

                action:
                    "Registered Student",

                details:
                    `${name} - ${studentNumber}`

            });

        }


        alert(t.studentRegistered);


        window.location.href =
            "students.html?id=" +
            encodeURIComponent(
                activeInstitutionId
            );

    }
);


function goBack() {

    window.location.href =
        "students.html?id=" +
        encodeURIComponent(
            activeInstitutionId
        );

}


if (backButton) {

    backButton.addEventListener(
        "click",
        goBack
    );

}


if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        goBack
    );

}


if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        function() {

            applyLanguage(
                languageSelect.value
            );

            loadClasses();
            generateStudentNumber();

        }
    );

}


loadAcademicYears();

setRegistrationDate();

applyLanguage(
    currentLanguage
);

loadClasses();

generateStudentNumber();
