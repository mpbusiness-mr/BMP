// =====================================================
// BMP Students Management
// =====================================================


// Get institution ID from URL
const urlParams =
    new URLSearchParams(
        window.location.search
    );

const institutionId =
    urlParams.get("id");


// Get institutions
const institutions =
    JSON.parse(
        localStorage.getItem("bmpInstitutions")
    ) || [];


// Find institution
const institution =
    institutions.find(
        item =>
            item.id === institutionId
    );


// =====================================================
// Elements
// =====================================================

const pageTitle =
    document.getElementById("pageTitle");

const pageSubtitle =
    document.getElementById("pageSubtitle");

const institutionIdElement =
    document.getElementById("institutionId");

const institutionNameElement =
    document.getElementById("institutionName");

const totalStudentsElement =
    document.getElementById("totalStudents");

const searchStudent =
    document.getElementById("searchStudent");

const stageFilter =
    document.getElementById("stageFilter");

const classFilter =
    document.getElementById("classFilter");

const studentsTableBody =
    document.getElementById("studentsTableBody");

const emptyState =
    document.getElementById("emptyState");

const addStudentButton =
    document.getElementById("addStudentButton");

const emptyAddStudentButton =
    document.getElementById(
        "emptyAddStudentButton"
    );

const backButton =
    document.getElementById("backButton");


// =====================================================
// Check Institution
// =====================================================

if (!institution) {

    alert("School not found.");

    window.location.href =
        "institutions.html";

} else {

    initializeStudents();
}


// =====================================================
// Initialize
// =====================================================

function initializeStudents() {

    pageTitle.textContent =
        "Students";


    pageSubtitle.textContent =
        `Manage students for ${institution.name}`;


    institutionIdElement.textContent =
        institution.id;


    institutionNameElement.textContent =
        institution.name;


    loadClassFilter();

    renderStudents();
}


// =====================================================
// Get Students
// =====================================================

function getStudents() {

    return JSON.parse(
        localStorage.getItem("bmpStudents")
    ) || [];
}


// =====================================================
// Save Students
// =====================================================

function saveStudents(students) {

    localStorage.setItem(
        "bmpStudents",
        JSON.stringify(students)
    );
}


// =====================================================
// Load Classes
// =====================================================

function loadClassFilter() {

    const stage =
        stageFilter.value;


    classFilter.innerHTML = `
        <option value="all">
            All Classes
        </option>
    `;


    let classes = [];


    if (stage === "primary") {

        classes = [
            "Class 1",
            "Class 2",
            "Class 3",
            "Class 4",
            "Class 5",
            "Class 6"
        ];

    }

    else if (stage === "preparatory") {

        classes = [
            "Class 1",
            "Class 2",
            "Class 3",
            "Class 4"
        ];

    }

    else if (stage === "secondary") {

        classes = [
            "Class 1",
            "Class 2",
            "Class 3"
        ];

    }

    else {

        classes = [
            "Class 1",
            "Class 2",
            "Class 3",
            "Class 4",
            "Class 5",
            "Class 6"
        ];
    }


    classes.forEach(
        className => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                className;


            option.textContent =
                className;


            classFilter.appendChild(
                option
            );
        }
    );
}


// =====================================================
// Render Students
// =====================================================

function renderStudents() {

    const allStudents =
        getStudents();


    // Only students belonging to this school
    const institutionStudents =
        allStudents.filter(
            student =>
                student.institutionId ===
                institution.id
        );


    // Update total
    totalStudentsElement.textContent =
        institutionStudents.length;


    const searchValue =
        searchStudent.value
            .trim()
            .toLowerCase();


    const selectedStage =
        stageFilter.value;


    const selectedClass =
        classFilter.value;


    const filteredStudents =
        institutionStudents.filter(
            student => {

                const studentName =
                    String(
                        student.name || ""
                    ).toLowerCase();


                const studentNumber =
                    String(
                        student.studentNumber || ""
                    ).toLowerCase();


                const matchesSearch =
                    studentName.includes(
                        searchValue
                    ) ||
                    studentNumber.includes(
                        searchValue
                    );


                const matchesStage =
                    selectedStage === "all" ||
                    student.stage === selectedStage;


                const matchesClass =
                    selectedClass === "all" ||
                    student.className === selectedClass;


                return (
                    matchesSearch &&
                    matchesStage &&
                    matchesClass
                );
            }
        );


    studentsTableBody.innerHTML = "";


    // Empty state
    if (filteredStudents.length === 0) {

        emptyState.style.display =
            "block";

        return;
    }


    emptyState.style.display =
        "none";


    // Render rows
    filteredStudents.forEach(
        student => {

            const row =
                document.createElement("tr");


            const registrationDate =
                student.registrationDate
                    ? new Date(
                        student.registrationDate
                    ).toLocaleDateString()
                    : "-";


            const stageName =
                formatStage(
                    student.stage
                );


            row.innerHTML = `

                <td>
                    <span class="student-number">
                        ${escapeHtml(
                            student.studentNumber || "-"
                        )}
                    </span>
                </td>

                <td>
                    <span class="student-name">
                        ${escapeHtml(
                            student.name || "-"
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
                            student.className || "-"
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
                        onclick="viewStudent('${student.id}')">
                        View
                    </button>

                    <button
                        class="table-action"
                        onclick="editStudent('${student.id}')">
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
// Format Stage
// =====================================================

function formatStage(stage) {

    if (stage === "primary") {
        return "Primary";
    }


    if (stage === "preparatory") {
        return "Preparatory";
    }


    if (stage === "secondary") {
        return "Secondary";
    }


    return stage || "-";
}


// =====================================================
// View Student
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
// Edit Student
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
// Add Student
// =====================================================

function openAddStudent() {

    window.location.href =
        `add-student.html?id=${encodeURIComponent(
            institution.id
        )}`;
}


addStudentButton.addEventListener(
    "click",
    openAddStudent
);


emptyAddStudentButton.addEventListener(
    "click",
    openAddStudent
);


// =====================================================
// Search
// =====================================================

searchStudent.addEventListener(
    "input",
    renderStudents
);


// =====================================================
// Stage Filter
// =====================================================

stageFilter.addEventListener(
    "change",
    function () {

        loadClassFilter();

        renderStudents();
    }
);


// =====================================================
// Class Filter
// =====================================================

classFilter.addEventListener(
    "change",
    renderStudents
);


// =====================================================
// Back
// =====================================================

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
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
