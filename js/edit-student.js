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
// Student ID
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const studentId =
    urlParams.get("id");


/* ================================
   Elements
================================ */

const institutionIdElement =
    document.getElementById("institutionId");

const institutionNameElement =
    document.getElementById("institutionName");

const academicYearInput =
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

const editStudentForm =
    document.getElementById("editStudentForm");

const backButton =
    document.getElementById("backButton");

const cancelButton =
    document.getElementById("cancelButton");


/* ================================
   Get Data
================================ */

function getInstitutions() {

    return JSON.parse(
        localStorage.getItem("bmpInstitutions")
    ) || [];

}


function getStudents() {

    return JSON.parse(
        localStorage.getItem("bmpStudents")
    ) || [];

}


function saveStudents(students) {

    localStorage.setItem(
        "bmpStudents",
        JSON.stringify(students)
    );

}


/* ================================
   Find Institution
================================ */

const institutions =
    getInstitutions();

const institution =
    institutions.find(
        item => item.id === institutionId
    );


if (!institution) {

    alert("Institution not found.");

    window.location.href =
        "institutions.html";

}


/* ================================
   Find Student
================================ */

let students =
    getStudents();

const studentIndex =
    students.findIndex(
        student =>
            student.id === studentId &&
            student.institutionId === institutionId
    );


if (studentIndex === -1) {

    alert("Student not found.");

    window.location.href =
        `students.html?id=${encodeURIComponent(
            institutionId
        )}`;

}


const student =
    students[studentIndex];


/* ================================
   Display Institution
================================ */

institutionIdElement.textContent =
    institution.id;

institutionNameElement.textContent =
    institution.name;


/* ================================
   Load Classes
================================ */

function loadClasses(
    selectedClass = ""
) {

    const stage =
        stageSelect.value;

    classSelect.innerHTML = `
        <option value="">
            Select class
        </option>
    `;


    let numberOfClasses = 0;


    if (stage === "primary") {

        numberOfClasses = 6;

    } else if (stage === "preparatory") {

        numberOfClasses = 4;

    } else if (stage === "secondary") {

        numberOfClasses = 3;

    }


    for (
        let i = 1;
        i <= numberOfClasses;
        i++
    ) {

        const option =
            document.createElement("option");

        option.value = i;

        option.textContent =
            `Class ${i}`;

        if (
            String(i) ===
            String(selectedClass)
        ) {

            option.selected = true;

        }

        classSelect.appendChild(
            option
        );

    }

}


/* ================================
   Fill Student Data
================================ */

academicYearInput.value =
    student.academicYear || "";

studentNumberInput.value =
    student.studentNumber || "";

studentNameInput.value =
    student.name || "";

stageSelect.value =
    student.stage || "";

registrationDateInput.value =
    student.registrationDate || "";

loadClasses(
    student.classNumber
);


/* ================================
   Stage Change
================================ */

stageSelect.addEventListener(
    "change",
    function () {

        loadClasses();

    }
);


/* ================================
   Save Changes
================================ */

editStudentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const updatedName =
            studentNameInput.value.trim();

        const updatedStage =
            stageSelect.value;

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
                "Please complete all required fields."
            );

            return;

        }


        /*
           Academic year and student number
           remain unchanged.
        */

        const oldStudent =
            students[studentIndex];


        students[studentIndex] = {

            ...oldStudent,

            name:
                updatedName,

            stage:
                updatedStage,

            classNumber:
                Number(updatedClassNumber),

            className:
                `Class ${updatedClassNumber}`,

            registrationDate:
                updatedRegistrationDate,

            updatedAt:
                new Date().toISOString()

        };


        saveStudents(students);


        /* ============================
           Activity Log
        ============================ */

        if (
            typeof logActivity ===
            "function"
        ) {

            logActivity({

                institutionId:
                    institutionId,

                userId:
                    "ADMIN",

                username:
                    "Admin",

                role:
                    "Admin",

                action:
                    "Edited Student",

                details:
                    `Student ${updatedName} edited. Student Number: ${oldStudent.studentNumber}. Academic Year: ${oldStudent.academicYear}.`

            });

        }


        alert(
            "Student information updated successfully."
        );


        window.location.href =
            `student.html?id=${encodeURIComponent(
                studentId
            )}&institutionId=${encodeURIComponent(
                institutionId
            )}`;

    }
);


/* ================================
   Navigation
================================ */

function goBackToStudent() {

    window.location.href =
        `student.html?id=${encodeURIComponent(
            studentId
        )}&institutionId=${encodeURIComponent(
            institutionId
        )}`;

}


backButton.addEventListener(
    "click",
    goBackToStudent
);


cancelButton.addEventListener(
    "click",
    goBackToStudent
);
