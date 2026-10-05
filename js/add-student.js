const urlParams =
    new URLSearchParams(
        window.location.search
    );

const institutionId =
    urlParams.get("id");


/* Get institutions */

const institutions =
    JSON.parse(
        localStorage.getItem("bmpInstitutions")
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


/* Initialize */

function initializePage() {

    institutionIdElement.textContent =
        institution.id || "-";

    institutionNameElement.textContent =
        institution.name || "-";


    /* Set today's date */

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


/* Get students */

function getStudents() {

    return JSON.parse(
        localStorage.getItem(
            "bmpStudents"
        )
    ) || [];

}


/* Save students */

function saveStudents(students) {

    localStorage.setItem(
        "bmpStudents",
        JSON.stringify(students)
    );

}


/* Stage letter */

function getStageLetter(stage) {

    if (stage === "primary") {
        return "A";
    }

    if (stage === "preparatory") {
        return "B";
    }

    if (stage === "secondary") {
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

    const stage =
        stageInput.value;

    const classNumber =
        classInput.value;


    if (
        stage === "" ||
        classNumber === ""
    ) {

        studentNumberInput.value =
            "";

        return "";

    }


    const stageLetter =
        getStageLetter(stage);


    if (!stageLetter) {

        return "";

    }


    const students =
        getStudents();


    /*
        Only count students
        from this school,
        this stage,
        and this class.
    */

    const classStudents =
        students.filter(
            student =>

                student.institutionId ===
                    institution.id &&

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
        Next sequence number.

        Example:

        0 students → 001
        1 student  → 002
        2 students → 003
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


    const studentNumber =
        `${stageLetter}${classNumber}${formattedNumber}`;


    studentNumberInput.value =
        studentNumber;


    return studentNumber;

}


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


        const studentName =
            studentNameInput.value.trim();

        const stage =
            stageInput.value;

        const classNumber =
            classInput.value;

        const registrationDate =
            registrationDateInput.value;


        /* Validation */

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
            Generate again immediately
            before saving.

            This prevents using
            an old displayed number.
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
            Final duplicate check
        */

        const duplicate =
            students.some(
                student =>

                    student.institutionId ===
                        institution.id &&

                    student.studentNumber ===
                        studentNumber
            );


        if (duplicate) {

            alert(
                "A student with this number already exists. Please try again."
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
                    `Registered student "${newStudent.name}" - Student Number: ${newStudent.studentNumber}`

            });

        }


        alert(
            `Student registered successfully.\n\nStudent Number: ${studentNumber}`
        );


        /* Return to students */

        window.location.href =
            `students.html?id=${encodeURIComponent(
                institution.id
            )}`;

    }
);
