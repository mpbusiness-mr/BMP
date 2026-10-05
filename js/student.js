const urlParams =
    new URLSearchParams(
        window.location.search
    );


/* IDs from URL */

const studentId =
    urlParams.get("id");

const institutionId =
    urlParams.get("institutionId");


/* Get institutions */

const institutions =
    JSON.parse(
        localStorage.getItem(
            "bmpInstitutions"
        )
    ) || [];


/* Find institution */

const institution =
    institutions.find(
        item =>
            item.id === institutionId
    );


/* Get students */

const students =
    JSON.parse(
        localStorage.getItem(
            "bmpStudents"
        )
    ) || [];


/*
    Find student.

    The student must belong
    to the selected institution.
*/

const student =
    students.find(
        item =>
            item.id === studentId &&
            item.institutionId ===
                institutionId
    );


/* Elements */

const studentPageTitle =
    document.getElementById(
        "studentPageTitle"
    );

const studentPageSubtitle =
    document.getElementById(
        "studentPageSubtitle"
    );

const institutionIdElement =
    document.getElementById(
        "institutionId"
    );

const institutionNameElement =
    document.getElementById(
        "institutionName"
    );

const studentNumberElement =
    document.getElementById(
        "studentNumber"
    );

const studentNameElement =
    document.getElementById(
        "studentName"
    );

const studentStageElement =
    document.getElementById(
        "studentStage"
    );

const studentClassElement =
    document.getElementById(
        "studentClass"
    );

const registrationDateElement =
    document.getElementById(
        "registrationDate"
    );

const studentIdElement =
    document.getElementById(
        "studentId"
    );

const paidMonthsElement =
    document.getElementById(
        "paidMonths"
    );

const unpaidMonthsElement =
    document.getElementById(
        "unpaidMonths"
    );

const totalPaidElement =
    document.getElementById(
        "totalPaid"
    );

const paymentTableBody =
    document.getElementById(
        "paymentTableBody"
    );

const paymentEmptyState =
    document.getElementById(
        "paymentEmptyState"
    );

const paymentTableContainer =
    document.getElementById(
        "paymentTableContainer"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const editButton =
    document.getElementById(
        "editButton"
    );


/* Validate */

if (!institution) {

    alert(
        "School not found."
    );

    window.location.href =
        "institutions.html";

}
else if (!student) {

    alert(
        "Student not found."
    );

    window.location.href =
        `students.html?id=${encodeURIComponent(
            institutionId
        )}`;

}
else {

    initializeStudentPage();

}


/* Initialize */

function initializeStudentPage() {

    document.title =
        `${student.name} - BMP`;


    studentPageTitle.textContent =
        student.name ||
        "Student Profile";


    studentPageSubtitle.textContent =
        `Student profile for ${institution.name}`;


    institutionIdElement.textContent =
        institution.id || "-";


    institutionNameElement.textContent =
        institution.name || "-";


    studentNumberElement.textContent =
        student.studentNumber || "-";


    studentNameElement.textContent =
        student.name || "-";


    studentStageElement.textContent =
        formatStage(
            student.stage
        );


    studentClassElement.textContent =
        student.className ||
        (
            student.classNumber
                ? `Class ${student.classNumber}`
                : "-"
        );


    registrationDateElement.textContent =
        formatDate(
            student.registrationDate
        );


    studentIdElement.textContent =
        student.id || "-";


    loadPaymentData();

}


/* Format stage */

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


/* Format date */

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString();

}


/* Load payment data */

function loadPaymentData() {

    /*
        Payments will be implemented
        later.

        For now, the page checks
        bmpPayments if it exists.
    */

    const payments =
        JSON.parse(
            localStorage.getItem(
                "bmpPayments"
            )
        ) || [];


    const studentPayments =
        payments.filter(
            payment =>

                payment.institutionId ===
                    institution.id &&

                payment.studentId ===
                    student.id
        );


    const paidMonths =
        studentPayments.length;


    const totalPaid =
        studentPayments.reduce(
            (
                total,
                payment
            ) => {

                return (
                    total +
                    Number(
                        payment.amount
                    || 0)
                );

            },
            0
        );


    /*
        The full list of school months
        will be handled by the payment
        system later.

        For now, unpaid months
        remain zero until the payment
        module is implemented.
    */

    const unpaidMonths = 0;


    paidMonthsElement.textContent =
        paidMonths;


    unpaidMonthsElement.textContent =
        unpaidMonths;


    totalPaidElement.textContent =
        formatAmount(
            totalPaid
        );


    renderPaymentHistory(
        studentPayments
    );

}


/* Format amount */

function formatAmount(amount) {

    const number =
        Number(amount || 0);

    return number.toLocaleString();

}


/* Render payment history */

function renderPaymentHistory(
    payments
) {

    paymentTableBody.innerHTML =
        "";


    if (
        payments.length === 0
    ) {

        paymentEmptyState.style.display =
            "block";

        paymentTableContainer.style.display =
            "none";

        return;

    }


    paymentEmptyState.style.display =
        "none";

    paymentTableContainer.style.display =
        "block";


    payments.forEach(
        payment => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        payment.month || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        formatAmount(
                            payment.amount
                        )
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        formatDate(
                            payment.paymentDate ||
                            payment.date
                        )
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        payment.receiptNumber ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        payment.recordedBy ||
                        payment.username ||
                        "-"
                    )}
                </td>

            `;


            paymentTableBody.appendChild(
                row
            );

        }
    );

}


/* Edit Student */

editButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `edit-student.html?id=${encodeURIComponent(
                student.id
            )}&institutionId=${encodeURIComponent(
                institution.id
            )}`;

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


/* Escape HTML */

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
