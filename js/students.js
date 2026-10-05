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


/* Check institution */

if (!institution) {

    alert(
        "School not found."
    );

    window.location.href =
        "institutions.html";

}
else {

    initializeStudents();

}


/* Initialize */

function initializeStudents() {

    pageTitle.textContent =
        "Students";


    pageSubtitle.textContent =
        `Manage students for ${institution.name}`;


    institutionIdElement.textContent =
        institution.id;


    institutionNameElement.textContent =
        institution.name;


    loadAcademicYearFilter();

    loadClassFilter();

    renderStudents();

}


/* Get students */

function getStudents() {

    return JSON.parse(
        localStorage.getItem(
            "bmpStudents"
        )
    ) || [];

}


/* Load academic years */

function loadAcademicYearFilter() {

    const students =
        getStudents();


    const institutionStudents =
        students.filter(
            student =>
                student.institutionId ===
                institution.id
        );


    const academicYears =
        [
            ...new Set(
                institutionStudents
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


    /*
        Sort newest academic year
        first.
    */

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


    /*
        Select current academic year
        if it exists.
    */

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


/* Load classes */

function loadClassFilter() {

    const stage =
        stageFilter.value;


    classFilter.innerHTML = `
        <option value="all">
            All Classes
        </option>
    `;


    let numberOfClasses =
        0;


    if (
        stage ===
        "primary"
    ) {

        numberOfClasses = 6;

    }
    else if (
        stage ===
        "preparatory"
    ) {

        numberOfClasses = 4;

    }
    else if (
        stage ===
        "secondary"
    ) {

        numberOfClasses = 3;

    }
    else {

        numberOfClasses = 6;

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


/* Render students */

function renderStudents() {

    const allStudents =
        getStudents();


    /*
        Only students belonging
        to this institution.
    */

    const institutionStudents =
        allStudents.filter(
            student =>
                student.institutionId ===
                institution.id
        );


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


    /*
        Apply filters.
    */

    const filteredStudents =
        institutionStudents.filter(
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


    /*
        Update total.
    */

    totalStudentsElement.textContent =
        filteredStudents.length;


    /*
        Clear table.
    */

    studentsTableBody.innerHTML =
        "";


    /*
        Empty state.
    */

    if (
        filteredStudents.length ===
        0
    ) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    /*
        Sort students by
        registration order.
    */

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


    /*
        Render rows.
    */

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


/* Format stage */

function formatStage(
    stage
) {

    if (
        stage ===
        "primary"
    ) {

        return "Primary";

    }


    if (
        stage ===
        "preparatory"
    ) {

        return "Preparatory";

    }


    if (
        stage ===
        "secondary"
    ) {

        return "Secondary";

    }


    return stage || "-";

}


/* Format date */

function formatDate(
    dateValue
) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(
            dateValue
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleDateString();

}


/* View student */

function viewStudent(
    studentId
) {

    window.location.href =
        `student.html?id=${encodeURIComponent(
            studentId
        )}&institutionId=${encodeURIComponent(
            institution.id
        )}`;

}


/* Edit student */

function editStudent(
    studentId
) {

    window.location.href =
        `edit-student.html?id=${encodeURIComponent(
            studentId
        )}&institutionId=${encodeURIComponent(
            institution.id
        )}`;

}


/* Add student */

function openAddStudent() {

    window.location.href =
        `add-student.html?id=${encodeURIComponent(
            institution.id
        )}`;

}


/* Events */

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


/* Escape HTML */

function escapeHtml(
    value
) {

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
