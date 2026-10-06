// =====================================================
// Students
// =====================================================

const STUDENTS_API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Authentication
// =====================================================

const currentUser =
    requireSchoolLogin();

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
        currentUser.institutionId || "",

    name:
        currentUser.institutionName || "",

    phone:
        currentUser.institutionPhone || "",

    email:
        currentUser.institutionEmail || ""

};


if (
    institution.id !==
    institutionId
) {

    alert("Institution access denied.");

    window.location.href =
        "school-login.html";

}


// =====================================================
// Elements
// =====================================================

const pageTitle =
    document.getElementById(
        "pageTitle"
    );

const pageSubtitle =
    document.getElementById(
        "pageSubtitle"
    );

const institutionIdElement =
    document.getElementById(
        "institutionId"
    );

const institutionNameElement =
    document.getElementById(
        "institutionName"
    );

const totalStudentsElement =
    document.getElementById(
        "totalStudents"
    );

const academicYearFilter =
    document.getElementById(
        "academicYearFilter"
    );

const searchStudent =
    document.getElementById(
        "searchStudent"
    );

const stageFilter =
    document.getElementById(
        "stageFilter"
    );

const classFilter =
    document.getElementById(
        "classFilter"
    );

const studentsTableBody =
    document.getElementById(
        "studentsTableBody"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const addStudentButton =
    document.getElementById(
        "addStudentButton"
    );

const emptyAddStudentButton =
    document.getElementById(
        "emptyAddStudentButton"
    );

const backButton =
    document.getElementById(
        "backButton"
    );


// =====================================================
// Students data
// =====================================================

let students = [];


// =====================================================
// Initialize
// =====================================================

initializeStudents();


async function initializeStudents() {

    pageTitle.textContent =
        "Students";


    pageSubtitle.textContent =
        `Manage students for ${institution.name}`;


    institutionIdElement.textContent =
        institution.id;


    institutionNameElement.textContent =
        institution.name;


    loadClassFilter();


    await loadStudents();

}


// =====================================================
// Load students from Backend
// =====================================================

async function loadStudents() {

    studentsTableBody.innerHTML = "";

    totalStudentsElement.textContent = "0";


    try {

        const response =
            await fetch(
                STUDENTS_API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        action:
                            "getStudents",

                        institutionId:
                            institution.id,

                        username:
                            currentUser.username

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Server connection failed."
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to load students."
            );

        }


        students =
            (result.students || [])
                .map(normalizeStudent);


        loadAcademicYearFilter();

        renderStudents();


    }
    catch (error) {

        console.error(
            "Students loading error:",
            error
        );


        students = [];

        renderStudents();


        alert(
            error.message ||
            "Unable to load students."
        );

    }

}


// =====================================================
// Normalize student data
// =====================================================

function normalizeStudent(student) {

    return {

        id:
            student.studentId || "",

        studentNumber:
            student.studentNumber || "",

        academicYear:
            student.academicYear || "",

        name:
            student.name || "",

        stage:
            student.stage || "",

        classNumber:
            student.class ||
            student.classNumber ||
            "",

        className:
            student.class
                ? `Class ${student.class}`
                : "",

        registrationDate:
            student.createdAt || ""

    };

}


// =====================================================
// Load academic years
// =====================================================

function loadAcademicYearFilter() {

    const academicYears =
        [
            ...new Set(
                students
                    .map(
                        student =>
                            student.academicYear
                    )
                    .filter(
                        year =>
                            year
                    )
            )
        ];


    academicYears.sort(
        function (
            a,
            b
        ) {

            return (
                Number(
                    b.split("-")[0]
                ) -
                Number(
                    a.split("-")[0]
                )
            );

        }
    );


    academicYearFilter.innerHTML = `

        <option value="all">
            All Academic Years
        </option>

    `;


    academicYears.forEach(
        year => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                year;


            option.textContent =
                year;


            academicYearFilter.appendChild(
                option
            );

        }
    );


    const currentYear =
        new Date().getFullYear();


    const currentAcademicYear =
        `${currentYear}-${currentYear + 1}`;


    if (
        academicYears.includes(
            currentAcademicYear
        )
    ) {

        academicYearFilter.value =
            currentAcademicYear;

    }

}


// =====================================================
// Load classes
// =====================================================

function loadClassFilter() {

    const stage =
        stageFilter.value;


    classFilter.innerHTML = `

        <option value="all">
            All Classes
        </option>

    `;


    let numberOfClasses = 6;


    if (
        stage === "primary"
    ) {

        numberOfClasses = 6;

    }
    else if (
        stage === "preparatory"
    ) {

        numberOfClasses = 4;

    }
    else if (
        stage === "secondary"
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


        classFilter.appendChild(
            option
        );

    }

}


// =====================================================
// Render students
// =====================================================

function renderStudents() {

    const selectedAcademicYear =
        academicYearFilter.value;


    const selectedStage =
        stageFilter.value;


    const selectedClass =
        classFilter.value;


    const searchValue =
        searchStudent.value
            .trim()
            .toLowerCase();


    const filteredStudents =
        students.filter(
            student => {


                const studentName =
                    String(
                        student.name ||
                        ""
                    ).toLowerCase();


                const studentNumber =
                    String(
                        student.studentNumber ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    studentName.includes(
                        searchValue
                    ) ||
                    studentNumber.includes(
                        searchValue
                    );


                const matchesAcademicYear =
                    selectedAcademicYear ===
                        "all" ||
                    student.academicYear ===
                        selectedAcademicYear;


                const matchesStage =
                    selectedStage ===
                        "all" ||
                    student.stage ===
                        selectedStage;


                const matchesClass =
                    selectedClass ===
                        "all" ||
                    String(
                        student.classNumber
                    ) ===
                        String(
                            selectedClass
                        );


                return (

                    matchesSearch &&

                    matchesAcademicYear &&

                    matchesStage &&

                    matchesClass

                );

            }
        );


    totalStudentsElement.textContent =
        filteredStudents.length;


    studentsTableBody.innerHTML =
        "";


    if (
        filteredStudents.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    filteredStudents.sort(
        function (
            a,
            b
        ) {

            return (
                String(
                    a.studentNumber ||
                    ""
                ).localeCompare(
                    String(
                        b.studentNumber ||
                        ""
                    ),
                    undefined,
                    {
                        numeric: true
                    }
                )
            );

        }
    );


    filteredStudents.forEach(
        student => {

            const row =
                document.createElement(
                    "tr"
                );


            const registrationDate =
                student.registrationDate
                    ? formatDate(
                        student.registrationDate
                    )
                    : "-";


            const stageName =
                formatStage(
                    student.stage
                );


            const className =
                student.className ||
                (
                    student.classNumber
                        ? `Class ${student.classNumber}`
                        : "-"
                );


            row.innerHTML = `

                <td>

                    <span class="student-number">

                        ${escapeHtml(
                            student.studentNumber ||
                            "-"
                        )}

                    </span>

                </td>


                <td>

                    <span class="student-name">

                        ${escapeHtml(
                            student.name ||
                            "-"
                        )}

                    </span>

                </td>


                <td>

                    <span class="class-badge">

                        ${escapeHtml(
                            student.academicYear ||
                            "-"
                        )}

                    </span>

                </td>


                <td>

                    <span class="stage-badge">

                        ${escapeHtml(
                            stageName
                        )}

                    </span>

                </td>


                <td>

                    <span class="class-badge">

                        ${escapeHtml(
                            className
                        )}

                    </span>

                </td>


                <td>

                    ${escapeHtml(
                        registrationDate
                    )}

                </td>


                <td>

                    <button
                        class="table-action"
                        onclick="viewStudent('${escapeHtml(
                            student.id
                        )}')">

                        View

                    </button>


                    <button
                        class="table-action"
                        onclick="editStudent('${escapeHtml(
                            student.id
                        )}')">

                        Edit

                    </button>

                </td>

            `;


            studentsTableBody.appendChild(
                row
            );

        }
    );

}


// =====================================================
// Format stage
// =====================================================

function formatStage(stage) {

    if (
        stage === "primary"
    ) {
        return "Primary";
    }


    if (
        stage === "preparatory"
    ) {
        return "Preparatory";
    }


    if (
        stage === "secondary"
    ) {
        return "Secondary";
    }


    return stage || "-";

}


// =====================================================
// Format date
// =====================================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(dateValue);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleDateString();

}


// =====================================================
// View student
// =====================================================

function viewStudent(studentId) {

    window.location.href =
        `student.html?id=${encodeURIComponent(
            studentId
        )}&institutionId=${encodeURIComponent(
            institution.id
        )}`;

}


// =====================================================
// Edit student
// =====================================================

function editStudent(studentId) {

    window.location.href =
        `edit-student.html?id=${encodeURIComponent(
            studentId
        )}&institutionId=${encodeURIComponent(
            institution.id
        )}`;

}


// =====================================================
// Add student
// =====================================================

function openAddStudent() {

    window.location.href =
        `add-student.html?id=${encodeURIComponent(
            institution.id
        )}`;

}


// =====================================================
// Events
// =====================================================

addStudentButton.addEventListener(
    "click",
    openAddStudent
);


emptyAddStudentButton.addEventListener(
    "click",
    openAddStudent
);


academicYearFilter.addEventListener(
    "change",
    renderStudents
);


searchStudent.addEventListener(
    "input",
    renderStudents
);


stageFilter.addEventListener(
    "change",
    function () {

        loadClassFilter();

        renderStudents();

    }
);


classFilter.addEventListener(
    "change",
    renderStudents
);


backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `school.html?id=${encodeURIComponent(
                institution.id
            )}`;

    }
);


// =====================================================
// Escape HTML
// =====================================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
