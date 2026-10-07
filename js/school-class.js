// =====================================================
// BMP School Class Students
// =====================================================

// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDd_T6k0w0AWWK/exec";


// =====================================================
// Authentication
// =====================================================

const currentUser =
    requireSchoolLogin();

if (!currentUser) {
    throw new Error(
        "School login required."
    );
}

const institutionId =
    getActiveInstitutionId();

if (!institutionId) {
    throw new Error(
        "Institution access denied."
    );
}


// =====================================================
// URL Parameters
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const selectedStage =
    String(
        urlParams.get("stage") || ""
    ).trim();

const selectedClass =
    String(
        urlParams.get("class") || ""
    ).trim();


// =====================================================
// Months
// =====================================================

const months = [
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June"
];


// =====================================================
// Data
// =====================================================

let students = [];
let payments = [];

let schoolName =
    currentUser.institutionName ||
    "";


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

const academicYearFilter =
    document.getElementById(
        "academicYearFilter"
    );

const stageNameElement =
    document.getElementById(
        "stageName"
    );

const classNameElement =
    document.getElementById(
        "className"
    );

const studentCountElement =
    document.getElementById(
        "studentCount"
    );

const studentsTableBody =
    document.getElementById(
        "studentsTableBody"
    );

const monthFilter =
    document.getElementById(
        "monthFilter"
    );

const paymentStatusFilter =
    document.getElementById(
        "paymentStatusFilter"
    );

const printUnpaidButton =
    document.getElementById(
        "printUnpaidButton"
    );

const printSchoolName =
    document.getElementById(
        "printSchoolName"
    );

const printClassTitle =
    document.getElementById(
        "printClassTitle"
    );

const printPeriod =
    document.getElementById(
        "printPeriod"
    );

const printUnpaidBody =
    document.getElementById(
        "printUnpaidBody"
    );

const backButton =
    document.getElementById(
        "backButton"
    );


// =====================================================
// Stage Name
// =====================================================

function getStageName(
    stage
) {

    const names = {

        primary:
            "Primary Education",

        preparatory:
            "Preparatory Education",

        secondary:
            "Secondary Education"

    };

    return (
        names[
            String(
                stage || ""
            ).toLowerCase()
        ] ||
        stage ||
        "-"
    );

}


// =====================================================
// Current Academic Year
// =====================================================

function getCurrentAcademicYear() {

    const today =
        new Date();

    const month =
        today.getMonth() + 1;

    const year =
        today.getFullYear();

    if (month >= 10) {

        return (
            `${year}-${year + 1}`
        );

    }

    return (
        `${year - 1}-${year}`
    );

}


// =====================================================
// API Call
// =====================================================

async function callApi(
    action
) {

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
                    JSON.stringify({

                        action:
                            action,

                        institutionId:
                            institutionId,

                        username:
                            currentUser.username

                    })
            }
        );

    if (!response.ok) {

        throw new Error(
            "Unable to connect to the server."
        );

    }

    return await response.json();

}


// =====================================================
// Load Class Data
// =====================================================

async function loadClassData() {

    if (
        !selectedStage ||
        !selectedClass
    ) {

        showError();

        alert(
            "Class information is missing."
        );

        return;

    }

    try {

        showLoading();


        // Students

        const studentsResult =
            await callApi(
                "getStudents"
            );

        if (
            !studentsResult.success
        ) {

            throw new Error(
                studentsResult.message ||
                "Failed to load students."
            );

        }


        students =
            Array.isArray(
                studentsResult.students
            )
                ? studentsResult.students
                : [];


        // Payments

        const paymentsResult =
            await callApi(
                "getPayments"
            );

        if (
            !paymentsResult.success
        ) {

            throw new Error(
                paymentsResult.message ||
                "Failed to load payments."
            );

        }


        payments =
            Array.isArray(
                paymentsResult.payments
            )
                ? paymentsResult.payments
                : [];


        // School information

        schoolName =
            currentUser.institutionName ||
            institutionId;


        updateHeader();
        loadAcademicYears();
        renderStudents();

    }

    catch (error) {

        console.error(
            "Class page error:",
            error
        );

        showError();

        alert(
            error.message ||
            "Failed to load class information."
        );

    }

}


// =====================================================
// Header
// =====================================================

function updateHeader() {

    const stageName =
        getStageName(
            selectedStage
        );

    if (pageTitle) {

        pageTitle.textContent =
            `${stageName} - Class ${selectedClass}`;

    }

    if (pageSubtitle) {

        pageSubtitle.textContent =
            "Student payment status";

    }

    if (institutionIdElement) {

        institutionIdElement.textContent =
            institutionId;

    }

    if (institutionNameElement) {

        institutionNameElement.textContent =
            schoolName ||
            "-";

    }

    if (stageNameElement) {

        stageNameElement.textContent =
            stageName;

    }

    if (classNameElement) {

        classNameElement.textContent =
            `${stageName} ${selectedClass}`;

    }

    document.title =
        `${stageName} - Class ${selectedClass}`;

}


// =====================================================
// Academic Years
// =====================================================

function loadAcademicYears() {

    if (!academicYearFilter) {
        return;
    }

    const years =
        [
            ...new Set(
                students
                    .map(
                        student =>
                            String(
                                student.academicYear ||
                                ""
                            ).trim()
                    )
                    .filter(
                        year =>
                            year !== ""
                    )
            )
        ]
        .sort(
            (
                a,
                b
            ) =>
                b.localeCompare(a)
        );


    academicYearFilter.innerHTML =
        "";


    const allOption =
        document.createElement(
            "option"
        );

    allOption.value = "";

    allOption.textContent =
        "All Academic Years";

    academicYearFilter.appendChild(
        allOption
    );


    years.forEach(
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
        getCurrentAcademicYear();


    if (
        years.includes(
            currentYear
        )
    ) {

        academicYearFilter.value =
            currentYear;

    } else {

        academicYearFilter.value =
            "";

    }

}


// =====================================================
// Get Class Students
// =====================================================

function getClassStudents() {

    return students.filter(
        student => {

            const stage =
                String(
                    student.stage ||
                    ""
                )
                .trim()
                .toLowerCase();


            const classNumber =
                String(
                    student.class ||
                    ""
                ).trim();


            if (
                stage !==
                selectedStage
                    .toLowerCase()
            ) {

                return false;

            }


            if (
                classNumber !==
                selectedClass
            ) {

                return false;

            }


            if (
                academicYearFilter &&
                academicYearFilter.value &&
                String(
                    student.academicYear ||
                    ""
                ).trim() !==
                academicYearFilter.value
            ) {

                return false;

            }


            return true;

        }
    );

}


// =====================================================
// Check Payment
// =====================================================

function isMonthPaid(
    studentId,
    academicYear,
    month
) {

    return payments.some(
        payment => {

            return (
                String(
                    payment.studentId ||
                    ""
                ) ===
                String(
                    studentId ||
                    ""
                ) &&

                String(
                    payment.academicYear ||
                    ""
                ) ===
                String(
                    academicYear ||
                    ""
                ) &&

                String(
                    payment.month ||
                    ""
                ) ===
                month
            );

        }
    );

}


// =====================================================
// Get Visible Students
// =====================================================

function getVisibleStudents() {

    const classStudents =
        getClassStudents();

    const selectedMonth =
        monthFilter
            ? monthFilter.value
            : "";

    const selectedStatus =
        paymentStatusFilter
            ? paymentStatusFilter.value
            : "";


    if (
        !selectedMonth &&
        !selectedStatus
    ) {

        return classStudents;

    }


    return classStudents.filter(
        student => {

            const studentId =
                student.studentId ||
                student.id ||
                "";

            const year =
                String(
                    student.academicYear ||
                    ""
                );


            // No month selected:
            // show students who have at least
            // one paid/unpaid month.

            if (
                !selectedMonth
            ) {

                if (
                    selectedStatus ===
                    "paid"
                ) {

                    return months.some(
                        month =>
                            isMonthPaid(
                                studentId,
                                year,
                                month
                            )
                    );

                }


                if (
                    selectedStatus ===
                    "unpaid"
                ) {

                    return months.some(
                        month =>
                            !isMonthPaid(
                                studentId,
                                year,
                                month
                            )
                    );

                }


                return true;

            }


            const paid =
                isMonthPaid(
                    studentId,
                    year,
                    selectedMonth
                );


            if (
                selectedStatus ===
                "paid"
            ) {

                return paid;

            }


            if (
                selectedStatus ===
                "unpaid"
            ) {

                return !paid;

            }


            return true;

        }
    );

}


// =====================================================
// Render Students
// =====================================================

function renderStudents() {

    if (!studentsTableBody) {
        return;
    }


    const visibleStudents =
        getVisibleStudents();


    if (studentCountElement) {

        studentCountElement.textContent =
            visibleStudents.length;

    }


    studentsTableBody.innerHTML =
        "";


    if (
        visibleStudents.length === 0
    ) {

        studentsTableBody.innerHTML = `
            <tr>

                <td
                    colspan="11"
                    class="empty-state">

                    No students match the selected filters.

                </td>

            </tr>
        `;

        return;

    }


    const sortedStudents =
        [...visibleStudents]
            .sort(
                (
                    a,
                    b
                ) =>
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
                            numeric:
                                true
                        }
                    )
            );


    sortedStudents.forEach(
        student => {

            const studentId =
                student.studentId ||
                student.id ||
                "";

            const year =
                String(
                    student.academicYear ||
                    ""
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        student.studentNumber ||
                        ""
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        student.name ||
                        ""
                    )}
                </td>

                ${months.map(
                    month => {

                        const paid =
                            isMonthPaid(
                                studentId,
                                year,
                                month
                            );

                        return `
                            <td>

                                <span
                                    class="status-badge ${
                                        paid
                                            ? "paid"
                                            : "unpaid"
                                    }">

                                    ${
                                        paid
                                            ? "Paid"
                                            : "Unpaid"
                                    }

                                </span>

                            </td>
                        `;

                    }
                ).join("")}

            `;


            studentsTableBody.appendChild(
                row
            );

        }
    );

}


// =====================================================
// Print Unpaid List
// =====================================================

function printUnpaidList() {

    const selectedMonth =
        monthFilter
            ? monthFilter.value
            : "";

    if (!selectedMonth) {

        alert(
            "Please select a month first."
        );

        return;

    }


    const classStudents =
        getClassStudents();


    const unpaidStudents =
        classStudents.filter(
            student => {

                const studentId =
                    student.studentId ||
                    student.id ||
                    "";

                const year =
                    String(
                        student.academicYear ||
                        ""
                    );


                return !isMonthPaid(
                    studentId,
                    year,
                    selectedMonth
                );

            }
        );


    if (printSchoolName) {

        printSchoolName.textContent =
            schoolName ||
            "School";

    }


    if (printClassTitle) {

        printClassTitle.textContent =
            `${getStageName(
                selectedStage
            )} - Class ${selectedClass} - Unpaid Students`;

    }


    if (printPeriod) {

        printPeriod.textContent =
            `Month: ${selectedMonth} | Academic Year: ${
                academicYearFilter &&
                academicYearFilter.value
                    ? academicYearFilter.value
                    : "All Academic Years"
            }`;

    }


    if (printUnpaidBody) {

        printUnpaidBody.innerHTML =
            "";

    }


    if (
        unpaidStudents.length === 0
    ) {

        if (printUnpaidBody) {

            printUnpaidBody.innerHTML = `
                <tr>

                    <td
                        colspan="6"
                        style="text-align:center;">

                        All students have paid.

                    </td>

                </tr>
            `;

        }

    } else {

        unpaidStudents
            .sort(
                (
                    a,
                    b
                ) =>
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
                            numeric:
                                true
                        }
                    )
            )
            .forEach(
                student => {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${escapeHtml(
                                student.studentNumber ||
                                ""
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                student.name ||
                                ""
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                selectedClass
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                student.academicYear ||
                                ""
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                selectedMonth
                            )}
                        </td>

                        <td>
                            Unpaid
                        </td>

                    `;


                    printUnpaidBody.appendChild(
                        row
                    );

                }
            );

    }


    window.print();

}


// =====================================================
// Filters
// =====================================================

if (academicYearFilter) {

    academicYearFilter.addEventListener(
        "change",
        function () {

            renderStudents();

        }
    );

}


if (monthFilter) {

    monthFilter.addEventListener(
        "change",
        function () {

            renderStudents();

        }
    );

}


if (paymentStatusFilter) {

    paymentStatusFilter.addEventListener(
        "change",
        function () {

            renderStudents();

        }
    );

}


// =====================================================
// Print
// =====================================================

if (printUnpaidButton) {

    printUnpaidButton.addEventListener(
        "click",
        printUnpaidList
    );

}


// =====================================================
// Back
// =====================================================

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                `classes.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );

}


// =====================================================
// Loading
// =====================================================

function showLoading() {

    if (!studentsTableBody) {
        return;
    }

    studentsTableBody.innerHTML = `
        <tr>

            <td
                colspan="11"
                class="empty-state">

                Loading students...

            </td>

        </tr>
    `;

}


// =====================================================
// Error
// =====================================================

function showError() {

    if (!studentsTableBody) {
        return;
    }

    studentsTableBody.innerHTML = `
        <tr>

            <td
                colspan="11"
                class="empty-state">

                Failed to load class data.

            </td>

        </tr>
    `;

}


// =====================================================
// Escape HTML
// =====================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
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


// =====================================================
// Back Button
// =====================================================

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                `classes.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );

}


// =====================================================
// Initialize
// =====================================================

loadClassData();
