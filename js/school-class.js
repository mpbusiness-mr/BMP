
// =====================================================
// BMP School Class Students
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


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
        urlParams.get("stage") ||
        ""
    ).trim();


const selectedClass =
    String(
        urlParams.get("class") ||
        ""
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

let institution = {

    id:
        institutionId,

    name:
        currentUser.institutionName ||
        "-"

};


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


const printUnpaidArea =
    document.getElementById(
        "printUnpaidArea"
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


    if (
        month >= 10
    ) {

        return (
            `${year}-${year + 1}`
        );

    }


    return (
        `${year - 1}-${year}`
    );

}


// =====================================================
// Load Data From Backend
// =====================================================

async function loadClassData() {

    try {

        showLoading();


        if (
            !selectedStage ||
            !selectedClass
        ) {

            throw new Error(
                "Class information is missing."
            );

        }


        // =============================================
        // Load Students
        // =============================================

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


        // =============================================
        // Load Payments
        // =============================================

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


        students =
            Array.isArray(
                studentsResult.students
            )
                ? studentsResult.students
                : [];


        payments =
            Array.isArray(
                paymentsResult.payments
            )
                ? paymentsResult.payments
                : [];


        // =============================================
        // Header
        // =============================================

        updateClassHeader();


        // =============================================
        // Academic Years
        // =============================================

        loadAcademicYears();


        // =============================================
        // Render
        // =============================================

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
// API Call
// =====================================================

async function callApi(
    action
) {

    const response =
        await fetch(
            API_URL,
            {
                method:
                    "POST",

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
// Update Header
// =====================================================

function updateClassHeader() {

    const stageName =
        getStageName(
            selectedStage
        );


    if (
        pageTitle
    ) {

        pageTitle.textContent =
            `${stageName} - Class ${selectedClass}`;

    }


    if (
        pageSubtitle
    ) {

        pageSubtitle.textContent =
            "Student payment status";

    }


    if (
        institutionIdElement
    ) {

        institutionIdElement.textContent =
            institutionId;

    }


    if (
        institutionNameElement
    ) {

        institutionNameElement.textContent =
            institution.name ||
            "-";

    }


    if (
        stageNameElement
    ) {

        stageNameElement.textContent =
            stageName;

    }


    if (
        classNameElement
    ) {

        classNameElement.textContent =
            `${stageName} ${selectedClass}`;

    }


    document.title =
        `${stageName} - Class ${selectedClass}`;

}


// =====================================================
// Academic Years
// =====================================================

function getAcademicYears() {

    const years =
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
            );


    return [
        ...new Set(
            years
        )
    ].sort(
        (
            a,
            b
        ) =>
            b.localeCompare(
                a
            )
    );

}


// =====================================================
// Load Academic Year Filter
// =====================================================

function loadAcademicYears() {

    if (
        !academicYearFilter
    ) {

        return;

    }


    const years =
        getAcademicYears();


    academicYearFilter.innerHTML =
        "";


    const allYearsOption =
        document.createElement(
            "option"
        );


    allYearsOption.value =
        "";


    allYearsOption.textContent =
        "All Academic Years";


    academicYearFilter.appendChild(
        allYearsOption
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
// Get Students In Selected Class
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
                selectedStage.toLowerCase()
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
                String(
                    student.studentId ||
                    student.id ||
                    ""
                );


            const academicYear =
                String(
                    student.academicYear ||
                    ""
                );


            const month =
                selectedMonth;


            // If status is selected but no month
            // is selected, status filtering is based
            // on whether the student has paid at least
            // one of the nine months.

            if (
                !month
            ) {

                if (
                    selectedStatus ===
                    "paid"
                ) {

                    return months.some(
                        currentMonth =>
                            isMonthPaid(
                                studentId,
                                academicYear,
                                currentMonth
                            )
                    );

                }


                if (
                    selectedStatus ===
                    "unpaid"
                ) {

                    return months.some(
                        currentMonth =>
                            !isMonthPaid(
                                studentId,
                                academicYear,
                                currentMonth
                            )
                    );

                }


                return true;

            }


            const paid =
                isMonthPaid(
                    studentId,
                    academicYear,
                    month
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

    if (
        !studentsTableBody
    ) {

        return;

    }


    const visibleStudents =
        getVisibleStudents();


    if (
        studentCountElement
    ) {

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
        [...visibleStudents];


    sortedStudents.sort(
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

            const row =
                document.createElement(
                    "tr"
                );


            const studentId =
                String(
                    student.studentId ||
                    student.id ||
                    ""
                );


            const studentYear =
                String(
                    student.academicYear ||
                    ""
                );


            let rowHtml = `

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

            `;


            months.forEach(
                month => {

                    const paid =
                        isMonthPaid(
                            studentId,
                            studentYear,
                            month
                        );


                    rowHtml += `

                        <td>

                            <span
                                class="status-badge ${paid ? "paid" : "unpaid"}">

                                ${paid
                                    ? "Paid"
                                    : "Unpaid"}

                            </span>

                        </td>

                    `;

                }
            );


            row.innerHTML =
                rowHtml;


            studentsTableBody.appendChild(
                row
            );

        }
    );

}


// =====================================================
// Check Monthly Payment
// =====================================================

function isMonthPaid(
    studentId,
    academicYear,
    month
) {

    return payments.some(
        payment => {

            const paymentStudentId =
                String(
                    payment.studentId ||
                    ""
                );


            const paymentYear =
                String(
                    payment.academicYear ||
                    ""
                );


            const paymentMonth =
                String(
                    payment.month ||
                    ""
                );


            return (
                paymentStudentId ===
                    studentId &&

                paymentYear ===
                    academicYear &&

                paymentMonth ===
                    month
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


    const selectedYear =
        academicYearFilter
            ? academicYearFilter.value
            : "";


    if (
        !selectedMonth
    ) {

        alert(
            "Please select a month before printing the unpaid list."
        );

        return;

    }


    const classStudents =
        getClassStudents();


    const unpaidStudents =
        classStudents.filter(
            student => {

                const studentId =
                    String(
                        student.studentId ||
                        student.id ||
                        ""
                    );


                const studentYear =
                    String(
                        student.academicYear ||
                        ""
                    );


                /*
                 * If a specific academic year is
                 * selected, use it naturally through
                 * getClassStudents().
                 */

                return !isMonthPaid(
                    studentId,
                    studentYear,
                    selectedMonth
                );

            }
        );


    if (
        printUnpaidBody
    ) {

        printUnpaidBody.innerHTML =
            "";

    }


    if (
        printSchoolName
    ) {

        printSchoolName.textContent =
            institution.name ||
            "School";

    }


    if (
        printClassTitle
    ) {

        printClassTitle.textContent =
            `${getStageName(
                selectedStage
            )} - Class ${selectedClass} - Unpaid Students`;

    }


    if (
        printPeriod
    ) {

        const yearText =
            selectedYear ||
            "All Academic Years";


        printPeriod.textContent =
            `Month: ${selectedMonth} | Academic Year: ${yearText}`;

    }


    if (
        unpaidStudents.length === 0
    ) {

        if (
            printUnpaidBody
        ) {

            printUnpaidBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="text-align:center;">

                        All students have paid for
                        ${escapeHtml(
                            selectedMonth
                        )}.

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

                    if (
                        !printUnpaidBody
                    ) {

                        return;

                    }


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
                                student.class ||
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


    document.body.classList.add(
        "printing-unpaid"
    );


    window.print();


    setTimeout(
        function () {

            document.body.classList.remove(
                "printing-unpaid"
            );

        },
        500
    );

}


// =====================================================
// Filters
// =====================================================

if (
    academicYearFilter
) {

    academicYearFilter.addEventListener(
        "change",
        function () {

            renderStudents();

        }
    );

}


if (
    monthFilter
) {

    monthFilter.addEventListener(
        "change",
        function () {

            /*
             * When a month is selected,
             * default to All Students.
             */

            if (
                monthFilter.value &&
                paymentStatusFilter
            ) {

                paymentStatusFilter.value =
                    "";

            }


            renderStudents();

        }
    );

}


if (
    paymentStatusFilter
) {

    paymentStatusFilter.addEventListener(
        "change",
        function () {

            renderStudents();

        }
    );

}


// =====================================================
// Print Button
// =====================================================

if (
    printUnpaidButton
) {

    printUnpaidButton.addEventListener(
        "click",
        function () {

            printUnpaidList();

        }
    );

}


// =====================================================
// Back
// =====================================================

if (
    backButton
) {

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
// Loading State
// =====================================================

function showLoading() {

    if (
        studentsTableBody
    ) {

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

}


// =====================================================
// Error State
// =====================================================

function showError() {

    if (
        studentsTableBody
    ) {

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
// Initialize
// =====================================================

loadClassData();
