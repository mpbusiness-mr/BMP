/* =================================
   School Payments - BMP
   Google Sheets Version
   ================================= */


/* =================================
   Configuration
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


/* =================================
   Helpers
   ================================= */

function getElement(id) {

    return document.getElementById(id);

}


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
            "School authentication error:",
            error
        );

    }


    /*
     * Fallback to localStorage
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
                "Could not read current user:",
                error
            );

            currentUser = null;

        }

    }


    /*
     * Institution from current user
     */

    if (
        currentUser &&
        currentUser.institutionId
    ) {

        institutionId =
            currentUser.institutionId;

    }


    /*
     * Auth helper fallback
     */

    if (
        !institutionId &&
        typeof getActiveInstitutionId ===
        "function"
    ) {

        try {

            institutionId =
                getActiveInstitutionId();

        } catch (error) {

            console.error(
                "Institution ID error:",
                error
            );

        }

    }


    /*
     * URL fallback
     */

    if (!institutionId) {

        try {

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
                null;

        } catch (error) {

            console.error(
                "URL error:",
                error
            );

        }

    }


    /*
     * Final localStorage fallback
     */

    if (!institutionId) {

        try {

            const storedUser =
                JSON.parse(
                    localStorage.getItem(
                        "bmpCurrentUser"
                    ) || "null"
                );


            if (
                storedUser &&
                storedUser.institutionId
            ) {

                institutionId =
                    storedUser.institutionId;

            }

        } catch (error) {

            console.error(
                "Stored user error:",
                error
            );

        }

    }


    return Boolean(
        institutionId
    );

}


/* =================================
   Username
   ================================= */

function getCurrentUsername() {

    if (!currentUser) {

        return "";

    }


    return (
        currentUser.username ||
        currentUser.userName ||
        currentUser.name ||
        ""
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


    const payload = {

        action:
            action,

        institutionId:
            institutionId,

        username:
            getCurrentUsername(),

        ...data

    };


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

    const institutionIdElement =
        getElement(
            "institutionId"
        );


    const institutionNameElement =
        getElement(
            "institutionName"
        );


    if (institutionIdElement) {

        institutionIdElement.textContent =
            institutionId || "-";

    }


    if (institutionNameElement) {

        institutionNameElement.textContent =
            (
                currentUser &&
                (
                    currentUser.institutionName ||
                    currentUser.schoolName ||
                    currentUser.institution
                )
            ) ||
            institutionId ||
            "-";

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
     * October → June
     */

    if (
        now.getMonth() < 9
    ) {

        year--;

    }


    return `${year}-${year + 1}`;

}


/* =================================
   Student Helpers
   ================================= */

function getStudentId(student) {

    return String(
        student.studentId ||
        student.id ||
        ""
    );

}


function getStudentById(studentId) {

    const id =
        String(
            studentId ||
            ""
        );


    if (!id) {

        return null;

    }


    return (
        allStudents.find(
            student =>
                getStudentId(student) ===
                id
        ) ||
        null
    );

}


function formatStage(stage) {

    if (!stage) {

        return "";

    }


    const normalized =
        String(stage)
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
        stages[normalized] ||
        String(stage)
    );

}


function getStudentStage(payment) {

    /*
     * If backend already sends stage,
     * use it first.
     */

    if (payment.stage) {

        return formatStage(
            payment.stage
        );

    }


    /*
     * Otherwise find student.
     */

    const student =
        getStudentById(
            payment.studentId
        );


    if (!student) {

        return "";

    }


    return formatStage(
        student.stage
    );

}


function getStudentClass(payment) {

    if (payment.className) {

        return payment.className;

    }


    if (payment.class) {

        return payment.class;

    }


    const student =
        getStudentById(
            payment.studentId
        );


    if (!student) {

        return "";

    }


    return (
        student.className ||
        student.class ||
        student.classNumber ||
        ""
    );

}


/* =================================
   Load Students
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


        /*
         * Keep only students belonging
         * to the current institution.
         */

        allStudents =
            allStudents.filter(
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


        /*
         * Payments can still be displayed
         * even if student loading fails.
         */

        allStudents = [];

        return false;

    }

}


/* =================================
   Academic Year Filter
   ================================= */

function loadAcademicYearFilter() {

    const select =
        getElement(
            "academicYear"
        );


    if (!select) {

        return;

    }


    /*
     * Keep "All"
     */

    while (
        select.options.length > 1
    ) {

        select.remove(1);

    }


    const years =
        new Set();


    allPayments.forEach(
        payment => {

            if (
                payment.academicYear
            ) {

                years.add(
                    String(
                        payment.academicYear
                    )
                );

            }

        }
    );


    /*
     * Also include current year
     */

    years.add(
        getCurrentAcademicYear()
    );


    Array.from(years)
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


    /*
     * Automatically select current
     * academic year if payments exist.
     */

    const currentYear =
        getCurrentAcademicYear();


    if (
        years.has(
            currentYear
        )
    ) {

        select.value =
            currentYear;

    }

}


/* =================================
   Load Payments
   ================================= */

async function loadPayments() {

    showLoading(true);

    hideError();

    hideEmpty();


    try {

        /*
         * Load payments
         */

        const paymentResult =
            await apiRequest(
                "getPayments"
            );


        allPayments =
            Array.isArray(
                paymentResult.payments
            )
                ? paymentResult.payments
                : [];


        /*
         * Load students as well.
         * This allows us to determine
         * stage/class from studentId.
         */

        await loadStudents();


        /*
         * Build academic-year filter.
         */

        loadAcademicYearFilter();


        /*
         * Display payments.
         */

        renderPayments();


    } catch (error) {

        console.error(
            "Failed to load payments:",
            error
        );


        showError(
            error.message ||
            "Failed to load payments."
        );

    } finally {

        showLoading(false);

    }

}


/* =================================
   Render Payments
   ================================= */

function renderPayments() {

    let payments =
        [...allPayments];


    /*
     * Academic Year
     */

    const academicYear =
        getElement(
            "academicYear"
        )?.value || "";


    /*
     * Month
     */

    const month =
        getElement(
            "paymentMonth"
        )?.value || "";


    /*
     * Stage
     */

    const stage =
        getElement(
            "stageFilter"
        )?.value || "";


    /*
     * Search
     */

    const search =
        (
            getElement(
                "studentSearch"
            )?.value || ""
        )
        .trim()
        .toLowerCase();


    /*
     * Apply filters
     */

    payments =
        payments.filter(
            payment => {

                /*
                 * Academic Year
                 */

                if (
                    academicYear &&
                    String(
                        payment.academicYear ||
                        ""
                    ) !==
                    String(
                        academicYear
                    )
                ) {

                    return false;

                }


                /*
                 * Month
                 */

                if (
                    month &&
                    String(
                        payment.month ||
                        ""
                    ).toLowerCase() !==
                    String(
                        month
                    ).toLowerCase()
                ) {

                    return false;

                }


                /*
                 * Stage
                 */

                if (stage) {

                    const paymentStage =
                        String(
                            getStudentStage(
                                payment
                            )
                        )
                        .trim()
                        .toLowerCase();


                    if (
                        paymentStage !==
                        stage.toLowerCase()
                    ) {

                        return false;

                    }

                }


                /*
                 * Search
                 */

                if (search) {

                    const studentName =
                        String(
                            payment.studentName ||
                            ""
                        ).toLowerCase();


                    const studentNumber =
                        String(
                            payment.studentNumber ||
                            ""
                        ).toLowerCase();


                    const studentId =
                        String(
                            payment.studentId ||
                            ""
                        ).toLowerCase();


                    const receiptNumber =
                        String(
                            payment.receiptNumber ||
                            ""
                        ).toLowerCase();


                    if (
                        !studentName.includes(
                            search
                        ) &&
                        !studentNumber.includes(
                            search
                        ) &&
                        !studentId.includes(
                            search
                        ) &&
                        !receiptNumber.includes(
                            search
                        )
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    /*
     * Newest payments first
     */

    payments.sort(
        (a, b) => {

            const dateA =
                parsePaymentDate(
                    a.paymentDate ||
                    a.date ||
                    a.createdAt
                );


            const dateB =
                parsePaymentDate(
                    b.paymentDate ||
                    b.date ||
                    b.createdAt
                );


            return dateB - dateA;

        }
    );


    /*
     * Summary
     */

    const totalPayments =
        allPayments.length;


    const totalAmount =
        allPayments.reduce(
            (total, payment) => {

                return (
                    total +
                    Number(
                        payment.amount ||
                        0
                    )
                );

            },
            0
        );


    const displayedPayments =
        payments.length;


    const displayedAmount =
        payments.reduce(
            (total, payment) => {

                return (
                    total +
                    Number(
                        payment.amount ||
                        0
                    )
                );

            },
            0
        );


    /*
     * Total Payments
     */

    const totalPaymentsElement =
        getElement(
            "totalPayments"
        );


    if (totalPaymentsElement) {

        totalPaymentsElement.textContent =
            totalPayments.toLocaleString();

    }


    /*
     * Total Amount
     */

    const totalAmountElement =
        getElement(
            "totalAmount"
        );


    if (totalAmountElement) {

        totalAmountElement.textContent =
            totalAmount.toLocaleString();

    }


    /*
     * Displayed Payments
     */

    const displayedPaymentsElement =
        getElement(
            "displayedPayments"
        );


    if (displayedPaymentsElement) {

        displayedPaymentsElement.textContent =
            displayedPayments.toLocaleString();

    }


    /*
     * Table
     */

    const tbody =
        getElement(
            "paymentsTableBody"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML =
        "";


    /*
     * No payments
     */

    if (
        payments.length === 0
    ) {

        showEmpty();

        return;

    }


    hideEmpty();


    /*
     * Display each payment
     */

    payments.forEach(
        payment => {

            const row =
                document.createElement(
                    "tr"
                );


            const stage =
                getStudentStage(
                    payment
                );


            const className =
                getStudentClass(
                    payment
                );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        payment.studentNumber ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        payment.studentName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        payment.academicYear ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        getMonthDisplayName(
                            payment.month
                        )
                    )}
                </td>

                <td>
                    ${Number(
                        payment.amount ||
                        0
                    ).toLocaleString()}
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
                        "-"
                    )}
                </td>

            `;


            /*
             * Store extra information
             * for the details modal.
             */

            row.dataset.studentStage =
                stage;


            row.dataset.studentClass =
                className;


            row.style.cursor =
                "pointer";


            row.addEventListener(
                "click",
                function () {

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

}


/* =================================
   Month
   ================================= */

function getMonthDisplayName(month) {

    if (!month) {

        return "-";

    }


    return String(
        month
    );

}


/* =================================
   Date Parsing
   ================================= */

function parsePaymentDate(value) {

    if (!value) {

        return 0;

    }


    /*
     * Handle YYYY-MM-DD safely
     * without timezone shifting.
     */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            String(value)
        )
    ) {

        const parts =
            String(value)
                .split("-")
                .map(Number);


        return new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        ).getTime();

    }


    const date =
        new Date(value);


    return isNaN(
        date.getTime()
    )
        ? 0
        : date.getTime();

}


/* =================================
   Date Display
   ================================= */

function formatDate(date) {

    if (!date) {

        return "-";

    }


    /*
     * YYYY-MM-DD
     */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            String(date)
        )
    ) {

        const parts =
            String(date)
                .split("-");


        return `${parts[2]}/${parts[1]}/${parts[0]}`;

    }


    const parsed =
        new Date(date);


    if (
        isNaN(
            parsed.getTime()
        )
    ) {

        return String(date);

    }


    return parsed.toLocaleDateString(
        "en-GB"
    );

}


/* =================================
   HTML Escape
   ================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
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
   Payment Details
   ================================= */

function showPaymentDetails(
    payment
) {

    const modal =
        getElement(
            "paymentDetailsModal"
        );


    const content =
        getElement(
            "paymentDetailsContent"
        );


    if (
        !modal ||
        !content
    ) {

        return;

    }


    const stage =
        getStudentStage(
            payment
        );


    const className =
        getStudentClass(
            payment
        );


    content.innerHTML = `

        <div class="payment-detail-row">
            <strong>Student Number</strong>
            <span>
                ${escapeHtml(
                    payment.studentNumber ||
                    "-"
                )}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>Student Name</strong>
            <span>
                ${escapeHtml(
                    payment.studentName ||
                    "-"
                )}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>Stage</strong>
            <span>
                ${escapeHtml(
                    stage ||
                    "-"
                )}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>Class</strong>
            <span>
                ${escapeHtml(
                    className ||
                    "-"
                )}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>Academic Year</strong>
            <span>
                ${escapeHtml(
                    payment.academicYear ||
                    "-"
                )}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>Month</strong>
            <span>
                ${escapeHtml(
                    getMonthDisplayName(
                        payment.month
                    )
                )}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>Amount</strong>
            <span>
                ${Number(
                    payment.amount ||
                    0
                ).toLocaleString()}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>Payment Date</strong>
            <span>
                ${escapeHtml(
                    formatDate(
                        payment.paymentDate ||
                        payment.date
                    )
                )}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>Receipt Number</strong>
            <span>
                ${escapeHtml(
                    payment.receiptNumber ||
                    "-"
                )}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>Recorded By</strong>
            <span>
                ${escapeHtml(
                    payment.recordedBy ||
                    "-"
                )}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>Notes</strong>
            <span>
                ${escapeHtml(
                    payment.notes ||
                    "-"
                )}
            </span>
        </div>

    `;


    modal.style.display =
        "flex";

}


/* =================================
   Close Modal
   ================================= */

function closePaymentDetails() {

    const modal =
        getElement(
            "paymentDetailsModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


/* =================================
   Loading
   ================================= */

function showLoading(show) {

    const loading =
        getElement(
            "loadingState"
        );


    const table =
        getElement(
            "paymentsTableSection"
        );


    if (loading) {

        loading.style.display =
            show
                ? "block"
                : "none";

    }


    if (table) {

        table.style.display =
            show
                ? "none"
                : "block";

    }

}


/* =================================
   Error
   ================================= */

function showError(message) {

    const errorState =
        getElement(
            "errorState"
        );


    const errorMessage =
        getElement(
            "errorMessage"
        );


    if (errorMessage) {

        errorMessage.textContent =
            message ||
            "An error occurred while loading payments.";

    }


    if (errorState) {

        errorState.style.display =
            "block";

    }

}


function hideError() {

    const errorState =
        getElement(
            "errorState"
        );


    if (errorState) {

        errorState.style.display =
            "none";

    }

}


/* =================================
   Empty
   ================================= */

function showEmpty() {

    const emptyState =
        getElement(
            "emptyState"
        );


    const table =
        getElement(
            "paymentsTableSection"
        );


    if (emptyState) {

        emptyState.style.display =
            "block";

    }


    if (table) {

        table.style.display =
            "none";

    }

}


function hideEmpty() {

    const emptyState =
        getElement(
            "emptyState"
        );


    const table =
        getElement(
            "paymentsTableSection"
        );


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    if (table) {

        table.style.display =
            "block";

    }

}


/* =================================
   Filters
   ================================= */

function applyFilters() {

    hideError();

    renderPayments();

}


function resetFilters() {

    const academicYear =
        getElement(
            "academicYear"
        );


    const paymentMonth =
        getElement(
            "paymentMonth"
        );


    const stageFilter =
        getElement(
            "stageFilter"
        );


    const studentSearch =
        getElement(
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


    hideError();

    renderPayments();

}


/* =================================
   Navigation
   ================================= */

function getNavigationInstitutionId() {

    if (institutionId) {

        return institutionId;

    }


    try {

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

    } catch (error) {

        return "";

    }

}


function goBack() {

    const id =
        getNavigationInstitutionId();


    if (id) {

        window.location.href =
            "school.html?id=" +
            encodeURIComponent(id);

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
            encodeURIComponent(id);

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
        getElement(
            "backButton"
        );


    const recordPaymentPageBtn =
        getElement(
            "recordPaymentPageBtn"
        );


    const academicYear =
        getElement(
            "academicYear"
        );


    const paymentMonth =
        getElement(
            "paymentMonth"
        );


    const stageFilter =
        getElement(
            "stageFilter"
        );


    const studentSearch =
        getElement(
            "studentSearch"
        );


    const applyFiltersBtn =
        getElement(
            "applyFiltersBtn"
        );


    const resetFiltersBtn =
        getElement(
            "resetFiltersBtn"
        );


    const retryBtn =
        getElement(
            "retryBtn"
        );


    const closeButton =
        getElement(
            "paymentDetailsCloseBtn"
        );


    const overlay =
        getElement(
            "paymentDetailsOverlay"
        );


    if (backButton) {

        backButton.onclick =
            goBack;

    }


    if (recordPaymentPageBtn) {

        recordPaymentPageBtn.onclick =
            function (event) {

                event.preventDefault();

                goToRecordPayment();

            };

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


    if (studentSearch) {

        studentSearch.addEventListener(
            "input",
            applyFilters
        );

    }


    if (applyFiltersBtn) {

        applyFiltersBtn.addEventListener(
            "click",
            applyFilters
        );

    }


    if (resetFiltersBtn) {

        resetFiltersBtn.addEventListener(
            "click",
            resetFilters
        );

    }


    if (retryBtn) {

        retryBtn.addEventListener(
            "click",
            loadPayments
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closePaymentDetails
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closePaymentDetails
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

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

    if (pageInitialized) {

        return;

    }


    pageInitialized =
        true;


    const authenticated =
        initializeAuthentication();


    if (!authenticated) {

        showError(
            "School authentication failed."
        );

        return;

    }


    loadInstitution();

    setupEventListeners();


    await loadPayments();

}


/* =================================
   Start
   ================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePage,
        {
            once: true
        }
    );

} else {

    initializePage();

}
