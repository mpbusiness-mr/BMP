/* =================================
   School Payments - BMP
   Google Sheets Version
   ================================= */


/* =================================
   Authentication
   ================================= */ 

const currentUser =
    requireSchoolLogin();

if (!currentUser) {
    throw new Error("School login required.");
}


const institutionId =
    getActiveInstitutionId();

if (!institutionId) {
    throw new Error("Institution access denied.");
}


/* =================================
   Apps Script Backend
   ================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


/* =================================
   State
   ================================= */

let allPayments = [];


/* =================================
   Helpers
   ================================= */

function getElement(id) {

    return document.getElementById(id);

}


function getCurrentUsername() {

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

async function apiRequest(action, data = {}) {

    const payload = {
        action: action,
        institutionId: institutionId,
        username: getCurrentUsername(),
        ...data
    };


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
                    JSON.stringify(payload)
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
        getElement("institutionName");


    const institutionIdElement =
        getElement("institutionId");


    if (institutionIdElement) {

        institutionIdElement.textContent =
            institutionId || "-";

    }


    if (institutionNameElement) {

        institutionNameElement.textContent =
            currentUser.institutionName ||
            currentUser.schoolName ||
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
       School year:
       October -> June
    */

    if (
        now.getMonth() < 9
    ) {

        year--;

    }


    return `${year}-${year + 1}`;

}


function loadAcademicYearFilter() {

    const select =
        getElement("academicYear");


    if (!select) {
        return;
    }


    /*
       Keep the first option:
       All
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


    const sortedYears =
        Array.from(years)
            .sort()
            .reverse();


    sortedYears.forEach(
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
       Select current academic year
       if it exists.
    */

    const currentYear =
        getCurrentAcademicYear();


    if (
        years.has(currentYear)
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


    /* =================================
       Filters
       ================================= */

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


                /* Academic Year */

                if (
                    academicYear &&
                    String(
                        payment.academicYear || ""
                    ) !==
                    String(
                        academicYear
                    )
                ) {

                    return false;

                }


                /* Month */

                if (
                    month &&
                    String(
                        payment.month || ""
                    ).toLowerCase() !==
                    String(
                        month
                    ).toLowerCase()
                ) {

                    return false;

                }


                /* Stage */

                if (
                    stage &&
                    String(
                        payment.stage || ""
                    ).toLowerCase() !==
                    String(
                        stage
                    ).toLowerCase()
                ) {

                    return false;

                }


                /* Search */

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


    /* =================================
       Sort
       ================================= */

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


    /* =================================
       Summary
       ================================= */

    const totalPayments =
        payments.length;


    const totalAmount =
        payments.reduce(
            (total, payment) => {

                return (
                    total +
                    Number(
                        payment.amount || 0
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


    /* =================================
       Table
       ================================= */

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


            const studentNumber =
                escapeHtml(
                    payment.studentNumber ||
                    "-"
                );


            const studentName =
                escapeHtml(
                    payment.studentName ||
                    "-"
                );


            const academicYearValue =
                escapeHtml(
                    payment.academicYear ||
                    "-"
                );


            const monthValue =
                escapeHtml(
                    getMonthDisplayName(
                        payment.month
                    )
                );


            const amount =
                Number(
                    payment.amount || 0
                ).toLocaleString();


            const paymentDate =
                formatDate(
                    payment.paymentDate ||
                    payment.date
                );


            const receiptNumber =
                escapeHtml(
                    payment.receiptNumber ||
                    "-"
                );


            const recordedBy =
                escapeHtml(
                    payment.recordedBy ||
                    "-"
                );


            row.innerHTML = `

                <td>
                    ${studentNumber}
                </td>

                <td>
                    ${studentName}
                </td>

                <td>
                    ${academicYearValue}
                </td>

                <td>
                    ${monthValue}
                </td>

                <td>
                    ${amount}
                </td>

                <td>
                    ${paymentDate}
                </td>

                <td>
                    ${receiptNumber}
                </td>

                <td>
                    ${recordedBy}
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

}


/* =================================
   Month Display
   ================================= */

function getMonthDisplayName(month) {

    if (!month) {
        return "-";
    }


    const months = {

        October: "October",

        November: "November",

        December: "December",

        January: "January",

        February: "February",

        March: "March",

        April: "April",

        May: "May",

        June: "June"

    };


    return (
        months[month] ||
        month
    );

}


/* =================================
   Date Format
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


    content.innerHTML = `

        <div class="payment-detail-row">

            <strong>
                Student Number
            </strong>

            <span>
                ${escapeHtml(
                    payment.studentNumber || "-"
                )}
            </span>

        </div>


        <div class="payment-detail-row">

            <strong>
                Student Name
            </strong>

            <span>
                ${escapeHtml(
                    payment.studentName || "-"
                )}
            </span>

        </div>


        <div class="payment-detail-row">

            <strong>
                Academic Year
            </strong>

            <span>
                ${escapeHtml(
                    payment.academicYear || "-"
                )}
            </span>

        </div>


        <div class="payment-detail-row">

            <strong>
                Month
            </strong>

            <span>
                ${escapeHtml(
                    getMonthDisplayName(
                        payment.month
                    )
                )}
            </span>

        </div>


        <div class="payment-detail-row">

            <strong>
                Amount
            </strong>

            <span>
                ${Number(
                    payment.amount || 0
                ).toLocaleString()}
            </span>

        </div>


        <div class="payment-detail-row">

            <strong>
                Payment Date
            </strong>

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

            <strong>
                Receipt Number
            </strong>

            <span>
                ${escapeHtml(
                    payment.receiptNumber ||
                    "-"
                )}
            </span>

        </div>


        <div class="payment-detail-row">

            <strong>
                Recorded By
            </strong>

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
   Loading / Error / Empty
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
   Apply Filters
   ================================= */

function applyFilters() {

    renderPayments();

}


/* =================================
   Reset Filters
   ================================= */

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

function goBack() {

    window.location.href =
        `school.html?id=${encodeURIComponent(
            institutionId
        )}`;

}


/*
   Record Payment Page

   This function is intentionally kept
   as a global function because the HTML
   button calls it directly.
*/

function goToRecordPayment() {

    if (!institutionId) {

        console.error(
            "Institution ID is missing."
        );

        return;

    }


    const targetUrl =
        `school-record-payment.html?id=${encodeURIComponent(
            institutionId
        )}`;


    window.location.href =
        targetUrl;

}


/* =================================
   Initialize Events
   ================================= */

function setupEventListeners() {

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


    const recordPaymentPageBtn =
        getElement(
            "recordPaymentPageBtn"
        );


    /* Academic Year */

    if (academicYear) {

        academicYear.addEventListener(
            "change",
            applyFilters
        );

    }


    /* Month */

    if (paymentMonth) {

        paymentMonth.addEventListener(
            "change",
            applyFilters
        );

    }


    /* Stage */

    if (stageFilter) {

        stageFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    /* Search */

    if (studentSearch) {

        studentSearch.addEventListener(
            "input",
            applyFilters
        );

    }


    /* Apply */

    if (applyFiltersBtn) {

        applyFiltersBtn.addEventListener(
            "click",
            applyFilters
        );

    }


    /* Reset */

    if (resetFiltersBtn) {

        resetFiltersBtn.addEventListener(
            "click",
            resetFilters
        );

    }


    /* Retry */

    if (retryBtn) {

        retryBtn.addEventListener(
            "click",
            loadPayments
        );

    }


    /*
       Record Payment

       HTML already has onclick as the
       primary navigation method.

       This event listener is kept as
       an additional backup.
    */

    if (recordPaymentPageBtn) {

        recordPaymentPageBtn.addEventListener(
            "click",
            goToRecordPayment
        );

    }


    /*
       Escape closes payment details.
    */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closePaymentDetails();

            }

        }
    );

}


/* =================================
   Start
   ================================= */

function initializePage() {

    loadInstitution();

    setupEventListeners();

    loadPayments();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePage
    );

} else {

    initializePage();

}
