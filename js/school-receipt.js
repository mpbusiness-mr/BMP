// =====================================================
// BMP School Receipt
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
// URL Parameters
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const paymentId =
    urlParams.get("paymentId");


// =====================================================
// Storage
// =====================================================

const institutions =
    JSON.parse(
        localStorage.getItem(
            "bmpInstitutions"
        )
    ) || [];


const payments =
    JSON.parse(
        localStorage.getItem(
            "bmpPayments"
        )
    ) || [];


const students =
    JSON.parse(
        localStorage.getItem(
            "bmpStudents"
        )
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
// Find Payment
// =====================================================

const payment =
    payments.find(
        item =>
            item.id === paymentId &&
            item.institutionId ===
                institutionId
    );


// =====================================================
// Elements
// =====================================================

const schoolName =
    document.getElementById(
        "schoolName"
    );


const schoolLogoContainer =
    document.getElementById(
        "schoolLogoContainer"
    );


const receiptNumber =
    document.getElementById(
        "receiptNumber"
    );


const institutionIdElement =
    document.getElementById(
        "institutionId"
    );


const academicYear =
    document.getElementById(
        "academicYear"
    );


const studentName =
    document.getElementById(
        "studentName"
    );


const studentNumber =
    document.getElementById(
        "studentNumber"
    );


const stage =
    document.getElementById(
        "stage"
    );


const className =
    document.getElementById(
        "className"
    );


const month =
    document.getElementById(
        "month"
    );


const amount =
    document.getElementById(
        "amount"
    );


const paymentDate =
    document.getElementById(
        "paymentDate"
    );


const recordedBy =
    document.getElementById(
        "recordedBy"
    );


const notesSection =
    document.getElementById(
        "notesSection"
    );


const notes =
    document.getElementById(
        "notes"
    );


const printButton =
    document.getElementById(
        "printButton"
    );


const pdfButton =
    document.getElementById(
        "pdfButton"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


// =====================================================
// Check Institution
// =====================================================

if (!institution) {

    alert(
        "School not found."
    );

    window.location.href =
        "institutions.html";
}


// =====================================================
// Check Payment
// =====================================================

else if (!payment) {

    alert(
        "Payment not found."
    );

    window.location.href =
        `school-payments.html?id=${encodeURIComponent(
            institutionId
        )}`;
}


// =====================================================
// Load Receipt
// =====================================================

else {

    loadReceipt();

}


// =====================================================
// Load Receipt Function
// =====================================================

function loadReceipt() {

    // -------------------------------------------------
    // School Information
    // -------------------------------------------------

    schoolName.textContent =
        institution.name ||
        "School Name";


    institutionIdElement.textContent =
        institution.id ||
        "-";


    // -------------------------------------------------
    // School Logo
    // -------------------------------------------------

    if (
        institution.logo &&
        schoolLogoContainer
    ) {

        const logo =
            document.createElement(
                "img"
            );


        logo.src =
            institution.logo;


        logo.alt =
            "School Logo";


        schoolLogoContainer.innerHTML =
            "";


        schoolLogoContainer.appendChild(
            logo
        );


        schoolLogoContainer.style.display =
            "block";

    } else if (
        schoolLogoContainer
    ) {

        schoolLogoContainer.style.display =
            "none";
    }


    // -------------------------------------------------
    // Receipt Information
    // -------------------------------------------------

    receiptNumber.textContent =
        payment.receiptNumber ||
        "-";


    academicYear.textContent =
        payment.academicYear ||
        "-";


    // -------------------------------------------------
    // Student Information
    // -------------------------------------------------

    studentName.textContent =
        payment.studentName ||
        "-";


    studentNumber.textContent =
        payment.studentNumber ||
        "-";


    stage.textContent =
        getStageName(
            payment.studentId
        );


    className.textContent =
        getClassName(
            payment.studentId
        );


    // -------------------------------------------------
    // Payment Information
    // -------------------------------------------------

    month.textContent =
        payment.month ||
        "-";


    amount.textContent =
        formatAmount(
            payment.amount
        );


    paymentDate.textContent =
        formatDate(
            payment.paymentDate
        );


    recordedBy.textContent =
        payment.recordedBy ||
        "-";


    // -------------------------------------------------
    // Notes
    // -------------------------------------------------

    if (
        payment.notes &&
        payment.notes.trim() !== ""
    ) {

        notes.textContent =
            payment.notes;


        notesSection.style.display =
            "block";

    } else {

        notesSection.style.display =
            "none";
    }


    // -------------------------------------------------
    // Browser Title
    // -------------------------------------------------

    document.title =
        `${payment.receiptNumber || "Receipt"} - ${institution.name || "School"}`;
}


// =====================================================
// Get Stage
// =====================================================

function getStageName(
    studentId
) {

    const student =
        students.find(
            item =>
                item.id === studentId &&
                item.institutionId ===
                    institutionId
        );


    if (!student) {

        return "-";
    }


    return student.stage ||
        "-";
}


// =====================================================
// Get Class
// =====================================================

function getClassName(
    studentId
) {

    const student =
        students.find(
            item =>
                item.id === studentId &&
                item.institutionId ===
                    institutionId
        );


    if (!student) {

        return "-";
    }


    return student.className ||
        "-";
}


// =====================================================
// Format Amount
// =====================================================

function formatAmount(
    value
) {

    const number =
        Number(value);


    if (
        Number.isNaN(number)
    ) {

        return value || "-";
    }


    const currency =
        institution.currency ||
        "MRU";


    return `${number.toLocaleString()} ${currency}`;
}


// =====================================================
// Format Date
// =====================================================

function formatDate(
    value
) {

    if (!value) {

        return "-";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;
    }


    return date.toLocaleDateString(
        "en-GB"
    );
}


// =====================================================
// Print Receipt
// =====================================================

printButton.addEventListener(
    "click",
    function () {

        window.print();

    }
);


// =====================================================
// Save as PDF
// =====================================================

pdfButton.addEventListener(
    "click",
    function () {

        window.print();

    }
);


// =====================================================
// Back to Payments
// =====================================================

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `school-payments.html?id=${encodeURIComponent(
                institutionId
            )}`;

    }
);
