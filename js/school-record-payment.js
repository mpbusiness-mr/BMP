/* =================================
   School Record Payment - BMP
   Google Apps Script Backend
   ================================= */


/* =================================
   API
   ================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


/* =================================
   Authentication
   ================================= */

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


/* =================================
   Backend Request
   ================================= */

async function apiRequest(
    action,
    data = {}
) {

    const payload = {
        action: action,
        institutionId: institutionId,
        username:
            currentUser.username ||
            currentUser.userName ||
            currentUser.name ||
            ""
    };

    Object.assign(
        payload,
        data
    );

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
                    JSON.stringify(
                        payload
                    )
            }
        );

    if (!response.ok) {

        throw new Error(
            `Server error: ${response.status}`
        );

    }

    const result =
        await response.json();

    if (!result.success) {

        throw new Error(
            result.message ||
            "Request failed."
        );

    }

    return result;

}


/* =================================
   State
   ================================= */

let institution = null;
let students = [];


/* =================================
   Institution
   ================================= */

function loadInstitution() {

    /*
       The school login/session already
       contains the institution information
       in the current authentication system.
    */

    institution = {

        id:
            institutionId,

        name:
            currentUser.institutionName ||
            currentUser.schoolName ||
            currentUser.name ||
            institutionId

    };


    const institutionIdElement =
        document.getElementById(
            "institutionId"
        );

    const institutionNameElement =
        document.getElementById(
            "institutionName"
        );


    if (institutionIdElement) {

        institutionIdElement.textContent =
            institution.id || "-";

    }


    if (institutionNameElement) {

        institutionNameElement.textContent =
            institution.name || "-";

    }


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

    const years =
        new Set();


    students.forEach(
        student => {

            if (
                student.academicYear
            ) {

                years.add(
                    student.academicYear
                );

            }

        }
    );


    /*
       Always include the current
       academic year.
    */

    years.add(
        getCurrentAcademicYear()
    );


    return Array.from(years)
        .sort()
        .reverse();

}


function loadAcademicYears() {

    const select =
        document.getElementById(
            "academicYear"
        );

    if (!select) {
        return;
    }


    const years =
        getAvailableAcademicYears();


    select.innerHTML = `
        <option value="">
            Select Academic Year
        </option>
    `;


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

            select.appendChild(
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

        select.value =
            currentYear;

    }

}


/* =================================
   Students
   ================================= */

async function loadStudentsFromBackend() {

    try {

        const result =
            await apiRequest(
                "getStudents"
            );


        students =
            Array.isArray(
                result.students
            )
                ? result.students
                : [];


        /*
           Keep only students belonging
           to the current institution.
        */

        students =
            students.filter(
                student =>
                    !student.institutionId ||
                    student.institutionId ===
                    institutionId
            );


        return true;

    } catch (error) {

        console.error(
            "Failed to load students:",
            error
        );

        showError(
            error.message ||
            "Failed to load students."
        );

        return false;

    }

}


function getInstitutionStudents() {

    return students.filter(
        student =>
            !student.institutionId ||
            student.institutionId ===
            institutionId
    );

}


function loadStudents() {

    const select =
        document.getElementById(
            "student"
        );

    if (!select) {
        return;
    }


    const academicYear =
        document.getElementById(
            "academicYear"
        ).value;


    const filteredStudents =
        getInstitutionStudents()
            .filter(
                student =>
                    student.academicYear ===
                    academicYear
            )
            .sort(
                (a, b) =>
                    (
                        a.studentNumber ||
                        ""
                    ).localeCompare(
                        b.studentNumber ||
                        "",
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


    filteredStudents.forEach(
        student => {

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

        }
    );


    clearStudentInformation();

}


/* =================================
   Student Information
   ================================= */

function clearStudentInformation() {

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


    if (studentNumber) {

        studentNumber.value =
            "";

    }


    if (stage) {

        stage.value =
            "";

    }


    if (className) {

        className.value =
            "";

    }

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


    const academicYear =
        document.getElementById(
            "academicYear"
        ).value;


    const student =
        students.find(
            item =>
                item.id ===
                    studentId &&

                item.academicYear ===
                    academicYear
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

        primary:
            "Primary",

        preparatory:
            "Preparatory",

        secondary:
            "Secondary"

    };


    return stages[stage] ||
        stage;

}


/* =================================
   Current User
   ================================= */

function getCurrentUser() {

    if (
        currentUser &&
        currentUser.username
    ) {

        return currentUser.username;

    }


    if (
        currentUser &&
        currentUser.userName
    ) {

        return currentUser.userName;

    }


    if (
        currentUser &&
        currentUser.name
    ) {

        return currentUser.name;

    }


    return "Unknown User";

}


function loadCurrentUser() {

    const recordedBy =
        document.getElementById(
            "recordedBy"
        );


    if (recordedBy) {

        recordedBy.value =
            getCurrentUser();

    }

}


/* =================================
   Receipt Number
   ================================= */

function setReceiptNumber(
    receiptNumber = ""
) {

    const element =
        document.getElementById(
            "receiptNumber"
        );


    if (!element) {
        return;
    }


    /*
       The backend is now responsible
       for generating the real receipt
       number.

       Before saving, display a temporary
       message instead of generating a
       potentially conflicting number.
    */

    element.value =
        receiptNumber ||
        "Generated after saving";

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


    if (success) {

        success.style.display =
            "none";

    }


    if (error) {

        error.textContent =
            message;

        error.style.display =
            "block";

    }

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


    if (error) {

        error.style.display =
            "none";

    }


    if (success) {

        success.textContent =
            message;

        success.style.display =
            "block";

    }

}


/* =================================
   Save Payment
   ================================= */

async function savePayment(event) {

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


    const notesElement =
        document.getElementById(
            "notes"
        );


    const notes =
        notesElement
            ? notesElement.value.trim()
            : "";


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


    /* =============================
       Find Student
       ============================= */

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
       Disable Button
       ============================= */

    const button =
        document.getElementById(
            "recordPaymentButton"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Recording...";

    }


    try {

        /* =============================
           Send To Backend
           ============================= */

        const result =
            await apiRequest(
                "addPayment",
                {

                    studentId:
                        studentId,

                    academicYear:
                        academicYear,

                    month:
                        month,

                    amount:
                        amount,

                    paymentDate:
                        paymentDate,

                    notes:
                        notes

                }
            );


        /* =============================
           Backend Response
           ============================= */

        const payment =
            result.payment ||
            {};


        const receiptNumber =
            payment.receiptNumber ||
            result.receiptNumber ||
            "";


        if (receiptNumber) {

            setReceiptNumber(
                receiptNumber
            );

        }


        /* =============================
           Success
           ============================= */

        showSuccess(
            `Payment recorded successfully.${receiptNumber ? ` Receipt: ${receiptNumber}` : ""}`
        );


        /*
           Give the user enough time to
           see the success message.
        */

        setTimeout(
            () => {

                window.location.href =
                    `school-payments.html?id=${encodeURIComponent(
                        institutionId
                    )}`;

            },
            1000
        );


    } catch (error) {

        console.error(
            "Payment error:",
            error
        );


        showError(
            error.message ||
            "Failed to record payment."
        );


        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Record Payment";

        }

    }

}


/* =================================
   Navigation
   ================================= */

function goBack() {

    window.location.href =
        `school-payments.html?id=${encodeURIComponent(
            institutionId
        )}`;

}


function goToPayments() {

    window.location.href =
        `school-payments.html?id=${encodeURIComponent(
            institutionId
        )}`;

}


/* =================================
   Events
   ================================= */

const academicYearElement =
    document.getElementById(
        "academicYear"
    );


if (academicYearElement) {

    academicYearElement.addEventListener(
        "change",
        () => {

            loadStudents();

        }
    );

}


const studentElement =
    document.getElementById(
        "student"
    );


if (studentElement) {

    studentElement.addEventListener(
        "change",
        loadStudentInformation
    );

}


const paymentForm =
    document.getElementById(
        "paymentForm"
    );


if (paymentForm) {

    paymentForm.addEventListener(
        "submit",
        savePayment
    );

}


const backButton =
    document.getElementById(
        "backButton"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        goBack
    );

}


const cancelButton =
    document.getElementById(
        "cancelButton"
    );


if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        goBack
    );

}


/* =================================
   Initialize
   ================================= */

async function initializePage() {

    if (!institutionId) {

        alert(
            "Institution ID is missing."
        );

        return;

    }


    const institutionLoaded =
        loadInstitution();


    if (!institutionLoaded) {

        return;

    }


    loadCurrentUser();


    document.getElementById(
        "paymentDate"
    ).value =
        new Date()
            .toISOString()
            .split("T")[0];


    setReceiptNumber();


    /*
       Load students from Google Sheets.
    */

    const loaded =
        await loadStudentsFromBackend();


    if (!loaded) {

        return;

    }


    /*
       Build academic year list
       from the backend students.
    */

    loadAcademicYears();


    /*
       Load students for the
       selected academic year.
    */

    loadStudents();

}


/* =================================
   Start
   ================================= */

initializePage();
