const urlParams =
    new URLSearchParams(
        window.location.search
    );

const institutionId =
    urlParams.get("id");


/* Get institutions */

const institutions =
    JSON.parse(
        localStorage.getItem(
            "bmpInstitutions"
        )
    ) || [];


const institution =
    institutions.find(
        item =>
            item.id === institutionId
    );


/* Elements */

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


/* Check institution */

if (!institution) {

    alert(
        "School not found."
    );

    window.location.href =
        "institutions.html";

} else {

    initializePage();

}


/* Initialize page */

function initializePage() {

    institutionIdElement.textContent =
        institution.id || "-";

    institutionNameElement.textContent =
        institution.name || "-";


    loadAcademicYears();


    setTodayDate();

}


/* Load academic years */

function loadAcademicYears() {

    const currentYear =
        new Date().getFullYear();


    /*
        Show several academic years
        around the current year.
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


    /*
        Automatically select the
        current academic year.
    */

    academicYearInput.value =
        `${currentYear}-${currentYear + 1}`;

}


/* Set today's date */

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


/* Get students */

function getStudents() {

    return JSON.parse(
        localStorage.getItem(
            "bmpStudents"
        )
    ) || [];

}


/* Save students */

function saveStudents(
    students
) {

    localStorage.setItem(
        "bmpStudents",
        JSON.stringify(
            students
        )
    );

}


/* Get stage letter */

function getStageLetter(
    stage
) {

    if (
        stage ===
        "primary"
    ) {
        return "A";
    }

    if (
        stage ===
        "preparatory"
    ) {
        return "B";
    }

    if (
        stage ===
        "secondary"
    ) {
        return "C";
    }

    return "";

}


/* Load classes */

function loadClasses() {

    const selectedStage =
        stageInput.value;


    classInput.innerHTML = `
        <option value="">
            Select class
        </option>
    `;


    let numberOfClasses =
        0;


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
            `Class ${i}`;

        classInput.appendChild(
            option
        );

    }


    studentNumberInput.value =
        "";

}


/* Generate student number */

function generateStudentNumber() {

    const academicYear =
        academicYearInput.value;

    const stage =
        stageInput.value;

    const classNumber =
        classInput.value;


    if (
        academicYear === "" ||
        stage === "" ||
        classNumber === ""
    ) {

        studentNumberInput.value =
            "";

        return "";

    }


    const stageLetter =
        getStageLetter(
            stage
        );


    if (!stageLetter) {

        studentNumberInput.value =
            "";

        return "";

    }


    const students =
        getStudents();


    /*
        Count only students
        from the same:

        1. Institution
        2. Academic year
        3. Stage
        4. Class
    */

    const classStudents =
        students.filter(
            student =>

                student.institutionId ===
                    institution.id &&

                student.academicYear ===
                    academicYear &&

                student.stage ===
                    stage &&

                String(
                    student.classNumber
                ) ===
                    String(
                        classNumber
                    )
        );


    /*
        Registration order.

        First student = 001
        Second student = 002
        Third student = 003
    */

    const nextNumber =
        classStudents.length + 1;


    const formattedNumber =
        String(
            nextNumber
        ).padStart(
            3,
            "0"
        );


    /*
        Example:

        A + 1 + 001
        = A1001
    */

    const studentNumber =
        `${stageLetter}${classNumber}${formattedNumber}`;


    studentNumberInput.value =
        studentNumber;


    return studentNumber;

}


/* Academic year changed */

academicYearInput.addEventListener(
    "change",
    function () {

        generateStudentNumber();

    }
);


/* Stage changed */

stageInput.addEventListener(
    "change",
    function () {

        loadClasses();

    }
);


/* Class changed */

classInput.addEventListener(
    "change",
    function () {

        generateStudentNumber();

    }
);


/* Back */

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `students.html?id=${encodeURIComponent(
                institution.id
            )}`;

    }
);


/* Cancel */

cancelButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `students.html?id=${encodeURIComponent(
                institution.id
            )}`;

    }
);


/* Register student */

addStudentForm.addEventListener(
    "submit",
    function (event) {

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


        /* Validation */

        if (!academicYear) {

            alert(
                "Please select the academic year."
            );

            academicYearInput.focus();

            return;

        }


        if (!studentName) {

            alert(
                "Please enter the student name."
            );

            studentNameInput.focus();

            return;

        }


        if (!stage) {

            alert(
                "Please select the stage."
            );

            stageInput.focus();

            return;

        }


        if (!classNumber) {

            alert(
                "Please select the class."
            );

            classInput.focus();

            return;

        }


        if (!registrationDate) {

            alert(
                "Please select the registration date."
            );

            registrationDateInput.focus();

            return;

        }


        /*
            Generate the number again
            immediately before saving.
        */

        const studentNumber =
            generateStudentNumber();


        if (!studentNumber) {

            alert(
                "Unable to generate the student number."
            );

            return;

        }


        const students =
            getStudents();


        /*
            Check duplicate number
            inside this school and
            academic year.
        */

        const duplicate =
            students.some(
                student =>

                    student.institutionId ===
                        institution.id &&

                    student.academicYear ===
                        academicYear &&

                    student.studentNumber ===
                        studentNumber
            );


        if (duplicate) {

            alert(
                "This student number already exists. Please try again."
            );

            generateStudentNumber();

            return;

        }


        /* Create student */

        const newStudent = {

            id:
                "STU-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8),

            institutionId:
                institution.id,

            academicYear:
                academicYear,

            studentNumber:
                studentNumber,

            name:
                studentName,

            stage:
                stage,

            classNumber:
                classNumber,

            className:
                `Class ${classNumber}`,

            registrationDate:
                registrationDate,

            createdAt:
                new Date().toISOString()

        };


        /* Save */

        students.push(
            newStudent
        );

        saveStudents(
            students
        );


        /* Activity log */

        if (
            typeof logActivity ===
            "function"
        ) {

            logActivity({

                institutionId:
                    institution.id,

                userId:
                    "ADMIN",

                username:
                    "Admin",

                role:
                    "Admin",

                action:
                    "Registered Student",

                details:
                    `Registered student "${newStudent.name}" - ${newStudent.studentNumber} - Academic Year: ${newStudent.academicYear}`

            });

        }


        alert(
            `Student registered successfully.\n\nStudent Number: ${studentNumber}\nAcademic Year: ${academicYear}`
        );


        /* Return to students */

        window.location.href =
            `students.html?id=${encodeURIComponent(
                institution.id
            )}`;

    }
);
