/* =================================
   School Record Payment - BMP
   ================================= */


// =================================
// Authentication
// =================================

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


// =================================
// Storage Keys
// =================================

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

function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


/* =================================
   Institution
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

function loadInstitution() {

    const institution =
        getInstitution();

    if (!institution) {

        alert(
            "Institution not found."
        );

        return false;
    }

    document.getElementById(
        "institutionId"
    ).textContent =
        institution.id || "-";

    document.getElementById(
        "institutionName"
    ).textContent =
        institution.name || "-";

    return true;

}


/* =================================
   Academic Year
   ================================= */

function getCurrentAcademicYear() {

    const now =
        new Date();

    let year =
        now.getFullYear();

    /*
       School year:
       October → June
    */

    if (now.getMonth() < 9) {
        year--;
    }

    return `${year}-${year + 1}`;

}


function getAvailableAcademicYears() {

    const students =
        getData(studentsKey);

    const payments =
        getData(paymentsKey);

    const years =
        new Set();

    students.forEach(student => {

        if (
            student.institutionId ===
            institutionId &&
            student.academicYear
        ) {

            years.add(
                student.academicYear
            );

        }

    });

    payments.forEach(payment => {

        if (
            payment.institutionId ===
            institutionId &&
            payment.academicYear
        ) {

            years.add(
                payment.academicYear
            );

        }

    });

    const currentYear =
        getCurrentAcademicYear();

    years.add(currentYear);

    return Array.from(years)
        .sort()
        .reverse();

}


function loadAcademicYears() {

    const select =
        document.getElementById(
            "academicYear"
        );

    const years =
        getAvailableAcademicYears();

    select.innerHTML = "";

    years.forEach(year => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            year;

        option.textContent =
            year;

        select.appendChild(
            option
        );

    });

    const currentYear =
        getCurrentAcademicYear();

    if (
        years.includes(
            currentYear
        )
    ) {

        select.value =
            currentYear;

    }

}


/* =================================
   Students
   ================================= */

function getInstitutionStudents() {

    const students =
        getData(studentsKey);

    return students.filter(
        student =>
            student.institutionId ===
            institutionId
    );

}


function loadStudents() {

    const select =
        document.getElementById(
            "student"
        );

    const academicYear =
        document.getElementById(
            "academicYear"
        ).value;

    const students =
        getInstitutionStudents()
            .filter(
                student =>
                    student.academicYear ===
                    academicYear
            )
            .sort(
                (a, b) =>
                    (a.studentNumber || "")
                        .localeCompare(
                            b.studentNumber || "",
                            undefined,
                            {
                                numeric: true
                            }
                        )
            );

    select.innerHTML = `
        <option value="">
            Select Student
        </option>
    `;

    students.forEach(student => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            student.id;

        option.textContent =
            `${student.studentNumber || "-"} - ${student.name || "-"}`;

        select.appendChild(
            option
        );

    });

    clearStudentInformation();

}


/* =================================
   Student Information
   ================================= */

function clearStudentInformation() {

    document.getElementById(
        "studentNumber"
    ).value = "";

    document.getElementById(
        "stage"
    ).value = "";

    document.getElementById(
        "className"
    ).value = "";

}


function loadStudentInformation() {

    const studentId =
        document.getElementById(
            "student"
        ).value;

    if (!studentId) {

        clearStudentInformation();

        return;

    }

    const students =
        getInstitutionStudents();

    const student =
        students.find(
            item =>
                item.id ===
                studentId
        );

    if (!student) {

        clearStudentInformation();

        return;

    }

    document.getElementById(
        "studentNumber"
    ).value =
        student.studentNumber || "";

    document.getElementById(
        "stage"
    ).value =
        formatStage(
            student.stage
        );

    document.getElementById(
        "className"
    ).value =
        student.className ||
        student.classNumber ||
        "";

}


/* =================================
   Stage
   ================================= */

function formatStage(stage) {

    if (!stage) {
        return "-";
    }

    const stages = {

        primary: "Primary",

        preparatory: "Preparatory",

        secondary: "Secondary"

    };

    return stages[stage] ||
        stage;

}


/* =================================
   Receipt Number
   ================================= */

function generateReceiptNumber() {

    const payments =
        getData(paymentsKey);

    const year =
        new Date()
            .getFullYear();

    let maxNumber = 0;

    payments.forEach(payment => {

        if (
            payment.institutionId !==
            institutionId
        ) {
            return;
        }

        const receipt =
            payment.receiptNumber ||
            "";

        const match =
            receipt.match(
                /^RC-(\d+)-(\d+)$/
            );

        if (!match) {
            return;
        }

        const receiptYear =
            Number(match[1]);

        const receiptNumber =
            Number(match[2]);

        if (
            receiptYear === year &&
            receiptNumber > maxNumber
        ) {

            maxNumber =
                receiptNumber;

        }

    });

    const nextNumber =
        maxNumber + 1;

    return `RC-${year}-${String(
        nextNumber
    ).padStart(5, "0")}`;

}


function setReceiptNumber() {

    document.getElementById(
        "receiptNumber"
    ).value =
        generateReceiptNumber();

}


/* =================================
   Payment Duplicate Check
   ================================= */

function paymentAlreadyExists(
    studentId,
    academicYear,
    month
) {

    const payments =
        getData(paymentsKey);

    return payments.some(
        payment =>
            payment.institutionId ===
                institutionId &&

            payment.studentId ===
                studentId &&

            payment.academicYear ===
                academicYear &&

            payment.month ===
                month
    );

}


/* =================================
   Current User
   ================================= */

function getCurrentUser() {

    /*
       Temporary prototype authentication.

       Later this will come from
       the real authentication system.
    */

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "bmpCurrentUser"
            )
        );

    if (
        currentUser &&
        currentUser.username
    ) {

        return currentUser.username;

    }

    return "Unknown User";

}


function loadCurrentUser() {

    document.getElementById(
        "recordedBy"
    ).value =
        getCurrentUser();

}


/* =================================
   Error / Success
   ================================= */

function showError(message) {

    const error =
        document.getElementById(
            "errorMessage"
        );

    const success =
        document.getElementById(
            "successMessage"
        );

    success.style.display =
        "none";

    error.textContent =
        message;

    error.style.display =
        "block";

}


function showSuccess(message) {

    const error =
        document.getElementById(
            "errorMessage"
        );

    const success =
        document.getElementById(
            "successMessage"
        );

    error.style.display =
        "none";

    success.textContent =
        message;

    success.style.display =
        "block";

}


/* =================================
   Activity Log
   ================================= */

function createActivityLog(
    payment
) {

    /*
       Use the existing activity-log
       system when available.
    */

    if (
        typeof logActivity ===
        "function"
    ) {

        logActivity({

            institutionId:
                institutionId,

            userId:
                null,

            username:
                payment.recordedBy,

            role:
                "User",

            action:
                "Recorded School Payment",

            details:
                `Student ${payment.studentNumber}, ${payment.academicYear}, ${payment.month}, Receipt ${payment.receiptNumber}`

        });

    }

}


/* =================================
   Save Payment
   ================================= */

function savePayment(event) {

    event.preventDefault();

    const academicYear =
        document.getElementById(
            "academicYear"
        ).value;

    const studentId =
        document.getElementById(
            "student"
        ).value;

    const month =
        document.getElementById(
            "month"
        ).value;

    const amount =
        Number(
            document.getElementById(
                "amount"
            ).value
        );

    const paymentDate =
        document.getElementById(
            "paymentDate"
        ).value;

    const receiptNumber =
        document.getElementById(
            "receiptNumber"
        ).value;

    const recordedBy =
        document.getElementById(
            "recordedBy"
        ).value.trim();

    const notes =
        document.getElementById(
            "notes"
        ).value.trim();


    /* =============================
       Validation
       ============================= */

    if (!academicYear) {

        showError(
            "Please select an academic year."
        );

        return;

    }


    if (!studentId) {

        showError(
            "Please select a student."
        );

        return;

    }


    if (!month) {

        showError(
            "Please select a month."
        );

        return;

    }


    if (
        !amount ||
        amount <= 0
    ) {

        showError(
            "Please enter a valid payment amount."
        );

        return;

    }


    if (!paymentDate) {

        showError(
            "Please select the payment date."
        );

        return;

    }


    if (!recordedBy) {

        showError(
            "Recorded By is required."
        );

        return;

    }


    /* =============================
       Find Student
       ============================= */

    const students =
        getInstitutionStudents();

    const student =
        students.find(
            item =>
                item.id ===
                studentId &&
                item.academicYear ===
                academicYear
        );

    if (!student) {

        showError(
            "Student not found for the selected academic year."
        );

        return;

    }


    /* =============================
       Duplicate Payment
       ============================= */

    if (
        paymentAlreadyExists(
            studentId,
            academicYear,
            month
        )
    ) {

        showError(
            `Payment already exists for ${student.name} for ${month} ${academicYear}.`
        );

        return;

    }


    /* =============================
       Create Payment
       ============================= */

    const payments =
        getData(paymentsKey);

    const payment = {

        id:
            "PAY-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8),

        institutionId:
            institutionId,

        studentId:
            student.id,

        studentNumber:
            student.studentNumber,

        studentName:
            student.name,

        academicYear:
            academicYear,

        month:
            month,

        amount:
            amount,

        paymentDate:
            paymentDate,

        receiptNumber:
            receiptNumber,

        recordedBy:
            recordedBy,

        notes:
            notes,

        createdAt:
            new Date().toISOString()

    };


    payments.push(
        payment
    );

    saveData(
        paymentsKey,
        payments
    );


    /* =============================
       Activity Log
       ============================= */

    createActivityLog(
        payment
    );


    /* =============================
       Success
       ============================= */

    showSuccess(
        "Payment recorded successfully."
    );


    /*
       Prepare next receipt number.
    */

    setReceiptNumber();


    /*
       After successful payment,
       keep the page open briefly.
    */

    setTimeout(() => {

        window.location.href =
            `school-payments.html?id=${encodeURIComponent(
                institutionId
            )}`;

    }, 900);

}


/* =================================
   Events
   ================================= */

document
    .getElementById(
        "academicYear"
    )
    .addEventListener(
        "change",
        () => {

            loadStudents();

            setReceiptNumber();

        }
    );


document
    .getElementById(
        "student"
    )
    .addEventListener(
        "change",
        loadStudentInformation
    );


document
    .getElementById(
        "paymentForm"
    )
    .addEventListener(
        "submit",
        savePayment
    );


document
    .getElementById(
        "backButton"
    )
    .addEventListener(
        "click",
        () => {

            window.location.href =
                `school-payments.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );


document
    .getElementById(
        "cancelButton"
    )
    .addEventListener(
        "click",
        () => {

            window.location.href =
                `school-payments.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );


/* =================================
   Initialize
   ================================= */

if (!institutionId) {

    alert(
        "Institution ID is missing."
    );

} else {

    const institutionLoaded =
        loadInstitution();

    if (institutionLoaded) {

        loadAcademicYears();

        loadStudents();

        loadCurrentUser();

        setReceiptNumber();

        document.getElementById(
            "paymentDate"
        ).value =
            new Date()
                .toISOString()
                .split("T")[0];

    }

}
