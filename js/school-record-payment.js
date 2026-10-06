/* =================================
   School Record Payment - BMP
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
let selectedStudent = null;
let pageInitialized = false;


/* =================================
   Authentication
   ================================= */

function initializeAuthentication() {

    try {

        if (typeof requireSchoolLogin === "function") {

            currentUser = requireSchoolLogin();

        }

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

    }


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


    /*
     * Resolve institution ID.
     */

    try {

        if (typeof getActiveInstitutionId === "function") {

            institutionId =
                getActiveInstitutionId();

        }

    } catch (error) {

        console.error(
            "Institution helper error:",
            error
        );

    }


    if (!institutionId) {

        const params =
            new URLSearchParams(
                window.location.search
            );

        institutionId =
            params.get("institutionId") ||
            params.get("id") ||
            "";

    }


    if (!institutionId) {

        institutionId =
            currentUser.institutionId ||
            "";

    }


    institutionId =
        String(
            institutionId || ""
        ).trim();


    return Boolean(
        institutionId
    );

}


/* =================================
   Username
   ================================= */

function getCurrentUsername() {

    if (
        currentUser &&
        currentUser.username
    ) {

        return String(
            currentUser.username
        ).trim();

    }


    if (
        currentUser &&
        currentUser.userName
    ) {

        return String(
            currentUser.userName
        ).trim();

    }


    if (
        currentUser &&
        currentUser.name
    ) {

        return String(
            currentUser.name
        ).trim();

    }


    return "";

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
        getCurrentUsername();


    if (!username) {

        throw new Error(
            "Current user is missing."
        );

    }


    const payload = {

        action:
            action,

        institutionId:
            institutionId,

        username:
            username,

        ...data

    };


    console.log(
        "BMP API request:",
        payload
    );


    let response;


    try {

        response =
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

    } catch (error) {

        throw new Error(
            "Could not connect to the school server. " +
            "Please check the Apps Script Web App URL and your internet connection."
        );

    }


    const responseText =
        await response.text();


    console.log(
        "BMP API response:",
        responseText
    );


    if (!response.ok) {

        throw new Error(
            `Server error: ${response.status}`
        );

    }


    let result;


    try {

        result =
            JSON.parse(
                responseText
            );

    } catch (error) {

        throw new Error(
            "The server returned an invalid response: " +
            responseText.substring(0, 300)
        );

    }


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
     * October -> June
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

            if (student.academicYear) {

                years.add(
                    String(
                        student.academicYear
                    ).trim()
                );

            }

        }
    );


    const currentYear =
        getCurrentAcademicYear();


    years.add(
        currentYear
    );


    return Array
        .from(years)
        .filter(Boolean)
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


    select.innerHTML =
        `<option value="">Select Academic Year</option>`;


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
                student => {

                    if (
                        !student.institutionId
                    ) {

                        return true;

                    }


                    return String(
                        student.institutionId
                    ) ===
                    String(
                        institutionId
                    );

                }
            );


        console.log(
            "Students loaded:",
            students.length
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


/* =================================
   Student Helpers
   ================================= */

function getStudentId(student) {

    return String(
        student.studentId ||
        student.id ||
        ""
    ).trim();

}


function getInstitutionStudents() {

    return students.filter(
        student => {

            if (
                !student.institutionId
            ) {

                return true;

            }


            return String(
                student.institutionId
            ) ===
            String(
                institutionId
            );

        }
    );

}


function normalizeStudentNumber(value) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase();

}


/* =================================
   Search Student
   ================================= */

function searchStudentByNumber() {

    clearError();


    const academicYearElement =
        document.getElementById(
            "academicYear"
        );


    const searchElement =
        document.getElementById(
            "studentNumberSearch"
        );


    const academicYear =
        academicYearElement
            ? String(
                academicYearElement.value || ""
            ).trim()
            : "";


    const studentNumber =
        searchElement
            ? normalizeStudentNumber(
                searchElement.value
            )
            : "";


    if (!academicYear) {

        clearStudentInformation();

        showError(
            "Please select an academic year first."
        );

        return;

    }


    if (!studentNumber) {

        clearStudentInformation();

        showError(
            "Please enter the student number."
        );

        return;

    }


    const matches =
        getInstitutionStudents()
            .filter(
                student => {

                    const sameYear =
                        String(
                            student.academicYear ||
                            ""
                        ).trim() ===
                        academicYear;


                    const number =
                        normalizeStudentNumber(
                            student.studentNumber
                        );


                    return (
                        sameYear &&
                        number ===
                        studentNumber
                    );

                }
            );


    if (matches.length === 0) {

        selectedStudent =
            null;

        clearStudentInformation();

        showStudentSearchResult(
            "Student not found for this academic year.",
            true
        );

        return;

    }


    if (matches.length > 1) {

        selectedStudent =
            null;

        clearStudentInformation();

        showStudentSearchResult(
            "More than one student has this student number.",
            true
        );

        return;

    }


    const student =
        matches[0];


    selectedStudent =
        student;


    const studentIdElement =
        document.getElementById(
            "studentId"
        );

    const studentNameElement =
        document.getElementById(
            "studentName"
        );

    const studentNumberElement =
        document.getElementById(
            "studentNumber"
        );

    const stageElement =
        document.getElementById(
            "stage"
        );

    const classNameElement =
        document.getElementById(
            "className"
        );


    if (studentIdElement) {

        studentIdElement.value =
            getStudentId(
                student
            );

    }


    if (studentNameElement) {

        studentNameElement.value =
            student.name ||
            "";

    }


    if (studentNumberElement) {

        studentNumberElement.value =
            student.studentNumber ||
            "";

    }


    if (stageElement) {

        stageElement.value =
            formatStage(
                student.stage
            );

    }


    if (classNameElement) {

        classNameElement.value =
            student.className ||
            student.class ||
            student.classNumber ||
            "";

    }


    showStudentSearchResult(
        `Student found: ${student.name || "-"}`
    );

}


/* =================================
   Search Result
   ================================= */

function showStudentSearchResult(
    message,
    isError = false
) {

    const element =
        document.getElementById(
            "studentSearchResult"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.classList.toggle(
        "error",
        Boolean(isError)
    );


    element.style.display =
        "block";

}


function clearStudentSearchResult() {

    const element =
        document.getElementById(
            "studentSearchResult"
        );


    if (!element) {

        return;

    }


    element.textContent =
        "";

    element.classList.remove(
        "error"
    );

    element.style.display =
        "none";

}


/* =================================
   Student Information
   ================================= */

function clearStudentInformation() {

    selectedStudent =
        null;


    const ids = [
        "studentId",
        "studentName",
        "studentNumber",
        "stage",
        "className"
    ];


    ids.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );

            if (element) {

                element.value =
                    "";

            }

        }
    );


    clearStudentSearchResult();

}


/* =================================
   Stage
   ================================= */

function formatStage(stage) {

    if (!stage) {

        return "-";

    }


    const value =
        String(
            stage
        )
        .trim()
        .toLowerCase();


    const stages = {

        primary:
            "Primary",

        preparatory:
            "Preparatory",

        secondary:
            "Secondary"

    };


    return (
        stages[value] ||
        stage
    );

}


/* =================================
   Current User
   ================================= */

function loadCurrentUser() {

    const recordedBy =
        document.getElementById(
            "recordedBy"
        );


    if (recordedBy) {

        recordedBy.value =
            getCurrentUsername() ||
            "Unknown User";

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

function clearError() {

    const error =
        document.getElementById(
            "errorMessage"
        );


    if (error) {

        error.style.display =
            "none";

        error.textContent =
            "";

    }

}


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
            String(
                message ||
                "An error occurred."
            );

        error.style.display =
            "block";

    }


    console.error(
        "BMP Error:",
        message
    );

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
            String(
                message
            );

        success.style.display =
            "block";

    }

}


/* =================================
   Save Payment
   ================================= */

async function savePayment(event) {

    event.preventDefault();

    clearError();


    const academicYear =
        document.getElementById(
            "academicYear"
        )?.value.trim();


    const studentId =
        document.getElementById(
            "studentId"
        )?.value.trim();


    const month =
        document.getElementById(
            "month"
        )?.value.trim();


    const amount =
        Number(
            document.getElementById(
                "amount"
            )?.value
        );


    const paymentDate =
        document.getElementById(
            "paymentDate"
        )?.value;


    const notes =
        document.getElementById(
            "notes"
        )?.value.trim() || "";


    /* Validation */

    if (!academicYear) {

        showError(
            "Please select an academic year."
        );

        return;

    }


    if (
        !studentId ||
        !selectedStudent
    ) {

        showError(
            "Please search and select a valid student first."
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
        !Number.isFinite(amount) ||
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
            item => {

                return (
                    getStudentId(item) ===
                    studentId &&
                    String(
                        item.academicYear ||
                        ""
                    ).trim() ===
                    academicYear
                );

            }
        );


    if (!student) {

        showError(
            "Student not found for the selected academic year."
        );

        return;

    }


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
            "Payment recorded successfully." +
            (
                receiptNumber
                    ? ` Receipt: ${receiptNumber}`
                    : ""
            )
        );


        setTimeout(
            () => {

                window.location.href =
                    "school-payments.html?id=" +
                    encodeURIComponent(
                        institutionId
                    );

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

    const id =
        institutionId ||
        currentUser?.institutionId ||
        "";


    if (id) {

        window.location.href =
            "school-payments.html?id=" +
            encodeURIComponent(
                id
            );

    } else {

        window.location.href =
            "school-payments.html";

    }

}


function goToPayments() {

    goBack();

}


/* =================================
   Event Listeners
   ================================= */

function setupEventListeners() {

    const academicYear =
        document.getElementById(
            "academicYear"
        );


    if (academicYear) {

        academicYear.addEventListener(
            "change",
            () => {

                clearStudentInformation();
                clearError();

            }
        );

    }


    const searchButton =
        document.getElementById(
            "searchStudentButton"
        );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchStudentByNumber
        );

    }


    const studentSearch =
        document.getElementById(
            "studentNumberSearch"
        );


    if (studentSearch) {

        studentSearch.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    searchStudentByNumber();

                }

            }
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

        showError(
            "School authentication failed. Please log in again."
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


    showSuccess(
        "Loading students..."
    );


    const loaded =
        await loadStudentsFromBackend();


    if (!loaded) {

        return;

    }


    if (!students.length) {

        showError(
            "No students were found for this school."
        );

        return;

    }


    loadAcademicYears();

    clearError();

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
