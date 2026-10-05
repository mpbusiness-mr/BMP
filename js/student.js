const urlParams =
    new URLSearchParams(window.location.search);

const studentId =
    urlParams.get("id");

const institutionId =
    urlParams.get("institutionId");


/* ================================
   Elements
================================ */

const institutionIdElement =
    document.getElementById("institutionId");

const institutionNameElement =
    document.getElementById("institutionName");

const academicYearElement =
    document.getElementById("academicYear");

const studentNumberElement =
    document.getElementById("studentNumber");

const studentNameElement =
    document.getElementById("studentName");

const stageElement =
    document.getElementById("stage");

const classNameElement =
    document.getElementById("className");

const registrationDateElement =
    document.getElementById("registrationDate");

const studentIdElement =
    document.getElementById("studentId");

const paidMonthsElement =
    document.getElementById("paidMonths");

const unpaidMonthsElement =
    document.getElementById("unpaidMonths");

const totalPaidElement =
    document.getElementById("totalPaid");

const paymentHistoryBody =
    document.getElementById("paymentHistoryBody");

const emptyPayments =
    document.getElementById("emptyPayments");

const backButton =
    document.getElementById("backButton");

const editButton =
    document.getElementById("editButton");


/* ================================
   Load Data
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


function getPayments() {

    return JSON.parse(
        localStorage.getItem("bmpPayments")
    ) || [];

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

const students =
    getStudents();

const student =
    students.find(
        item =>
            item.id === studentId &&
            item.institutionId === institutionId
    );


if (!student) {

    alert("Student not found.");

    window.location.href =
        `students.html?id=${encodeURIComponent(
            institutionId
        )}`;

}


/* ================================
   Display Institution
================================ */

institutionIdElement.textContent =
    institution.id;

institutionNameElement.textContent =
    institution.name;


/* ================================
   Display Student
================================ */

academicYearElement.textContent =
    student.academicYear || "-";

studentNumberElement.textContent =
    student.studentNumber || "-";

studentNameElement.textContent =
    student.name || "-";

stageElement.textContent =
    formatStage(student.stage);

classNameElement.textContent =
    student.className ||
    `Class ${student.classNumber}`;

registrationDateElement.textContent =
    student.registrationDate || "-";

studentIdElement.textContent =
    student.id || "-";


/* ================================
   Format Stage
================================ */

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


/* ================================
   Student Payments
================================ */

const allPayments =
    getPayments();


const studentPayments =
    allPayments.filter(payment =>

        payment.institutionId ===
            institutionId &&

        (
            payment.studentId ===
                student.id ||

            payment.studentNumber ===
                student.studentNumber
        )

    );


/* ================================
   Payment Summary
================================ */

const paidMonths =
    studentPayments.length;


const totalPaid =
    studentPayments.reduce(
        (total, payment) => {

            return total +
                Number(
                    payment.amount
                );

        },
        0
    );


/*
   There are currently 12 possible
   payment months in one academic year.
*/

const unpaidMonths =
    Math.max(
        0,
        12 - paidMonths
    );


paidMonthsElement.textContent =
    paidMonths;

unpaidMonthsElement.textContent =
    unpaidMonths;

totalPaidElement.textContent =
    formatAmount(totalPaid);


/* ================================
   Format Amount
================================ */

function formatAmount(amount) {

    return Number(amount || 0)
        .toLocaleString();

}


/* ================================
   Payment History
================================ */

function renderPaymentHistory() {

    paymentHistoryBody.innerHTML = "";


    if (
        studentPayments.length === 0
    ) {

        emptyPayments.style.display =
            "block";

        return;

    }


    emptyPayments.style.display =
        "none";


    const sortedPayments =
        [...studentPayments].sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.paymentDate ||
                        a.date ||
                        0
                    );

                const dateB =
                    new Date(
                        b.paymentDate ||
                        b.date ||
                        0
                    );

                return dateB - dateA;

            }
        );


    sortedPayments.forEach(
        payment => {

            const row =
                document.createElement("tr");


            const month =
                payment.month || "-";


            const amount =
                formatAmount(
                    payment.amount
                );


            const paymentDate =
                payment.paymentDate ||
                payment.date ||
                "-";


            const receiptNumber =
                payment.receiptNumber ||
                "-";


            const recordedBy =
                payment.username ||
                payment.recordedBy ||
                "-";


            row.innerHTML = `

                <td>
                    ${escapeHtml(month)}
                </td>

                <td>
                    ${escapeHtml(amount)}
                </td>

                <td>
                    ${escapeHtml(paymentDate)}
                </td>

                <td>
                    ${escapeHtml(receiptNumber)}
                </td>

                <td>
                    ${escapeHtml(recordedBy)}
                </td>

            `;


            paymentHistoryBody.appendChild(
                row
            );

        }
    );

}


/* ================================
   Escape HTML
================================ */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ================================
   Navigation
================================ */

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `students.html?id=${encodeURIComponent(
                institutionId
            )}`;

    }
);


editButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `edit-student.html?id=${encodeURIComponent(
                student.id
            )}&institutionId=${encodeURIComponent(
                institutionId
            )}`;

    }
);


/* ================================
   Initial Render
================================ */

renderPaymentHistory();
