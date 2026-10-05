// =====================================================
// BMP School Reports
// =====================================================


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
// Storage
// =====================================================

const institutions =
    JSON.parse(
        localStorage.getItem("bmpInstitutions")
    ) || [];

const students =
    JSON.parse(
        localStorage.getItem("bmpStudents")
    ) || [];

const payments =
    JSON.parse(
        localStorage.getItem("bmpPayments")
    ) || [];


// =====================================================
// Find Institution
// =====================================================

const institution =
    institutions.find(
        item =>
            item.id === institutionId
    );


// =====================================================
// Check Institution
// =====================================================

if (!institution) {

    alert("School not found.");

    window.location.href =
        "institutions.html";
}


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
// School Information
// =====================================================

institutionIdElement.textContent =
    institution.id || "-";

institutionNameElement.textContent =
    institution.name || "-";


// =====================================================
// Academic Years
// =====================================================

function getAcademicYears() {

    const years = students
        .filter(
            student =>
                student.institutionId ===
                institutionId
        )
        .map(
            student =>
                student.academicYear
        )
        .filter(Boolean);

    return [
        ...new Set(years)
    ].sort(
        (a, b) =>
            b.localeCompare(a)
    );
}


// =====================================================
// Load Academic Year Filter
// =====================================================

function loadAcademicYears() {

    const years =
        getAcademicYears();

    academicYearFilter.innerHTML = "";

    const allOption =
        document.createElement("option");

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


    // Prefer current academic year
    const currentYear =
        getCurrentAcademicYear();

    if (
        years.includes(currentYear)
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

    if (month >= 10) {

        return `${year}-${year + 1}`;

    }

    return `${year - 1}-${year}`;
}


// =====================================================
// Get Selected Students
// =====================================================

function getSelectedStudents() {

    return students.filter(
        student => {

            if (
                student.institutionId !==
                institutionId
            ) {

                return false;
            }


            if (
                academicYearFilter.value &&
                student.academicYear !==
                    academicYearFilter.value
            ) {

                return false;
            }


            return true;
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
                    student.id
            )
        );

    return payments.filter(
        payment => {

            if (
                payment.institutionId !==
                institutionId
            ) {

                return false;
            }


            if (
                !studentIds.has(
                    payment.studentId
                )
            ) {

                return false;
            }


            if (
                academicYearFilter.value &&
                payment.academicYear !==
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
    totalStudentsElement.textContent =
        selectedStudents.length;


    // Total Payments
    totalPaymentsElement.textContent =
        selectedPayments.length;


    // Total Amount
    const totalAmount =
        selectedPayments.reduce(
            (sum, payment) =>
                sum +
                Number(
                    payment.amount
                ),

            0
        );

    totalAmountElement.textContent =
        formatAmount(
            totalAmount
        );


    // Students With Payments
    const paidStudentIds =
        new Set(
            selectedPayments.map(
                payment =>
                    payment.studentId
            )
        );

    paidStudentsElement.textContent =
        paidStudentIds.size;


    // Students Without Payments
    unpaidStudentsElement.textContent =
        Math.max(
            0,
            selectedStudents.length -
            paidStudentIds.size
        );


    // Paid Months
    paidMonthsElement.textContent =
        selectedPayments.length;
}


// =====================================================
// Format Amount
// =====================================================

function formatAmount(amount) {

    return Number(amount || 0)
        .toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );
}


// =====================================================
// Payment Report
// =====================================================

function renderPaymentReport() {

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


    paymentReportBody.innerHTML = "";


    months.forEach(
        month => {

            const monthPayments =
                selectedPayments.filter(
                    payment =>
                        payment.month ===
                        month
                );


            const studentIds =
                new Set(
                    monthPayments.map(
                        payment =>
                            payment.studentId
                    )
                );


            const totalAmount =
                monthPayments.reduce(
                    (sum, payment) =>
                        sum +
                        Number(
                            payment.amount
                        ),

                    0
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `
                <td>${month}</td>

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

    const selectedStudents =
        getSelectedStudents();

    const selectedPayments =
        getSelectedPayments();


    studentReportBody.innerHTML = "";


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


    selectedStudents
        .sort(
            (a, b) =>
                String(
                    a.studentNumber
                ).localeCompare(
                    String(
                        b.studentNumber
                    ),
                    undefined,
                    {
                        numeric: true
                    }
                )
        )
        .forEach(
            student => {

                const studentPayments =
                    selectedPayments.filter(
                        payment =>
                            payment.studentId ===
                            student.id
                    );


                const totalPaid =
                    studentPayments.reduce(
                        (sum, payment) =>
                            sum +
                            Number(
                                payment.amount
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
                            student.studentNumber
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            student.name
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            student.stage
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            student.className
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

function escapeHtml(value) {

    return String(value ?? "")
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
// Academic Year Change
// =====================================================

academicYearFilter.addEventListener(
    "change",
    function () {

        refreshReports();
    }
);


// =====================================================
// Print / Save PDF
// =====================================================

printButton.addEventListener(
    "click",
    function () {

        window.print();
    }
);


// =====================================================
// Back
// =====================================================

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `school.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);


// =====================================================
// Initialize
// =====================================================

loadAcademicYears();

refreshReports();
