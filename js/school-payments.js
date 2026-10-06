/* =================================
   School Payments - BMP
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

let allPayments = [];
let allStudents = [];

let pageInitialized = false;
let paymentsLoaded = false;


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
     * First try the authenticated
     * institution helper.
     */

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
     * Then URL.
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
            ) ||
            "";

    }


    /*
     * Finally stored user.
     */

    if (!institutionId) {

        institutionId =
            currentUser.institutionId ||
            "";

    }


    institutionId =
        String(
            institutionId ||
            ""
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
   API Request
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
                    method:
                        "POST",

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
            "Could not connect to the BMP server."
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
            "The server returned an invalid response."
        );

    }


    if (!result.success) {

        throw new Error(
            result.message ||
            "The request failed."
        );

    }


    return result;

}


/* =================================
   Current Academic Year
   ================================= */

function getCurrentAcademicYear() {

    const now =
        new Date();


    let year =
        now.getFullYear();


    /*
     * October -> June
     */

    if (
        now.getMonth() < 9
    ) {

        year--;

    }


    return `${year}-${year + 1}`;

}


/* =================================
   Students
   ================================= */

async function loadStudents() {

    try {

        const result =
            await apiRequest(
                "getStudents"
            );


        allStudents =
            Array.isArray(
                result.students
            )
                ? result.students
                : [];


        allStudents =
            allStudents.filter(
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
            allStudents.length
        );


        return true;

    } catch (error) {

        /*
         * Student loading should NOT
         * prevent payment loading.
         */

        console.error(
            "Students could not be loaded:",
            error
        );


        allStudents = [];


        return false;

    }

}


/* =================================
   Payment Helpers
   ================================= */

function getPaymentStudentId(payment) {

    return String(
        payment.studentId ||
        payment.studentID ||
        payment.student_id ||
        ""
    ).trim();

}


function getPaymentStudentNumber(payment) {

    return String(
        payment.studentNumber ||
        payment.student_number ||
        ""
    ).trim();

}


function getPaymentStudentName(payment) {

    return String(
        payment.studentName ||
        payment.name ||
        ""
    ).trim();

}


function getPaymentAcademicYear(payment) {

    return String(
        payment.academicYear ||
        payment.academic_year ||
        ""
    ).trim();

}


function getPaymentMonth(payment) {

    return String(
        payment.month ||
        ""
    ).trim();

}


function getPaymentAmount(payment) {

    const value =
        Number(
            payment.amount
        );


    return Number.isFinite(
        value
    )
        ? value
        : 0;

}


function getPaymentDate(payment) {

    return String(
        payment.paymentDate ||
        payment.date ||
        ""
    ).trim();

}


function getReceiptNumber(payment) {

    return String(
        payment.receiptNumber ||
        payment.receipt_number ||
        ""
    ).trim();

}


function getRecordedBy(payment) {

    return String(
        payment.recordedBy ||
        payment.recorded_by ||
        ""
    ).trim();

}


/* =================================
   Student Lookup
   ================================= */

function findStudentForPayment(payment) {

    const studentId =
        getPaymentStudentId(
            payment
        );


    const studentNumber =
        getPaymentStudentNumber(
            payment
        );


    /*
     * Prefer student ID.
     */

    if (studentId) {

        const byId =
            allStudents.find(
                student =>
                    String(
                        student.studentId ||
                        student.id ||
                        ""
                    ).trim() ===
                    studentId
            );


        if (byId) {

            return byId;

        }

    }


    /*
     * Fallback to student number.
     */

    if (studentNumber) {

        const byNumber =
            allStudents.find(
                student =>
                    String(
                        student.studentNumber ||
                        ""
                    ).trim().toLowerCase() ===
                    studentNumber.toLowerCase() &&
                    String(
                        student.academicYear ||
                        ""
                    ).trim() ===
                    getPaymentAcademicYear(
                        payment
                    )
            );


        if (byNumber) {

            return byNumber;

        }

    }


    return null;

}


/* =================================
   Stage
   ================================= */

function normalizeStage(stage) {

    return String(
        stage ||
        ""
    )
        .trim()
        .toLowerCase();

}


function getStageForPayment(payment) {

    /*
     * In case the backend already
     * sends the stage.
     */

    if (payment.stage) {

        return normalizeStage(
            payment.stage
        );

    }


    const student =
        findStudentForPayment(
            payment
        );


    if (!student) {

        return "";

    }


    return normalizeStage(
        student.stage
    );

}


function formatStage(stage) {

    const value =
        normalizeStage(
            stage
        );


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
        stage ||
        "-"
    );

}


/* =================================
   Load Payments
   ================================= */

async function loadPayments() {

    hideError();
    showLoading(
        "Loading payments..."
    );


    try {

        const result =
            await apiRequest(
                "getPayments"
            );


        /*
         * Support the normal:
         * result.payments
         *
         * and fallback:
         * result.data
         */

        if (
            Array.isArray(
                result.payments
            )
        ) {

            allPayments =
                result.payments;

        } else if (
            Array.isArray(
                result.data
            )
        ) {

            allPayments =
                result.data;

        } else {

            allPayments = [];

        }


        console.log(
            "Payments loaded:",
            allPayments.length
        );


        paymentsLoaded =
            true;


        hideLoading();


        return true;

    } catch (error) {

        console.error(
            "Failed to load payments:",
            error
        );


        paymentsLoaded =
            false;


        allPayments =
            [];


        hideLoading();


        showError(
            error.message ||
            "Failed to load payments."
        );


        updateSummary(
            []
        );


        renderPayments(
            []
        );


        return false;

    }

}


/* =================================
   Academic Years
   ================================= */

function loadAcademicYears() {

    const select =
        document.getElementById(
            "academicYear"
        );


    if (!select) {

        return;

    }


    const years =
        new Set();


    allPayments.forEach(
        payment => {

            const year =
                getPaymentAcademicYear(
                    payment
                );


            if (year) {

                years.add(
                    year
                );

            }

        }
    );


    allStudents.forEach(
        student => {

            if (
                student.academicYear
            ) {

                years.add(
                    String(
                        student.academicYear
                    ).trim()
                );

            }

        }
    );


    years.add(
        getCurrentAcademicYear()
    );


    const currentValue =
        select.value;


    select.innerHTML =
        `<option value="">All</option>`;


    Array
        .from(years)
        .filter(Boolean)
        .sort()
        .reverse()
        .forEach(
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


    if (
        currentValue &&
        years.has(
            currentValue
        )
    ) {

        select.value =
            currentValue;

    }

}


/* =================================
   Filtering
   ================================= */

function getFilteredPayments() {

    const academicYear =
        String(
            document.getElementById(
                "academicYear"
            )?.value ||
            ""
        ).trim();


    const month =
        String(
            document.getElementById(
                "paymentMonth"
            )?.value ||
            ""
        ).trim()
        .toLowerCase();


    const stage =
        String(
            document.getElementById(
                "stageFilter"
            )?.value ||
            ""
        ).trim()
        .toLowerCase();


    const search =
        String(
            document.getElementById(
                "studentSearch"
            )?.value ||
            ""
        ).trim()
        .toLowerCase();


    return allPayments.filter(
        payment => {

            const paymentYear =
                getPaymentAcademicYear(
                    payment
                );


            const paymentMonth =
                getPaymentMonth(
                    payment
                )
                .toLowerCase();


            const paymentStudentNumber =
                getPaymentStudentNumber(
                    payment
                )
                .toLowerCase();


            const paymentStudentName =
                getPaymentStudentName(
                    payment
                )
                .toLowerCase();


            const paymentStage =
                getStageForPayment(
                    payment
                );


            if (
                academicYear &&
                paymentYear !==
                academicYear
            ) {

                return false;

            }


            if (
                month &&
                paymentMonth !==
                month
            ) {

                return false;

            }


            if (
                stage &&
                paymentStage !==
                stage
            ) {

                return false;

            }


            if (search) {

                const matchesSearch =
                    paymentStudentNumber
                        .includes(search) ||
                    paymentStudentName
                        .includes(search);


                if (!matchesSearch) {

                    return false;

                }

            }


            return true;

        }
    );

}


/* =================================
   Sorting
   ================================= */

function sortPayments(payments) {

    return [
        ...payments
    ].sort(
        (
            a,
            b
        ) => {

            const dateA =
                new Date(
                    getPaymentDate(
                        a
                    ) ||
                    0
                ).getTime();


            const dateB =
                new Date(
                    getPaymentDate(
                        b
                    ) ||
                    0
                ).getTime();


            return (
                dateB -
                dateA
            );

        }
    );

}


/* =================================
   HTML Escape
   ================================= */

function escapeHtml(value) {

    return String(
        value ??
        ""
    )
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


/* =================================
   Render Payments
   ================================= */

function renderPayments(
    payments = getFilteredPayments()
) {

    const tbody =
        document.getElementById(
            "paymentsTableBody"
        );


    const tableSection =
        document.getElementById(
            "paymentsTableSection"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML =
        "";


    const sorted =
        sortPayments(
            payments
        );


    if (
        tableSection
    ) {

        tableSection.style.display =
            sorted.length
                ? "block"
                : "none";

    }


    if (
        emptyState
    ) {

        emptyState.style.display =
            sorted.length
                ? "none"
                : "block";

    }


    sorted.forEach(
        payment => {

            const row =
                document.createElement(
                    "tr"
                );


            const studentNumber =
                getPaymentStudentNumber(
                    payment
                );


            const studentName =
                getPaymentStudentName(
                    payment
                ) ||
                (
                    findStudentForPayment(
                        payment
                    )?.name ||
                    "-"
                );


            const academicYear =
                getPaymentAcademicYear(
                    payment
                );


            const month =
                getPaymentMonth(
                    payment
                );


            const amount =
                getPaymentAmount(
                    payment
                );


            const paymentDate =
                getPaymentDate(
                    payment
                );


            const receiptNumber =
                getReceiptNumber(
                    payment
                );


            const recordedBy =
                getRecordedBy(
                    payment
                );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        studentNumber ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        studentName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        academicYear ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        month ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        amount.toFixed(2)
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        paymentDate ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        receiptNumber ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        recordedBy ||
                        "-"
                    )}
                </td>

            `;


            row.style.cursor =
                "pointer";


            row.addEventListener(
                "click",
                () => {

                    showPaymentDetails(
                        payment
                    );

                }
            );


            tbody.appendChild(
                row
            );

        }
    );


    updateSummary(
        payments
    );

}


/* =================================
   Summary
   ================================= */

function updateSummary(
    displayedPayments
) {

    const totalPaymentsElement =
        document.getElementById(
            "totalPayments"
        );


    const totalAmountElement =
        document.getElementById(
            "totalAmount"
        );


    const displayedPaymentsElement =
        document.getElementById(
            "displayedPayments"
        );


    const totalAmount =
        allPayments.reduce(
            (
                sum,
                payment
            ) => {

                return (
                    sum +
                    getPaymentAmount(
                        payment
                    )
                );

            },
            0
        );


    if (
        totalPaymentsElement
    ) {

        totalPaymentsElement.textContent =
            String(
                allPayments.length
            );

    }


    if (
        totalAmountElement
    ) {

        totalAmountElement.textContent =
            totalAmount.toFixed(2);

    }


    if (
        displayedPaymentsElement
    ) {

        displayedPaymentsElement.textContent =
            String(
                displayedPayments.length
            );

    }

}


/* =================================
   Apply Filters
   ================================= */

function applyFilters() {

    if (!paymentsLoaded) {

        return;

    }


    const filtered =
        getFilteredPayments();


    renderPayments(
        filtered
    );

}


/* =================================
   Reset Filters
   ================================= */

function resetFilters() {

    const academicYear =
        document.getElementById(
            "academicYear"
        );


    const paymentMonth =
        document.getElementById(
            "paymentMonth"
        );


    const stageFilter =
        document.getElementById(
            "stageFilter"
        );


    const studentSearch =
        document.getElementById(
            "studentSearch"
        );


    if (academicYear) {

        academicYear.value =
            "";

    }


    if (paymentMonth) {

        paymentMonth.value =
            "";

    }


    if (stageFilter) {

        stageFilter.value =
            "";

    }


    if (studentSearch) {

        studentSearch.value =
            "";

    }


    applyFilters();

}


/* =================================
   Loading
   ================================= */

function showLoading(
    message = "Loading..."
) {

    const loading =
        document.getElementById(
            "loadingState"
        );


    const messageElement =
        document.getElementById(
            "loadingMessage"
        );


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    if (loading) {

        loading.style.display =
            "block";

    }

}


function hideLoading() {

    const loading =
        document.getElementById(
            "loadingState"
        );


    if (loading) {

        loading.style.display =
            "none";

    }

}


/* =================================
   Error
   ================================= */

function showError(message) {

    const errorState =
        document.getElementById(
            "errorState"
        );


    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    if (errorMessage) {

        errorMessage.textContent =
            String(
                message ||
                "An error occurred."
            );

    }


    if (errorState) {

        errorState.style.display =
            "block";

    }


    console.error(
        "BMP Payments Error:",
        message
    );

}


function hideError() {

    const errorState =
        document.getElementById(
            "errorState"
        );


    if (errorState) {

        errorState.style.display =
            "none";

    }

}


/* =================================
   Payment Details
   ================================= */

function showPaymentDetails(
    payment
) {

    const modal =
        document.getElementById(
            "paymentDetailsModal"
        );


    const content =
        document.getElementById(
            "paymentDetailsContent"
        );


    if (
        !modal ||
        !content
    ) {

        return;

    }


    const student =
        findStudentForPayment(
            payment
        );


    const studentName =
        getPaymentStudentName(
            payment
        ) ||
        student?.name ||
        "-";


    const stage =
        getStageForPayment(
            payment
        );


    const className =
        student?.className ||
        student?.class ||
        student?.classNumber ||
        "-";


    const studentNumber =
        getPaymentStudentNumber(
            payment
        ) ||
        student?.studentNumber ||
        "-";


    const academicYear =
        getPaymentAcademicYear(
            payment
        );


    const month =
        getPaymentMonth(
            payment
        );


    const amount =
        getPaymentAmount(
            payment
        );


    const paymentDate =
        getPaymentDate(
            payment
        );


    const receiptNumber =
        getReceiptNumber(
            payment
        );


    const recordedBy =
        getRecordedBy(
            payment
        );


    const notes =
        String(
            payment.notes ||
            ""
        );


    content.innerHTML = `

        <div class="info-grid">

            <div class="info-item">
                <span>Student Name</span>
                <strong>
                    ${escapeHtml(
                        studentName
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Student Number</span>
                <strong>
                    ${escapeHtml(
                        studentNumber
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Academic Year</span>
                <strong>
                    ${escapeHtml(
                        academicYear
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Stage</span>
                <strong>
                    ${escapeHtml(
                        formatStage(
                            stage
                        )
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Class</span>
                <strong>
                    ${escapeHtml(
                        className
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Month</span>
                <strong>
                    ${escapeHtml(
                        month
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Amount</span>
                <strong>
                    ${escapeHtml(
                        amount.toFixed(2)
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Payment Date</span>
                <strong>
                    ${escapeHtml(
                        paymentDate
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Receipt Number</span>
                <strong>
                    ${escapeHtml(
                        receiptNumber ||
                        "-"
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Recorded By</span>
                <strong>
                    ${escapeHtml(
                        recordedBy ||
                        "-"
                    )}
                </strong>
            </div>

            ${
                notes
                    ? `
                    <div
                        class="info-item"
                        style="grid-column: 1 / -1;">
                        <span>Notes</span>
                        <strong>
                            ${escapeHtml(
                                notes
                            )}
                        </strong>
                    </div>
                    `
                    : ""
            }

        </div>

    `;


    modal.style.display =
        "block";

}


/* =================================
   Close Modal
   ================================= */

function closePaymentDetails() {

    const modal =
        document.getElementById(
            "paymentDetailsModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


/* =================================
   Navigation
   ================================= */

function getNavigationInstitutionId() {

    if (institutionId) {

        return institutionId;

    }


    if (
        currentUser &&
        currentUser.institutionId
    ) {

        return String(
            currentUser.institutionId
        );

    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    return (
        params.get(
            "institutionId"
        ) ||
        params.get(
            "id"
        ) ||
        ""
    );

}


function goBack() {

    const id =
        getNavigationInstitutionId();


    if (id) {

        window.location.href =
            "school.html?id=" +
            encodeURIComponent(
                id
            );

    } else {

        window.location.href =
            "school.html";

    }

}


function goToRecordPayment() {

    const id =
        getNavigationInstitutionId();


    if (id) {

        window.location.href =
            "school-record-payment.html?id=" +
            encodeURIComponent(
                id
            );

    } else {

        window.location.href =
            "school-record-payment.html";

    }

}


/* =================================
   Event Listeners
   ================================= */

function setupEventListeners() {

    const backButton =
        document.getElementById(
            "backButton"
        );


    const recordPaymentButton =
        document.getElementById(
            "recordPaymentPageBtn"
        );


    const applyFiltersButton =
        document.getElementById(
            "applyFiltersBtn"
        );


    const resetFiltersButton =
        document.getElementById(
            "resetFiltersBtn"
        );


    const retryButton =
        document.getElementById(
            "retryBtn"
        );


    const searchInput =
        document.getElementById(
            "studentSearch"
        );


    const academicYear =
        document.getElementById(
            "academicYear"
        );


    const paymentMonth =
        document.getElementById(
            "paymentMonth"
        );


    const stageFilter =
        document.getElementById(
            "stageFilter"
        );


    const modalCloseButton =
        document.getElementById(
            "paymentDetailsCloseBtn"
        );


    const modalOverlay =
        document.getElementById(
            "paymentDetailsOverlay"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            goBack
        );

    }


    if (recordPaymentButton) {

        recordPaymentButton.addEventListener(
            "click",
            goToRecordPayment
        );

    }


    if (applyFiltersButton) {

        applyFiltersButton.addEventListener(
            "click",
            applyFilters
        );

    }


    if (resetFiltersButton) {

        resetFiltersButton.addEventListener(
            "click",
            resetFilters
        );

    }


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            initializePage
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    applyFilters();

                }

            }
        );

    }


    if (academicYear) {

        academicYear.addEventListener(
            "change",
            applyFilters
        );

    }


    if (paymentMonth) {

        paymentMonth.addEventListener(
            "change",
            applyFilters
        );

    }


    if (stageFilter) {

        stageFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (modalCloseButton) {

        modalCloseButton.addEventListener(
            "click",
            closePaymentDetails
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closePaymentDetails
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closePaymentDetails();

            }

        }
    );

}


/* =================================
   Initialize
   ================================= */

async function initializePage() {

    if (
        pageInitialized &&
        paymentsLoaded
    ) {

        return;

    }


    pageInitialized =
        true;


    hideError();


    const authenticated =
        initializeAuthentication();


    if (!authenticated) {

        showError(
            "School authentication failed. Please log in again."
        );

        return;

    }


    console.log(
        "Institution ID:",
        institutionId
    );


    /*
     * Load payments first.
     *
     * This is intentionally independent
     * from student loading.
     */

    const paymentsResult =
        await loadPayments();


    /*
     * Student data is only needed for
     * stage/class/name fallbacks.
     */

    await loadStudents();


    loadAcademicYears();


    if (paymentsResult) {

        applyFilters();

    }

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
