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

    /*
     * Do NOT allow authentication errors
     * to stop the entire page.
     */

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
     * Get institution directly from
     * the current user first.
     */

    if (
        currentUser &&
        currentUser.institutionId
    ) {

        institutionId =
            currentUser.institutionId;

    }


    /*
     * Try auth helper if needed.
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
     * URL fallback.
     */

    if (!institutionId) {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const urlInstitutionId =
            params.get(
                "institutionId"
            );


        const urlId =
            params.get(
                "id"
            );


        institutionId =
            urlInstitutionId ||
            urlId ||
            null;

    }


    /*
     * Final localStorage fallback.
     */

    if (!institutionId) {

        try {

            const storedUser =
                JSON.parse(
                    localStorage.getItem(
                        "bmpCurrentUser"
                    )
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
                "Could not read stored user:",
                error
            );

        }

    }


    return true;

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

    const institutionNameElement =
        getElement(
            "institutionName"
        );


    const institutionIdElement =
        getElement(
            "institutionId"
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
                    currentUser.schoolName
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


    if (
        now.getMonth() < 9
    ) {

        year--;

    }


    return `${year}-${year + 1}`;

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

        const result =
            await apiRequest(
                "getPayments"
            );


        allPayments =
            Array.isArray(
                result.payments
            )
                ? result.payments
                : [];


        loadAcademicYearFilter();

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


    const academicYear =
        getElement(
            "academicYear"
        )?.value || "";


    const month =
        getElement(
            "paymentMonth"
        )?.value || "";


    const stage =
        getElement(
            "stageFilter"
        )?.value || "";


    const search =
        (
            getElement(
                "studentSearch"
            )?.value || ""
        )
        .trim()
        .toLowerCase();


    payments =
        payments.filter(
            payment => {

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


                if (
                    month &&
                    String(
                        payment.month ||
                        ""
                    ).toLowerCase() !==
                    month.toLowerCase()
                ) {

                    return false;

                }


                /*
                 * Only filter by stage when
                 * payment.stage actually exists.
                 */

                if (
                    stage &&
                    payment.stage &&
                    String(
                        payment.stage
                    ).toLowerCase() !==
                    stage.toLowerCase()
                ) {

                    return false;

                }


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


                    if (
                        !studentName.includes(
                            search
                        ) &&
                        !studentNumber.includes(
                            search
                        ) &&
                        !studentId.includes(
                            search
                        )
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    payments.sort(
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


    const totalPayments =
        payments.length;


    const totalAmount =
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


    const totalPaymentsElement =
        getElement(
            "totalPayments"
        );


    if (totalPaymentsElement) {

        totalPaymentsElement.textContent =
            totalPayments.toLocaleString();

    }


    const totalAmountElement =
        getElement(
            "totalAmount"
        );


    if (totalAmountElement) {

        totalAmountElement.textContent =
            totalAmount.toLocaleString();

    }


    const displayedPaymentsElement =
        getElement(
            "displayedPayments"
        );


    if (displayedPaymentsElement) {

        displayedPaymentsElement.textContent =
            totalPayments.toLocaleString();

    }


    const tbody =
        getElement(
            "paymentsTableBody"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML =
        "";


    if (
        payments.length === 0
    ) {

        showEmpty();

        return;

    }


    hideEmpty();


    payments.forEach(
        payment => {

            const row =
                document.createElement(
                    "tr"
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


    return month;

}


/* =================================
   Date
   ================================= */

function formatDate(date) {

    if (!date) {

        return "-";

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
        "en-US"
    );

}


/* =================================
   HTML Escape
   ================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =================================
   Payment Details
   ================================= */

function showPaymentDetails(payment) {

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
            params.get("institutionId") ||
            params.get("id") ||
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
                event.key === "Escape"
            ) {

                closePaymentDetails();

            }

        }
    );

}


/* =================================
   Initialize
   ================================= */

function initializePage() {

    if (pageInitialized) {

        return;

    }


    pageInitialized =
        true;


    initializeAuthentication();

    loadInstitution();

    setupEventListeners();


    if (institutionId) {

        loadPayments();

    } else {

        showError(
            "Institution ID is missing."
        );

    }

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
