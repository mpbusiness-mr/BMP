/* =================================
   School Receipt - BMP
   ================================= */

const params = new URLSearchParams(
    window.location.search
);

const institutionId =
    params.get("id");

const paymentId =
    params.get("paymentId");

const studentsKey =
    "bmpStudents";

const paymentsKey =
    "bmpPayments";

const institutionsKey =
    "bmpInstitutions";


/* =================================
   Helpers
   ================================= */

function getData(key) {

    return JSON.parse(
        localStorage.getItem(key)
    ) || [];

}


/* =================================
   Find Payment
   ================================= */

function getPayment() {

    const payments =
        getData(paymentsKey);

    return payments.find(
        payment =>
            payment.id === paymentId &&
            payment.institutionId ===
            institutionId
    );

}


/* =================================
   Find Student
   ================================= */

function getStudent(studentId) {

    const students =
        getData(studentsKey);

    return students.find(
        student =>
            student.id === studentId &&
            student.institutionId ===
            institutionId
    );

}


/* =================================
   Find Institution
   ================================= */

function getInstitution() {

    const institutions =
        getData(institutionsKey);

    return institutions.find(
        institution =>
            institution.id ===
            institutionId
    );

}


/* =================================
   Format Stage
   ================================= */

function formatStage(stage) {

    const stages = {

        primary: "Primary",

        preparatory: "Preparatory",

        secondary: "Secondary"

    };

    return stages[stage] ||
        stage ||
        "-";

}


/* =================================
   Format Date
   ================================= */

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parsed =
        new Date(date);

    if (isNaN(parsed)) {
        return date;
    }

    return parsed.toLocaleDateString();

}


/* =================================
   Format Amount
   ================================= */

function formatAmount(amount) {

    const number =
        Number(amount || 0);

    return number.toLocaleString();

}


/* =================================
   Load Receipt
   ================================= */

function loadReceipt() {

    const payment =
        getPayment();

    if (!payment) {

        alert(
            "Payment record not found."
        );

        return false;

    }


    const institution =
        getInstitution();

    const student =
        getStudent(
            payment.studentId
        );


    if (!institution) {

        alert(
            "Institution not found."
        );

        return false;

    }


    if (!student) {

        alert(
            "Student record not found."
        );

        return false;

    }


    /* =============================
       School
       ============================= */

    document.getElementById(
        "schoolName"
    ).textContent =
        institution.name || "-";

    document.getElementById(
        "institutionId"
    ).textContent =
        institution.id || "-";


    /* =============================
       Receipt
       ============================= */

    document.getElementById(
        "receiptNumber"
    ).textContent =
        payment.receiptNumber || "-";


    /* =============================
       Academic Year
       ============================= */

    document.getElementById(
        "academicYear"
    ).textContent =
        payment.academicYear || "-";


    /* =============================
       Student
       ============================= */

    document.getElementById(
        "studentName"
    ).textContent =
        student.name || "-";

    document.getElementById(
        "studentNumber"
    ).textContent =
        student.studentNumber || "-";

    document.getElementById(
        "stage"
    ).textContent =
        formatStage(
            student.stage
        );

    document.getElementById(
        "className"
    ).textContent =
        student.className ||
        student.classNumber ||
        "-";


    /* =============================
       Payment
       ============================= */

    document.getElementById(
        "month"
    ).textContent =
        payment.month || "-";

    document.getElementById(
        "amount"
    ).textContent =
        formatAmount(
            payment.amount
        );

    document.getElementById(
        "paymentDate"
    ).textContent =
        formatDate(
            payment.paymentDate
        );

    document.getElementById(
        "recordedBy"
    ).textContent =
        payment.recordedBy || "-";


    /* =============================
       Notes
       ============================= */

    if (payment.notes) {

        document.getElementById(
            "notes"
        ).textContent =
            payment.notes;

        document.getElementById(
            "notesSection"
        ).style.display =
            "block";

    }


    return true;

}


/* =================================
   Print Receipt
   ================================= */

function printReceipt() {

    window.print();

}


/* =================================
   Save as PDF
   ================================= */

function saveAsPDF() {

    /*
       Browsers use the system print
       dialog to save a webpage as PDF.

       The user can select:
       "Save as PDF"
    */

    window.print();

}


/* =================================
   Back to Payments
   ================================= */

function goBack() {

    window.location.href =
        `school-payments.html?id=${encodeURIComponent(
            institutionId
        )}`;

}


/* =================================
   Events
   ================================= */

document
    .getElementById(
        "printButton"
    )
    .addEventListener(
        "click",
        printReceipt
    );


document
    .getElementById(
        "pdfButton"
    )
    .addEventListener(
        "click",
        saveAsPDF
    );


document
    .getElementById(
        "backButton"
    )
    .addEventListener(
        "click",
        goBack
    );


/* =================================
   Initialize
   ================================= */

if (
    !institutionId ||
    !paymentId
) {

    alert(
        "Receipt information is missing."
    );

} else {

    loadReceipt();

}
