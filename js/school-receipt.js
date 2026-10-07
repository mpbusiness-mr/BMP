// =====================================================
// BMP School Receipt
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


const paymentId =
    urlParams.get(
        "paymentId"
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
// Load Receipt From Backend
// =====================================================

async function loadReceipt() {

    if (!paymentId) {

        alert(
            "Payment not found."
        );

        window.location.href =
            `school-payments.html?id=${encodeURIComponent(
                institutionId
            )}`;

        return;

    }


    try {

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
                                "getReceipt",

                            institutionId:
                                institutionId,

                            username:
                                currentUser.username,

                            paymentId:
                                paymentId

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
                "Failed to load receipt."
            );

        }


        const payment =
            result.payment ||
            null;


        const student =
            result.student ||
            null;


        const institution =
            result.institution ||
            null;


        if (!payment) {

            throw new Error(
                "Payment not found."
            );

        }


        renderReceipt(
            payment,
            student,
            institution
        );

    }

    catch (error) {

        console.error(
            "Receipt loading error:",
            error
        );


        alert(
            error.message ||
            "Failed to load receipt."
        );


        window.location.href =
            `school-payments.html?id=${encodeURIComponent(
                institutionId
            )}`;

    }

}


// =====================================================
// Render Receipt
// =====================================================

function renderReceipt(
    payment,
    student,
    institution
) {

    const school =
        institution ||
        {};


    // -------------------------------------------------
    // School Information
    // -------------------------------------------------

    if (
        schoolName
    ) {

        schoolName.textContent =
            school.name ||
            "School Name";

    }


    if (
        institutionIdElement
    ) {

        institutionIdElement.textContent =
            school.id ||
            institutionId ||
            "-";

    }


    // -------------------------------------------------
    // School Logo
    // -------------------------------------------------

    if (
        schoolLogoContainer
    ) {

        if (
            school.logo
        ) {

            const logo =
                document.createElement(
                    "img"
                );


            logo.src =
                school.logo;


            logo.alt =
                "School Logo";


            schoolLogoContainer.innerHTML =
                "";


            schoolLogoContainer.appendChild(
                logo
            );


            schoolLogoContainer.style.display =
                "block";

        } else {

            schoolLogoContainer.innerHTML =
                "";


            schoolLogoContainer.style.display =
                "none";

        }

    }


    // -------------------------------------------------
    // Receipt Information
    // -------------------------------------------------

    if (
        receiptNumber
    ) {

        receiptNumber.textContent =
            payment.receiptNumber ||
            "-";

    }


    if (
        academicYear
    ) {

        academicYear.textContent =
            payment.academicYear ||
            "-";

    }


    // -------------------------------------------------
    // Student Information
    // -------------------------------------------------

    if (
        studentName
    ) {

        studentName.textContent =
            payment.studentName ||
            (
                student &&
                student.name
            ) ||
            "-";

    }


    if (
        studentNumber
    ) {

        studentNumber.textContent =
            payment.studentNumber ||
            (
                student &&
                student.studentNumber
            ) ||
            "-";

    }


    if (
        stage
    ) {

        stage.textContent =
            getStageName(
                payment,
                student
            );

    }


    if (
        className
    ) {

        className.textContent =
            getClassName(
                payment,
                student
            );

    }


    // -------------------------------------------------
    // Payment Information
    // -------------------------------------------------

    if (
        month
    ) {

        month.textContent =
            payment.month ||
            "-";

    }


    if (
        amount
    ) {

        amount.textContent =
            formatAmount(
                payment.amount,
                school
            );

    }


    if (
        paymentDate
    ) {

        paymentDate.textContent =
            formatDate(
                payment.paymentDate ||
                payment.date
            );

    }


    if (
        recordedBy
    ) {

        recordedBy.textContent =
            payment.recordedBy ||
            "-";

    }


    // -------------------------------------------------
    // Notes
    // -------------------------------------------------

    if (
        notesSection &&
        notes
    ) {

        if (
            payment.notes &&
            String(
                payment.notes
            ).trim() !== ""
        ) {

            notes.textContent =
                payment.notes;


            notesSection.style.display =
                "block";

        } else {

            notes.textContent =
                "";


            notesSection.style.display =
                "none";

        }

    }


    // -------------------------------------------------
    // Browser Title
    // -------------------------------------------------

    document.title =
        `${payment.receiptNumber || "Receipt"} - ${school.name || "School"}`;

}


// =====================================================
// Get Stage
// =====================================================

function getStageName(
    payment,
    student
) {

    if (
        student &&
        student.stage
    ) {

        return student.stage;

    }


    if (
        payment &&
        payment.stage
    ) {

        return payment.stage;

    }


    return "-";

}


// =====================================================
// Get Class
// =====================================================

function getClassName(
    payment,
    student
) {

    if (
        student
    ) {

        if (
            student.className
        ) {

            return student.className;

        }


        if (
            student.class
        ) {

            return student.class;

        }

    }


    if (
        payment &&
        payment.className
    ) {

        return payment.className;

    }


    if (
        payment &&
        payment.class
    ) {

        return payment.class;

    }


    return "-";

}


// =====================================================
// Format Amount
// =====================================================

function formatAmount(
    value,
    institution
) {

    const number =
        Number(
            value
        );


    if (
        Number.isNaN(
            number
        )
    ) {

        return value || "-";

    }


    const currency =
        (
            institution &&
            institution.currency
        ) ||
        "MRU";


    return (
        number.toLocaleString() +
        " " +
        currency
    );

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
        new Date(
            value
        );


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
// Save as PDF
// =====================================================

if (
    pdfButton
) {

    pdfButton.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

}


// =====================================================
// Back to Payments
// =====================================================

if (
    backButton
) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                `school-payments.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );

}


// =====================================================
// Initialize
// =====================================================

loadReceipt();
