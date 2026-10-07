/* =====================================================
   School Payments - BMP
   Complete JavaScript
   ===================================================== */


/* =====================================================
   API
   ===================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


/* =====================================================
   State
   ===================================================== */

let currentUser = null;
let institutionId = null;

let allPayments = [];
let allStudents = [];

let pageInitialized = false;
let paymentsLoaded = false;

let currentLanguage = "en";


/* =====================================================
   Translations
   ===================================================== */

const TRANSLATIONS = {

    en: {

        pageTitle: "School Payments",
        pageSubtitle: "View and manage student payments",

        back: "Back",
        recordPayment: "Record Payment",

        search: "Search",
        searchPlaceholder: "Search by student name or number",

        academicYear: "Academic Year",
        stage: "Stage",
        month: "Month",

        allYears: "All Academic Years",
        allStages: "All Stages",
        allMonths: "All Months",

        applyFilters: "Apply Filters",
        resetFilters: "Reset",

        totalPayments: "Total Payments",
        totalAmount: "Total Amount",
        studentsPaid: "Students Paid",

        studentName: "Student Name",
        studentNumber: "Student Number",
        className: "Class",
        paidMonth: "Paid Month",
        amount: "Amount",
        paymentDate: "Payment Date",
        receiptNumber: "Receipt Number",
        recordedBy: "Recorded By",
        notes: "Notes",

        paymentDetails: "Payment Details",

        close: "Close",
        printReceipt: "Print Receipt",

        loading: "Loading payments...",
        noPayments: "No payments found",
        noPaymentsDescription: "There are no payments matching your current filters.",

        errorTitle: "Something went wrong",
        retry: "Try Again",

        paymentNotFound: "Payment not found.",
        studentNotFound: "Student not found.",

        receiptTitle: "Official Payment Receipt",

        october: "October",
        november: "November",
        december: "December",
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",

        primary: "Primary",
        preparatory: "Preparatory",
        secondary: "Secondary",

        currency: "MRU",

        unauthorized: "Unauthorized access.",
        sessionExpired: "Your session has expired.",
        failedToLoad: "Failed to load data.",
        failedToPrint: "Failed to print receipt."
    },


    ar: {

        pageTitle: "مدفوعات المدرسة",
        pageSubtitle: "عرض وإدارة مدفوعات الطلاب",

        back: "رجوع",
        recordPayment: "تسجيل دفعة",

        search: "بحث",
        searchPlaceholder: "البحث باسم الطالب أو رقمه",

        academicYear: "السنة الدراسية",
        stage: "المرحلة",
        month: "الشهر",

        allYears: "كل السنوات الدراسية",
        allStages: "كل المراحل",
        allMonths: "كل الأشهر",

        applyFilters: "تطبيق الفلاتر",
        resetFilters: "إعادة تعيين",

        totalPayments: "إجمالي المدفوعات",
        totalAmount: "إجمالي المبلغ",
        studentsPaid: "الطلاب الذين دفعوا",

        studentName: "اسم الطالب",
        studentNumber: "رقم الطالب",
        className: "القسم",
        paidMonth: "الشهر المدفوع",
        amount: "المبلغ",
        paymentDate: "تاريخ الدفع",
        receiptNumber: "رقم الإيصال",
        recordedBy: "سجلها المستخدم",
        notes: "ملاحظات",

        paymentDetails: "تفاصيل الدفعة",

        close: "إغلاق",
        printReceipt: "طباعة الإيصال",

        loading: "جاري تحميل المدفوعات...",
        noPayments: "لا توجد مدفوعات",
        noPaymentsDescription: "لا توجد مدفوعات تطابق الفلاتر الحالية.",

        errorTitle: "حدث خطأ",
        retry: "إعادة المحاولة",

        paymentNotFound: "لم يتم العثور على الدفعة.",
        studentNotFound: "لم يتم العثور على الطالب.",

        receiptTitle: "إيصال دفع رسمي",

        october: "أكتوبر",
        november: "نوفمبر",
        december: "ديسمبر",
        january: "يناير",
        february: "فبراير",
        march: "مارس",
        april: "أبريل",
        may: "مايو",
        june: "يونيو",

        primary: "الابتدائية",
        preparatory: "الإعدادية",
        secondary: "الثانوية",

        currency: "أوقية",

        unauthorized: "غير مصرح بالدخول.",
        sessionExpired: "انتهت جلسة الدخول.",
        failedToLoad: "فشل تحميل البيانات.",
        failedToPrint: "فشل طباعة الإيصال."
    },


    fr: {

        pageTitle: "Paiements scolaires",
        pageSubtitle: "Afficher et gérer les paiements des élèves",

        back: "Retour",
        recordPayment: "Enregistrer un paiement",

        search: "Recherche",
        searchPlaceholder: "Rechercher par nom ou numéro",

        academicYear: "Année scolaire",
        stage: "Niveau",
        month: "Mois",

        allYears: "Toutes les années scolaires",
        allStages: "Tous les niveaux",
        allMonths: "Tous les mois",

        applyFilters: "Appliquer",
        resetFilters: "Réinitialiser",

        totalPayments: "Total des paiements",
        totalAmount: "Montant total",
        studentsPaid: "Élèves ayant payé",

        studentName: "Nom de l'élève",
        studentNumber: "Numéro de l'élève",
        className: "Classe",
        paidMonth: "Mois payé",
        amount: "Montant",
        paymentDate: "Date du paiement",
        receiptNumber: "Numéro du reçu",
        recordedBy: "Enregistré par",
        notes: "Notes",

        paymentDetails: "Détails du paiement",

        close: "Fermer",
        printReceipt: "Imprimer le reçu",

        loading: "Chargement des paiements...",
        noPayments: "Aucun paiement trouvé",
        noPaymentsDescription: "Aucun paiement ne correspond aux filtres actuels.",

        errorTitle: "Une erreur est survenue",
        retry: "Réessayer",

        paymentNotFound: "Paiement introuvable.",
        studentNotFound: "Élève introuvable.",

        receiptTitle: "Reçu de paiement officiel",

        october: "Octobre",
        november: "Novembre",
        december: "Décembre",
        january: "Janvier",
        february: "Février",
        march: "Mars",
        april: "Avril",
        may: "Mai",
        june: "Juin",

        primary: "Primaire",
        preparatory: "Collège",
        secondary: "Secondaire",

        currency: "MRU",

        unauthorized: "Accès non autorisé.",
        sessionExpired: "Votre session a expiré.",
        failedToLoad: "Échec du chargement des données.",
        failedToPrint: "Échec de l'impression du reçu."
    }
};


/* =====================================================
   Translation
   ===================================================== */

function t(key) {

    return (
        TRANSLATIONS[currentLanguage]?.[key] ??
        TRANSLATIONS.en[key] ??
        key
    );
}


/* =====================================================
   Language
   ===================================================== */

function getSavedLanguage() {

    return (
        localStorage.getItem("bmpLanguage") ||
        localStorage.getItem("language") ||
        "en"
    );
}


function setLanguage(language) {

    if (!TRANSLATIONS[language]) {
        language = "en";
    }

    currentLanguage = language;

    localStorage.setItem("bmpLanguage", language);
    localStorage.setItem("language", language);

    applyLanguage();

    updateFilterOptions();

    renderPayments();
}


function applyLanguage() {

    document.documentElement.lang = currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar" ? "rtl" : "ltr";

    const elements =
        document.querySelectorAll("[data-i18n]");

    elements.forEach(element => {

        const key = element.getAttribute("data-i18n");

        if (key) {
            element.textContent = t(key);
        }
    });

    const placeholders =
        document.querySelectorAll("[data-i18n-placeholder]");

    placeholders.forEach(element => {

        const key =
            element.getAttribute("data-i18n-placeholder");

        if (key) {
            element.placeholder = t(key);
        }
    });

    updateLanguageSelector();
}


function updateFilterOptions() {

    const stageSelect =
        document.getElementById("stageFilter");

    if (stageSelect) {

        const currentValue = stageSelect.value;

        const options = [
            {
                value: "",
                label: t("allStages")
            },
            {
                value: "primary",
                label: t("primary")
            },
            {
                value: "preparatory",
                label: t("preparatory")
            },
            {
                value: "secondary",
                label: t("secondary")
            }
        ];

        stageSelect.innerHTML =
            options
                .map(option =>
                    `<option value="${escapeHtml(option.value)}">
                        ${escapeHtml(option.label)}
                    </option>`
                )
                .join("");

        stageSelect.value = currentValue;
    }


    const monthSelect =
        document.getElementById("monthFilter");

    if (monthSelect) {

        const currentValue = monthSelect.value;

        const months = [
            ["", "allMonths"],
            ["October", "october"],
            ["November", "november"],
            ["December", "december"],
            ["January", "january"],
            ["February", "february"],
            ["March", "march"],
            ["April", "april"],
            ["May", "may"],
            ["June", "june"]
        ];

        monthSelect.innerHTML =
            months
                .map(([value, key]) =>
                    `<option value="${escapeHtml(value)}">
                        ${escapeHtml(t(key))}
                    </option>`
                )
                .join("");

        monthSelect.value = currentValue;
    }
}


function ensureLanguageSelector() {

    let selector =
        document.getElementById("languageSelector");

    if (selector) {
        return;
    }

    const headerActions =
        document.querySelector(".header-actions");

    if (!headerActions) {
        return;
    }

    selector = document.createElement("select");

    selector.id = "languageSelector";

    selector.style.height = "42px";
    selector.style.padding = "0 10px";
    selector.style.border = "1px solid #d1d5db";
    selector.style.borderRadius = "7px";
    selector.style.background = "#fff";
    selector.style.cursor = "pointer";

    selector.innerHTML = `
        <option value="en">English</option>
        <option value="ar">العربية</option>
        <option value="fr">Français</option>
    `;

    selector.addEventListener("change", function () {

        setLanguage(this.value);

    });

    headerActions.appendChild(selector);
}


function updateLanguageSelector() {

    const selector =
        document.getElementById("languageSelector");

    if (selector) {
        selector.value = currentLanguage;
    }
}


/* =====================================================
   API Request
   ===================================================== */

async function apiRequest(action, data = {}) {

    const payload = {

        action,

        ...data,

        institutionId:
            data.institutionId ||
            institutionId ||
            "",

        username:
            data.username ||
            getCurrentUsername() ||
            ""
    };


    const response =
        await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body: JSON.stringify(payload)
        });


    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}`
        );
    }


    const text =
        await response.text();

    let result;

    try {

        result = JSON.parse(text);

    } catch (error) {

        throw new Error(
            "Invalid server response."
        );
    }


    if (
        result &&
        result.success === false
    ) {

        throw new Error(
            translateBackendError(
                result.message ||
                result.error ||
                "Request failed."
            )
        );
    }


    return result;
}


/* =====================================================
   Backend Error Translation
   ===================================================== */

function translateBackendError(message) {

    if (!message) {
        return t("failedToLoad");
    }

    const normalized =
        String(message).toLowerCase();

    if (
        normalized.includes("unauthorized") ||
        normalized.includes("not authorized")
    ) {
        return t("unauthorized");
    }

    if (
        normalized.includes("session") &&
        normalized.includes("expired")
    ) {
        return t("sessionExpired");
    }

    return message;
}


/* =====================================================
   Authentication
   ===================================================== */

function initializeAuthentication() {

    try {

        if (
            typeof window.requireSchoolLogin ===
            "function"
        ) {

            const result =
                window.requireSchoolLogin();

            if (result) {
                currentUser = result;
            }
        }

    } catch (error) {

        console.warn(
            "School login helper failed:",
            error
        );
    }


    if (!currentUser) {

        try {

            const savedUser =
                localStorage.getItem(
                    "bmpCurrentUser"
                );

            if (savedUser) {

                currentUser =
                    JSON.parse(savedUser);
            }

        } catch (error) {

            console.warn(
                "Could not read saved user:",
                error
            );
        }
    }


    if (!institutionId) {

        try {

            if (
                typeof window.getActiveInstitutionId ===
                "function"
            ) {

                institutionId =
                    window.getActiveInstitutionId();
            }

        } catch (error) {

            console.warn(
                "Could not get active institution:",
                error
            );
        }
    }


    if (!institutionId) {

        const urlParams =
            new URLSearchParams(
                window.location.search
            );

        institutionId =
            urlParams.get("institutionId") ||
            urlParams.get("id") ||
            null;
    }


    if (!institutionId && currentUser) {

        institutionId =
            currentUser.institutionId ||
            currentUser.institution_id ||
            currentUser.schoolId ||
            null;
    }


    return currentUser;
}


/* =====================================================
   Current Username
   ===================================================== */

function getCurrentUsername() {

    if (!currentUser) {
        return "";
    }

    return (
        currentUser.username ||
        currentUser.userName ||
        currentUser.name ||
        currentUser.fullName ||
        ""
    );
}


/* =====================================================
   Current Academic Year
   ===================================================== */

function getCurrentAcademicYear() {

    const year =
        localStorage.getItem(
            "bmpCurrentAcademicYear"
        );

    if (year) {
        return year;
    }

    const currentYear =
        new Date().getFullYear();

    return `${currentYear}-${currentYear + 1}`;
}


/* =====================================================
   Load Students
   ===================================================== */

async function loadStudents() {

    const result =
        await apiRequest(
            "getStudents"
        );


    if (
        Array.isArray(result)
    ) {

        allStudents = result;

    } else if (
        Array.isArray(result.students)
    ) {

        allStudents =
            result.students;

    } else if (
        Array.isArray(result.data)
    ) {

        allStudents =
            result.data;

    } else {

        allStudents = [];
    }


    return allStudents;
}


/* =====================================================
   Payment Helpers
   ===================================================== */

function getPaymentStudentId(payment) {

    return (
        payment?.studentId ||
        payment?.student_id ||
        payment?.studentID ||
        ""
    );
}


function getPaymentStudentNumber(payment) {

    return (
        payment?.studentNumber ||
        payment?.student_number ||
        payment?.studentNo ||
        payment?.student_no ||
        ""
    );
}


function getPaymentStudentName(payment) {

    return (
        payment?.studentName ||
        payment?.student_name ||
        payment?.name ||
        ""
    );
}


function getPaymentAcademicYear(payment) {

    return (
        payment?.academicYear ||
        payment?.academic_year ||
        payment?.schoolYear ||
        payment?.school_year ||
        ""
    );
}


function getPaymentMonth(payment) {

    return (
        payment?.month ||
        payment?.paidMonth ||
        payment?.paid_month ||
        ""
    );
}


function getPaymentAmount(payment) {

    const value =
        payment?.amount ??
        payment?.paymentAmount ??
        payment?.payment_amount ??
        0;

    const numeric =
        Number(
            String(value)
                .replace(/,/g, "")
                .trim()
        );

    return Number.isFinite(numeric)
        ? numeric
        : 0;
}


function getPaymentDate(payment) {

    return (
        payment?.paymentDate ||
        payment?.payment_date ||
        payment?.date ||
        ""
    );
}


function getReceiptNumber(payment) {

    return (
        payment?.receiptNumber ||
        payment?.receipt_number ||
        payment?.receiptNo ||
        payment?.receipt_no ||
        payment?.id ||
        ""
    );
}


function getRecordedBy(payment) {

    return (
        payment?.recordedBy ||
        payment?.recorded_by ||
        payment?.username ||
        payment?.userName ||
        payment?.createdBy ||
        ""
    );
}


/* =====================================================
   Payment ID
   ===================================================== */

function getPaymentId(payment) {

    return (
        payment?.paymentId ||
        payment?.payment_id ||
        payment?.id ||
        ""
    );
}


/* =====================================================
   Find Student
   ===================================================== */

function findStudentForPayment(payment) {

    const studentId =
        getPaymentStudentId(payment);

    const studentNumber =
        getPaymentStudentNumber(payment);


    return allStudents.find(student => {

        const id =
            student?.id ||
            student?.studentId ||
            student?.student_id ||
            "";

        const number =
            student?.studentNumber ||
            student?.student_number ||
            student?.studentNo ||
            "";


        if (
            studentId &&
            String(id) === String(studentId)
        ) {
            return true;
        }


        if (
            studentNumber &&
            String(number) === String(studentNumber)
        ) {
            return true;
        }


        return false;

    }) || null;
}


/* =====================================================
   Normalize Stage
   ===================================================== */

function normalizeStage(stage) {

    if (!stage) {
        return "";
    }

    const value =
        String(stage)
            .trim()
            .toLowerCase();


    if (
        value.includes("primary") ||
        value.includes("ابتد")
    ) {
        return "primary";
    }


    if (
        value.includes("preparatory") ||
        value.includes("prep") ||
        value.includes("إعد")
    ) {
        return "preparatory";
    }


    if (
        value.includes("secondary") ||
        value.includes("ثان")
    ) {
        return "secondary";
    }


    return value;
}


/* =====================================================
   Get Stage
   ===================================================== */

function getStageForPayment(payment, student = null) {

    return (
        payment?.stage ||
        payment?.stageName ||
        payment?.stage_name ||
        student?.stage ||
        student?.stageName ||
        student?.stage_name ||
        ""
    );
}


/* =====================================================
   Format Stage
   ===================================================== */

function formatStage(stage) {

    const normalized =
        normalizeStage(stage);


    if (
        TRANSLATIONS[currentLanguage]?.[
            normalized
        ]
    ) {
        return t(normalized);
    }


    return stage || "";
}


/* =====================================================
   Format Month
   ===================================================== */

function formatMonth(month) {

    if (!month) {
        return "";
    }


    const value =
        String(month)
            .trim()
            .toLowerCase();


    const map = {

        october: "october",
        oct: "october",

        november: "november",
        nov: "november",

        december: "december",
        dec: "december",

        january: "january",
        jan: "january",

        february: "february",
        feb: "february",

        march: "march",
        mar: "march",

        april: "april",
        apr: "april",

        may: "may",

        june: "june",
        jun: "june"
    };


    if (map[value]) {
        return t(map[value]);
    }


    return month;
}


/* =====================================================
   Load Payments
   ===================================================== */

async function loadPayments() {

    showLoading();

    hideError();


    try {

        const result =
            await apiRequest(
                "getPayments"
            );


        if (Array.isArray(result)) {

            allPayments = result;

        } else if (
            Array.isArray(result.payments)
        ) {

            allPayments =
                result.payments;

        } else if (
            Array.isArray(result.data)
        ) {

            allPayments =
                result.data;

        } else {

            allPayments = [];
        }


        paymentsLoaded = true;


        await loadAcademicYears();

        updateSummary();

        renderPayments();

        hideLoading();


    } catch (error) {

        console.error(
            "loadPayments:",
            error
        );

        hideLoading();

        showError(
            error.message ||
            t("failedToLoad")
        );
    }
}


/* =====================================================
   Load Academic Years
   ===================================================== */

async function loadAcademicYears() {

    const select =
        document.getElementById(
            "academicYearFilter"
        );


    if (!select) {
        return;
    }


    const years = new Set();


    allPayments.forEach(payment => {

        const year =
            getPaymentAcademicYear(payment);

        if (year) {
            years.add(String(year));
        }
    });


    select.innerHTML = `
        <option value="">
            ${escapeHtml(t("allYears"))}
        </option>
    `;


    Array.from(years)
        .sort()
        .reverse()
        .forEach(year => {

            const option =
                document.createElement("option");

            option.value = year;
            option.textContent = year;

            select.appendChild(option);
        });
}


/* =====================================================
   Filter Payments
   ===================================================== */

function getFilteredPayments() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const yearFilter =
        document.getElementById(
            "academicYearFilter"
        );

    const stageFilter =
        document.getElementById(
            "stageFilter"
        );

    const monthFilter =
        document.getElementById(
            "monthFilter"
        );


    const search =
        searchInput?.value
            ?.trim()
            .toLowerCase() || "";


    const year =
        yearFilter?.value || "";


    const stage =
        stageFilter?.value || "";


    const month =
        monthFilter?.value || "";


    return allPayments.filter(payment => {

        const student =
            findStudentForPayment(payment);


        const studentName =
            getPaymentStudentName(payment) ||
            student?.name ||
            student?.studentName ||
            "";


        const studentNumber =
            getPaymentStudentNumber(payment) ||
            student?.studentNumber ||
            student?.student_number ||
            "";


        const paymentYear =
            getPaymentAcademicYear(payment);


        const paymentStage =
            getStageForPayment(
                payment,
                student
            );


        const paymentMonth =
            getPaymentMonth(payment);


        const matchesSearch =
            !search ||
            String(studentName)
                .toLowerCase()
                .includes(search) ||
            String(studentNumber)
                .toLowerCase()
                .includes(search);


        const matchesYear =
            !year ||
            String(paymentYear) === String(year);


        const matchesStage =
            !stage ||
            normalizeStage(paymentStage) ===
            normalizeStage(stage);


        const matchesMonth =
            !month ||
            String(paymentMonth)
                .toLowerCase() ===
            String(month)
                .toLowerCase();


        return (
            matchesSearch &&
            matchesYear &&
            matchesStage &&
            matchesMonth
        );
    });
}


/* =====================================================
   Sort Payments
   ===================================================== */

function sortPayments(payments) {

    return [...payments].sort((a, b) => {

        const dateA =
            new Date(
                getPaymentDate(a)
            ).getTime() || 0;


        const dateB =
            new Date(
                getPaymentDate(b)
            ).getTime() || 0;


        return dateB - dateA;
    });
}


/* =====================================================
   Escape HTML
   ===================================================== */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   Render Payments
   ===================================================== */

function renderPayments() {

    const tbody =
        document.getElementById(
            "paymentsTableBody"
        );


    if (!tbody) {
        return;
    }


    const payments =
        sortPayments(
            getFilteredPayments()
        );


    if (!payments.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    <div class="empty-state">
                        <div class="empty-icon">💳</div>
                        <h3>
                            ${escapeHtml(t("noPayments"))}
                        </h3>
                        <p>
                            ${escapeHtml(
                                t("noPaymentsDescription")
                            )}
                        </p>
                    </div>
                </td>
            </tr>
        `;

        updateSummary();

        return;
    }


    tbody.innerHTML =
        payments.map((payment, index) => {

            const student =
                findStudentForPayment(payment);


            const name =
                getPaymentStudentName(payment) ||
                student?.name ||
                student?.studentName ||
                "";


            const number =
                getPaymentStudentNumber(payment) ||
                student?.studentNumber ||
                student?.student_number ||
                "";


            const stage =
                formatStage(
                    getStageForPayment(
                        payment,
                        student
                    )
                );


            const className =
                payment?.className ||
                payment?.class_name ||
                payment?.class ||
                student?.className ||
                student?.class_name ||
                student?.class ||
                "";


            const month =
                formatMonth(
                    getPaymentMonth(payment)
                );


            const amount =
                getPaymentAmount(payment);


            const date =
                formatReceiptDate(
                    getPaymentDate(payment)
                );


            const receipt =
                getReceiptNumber(payment);


            const recordedBy =
                getRecordedBy(payment);


            return `
                <tr
                    data-payment-index="${index}"
                    style="cursor:pointer;"
                >

                    <td>
                        ${escapeHtml(name)}
                    </td>

                    <td>
                        ${escapeHtml(number)}
                    </td>

                    <td>
                        ${escapeHtml(stage)}
                    </td>

                    <td>
                        ${escapeHtml(className)}
                    </td>

                    <td>
                        ${escapeHtml(month)}
                    </td>

                    <td>
                        ${escapeHtml(
                            amount.toLocaleString()
                        )}
                    </td>

                    <td>
                        ${escapeHtml(date)}
                    </td>

                    <td>
                        ${escapeHtml(receipt)}
                    </td>

                    <td>
                        ${escapeHtml(recordedBy)}
                    </td>

                </tr>
            `;

        }).join("");


    tbody
        .querySelectorAll("tr[data-payment-index]")
        .forEach(row => {

            row.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.paymentIndex
                        );

                    const filtered =
                        sortPayments(
                            getFilteredPayments()
                        );

                    if (
                        filtered[index]
                    ) {
                        showPaymentDetails(
                            filtered[index]
                        );
                    }
                }
            );
        });


    updateSummary();
}


/* =====================================================
   Summary
   ===================================================== */

function updateSummary() {

    const payments =
        getFilteredPayments();


    const totalPayments =
        document.getElementById(
            "totalPayments"
        );


    const totalAmount =
        document.getElementById(
            "totalAmount"
        );


    const studentsPaid =
        document.getElementById(
            "studentsPaid"
        );


    const uniqueStudents =
        new Set();


    let amount = 0;


    payments.forEach(payment => {

        const student =
            findStudentForPayment(payment);


        const studentId =
            getPaymentStudentId(payment) ||
            getPaymentStudentNumber(payment) ||
            student?.id ||
            student?.studentNumber ||
            "";


        if (studentId) {
            uniqueStudents.add(
                String(studentId)
            );
        }


        amount +=
            getPaymentAmount(payment);
    });


    if (totalPayments) {
        totalPayments.textContent =
            payments.length.toLocaleString();
    }


    if (totalAmount) {
        totalAmount.textContent =
            amount.toLocaleString();
    }


    if (studentsPaid) {
        studentsPaid.textContent =
            uniqueStudents.size.toLocaleString();
    }
}


/* =====================================================
   Apply Filters
   ===================================================== */

function applyFilters() {

    renderPayments();
}


/* =====================================================
   Reset Filters
   ===================================================== */

function resetFilters() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const yearFilter =
        document.getElementById(
            "academicYearFilter"
        );


    const stageFilter =
        document.getElementById(
            "stageFilter"
        );


    const monthFilter =
        document.getElementById(
            "monthFilter"
        );


    if (searchInput) {
        searchInput.value = "";
    }


    if (yearFilter) {
        yearFilter.value = "";
    }


    if (stageFilter) {
        stageFilter.value = "";
    }


    if (monthFilter) {
        monthFilter.value = "";
    }


    renderPayments();
}


/* =====================================================
   Loading
   ===================================================== */

function showLoading() {

    const loading =
        document.getElementById(
            "loadingState"
        );

    const tableSection =
        document.querySelector(
            ".table-section"
        );


    if (loading) {
        loading.style.display = "block";
    }


    if (tableSection) {
        tableSection.style.display = "none";
    }
}


function hideLoading() {

    const loading =
        document.getElementById(
            "loadingState"
        );

    const tableSection =
        document.querySelector(
            ".table-section"
        );


    if (loading) {
        loading.style.display = "none";
    }


    if (tableSection) {
        tableSection.style.display = "block";
    }
}


/* =====================================================
   Error
   ===================================================== */

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
            message ||
            t("failedToLoad");
    }


    if (errorState) {
        errorState.style.display = "block";
    }
}


function hideError() {

    const errorState =
        document.getElementById(
            "errorState"
        );


    if (errorState) {
        errorState.style.display = "none";
    }
}


/* =====================================================
   Payment Details
   ===================================================== */

function showPaymentDetails(payment) {

    if (!payment) {
        alert(t("paymentNotFound"));
        return;
    }


    const student =
        findStudentForPayment(payment);


    const modal =
        document.getElementById(
            "paymentDetailsModal"
        );


    const body =
        document.getElementById(
            "paymentDetailsBody"
        );


    if (!modal || !body) {
        return;
    }


    const studentName =
        getPaymentStudentName(payment) ||
        student?.name ||
        student?.studentName ||
        "";


    const studentNumber =
        getPaymentStudentNumber(payment) ||
        student?.studentNumber ||
        student?.student_number ||
        "";


    const academicYear =
        getPaymentAcademicYear(payment);


    const stage =
        formatStage(
            getStageForPayment(
                payment,
                student
            )
        );


    const className =
        payment?.className ||
        payment?.class_name ||
        payment?.class ||
        student?.className ||
        student?.class_name ||
        student?.class ||
        "";


    const month =
        formatMonth(
            getPaymentMonth(payment)
        );


    const amount =
        getPaymentAmount(payment);


    const date =
        formatReceiptDate(
            getPaymentDate(payment)
        );


    const receiptNumber =
        getReceiptNumber(payment);


    const recordedBy =
        getRecordedBy(payment);


    const notes =
        payment?.notes ||
        payment?.note ||
        "";


    body.innerHTML = `

        <div class="payment-detail-row">
            <strong>
                ${escapeHtml(t("studentName"))}
            </strong>

            <span>
                ${escapeHtml(studentName)}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>
                ${escapeHtml(t("studentNumber"))}
            </strong>

            <span>
                ${escapeHtml(studentNumber)}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>
                ${escapeHtml(t("academicYear"))}
            </strong>

            <span>
                ${escapeHtml(academicYear)}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>
                ${escapeHtml(t("stage"))}
            </strong>

            <span>
                ${escapeHtml(stage)}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>
                ${escapeHtml(t("className"))}
            </strong>

            <span>
                ${escapeHtml(className)}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>
                ${escapeHtml(t("paidMonth"))}
            </strong>

            <span>
                ${escapeHtml(month)}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>
                ${escapeHtml(t("amount"))}
            </strong>

            <span>
                ${escapeHtml(
                    amount.toLocaleString()
                )}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>
                ${escapeHtml(t("paymentDate"))}
            </strong>

            <span>
                ${escapeHtml(date)}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>
                ${escapeHtml(t("receiptNumber"))}
            </strong>

            <span>
                ${escapeHtml(receiptNumber)}
            </span>
        </div>


        <div class="payment-detail-row">
            <strong>
                ${escapeHtml(t("recordedBy"))}
            </strong>

            <span>
                ${escapeHtml(recordedBy)}
            </span>
        </div>


        ${
            notes
                ? `
                    <div class="payment-detail-row">
                        <strong>
                            ${escapeHtml(t("notes"))}
                        </strong>

                        <span>
                            ${escapeHtml(notes)}
                        </span>
                    </div>
                `
                : ""
        }


        <div style="
            margin-top:20px;
            display:flex;
            justify-content:flex-end;
            gap:10px;
        ">

            <button
                type="button"
                id="printPaymentReceiptBtn"
                class="primary-button"
            >
                🖨️ ${escapeHtml(t("printReceipt"))}
            </button>

        </div>
    `;


    modal.style.display = "flex";


    const printButton =
        document.getElementById(
            "printPaymentReceiptBtn"
        );


    if (printButton) {

        printButton.addEventListener(
            "click",
            function () {

                printPaymentReceipt(
                    payment
                );

            }
        );
    }
}


/* =====================================================
   Close Payment Details
   ===================================================== */

function closePaymentDetails() {

    const modal =
        document.getElementById(
            "paymentDetailsModal"
        );


    if (modal) {
        modal.style.display = "none";
    }
}


/* =====================================================
   Receipt Title
   ===================================================== */

function getReceiptTitle() {

    return t("receiptTitle");
}


/* =====================================================
   Receipt Thank You
   ===================================================== */

function getReceiptThankYou() {

    if (currentLanguage === "ar") {
        return "شكراً لكم";
    }

    if (currentLanguage === "fr") {
        return "Merci";
    }

    return "Thank you";
}


/* =====================================================
   Receipt Date
   ===================================================== */

function formatReceiptDate(value) {

    if (!value) {
        return "";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(value);
    }


    const locale =
        currentLanguage === "ar"
            ? "ar-MR"
            : currentLanguage === "fr"
                ? "fr-FR"
                : "en-GB";


    return date.toLocaleDateString(
        locale,
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    );
}


/* =====================================================
   Receipt Print Styles
   ===================================================== */

function ensureReceiptPrintStyles() {

    if (
        document.getElementById(
            "bmpReceiptPrintStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "bmpReceiptPrintStyles";


    style.textContent = `

        #bmpPrintReceipt {
            display: none;
        }


        @media print {

            body * {
                visibility: hidden !important;
            }


            #bmpPrintReceipt,
            #bmpPrintReceipt * {
                visibility: visible !important;
            }


            #bmpPrintReceipt {

                display: block !important;

                position: absolute !important;

                left: 50% !important;

                top: 0 !important;

                transform:
                    translateX(-50%) !important;

                width: 80mm !important;

                max-width: 80mm !important;

                min-height: 0 !important;

                margin: 0 !important;

                padding: 4mm !important;

                background: #ffffff !important;

                color: #000000 !important;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif !important;

                font-size: 12px !important;

                line-height: 1.4 !important;

                box-shadow: none !important;

                border: none !important;

                overflow: visible !important;
            }


            #bmpPrintReceipt
                .bmp-receipt-title {

                text-align: center !important;

                font-size: 17px !important;

                font-weight: 700 !important;

                margin-bottom: 5mm !important;

                color: #000000 !important;
            }


            #bmpPrintReceipt
                .bmp-receipt-number {

                text-align: center !important;

                font-size: 11px !important;

                margin-bottom: 4mm !important;

                padding-bottom: 3mm !important;

                border-bottom:
                    1px dashed #000000 !important;
            }


            #bmpPrintReceipt
                .bmp-receipt-row {

                display: flex !important;

                justify-content:
                    space-between !important;

                align-items:
                    flex-start !important;

                gap: 8px !important;

                padding: 2.2mm 0 !important;

                border-bottom:
                    1px solid #eeeeee !important;

                font-size: 12px !important;
            }


            #bmpPrintReceipt
                .bmp-receipt-row:last-child {

                border-bottom: none !important;
            }


            #bmpPrintReceipt
                .bmp-receipt-row strong {

                flex:
                    0 0 42% !important;

                font-weight: 700 !important;

                color: #000000 !important;

                text-align: left !important;
            }


            #bmpPrintReceipt
                .bmp-receipt-row span {

                flex: 1 !important;

                color: #000000 !important;

                text-align: right !important;

                word-break: break-word !important;
            }


            #bmpPrintReceipt[dir="rtl"]
                .bmp-receipt-row strong {

                text-align: right !important;
            }


            #bmpPrintReceipt[dir="rtl"]
                .bmp-receipt-row span {

                text-align: left !important;
            }


            #bmpPrintReceipt
                .bmp-receipt-amount {

                font-size: 15px !important;

                font-weight: 700 !important;
            }


            #bmpPrintReceipt
                .bmp-receipt-notes {

                margin-top: 3mm !important;

                padding-top: 3mm !important;

                border-top:
                    1px dashed #000000 !important;

                font-size: 11px !important;

                word-break: break-word !important;
            }


            .modal,
            .page-container,
            .filters-section,
            .summary-section,
            .table-section,
            .page-header,
            button {

                display: none !important;
            }


            @page {

                size: auto;

                margin: 8mm;
            }
        }
    `;


    document.head.appendChild(style);
}


/* =====================================================
   Print Payment Receipt
   ===================================================== */

async function printPaymentReceipt(
    selectedPayment
) {

    if (!selectedPayment) {

        alert(
            t("paymentNotFound")
        );

        return;
    }


    ensureReceiptPrintStyles();


    let payment =
        selectedPayment;


    let student =
        findStudentForPayment(
            selectedPayment
        );


    let currency =
        t("currency");


    /* ---------------------------------------------
       Try to get the complete selected receipt
       --------------------------------------------- */

    const paymentId =
        getPaymentId(
            selectedPayment
        );


    if (paymentId) {

        try {

            const result =
                await apiRequest(
                    "getReceipt",
                    {
                        paymentId
                    }
                );


            if (
                result &&
                result.payment
            ) {

                payment = {
                    ...selectedPayment,
                    ...result.payment
                };
            }


            if (
                result &&
                result.student
            ) {

                student = {
                    ...(student || {}),
                    ...result.student
                };
            }


            if (
                result &&
                result.institution &&
                result.institution.currency
            ) {

                currency =
                    result.institution.currency;
            }


        } catch (error) {

            console.warn(
                "Could not load complete receipt. Using selected payment:",
                error
            );

        }
    }


    /* ---------------------------------------------
       Selected payment information
       --------------------------------------------- */

    const studentName =
        getPaymentStudentName(payment) ||
        student?.name ||
        student?.studentName ||
        "";


    const studentNumber =
        getPaymentStudentNumber(payment) ||
        student?.studentNumber ||
        student?.student_number ||
        "";


    const academicYear =
        getPaymentAcademicYear(payment) ||
        "";


    const stage =
        formatStage(
            getStageForPayment(
                payment,
                student
            )
        );


    const className =
        payment?.className ||
        payment?.class_name ||
        payment?.class ||
        student?.className ||
        student?.class_name ||
        student?.class ||
        "";


    const month =
        formatMonth(
            getPaymentMonth(payment)
        );


    const paymentAmount =
        getPaymentAmount(payment);


    const paymentDate =
        formatReceiptDate(
            getPaymentDate(payment)
        );


    const receiptNumber =
        getReceiptNumber(payment);


    const recordedBy =
        getRecordedBy(payment);


    const notes =
        payment?.notes ||
        payment?.note ||
        "";


    /* ---------------------------------------------
       Remove any previous temporary receipt
       --------------------------------------------- */

    const oldReceipt =
        document.getElementById(
            "bmpPrintReceipt"
        );


    if (oldReceipt) {
        oldReceipt.remove();
    }


    /* ---------------------------------------------
       Create print-only receipt
       --------------------------------------------- */

    const printArea =
        document.createElement("div");


    printArea.id =
        "bmpPrintReceipt";


    printArea.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";


    printArea.innerHTML = `

        <div class="bmp-receipt-title">
            ${escapeHtml(
                getReceiptTitle()
            )}
        </div>


        <div class="bmp-receipt-number">
            <strong>
                ${escapeHtml(
                    t("receiptNumber")
                )}
            </strong>

            <br>

            ${escapeHtml(
                receiptNumber
            )}
        </div>


        <div class="bmp-receipt-row">

            <strong>
                ${escapeHtml(
                    t("studentName")
                )}
            </strong>

            <span>
                ${escapeHtml(
                    studentName
                )}
            </span>

        </div>


        <div class="bmp-receipt-row">

            <strong>
                ${escapeHtml(
                    t("studentNumber")
                )}
            </strong>

            <span>
                ${escapeHtml(
                    studentNumber
                )}
            </span>

        </div>


        <div class="bmp-receipt-row">

            <strong>
                ${escapeHtml(
                    t("academicYear")
                )}
            </strong>

            <span>
                ${escapeHtml(
                    academicYear
                )}
            </span>

        </div>


        <div class="bmp-receipt-row">

            <strong>
                ${escapeHtml(
                    t("stage")
                )}
            </strong>

            <span>
                ${escapeHtml(
                    stage
                )}
            </span>

        </div>


        <div class="bmp-receipt-row">

            <strong>
                ${escapeHtml(
                    t("className")
                )}
            </strong>

            <span>
                ${escapeHtml(
                    className
                )}
            </span>

        </div>


        <div class="bmp-receipt-row">

            <strong>
                ${escapeHtml(
                    t("paidMonth")
                )}
            </strong>

            <span>
                ${escapeHtml(
                    month
                )}
            </span>

        </div>


        <div class="bmp-receipt-row">

            <strong>
                ${escapeHtml(
                    t("amount")
                )}
            </strong>

            <span class="bmp-receipt-amount">
                ${escapeHtml(
                    paymentAmount.toLocaleString()
                )}
                ${escapeHtml(
                    currency
                )}
            </span>

        </div>


        <div class="bmp-receipt-row">

            <strong>
                ${escapeHtml(
                    t("paymentDate")
                )}
            </strong>

            <span>
                ${escapeHtml(
                    paymentDate
                )}
            </span>

        </div>


        <div class="bmp-receipt-row">

            <strong>
                ${escapeHtml(
                    t("recordedBy")
                )}
            </strong>

            <span>
                ${escapeHtml(
                    recordedBy
                )}
            </span>

        </div>


        ${
            notes
                ? `
                    <div class="bmp-receipt-notes">

                        <strong>
                            ${escapeHtml(
                                t("notes")
                            )}
                        </strong>

                        <br>

                        ${escapeHtml(
                            notes
                        )}

                    </div>
                `
                : ""
        }

    `;


    document.body.appendChild(
        printArea
    );


    /* ---------------------------------------------
       Close modal before printing
       --------------------------------------------- */

    closePaymentDetails();


    /* ---------------------------------------------
       Print
       --------------------------------------------- */

    await new Promise(
        resolve =>
            setTimeout(resolve, 150)
    );


    try {

        window.print();

    } catch (error) {

        console.error(
            "Print error:",
            error
        );

        alert(
            t("failedToPrint")
        );

    }


    /* ---------------------------------------------
       Remove temporary receipt after printing
       --------------------------------------------- */

    setTimeout(() => {

        const receipt =
            document.getElementById(
                "bmpPrintReceipt"
            );

        if (receipt) {
            receipt.remove();
        }

    }, 1000);
}


/* =====================================================
   Navigation
   ===================================================== */

function getNavigationInstitutionId() {

    return (
        institutionId ||
        currentUser?.institutionId ||
        currentUser?.institution_id ||
        ""
    );
}


function goBack() {

    const id =
        getNavigationInstitutionId();


    if (id) {

        window.location.href =
            `school-dashboard.html?institutionId=${encodeURIComponent(id)}`;

        return;
    }


    if (
        window.history.length > 1
    ) {

        window.history.back();

        return;
    }


    window.location.href =
        "school-dashboard.html";
}


function goToRecordPayment() {

    const id =
        getNavigationInstitutionId();


    let url =
        "school-record-payment.html";


    if (id) {

        url +=
            `?institutionId=${encodeURIComponent(id)}`;
    }


    window.location.href = url;
}


/* =====================================================
   Event Listeners
   ===================================================== */

function setupEventListeners() {

    const applyButton =
        document.getElementById(
            "applyFiltersBtn"
        );


    if (applyButton) {

        applyButton.addEventListener(
            "click",
            applyFilters
        );
    }


    const resetButton =
        document.getElementById(
            "resetFiltersBtn"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetFilters
        );
    }


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                renderPayments();

            }
        );
    }


    const backButton =
        document.getElementById(
            "backBtn"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            goBack
        );
    }


    const recordButton =
        document.getElementById(
            "recordPaymentBtn"
        );


    if (recordButton) {

        recordButton.addEventListener(
            "click",
            goToRecordPayment
        );
    }


    const closeButton =
        document.getElementById(
            "closePaymentDetailsBtn"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closePaymentDetails
        );
    }


    const modal =
        document.getElementById(
            "paymentDetailsModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal ||
                    event.target.classList.contains(
                        "modal-overlay"
                    )
                ) {

                    closePaymentDetails();
                }
            }
        );
    }


    const retryButton =
        document.getElementById(
            "retryButton"
        );


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            function () {

                loadPayments();

            }
        );
    }


    const yearFilter =
        document.getElementById(
            "academicYearFilter"
        );


    if (yearFilter) {

        yearFilter.addEventListener(
            "change",
            applyFilters
        );
    }


    const stageFilter =
        document.getElementById(
            "stageFilter"
        );


    if (stageFilter) {

        stageFilter.addEventListener(
            "change",
            applyFilters
        );
    }


    const monthFilter =
        document.getElementById(
            "monthFilter"
        );


    if (monthFilter) {

        monthFilter.addEventListener(
            "change",
            applyFilters
        );
    }
}


/* =====================================================
   Initialize Language
   ===================================================== */

function initializeLanguage() {

    currentLanguage =
        getSavedLanguage();


    if (
        !TRANSLATIONS[currentLanguage]
    ) {

        currentLanguage = "en";
    }


    ensureLanguageSelector();

    applyLanguage();

    updateFilterOptions();
}


/* =====================================================
   Initialize Page
   ===================================================== */

async function initializePage() {

    if (pageInitialized) {
        return;
    }


    pageInitialized = true;


    initializeAuthentication();


    if (!institutionId) {

        console.warn(
            "No institution ID found."
        );
    }


    initializeLanguage();

    setupEventListeners();

    ensureReceiptPrintStyles();


    try {

        await loadStudents();

    } catch (error) {

        console.warn(
            "Could not load students:",
            error
        );

        allStudents = [];
    }


    await loadPayments();
}


/* =====================================================
   DOM Ready
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializePage();

    }
);
