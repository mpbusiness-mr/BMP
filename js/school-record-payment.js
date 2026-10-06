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
   State
   ================================= */

let currentUser = null;
let institutionId = null;
let institution = null;
let students = [];
let pageInitialized = false;


/* =================================
   Authentication
   ================================= */

function initializeAuthentication() {

    try {

        if (
            typeof requireSchoolLogin ===
            "function"
        ) {

            currentUser =
                requireSchoolLogin();

        }

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

    }


    /*
       If authentication helper did not
       return the user, try localStorage.
    */

    if (!currentUser) {

        try {

            currentUser =
                JSON.parse(
                    localStorage.getItem(
                        "bmpCurrentUser"
                    ) || "null"
                );

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );

            currentUser = null;

        }

    }


    if (!currentUser) {

        return false;

    }


    /* =================================
       Institution ID
       ================================= */

    try {

        if (
            typeof getActiveInstitutionId ===
            "function"
        ) {

            institutionId =
                getActiveInstitutionId();

        }

    } catch (error) {

        console.error(
            "Institution helper error:",
            error
        );

    }


    /*
       Fallback to URL.
    */

    if (!institutionId) {

        const params =
            new URLSearchParams(
                window.location.search
            );


        institutionId =
            params.get(
                "institutionId"
            ) ||
            params.get(
                "id"
            );

    }


    /*
       Final fallback to logged-in user.
    */

    if (!institutionId) {

        institutionId =
            currentUser.institutionId ||
            null;

    }


    return Boolean(
        institutionId
    );

}


/* =================================
   Backend Request
   ================================= */

async function apiRequest(
    action,
    data = {}
) {

    if (!institutionId) {

        throw new Error(
            "Institution ID is missing."
        );

    }


    const username =
        currentUser &&
        (
            currentUser.username ||
            currentUser.userName ||
            currentUser.name
        )
        || "";


    const payload = {

        action:
            action,

        institutionId:
            institutionId,

        username:
            username

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
   Institution
   ================================= */

function loadInstitution() {

    institution = {

        id:
            institutionId,

        name:
            currentUser.institutionName ||
            currentUser.schoolName ||
            currentUser.institution ||
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
       October → June
    */

    if (
        now.getMonth() < 9
    ) {

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
                    String(
                        student.academicYear
                    )
                );

            }

        }
    );


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


        students =
            students.filter(
                student =>
                    !student.institutionId ||
                    String(
                        student.institutionId
                    ) ===
                    String(
                        institutionId
                    )
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


function getStudentId(student) {

    return String(
        student.studentId ||
        student.id ||
        ""
    );

}


function getInstitutionStudents() {

    return students.filter(
        student =>
            !student.institutionId ||
            String(
                student.institutionId
            ) ===
            String(
                institutionId
            )
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


    const academicYearElement =
        document.getElementById(
            "academicYear"
        );


    const academicYear =
        academicYearElement
            ? academicYearElement.value
            : "";


    const filteredStudents =
        getInstitutionStudents()
            .filter(
                student =>
                    String(
                        student.academicYear ||
                        ""
                    ) ===
                    String(
                        academicYear
                    )
            )
            .sort(
                (a, b) =>
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
                getStudentId(
                    student
                );


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

    const studentElement =
        document.getElementById(
            "student"
        );


    if (!studentElement) {
        return;
    }


    const studentId =
        String(
            studentElement.value ||
            ""
        );


    if (!studentId) {

        clearStudentInformation();

        return;

    }


    const academicYearElement =
        document.getElementById(
            "academicYear"
        );


    const academicYear =
        academicYearElement
            ? academicYearElement.value
            : "";


    const student =
        students.find(
            item =>

                getStudentId(item) ===
                    studentId &&

                String(
                    item.academicYear ||
                    ""
                ) ===
                    String(
                        academicYear
                    )
        );


    if (!student) {

        clearStudentInformation();

        return;

    }


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
            student.studentNumber ||
            "";

    }


    if (stage) {

        stage.value =
            formatStage(
                student.stage
            );

    }


    if (className) {

        className.value =
            student.className ||
            student.class ||
            student.classNumber ||
            "";

    }

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


    return stages[
        String(stage)
            .trim()
            .toLowerCase()
    ] ||
        stage;

}


/* =================================
   Current User
   ================================= */

function getCurrentUsername() {

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
            getCurrentUsername();

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


    element.value =
        receiptNumber ||
        "Generated after saving";

}


/* =================================
   Messages
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


    /* =================================
       Validation
       ================================= */

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


    const student =
        students.find(
            item =>

                getStudentId(item) ===
                    String(
                        studentId
                    ) &&

                String(
                    item.academicYear ||
                    ""
                ) ===
                    String(
                        academicYear
                    )
        );


    if (!student) {

        showError(
            "Student not found for the selected academic year."
        );

        return;

    }


    /* =================================
       Disable Button
       ================================= */

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

        /* =================================
           Send To Backend
           ================================= */

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


        /* =================================
           Backend Response
           ================================= */

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


        showSuccess(
            `Payment recorded successfully.${receiptNumber ? ` Receipt: ${receiptNumber}` : ""}`
        );


        /*
           Return to the payments page
           after successful recording.
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

    if (!institutionId) {

        window.location.href =
            "school-payments.html";

        return;

    }


    window.location.href =
        `school-payments.html?id=${encodeURIComponent(
            institutionId
        )}`;

}


function goToPayments() {

    goBack();

}


/* =================================
   Event Listeners
   ================================= */

function setupEventListeners() {

    const academicYearElement =
        document.getElementById(
            "academicYear"
        );


    if (academicYearElement) {

        academicYearElement.addEventListener(
            "change",
            loadStudents
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

        backButton.onclick =
            goBack;

    }


    const cancelButton =
        document.getElementById(
            "cancelButton"
        );


    if (cancelButton) {

        cancelButton.onclick =
            goBack;

    }

}


/* =================================
   Initialize
   ================================= */

async function initializePage() {

    if (pageInitialized) {
        return;
    }


    pageInitialized =
        true;


    const authenticated =
        initializeAuthentication();


    if (!authenticated) {

        console.error(
            "School authentication failed."
        );

        return;

    }


    if (!institutionId) {

        showError(
            "Institution ID is missing."
        );

        return;

    }


    loadInstitution();

    loadCurrentUser();


    const paymentDate =
        document.getElementById(
            "paymentDate"
        );


    if (paymentDate) {

        paymentDate.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }


    setReceiptNumber();


    const loaded =
        await loadStudentsFromBackend();


    if (!loaded) {

        return;

    }


    loadAcademicYears();

    loadStudents();

}


/* =================================
   Start
   ================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupEventListeners();

        initializePage();

    }
);
