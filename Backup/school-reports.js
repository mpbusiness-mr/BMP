// =====================================================
// BMP School Reports
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
// Data
// =====================================================

let students = [];

let payments = [];

let institution = null;


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


const academicYearFilter =
    document.getElementById(
        "academicYearFilter"
    );


const totalStudentsElement =
    document.getElementById(
        "totalStudents"
    );


const totalPaymentsElement =
    document.getElementById(
        "totalPayments"
    );


const totalAmountElement =
    document.getElementById(
        "totalAmount"
    );


const paidStudentsElement =
    document.getElementById(
        "paidStudents"
    );


const unpaidStudentsElement =
    document.getElementById(
        "unpaidStudents"
    );


const paidMonthsElement =
    document.getElementById(
        "paidMonths"
    );


const paymentReportBody =
    document.getElementById(
        "paymentReportBody"
    );


const studentReportBody =
    document.getElementById(
        "studentReportBody"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


const printButton =
    document.getElementById(
        "printButton"
    );


// =====================================================
// Load Reports From Backend
// =====================================================

async function loadReports() {

    try {

        showLoading();


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
                                "getReports",

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


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Failed to load reports."
            );

        }


        // =============================================
        // Store Data
        // =============================================

        students =
            Array.isArray(
                result.students
            )
                ? result.students
                : [];


        payments =
            Array.isArray(
                result.payments
            )
                ? result.payments
                : [];


        institution =
            result.institution ||
            null;


        // =============================================
        // Institution Information
        // =============================================

        if (
            institutionIdElement
        ) {

            institutionIdElement.textContent =
                institution &&
                institution.id
                    ? institution.id
                    : institutionId;

        }


        if (
            institutionNameElement
        ) {

            institutionNameElement.textContent =
                institution &&
                institution.name
                    ? institution.name
                    : "-";

        }


        if (
            institution &&
            institution.name
        ) {

            document.title =
                `${institution.name} - School Reports`;

        }


        // =============================================
        // Academic Years
        // =============================================

        loadAcademicYears();


        // =============================================
        // Refresh Report
        // =============================================

        refreshReports();

    }

    catch (error) {

        console.error(
            "Reports loading error:",
            error
        );


        showError();


        alert(
            error.message ||
            "Failed to load reports."
        );

    }

}


// =====================================================
// Academic Years
// =====================================================

function getAcademicYears() {

    const years =
        students
            .map(
                student =>
                    student.academicYear
            )
            .filter(
                year =>
                    year !== undefined &&
                    year !== null &&
                    String(
                        year
                    ).trim() !== ""
            )
            .map(
                year =>
                    String(
                        year
                    ).trim()
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


    const allOption =
        document.createElement(
            "option"
        );


    allOption.value =
        "";


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


    // =============================================
    // Prefer Current Academic Year
    // =============================================

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
// Get Selected Students
// =====================================================

function getSelectedStudents() {

    if (
        !academicYearFilter ||
        !academicYearFilter.value
    ) {

        return students
            .filter(
                student =>
                    String(
                        student.institutionId ||
                        institutionId
                    ) ===
                    institutionId
            );

    }


    return students.filter(
        student => {

            const studentInstitutionId =
                String(
                    student.institutionId ||
                    institutionId
                );


            if (
                studentInstitutionId !==
                institutionId
            ) {

                return false;

            }


            return (
                String(
                    student.academicYear ||
                    ""
                ) ===
                academicYearFilter.value
            );

        }
    );

}


// =====================================================
// Get Selected Payments
// =====================================================

function getSelectedPayments() {

    const selectedStudents =
        getSelectedStudents();


    const studentIds =
        new Set(
            selectedStudents.map(
                student =>
                    String(
                        student.id ||
                        student.studentId ||
                        ""
                    )
            )
        );


    return payments.filter(
        payment => {

            const paymentInstitutionId =
                String(
                    payment.institutionId ||
                    institutionId
                );


            if (
                paymentInstitutionId !==
                institutionId
            ) {

                return false;

            }


            const paymentStudentId =
                String(
                    payment.studentId ||
                    ""
                );


            if (
                !studentIds.has(
                    paymentStudentId
                )
            ) {

                return false;

            }


            if (
                academicYearFilter &&
                academicYearFilter.value &&
                String(
                    payment.academicYear ||
                    ""
                ) !==
                academicYearFilter.value
            ) {

                return false;

            }


            return true;

        }
    );

}


// =====================================================
// Update Summary
// =====================================================

function updateSummary() {

    const selectedStudents =
        getSelectedStudents();


    const selectedPayments =
        getSelectedPayments();


    // Total Students
    if (
        totalStudentsElement
    ) {

        totalStudentsElement.textContent =
            selectedStudents.length;

    }


    // Total Payments
    if (
        totalPaymentsElement
    ) {

        totalPaymentsElement.textContent =
            selectedPayments.length;

    }


    // Total Amount
    const totalAmount =
        selectedPayments.reduce(
            (
                sum,
                payment
            ) =>
                sum +
                Number(
                    payment.amount || 0
                ),

            0
        );


    if (
        totalAmountElement
    ) {

        totalAmountElement.textContent =
            formatAmount(
                totalAmount
            );

    }


    // Students With Payments
    const paidStudentIds =
        new Set(
            selectedPayments.map(
                payment =>
                    String(
                        payment.studentId ||
                        ""
                    )
            )
        );


    if (
        paidStudentsElement
    ) {

        paidStudentsElement.textContent =
            paidStudentIds.size;

    }


    // Students Without Payments
    if (
        unpaidStudentsElement
    ) {

        unpaidStudentsElement.textContent =
            Math.max(
                0,
                selectedStudents.length -
                paidStudentIds.size
            );

    }


    // Paid Months
    if (
        paidMonthsElement
    ) {

        paidMonthsElement.textContent =
            selectedPayments.length;

    }

}


// =====================================================
// Format Amount
// =====================================================

function formatAmount(
    amount
) {

    const number =
        Number(
            amount || 0
        );


    return number.toLocaleString(
        "en-US",
        {
            minimumFractionDigits:
                0,

            maximumFractionDigits:
                2
        }
    );

}


// =====================================================
// Payment Report
// =====================================================

function renderPaymentReport() {

    if (
        !paymentReportBody
    ) {

        return;

    }


    const selectedPayments =
        getSelectedPayments();


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


    paymentReportBody.innerHTML =
        "";


    months.forEach(
        month => {

            const monthPayments =
                selectedPayments.filter(
                    payment =>
                        String(
                            payment.month ||
                            ""
                        ) ===
                        month
                );


            const studentIds =
                new Set(
                    monthPayments.map(
                        payment =>
                            String(
                                payment.studentId ||
                                ""
                            )
                    )
                );


            const totalAmount =
                monthPayments.reduce(
                    (
                        sum,
                        payment
                    ) =>
                        sum +
                        Number(
                            payment.amount ||
                            0
                        ),

                    0
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `
                <td>
                    ${escapeHtml(
                        month
                    )}
                </td>

                <td>
                    ${monthPayments.length}
                </td>

                <td>
                    ${studentIds.size}
                </td>

                <td>
                    ${formatAmount(
                        totalAmount
                    )}
                </td>
            `;


            paymentReportBody.appendChild(
                row
            );

        }
    );

}


// =====================================================
// Student Report
// =====================================================

function renderStudentReport() {

    if (
        !studentReportBody
    ) {

        return;

    }


    const selectedStudents =
        getSelectedStudents();


    const selectedPayments =
        getSelectedPayments();


    studentReportBody.innerHTML =
        "";


    if (
        selectedStudents.length === 0
    ) {

        studentReportBody.innerHTML = `
            <tr>

                <td
                    colspan="6"
                    class="empty-state">

                    No students available.

                </td>

            </tr>
        `;

        return;

    }


    const sortedStudents =
        [...selectedStudents];


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

            const studentId =
                String(
                    student.id ||
                    student.studentId ||
                    ""
                );


            const studentPayments =
                selectedPayments.filter(
                    payment =>
                        String(
                            payment.studentId ||
                            ""
                        ) ===
                        studentId
                );


            const totalPaid =
                studentPayments.reduce(
                    (
                        sum,
                        payment
                    ) =>
                        sum +
                        Number(
                            payment.amount ||
                            0
                        ),

                    0
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

                <td>
                    ${escapeHtml(
                        student.stage ||
                        ""
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        student.className ||
                        student.class ||
                        ""
                    )}
                </td>

                <td>
                    ${studentPayments.length}
                </td>

                <td>
                    ${formatAmount(
                        totalPaid
                    )}
                </td>
            `;


            studentReportBody.appendChild(
                row
            );

        }
    );

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
// Refresh Reports
// =====================================================

function refreshReports() {

    updateSummary();

    renderPaymentReport();

    renderStudentReport();

}


// =====================================================
// Loading State
// =====================================================

function showLoading() {

    if (
        paymentReportBody
    ) {

        paymentReportBody.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty-state">

                    Loading reports...

                </td>
            </tr>
        `;

    }


    if (
        studentReportBody
    ) {

        studentReportBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty-state">

                    Loading reports...

                </td>
            </tr>
        `;

    }


    if (
        totalStudentsElement
    ) {

        totalStudentsElement.textContent =
            "...";

    }


    if (
        totalPaymentsElement
    ) {

        totalPaymentsElement.textContent =
            "...";

    }


    if (
        totalAmountElement
    ) {

        totalAmountElement.textContent =
            "...";

    }


    if (
        paidStudentsElement
    ) {

        paidStudentsElement.textContent =
            "...";

    }


    if (
        unpaidStudentsElement
    ) {

        unpaidStudentsElement.textContent =
            "...";

    }


    if (
        paidMonthsElement
    ) {

        paidMonthsElement.textContent =
            "...";

    }

}


// =====================================================
// Error State
// =====================================================

function showError() {

    if (
        paymentReportBody
    ) {

        paymentReportBody.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty-state">

                    Failed to load reports.

                </td>
            </tr>
        `;

    }


    if (
        studentReportBody
    ) {

        studentReportBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty-state">

                    Failed to load reports.

                </td>
            </tr>
        `;

    }

}


// =====================================================
// Academic Year Change
// =====================================================

if (
    academicYearFilter
) {

    academicYearFilter.addEventListener(
        "change",
        function () {

            refreshReports();

        }
    );

}


// =====================================================
// Print / Save PDF
// =====================================================

if (
    printButton
) {

    printButton.addEventListener(
        "click",
        function () {

            window.print();

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
                `school.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );

}


// =====================================================
// Initialize
// =====================================================

loadReports();
