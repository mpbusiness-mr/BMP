/* =================================
   School Payments - BMP
   Multilingual:
   English / Arabic / French
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

let currentLanguage = "en";


/* =================================
   Language System
   ================================= */

const TRANSLATIONS = {

    en: {

        pageTitle:
            "Payments",

        pageSubtitle:
            "View and manage student payments",

        back:
            "Back",

        recordPayment:
            "Record Payment",

        academicYear:
            "Academic Year",

        all:
            "All",

        month:
            "Month",

        stage:
            "Stage",

        search:
            "Search",

        searchStudent:
            "Student name or number",

        reset:
            "Reset",

        totalPayments:
            "Total Payments",

        totalAmount:
            "Total Amount",

        displayedPayments:
            "Displayed Payments",

        loadingPayments:
            "Loading payments...",

        loading:
            "Loading...",

        errorLoading:
            "An error occurred while loading payments.",

        retry:
            "Retry",

        noPayments:
            "No Payments",

        noPaymentsDescription:
            "No payments matching your search were found.",

        paymentDetails:
            "Payment Details",

        studentNumber:
            "Student Number",

        studentName:
            "Student Name",

        paymentDate:
            "Payment Date",

        receiptNumber:
            "Receipt Number",

        recordedBy:
            "Recorded By",

        amount:
            "Amount",

        notes:
            "Notes",

        class:
            "Class",

        printReceipt:
            "Print Receipt",

        primary:
            "Primary",

        preparatory:
            "Preparatory",

        secondary:
            "Secondary",

        close:
            "Close",

        unknown:
            "-",

        language:
            "Language",

        english:
            "English",

        arabic:
            "Arabic",

        french:
            "French",

        months: {

            October:
                "October",

            November:
                "November",

            December:
                "December",

            January:
                "January",

            February:
                "February",

            March:
                "March",

            April:
                "April",

            May:
                "May",

            June:
                "June"

        },

        errors: {

            institutionMissing:
                "Institution ID is missing.",

            userMissing:
                "Current user is missing.",

            connection:
                "Could not connect to the BMP server.",

            invalidResponse:
                "The server returned an invalid response.",

            authentication:
                "School authentication failed. Please log in again.",

            unknownRequest:
                "The request failed.",

            failedPayments:
                "Failed to load payments."

        }

    },


    ar: {

        pageTitle:
            "المدفوعات",

        pageSubtitle:
            "عرض وإدارة مدفوعات الطلاب",

        back:
            "رجوع",

        recordPayment:
            "تسجيل دفعة",

        academicYear:
            "السنة الدراسية",

        all:
            "الكل",

        month:
            "الشهر",

        stage:
            "المرحلة",

        search:
            "بحث",

        searchStudent:
            "اسم الطالب أو رقمه",

        reset:
            "إعادة تعيين",

        totalPayments:
            "إجمالي المدفوعات",

        totalAmount:
            "إجمالي المبلغ",

        displayedPayments:
            "المدفوعات المعروضة",

        loadingPayments:
            "جارٍ تحميل المدفوعات...",

        loading:
            "جارٍ التحميل...",

        errorLoading:
            "حدث خطأ أثناء تحميل المدفوعات.",

        retry:
            "إعادة المحاولة",

        noPayments:
            "لا توجد مدفوعات",

        noPaymentsDescription:
            "لم يتم العثور على مدفوعات مطابقة لبحثك.",

        paymentDetails:
            "تفاصيل الدفعة",

        studentNumber:
            "رقم الطالب",

        studentName:
            "اسم الطالب",

        paymentDate:
            "تاريخ الدفع",

        receiptNumber:
            "رقم الإيصال",

        recordedBy:
            "سجلها المستخدم",

        amount:
            "المبلغ",

        notes:
            "ملاحظات",

        class:
            "القسم",

        printReceipt:
            "طباعة الإيصال",

        primary:
            "الابتدائية",

        preparatory:
            "الإعدادية",

        secondary:
            "الثانوية",

        close:
            "إغلاق",

        unknown:
            "-",

        language:
            "اللغة",

        english:
            "الإنجليزية",

        arabic:
            "العربية",

        french:
            "الفرنسية",

        months: {

            October:
                "أكتوبر",

            November:
                "نوفمبر",

            December:
                "ديسمبر",

            January:
                "يناير",

            February:
                "فبراير",

            March:
                "مارس",

            April:
                "أبريل",

            May:
                "مايو",

            June:
                "يونيو"

        },

        errors: {

            institutionMissing:
                "معرّف المؤسسة غير موجود.",

            userMissing:
                "المستخدم الحالي غير موجود.",

            connection:
                "تعذر الاتصال بخادم النظام.",

            invalidResponse:
                "أعاد الخادم استجابة غير صالحة.",

            authentication:
                "فشل تسجيل دخول المدرسة. يرجى تسجيل الدخول مرة أخرى.",

            unknownRequest:
                "فشل تنفيذ الطلب.",

            failedPayments:
                "فشل تحميل المدفوعات."

        }

    },


    fr: {

        pageTitle:
            "Paiements",

        pageSubtitle:
            "Consulter et gérer les paiements des élèves",

        back:
            "Retour",

        recordPayment:
            "Enregistrer un paiement",

        academicYear:
            "Année scolaire",

        all:
            "Tous",

        month:
            "Mois",

        stage:
            "Cycle",

        search:
            "Rechercher",

        searchStudent:
            "Nom ou numéro de l'élève",

        reset:
            "Réinitialiser",

        totalPayments:
            "Total des paiements",

        totalAmount:
            "Montant total",

        displayedPayments:
            "Paiements affichés",

        loadingPayments:
            "Chargement des paiements...",

        loading:
            "Chargement...",

        errorLoading:
            "Une erreur s'est produite lors du chargement des paiements.",

        retry:
            "Réessayer",

        noPayments:
            "Aucun paiement",

        noPaymentsDescription:
            "Aucun paiement correspondant à votre recherche n'a été trouvé.",

        paymentDetails:
            "Détails du paiement",

        studentNumber:
            "Numéro de l'élève",

        studentName:
            "Nom de l'élève",

        paymentDate:
            "Date du paiement",

        receiptNumber:
            "Numéro du reçu",

        recordedBy:
            "Enregistré par",

        amount:
            "Montant",

        notes:
            "Notes",

        class:
            "Classe",

        printReceipt:
            "Imprimer le reçu",

        primary:
            "Primaire",

        preparatory:
            "Collège",

        secondary:
            "Secondaire",

        close:
            "Fermer",

        unknown:
            "-",

        language:
            "Langue",

        english:
            "Anglais",

        arabic:
            "Arabe",

        french:
            "Français",

        months: {

            October:
                "Octobre",

            November:
                "Novembre",

            December:
                "Décembre",

            January:
                "Janvier",

            February:
                "Février",

            March:
                "Mars",

            April:
                "Avril",

            May:
                "Mai",

            June:
                "Juin"

        },

        errors: {

            institutionMissing:
                "L'identifiant de l'établissement est manquant.",

            userMissing:
                "L'utilisateur actuel est introuvable.",

            connection:
                "Impossible de se connecter au serveur BMP.",

            invalidResponse:
                "Le serveur a renvoyé une réponse invalide.",

            authentication:
                "L'authentification de l'école a échoué. Veuillez vous reconnecter.",

            unknownRequest:
                "La requête a échoué.",

            failedPayments:
                "Échec du chargement des paiements."

        }

    }

};


/* =================================
   Translation Helper
   ================================= */

function t(key) {

    const language =
        TRANSLATIONS[currentLanguage] ||
        TRANSLATIONS.en;


    const parts =
        String(key)
            .split(".");


    let value =
        language;


    for (
        const part of parts
    ) {

        if (
            value &&
            Object.prototype.hasOwnProperty.call(
                value,
                part
            )
        ) {

            value =
                value[part];

        } else {

            return key;

        }

    }


    return value;

}


/* =================================
   Language Detection
   ================================= */

function getSavedLanguage() {

    const possibleKeys = [

        "bmpLanguage",
        "language",
        "selectedLanguage",
        "appLanguage"

    ];


    for (
        const key of possibleKeys
    ) {

        const value =
            localStorage.getItem(
                key
            );


        if (
            value &&
            [
                "en",
                "ar",
                "fr"
            ].includes(
                value
                    .toLowerCase()
                    .trim()
            )
        ) {

            return value
                .toLowerCase()
                .trim();

        }

    }


    const htmlLanguage =
        String(
            document.documentElement.lang ||
            ""
        )
        .toLowerCase()
        .trim();


    if (
        htmlLanguage.startsWith("ar")
    ) {

        return "ar";

    }


    if (
        htmlLanguage.startsWith("fr")
    ) {

        return "fr";

    }


    return "en";

}


/* =================================
   Set Language
   ================================= */

function setLanguage(
    language
) {

    language =
        String(
            language ||
            "en"
        )
        .toLowerCase()
        .trim();


    if (
        !TRANSLATIONS[language]
    ) {

        language =
            "en";

    }


    currentLanguage =
        language;


    localStorage.setItem(
        "bmpLanguage",
        currentLanguage
    );


    applyLanguage();

}


/* =================================
   Apply Language
   ================================= */

function applyLanguage() {

    const language =
        currentLanguage;


    document.documentElement.lang =
        language;


    document.documentElement.dir =
        language === "ar"
            ? "rtl"
            : "ltr";


    /*
     * Page title.
     */

    document.title =
        `${t("pageTitle")} - BMP`;


    /*
     * Header.
     */

    const backButton =
        document.getElementById(
            "backButton"
        );

    const pageTitle =
        document.querySelector(
            ".page-title h1"
        );

    const pageSubtitle =
        document.querySelector(
            ".page-title p"
        );

    const recordPaymentButton =
        document.getElementById(
            "recordPaymentPageBtn"
        );


    if (backButton) {

        backButton.textContent =
            t("back");

    }


    if (pageTitle) {

        pageTitle.textContent =
            t("pageTitle");

    }


    if (pageSubtitle) {

        pageSubtitle.textContent =
            t("pageSubtitle");

    }


    if (recordPaymentButton) {

        recordPaymentButton.textContent =
            t("recordPayment");

    }


    /*
     * Filter labels.
     */

    const academicYearLabel =
        document.querySelector(
            'label[for="academicYear"]'
        );

    const paymentMonthLabel =
        document.querySelector(
            'label[for="paymentMonth"]'
        );

    const stageLabel =
        document.querySelector(
            'label[for="stageFilter"]'
        );

    const searchLabel =
        document.querySelector(
            'label[for="studentSearch"]'
        );


    if (academicYearLabel) {

        academicYearLabel.textContent =
            t("academicYear");

    }


    if (paymentMonthLabel) {

        paymentMonthLabel.textContent =
            t("month");

    }


    if (stageLabel) {

        stageLabel.textContent =
            t("stage");

    }


    if (searchLabel) {

        searchLabel.textContent =
            t("search");

    }


    /*
     * Search input.
     */

    const searchInput =
        document.getElementById(
            "studentSearch"
        );


    if (searchInput) {

        searchInput.placeholder =
            t("searchStudent");

    }


    /*
     * Filter buttons.
     */

    const applyFiltersButton =
        document.getElementById(
            "applyFiltersBtn"
        );

    const resetFiltersButton =
        document.getElementById(
            "resetFiltersBtn"
        );


    if (applyFiltersButton) {

        applyFiltersButton.textContent =
            t("search");

    }


    if (resetFiltersButton) {

        resetFiltersButton.textContent =
            t("reset");

    }


    /*
     * Summary.
     */

    const summaryLabels =
        document.querySelectorAll(
            ".summary-label"
        );


    if (
        summaryLabels.length >= 3
    ) {

        summaryLabels[0].textContent =
            t("totalPayments");

        summaryLabels[1].textContent =
            t("totalAmount");

        summaryLabels[2].textContent =
            t("displayedPayments");

    }


    /*
     * Loading.
     */

    const loadingMessage =
        document.getElementById(
            "loadingMessage"
        );


    if (loadingMessage) {

        loadingMessage.textContent =
            t("loadingPayments");

    }


    /*
     * Retry.
     */

    const retryButton =
        document.getElementById(
            "retryBtn"
        );


    if (retryButton) {

        retryButton.textContent =
            t("retry");

    }


    /*
     * Empty state.
     */

    const emptyTitle =
        document.querySelector(
            "#emptyState h3"
        );

    const emptyDescription =
        document.querySelector(
            "#emptyState p"
        );


    if (emptyTitle) {

        emptyTitle.textContent =
            t("noPayments");

    }


    if (emptyDescription) {

        emptyDescription.textContent =
            t("noPaymentsDescription");

    }


    /*
     * Modal title.
     */

    const modalTitle =
        document.querySelector(
            "#paymentDetailsModal .modal-header h2"
        );


    if (modalTitle) {

        modalTitle.textContent =
            t("paymentDetails");

    }


    /*
     * Table headers.
     */

    const headers =
        document.querySelectorAll(
            "#paymentsTable thead th"
        );


    const headerTranslations = [

        "studentNumber",
        "studentName",
        "academicYear",
        "month",
        "amount",
        "paymentDate",
        "receiptNumber",
        "recordedBy"

    ];


    headers.forEach(
        (
            header,
            index
        ) => {

            if (
                headerTranslations[index]
            ) {

                header.textContent =
                    t(
                        headerTranslations[index]
                    );

            }

        }
    );


    /*
     * Filter options.
     */

    updateFilterOptions();


    /*
     * Language selector.
     */

    updateLanguageSelector();


    /*
     * Re-render current table
     * using translated values.
     */

    if (paymentsLoaded) {

        renderPayments(
            getFilteredPayments()
        );

    }

}


/* =================================
   Filter Option Translations
   ================================= */

function updateFilterOptions() {

    const academicYear =
        document.getElementById(
            "academicYear"
        );


    if (academicYear) {

        const currentValue =
            academicYear.value;


        const firstOption =
            academicYear.querySelector(
                'option[value=""]'
            );


        if (firstOption) {

            firstOption.textContent =
                t("all");

        }


        /*
         * Academic years themselves
         * must remain unchanged.
         */

        if (
            currentValue
        ) {

            academicYear.value =
                currentValue;

        }

    }


    const paymentMonth =
        document.getElementById(
            "paymentMonth"
        );


    if (paymentMonth) {

        const allOption =
            paymentMonth.querySelector(
                'option[value=""]'
            );


        if (allOption) {

            allOption.textContent =
                t("all");

        }


        paymentMonth
            .querySelectorAll(
                "option"
            )
            .forEach(
                option => {

                    if (
                        option.value &&
                        TRANSLATIONS.en.months[
                            option.value
                        ]
                    ) {

                        option.textContent =
                            t(
                                `months.${option.value}`
                            );

                    }

                }
            );

    }


    const stageFilter =
        document.getElementById(
            "stageFilter"
        );


    if (stageFilter) {

        stageFilter
            .querySelectorAll(
                "option"
            )
            .forEach(
                option => {

                    if (
                        !option.value
                    ) {

                        option.textContent =
                            t("all");

                        return;

                    }


                    const stageKey =
                        String(
                            option.value
                        )
                        .trim()
                        .toLowerCase();


                    if (
                        TRANSLATIONS[
                            "en"
                        ][stageKey]
                    ) {

                        option.textContent =
                            t(
                                stageKey
                            );

                    }

                }
            );

    }

}


/* =================================
   Language Selector
   ================================= */

function ensureLanguageSelector() {

    const headerActions =
        document.querySelector(
            ".header-actions"
        );


    if (
        !headerActions
    ) {

        return;

    }


    if (
        document.getElementById(
            "bmpLanguageSelector"
        )
    ) {

        return;

    }


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.id =
        "bmpLanguageWrapper";


    wrapper.style.display =
        "flex";

    wrapper.style.alignItems =
        "center";

    wrapper.style.gap =
        "7px";


    const label =
        document.createElement(
            "span"
        );


    label.id =
        "bmpLanguageLabel";


    label.style.fontSize =
        "13px";

    label.style.fontWeight =
        "600";


    const select =
        document.createElement(
            "select"
        );


    select.id =
        "bmpLanguageSelector";


    select.innerHTML = `

        <option value="en">
            English
        </option>

        <option value="ar">
            العربية
        </option>

        <option value="fr">
            Français
        </option>

    `;


    select.style.height =
        "38px";

    select.style.padding =
        "0 10px";

    select.style.borderRadius =
        "7px";

    select.style.border =
        "1px solid #d1d5db";

    select.style.background =
        "#ffffff";

    select.style.cursor =
        "pointer";


    select.addEventListener(
        "change",
        function () {

            setLanguage(
                this.value
            );

        }
    );


    wrapper.appendChild(
        label
    );

    wrapper.appendChild(
        select
    );


    headerActions.prepend(
        wrapper
    );

}


/* =================================
   Update Language Selector
   ================================= */

function updateLanguageSelector() {

    const selector =
        document.getElementById(
            "bmpLanguageSelector"
        );


    const label =
        document.getElementById(
            "bmpLanguageLabel"
        );


    if (selector) {

        selector.value =
            currentLanguage;

    }


    if (label) {

        label.textContent =
            t("language");

    }

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
            t(
                "errors.institutionMissing"
            )
        );

    }


    const username =
        getCurrentUsername();


    if (!username) {

        throw new Error(
            t(
                "errors.userMissing"
            )
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
            t(
                "errors.connection"
            )
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
            t(
                "errors.invalidResponse"
            )
        );

    }


    if (!result.success) {

        throw new Error(
            translateBackendError(
                result.message
            )
        );

    }


    return result;

}


/* =================================
   Backend Error Translation
   ================================= */

function translateBackendError(
    message
) {

    if (!message) {

        return t(
            "errors.unknownRequest"
        );

    }


    const text =
        String(
            message
        );


    const lower =
        text.toLowerCase();


    const knownErrors = [

        {
            keys: [
                "institution id is missing",
                "institution is missing"
            ],
            translation:
                "errors.institutionMissing"
        },

        {
            keys: [
                "current user is missing"
            ],
            translation:
                "errors.userMissing"
        },

        {
            keys: [
                "authentication failed",
                "school authentication failed"
            ],
            translation:
                "errors.authentication"
        }

    ];


    for (
        const item of knownErrors
    ) {

        if (
            item.keys.some(
                key =>
                    lower.includes(
                        key
                    )
            )
        ) {

            return t(
                item.translation
            );

        }

    }


    /*
     * Unknown backend errors are kept
     * because they may contain useful
     * diagnostic information.
     */

    return text;

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

            currentUser =
                null;

        }

    }


    if (!currentUser) {

        return false;

    }


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
   Current Academic Year
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

        console.error(
            "Students could not be loaded:",
            error
        );


        allStudents =
            [];


        return false;

    }

}


/* =================================
   Payment Helpers
   ================================= */

function getPaymentStudentId(
    payment
) {

    return String(
        payment.studentId ||
        payment.studentID ||
        payment.student_id ||
        ""
    ).trim();

}


function getPaymentStudentNumber(
    payment
) {

    return String(
        payment.studentNumber ||
        payment.student_number ||
        ""
    ).trim();

}


function getPaymentStudentName(
    payment
) {

    return String(
        payment.studentName ||
        payment.name ||
        ""
    ).trim();

}


function getPaymentAcademicYear(
    payment
) {

    return String(
        payment.academicYear ||
        payment.academic_year ||
        ""
    ).trim();

}


function getPaymentMonth(
    payment
) {

    return String(
        payment.month ||
        ""
    ).trim();

}


function getPaymentAmount(
    payment
) {

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


function getPaymentDate(
    payment
) {

    return String(
        payment.paymentDate ||
        payment.date ||
        ""
    ).trim();

}


function getReceiptNumber(
    payment
) {

    return String(
        payment.receiptNumber ||
        payment.receipt_number ||
        ""
    ).trim();

}


function getRecordedBy(
    payment
) {

    return String(
        payment.recordedBy ||
        payment.recorded_by ||
        ""
    ).trim();

}


/* =================================
   Student Lookup
   ================================= */

function findStudentForPayment(
    payment
) {

    const studentId =
        getPaymentStudentId(
            payment
        );


    const studentNumber =
        getPaymentStudentNumber(
            payment
        );


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

function normalizeStage(
    stage
) {

    return String(
        stage ||
        ""
    )
        .trim()
        .toLowerCase();

}


function getStageForPayment(
    payment
) {

    if (
        payment.stage
    ) {

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


function formatStage(
    stage
) {

    const value =
        normalizeStage(
            stage
        );


    const stages = {

        primary:
            t("primary"),

        preparatory:
            t("preparatory"),

        secondary:
            t("secondary")

    };


    return (
        stages[value] ||
        stage ||
        t("unknown")
    );

}


/* =================================
   Display Month
   ================================= */

function formatMonth(
    month
) {

    if (!month) {

        return t("unknown");

    }


    const monthKey =
        String(
            month
        ).trim();


    if (
        TRANSLATIONS.en.months[
            monthKey
        ]
    ) {

        return t(
            `months.${monthKey}`
        );

    }


    return monthKey;

}


/* =================================
   Load Payments
   ================================= */

async function loadPayments() {

    hideError();

    showLoading(
        t("loadingPayments")
    );


    try {

        const result =
            await apiRequest(
                "getPayments"
            );


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

            allPayments =
                [];

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
            t("errors.failedPayments")
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
        `<option value="">${escapeHtml(
            t("all")
        )}</option>`;


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
                    paymentStudentNumber.includes(
                        search
                    ) ||
                    paymentStudentName.includes(
                        search
                    );


                if (
                    !matchesSearch
                ) {

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

function sortPayments(
    payments
) {

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

function escapeHtml(
    value
) {

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
    payments =
        getFilteredPayments()
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
                    t("unknown")
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
                        t("unknown")
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        studentName ||
                        t("unknown")
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        academicYear ||
                        t("unknown")
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        formatMonth(
                            month
                        )
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        amount.toFixed(
                            2
                        )
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        paymentDate ||
                        t("unknown")
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        receiptNumber ||
                        t("unknown")
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        recordedBy ||
                        t("unknown")
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
            totalAmount.toFixed(
                2
            );

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

    if (
        !paymentsLoaded
    ) {

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
    message =
        "Loading..."
) {

    const loading =
        document.getElementById(
            "loadingState"
        );


    const messageElement =
        document.getElementById(
            "loadingMessage"
        );


    if (
        messageElement
    ) {

        messageElement.textContent =
            message;

    }


    if (
        loading
    ) {

        loading.style.display =
            "block";

    }

}


function hideLoading() {

    const loading =
        document.getElementById(
            "loadingState"
        );


    if (
        loading
    ) {

        loading.style.display =
            "none";

    }

}


/* =================================
   Error
   ================================= */

function showError(
    message
) {

    const errorState =
        document.getElementById(
            "errorState"
        );


    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    if (
        errorMessage
    ) {

        errorMessage.textContent =
            String(
                message ||
                t(
                    "errorLoading"
                )
            );

    }


    if (
        errorState
    ) {

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


    if (
        errorState
    ) {

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
        t("unknown");


    const stage =
        getStageForPayment(
            payment
        );


    const className =
        student?.className ||
        student?.class ||
        student?.classNumber ||
        t("unknown");


    const studentNumber =
        getPaymentStudentNumber(
            payment
        ) ||
        student?.studentNumber ||
        t("unknown");


    const academicYear =
        getPaymentAcademicYear(
            payment
        ) ||
        t("unknown");


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
        ) ||
        t("unknown");


    const receiptNumber =
        getReceiptNumber(
            payment
        ) ||
        t("unknown");


    const recordedBy =
        getRecordedBy(
            payment
        ) ||
        t("unknown");


    const notes =
        String(
            payment.notes ||
            ""
        );


    content.innerHTML = `

        <div class="info-grid">

            <div class="info-item">

                <span>
                    ${escapeHtml(
                        t("studentName")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        studentName
                    )}
                </strong>

            </div>


            <div class="info-item">

                <span>
                    ${escapeHtml(
                        t("studentNumber")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        studentNumber
                    )}
                </strong>

            </div>


            <div class="info-item">

                <span>
                    ${escapeHtml(
                        t("academicYear")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        academicYear
                    )}
                </strong>

            </div>


            <div class="info-item">

                <span>
                    ${escapeHtml(
                        t("stage")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        formatStage(
                            stage
                        )
                    )}
                </strong>

            </div>


            <div class="info-item">

                <span>
                    ${escapeHtml(
                        t("class")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        className
                    )}
                </strong>

            </div>


            <div class="info-item">

                <span>
                    ${escapeHtml(
                        t("month")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        formatMonth(
                            month
                        )
                    )}
                </strong>

            </div>


            <div class="info-item">

                <span>
                    ${escapeHtml(
                        t("amount")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        amount.toFixed(
                            2
                        )
                    )}
                </strong>

            </div>


            <div class="info-item">

                <span>
                    ${escapeHtml(
                        t("paymentDate")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        paymentDate
                    )}
                </strong>

            </div>


            <div class="info-item">

                <span>
                    ${escapeHtml(
                        t("receiptNumber")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        receiptNumber
                    )}
                </strong>

            </div>


            <div class="info-item">

                <span>
                    ${escapeHtml(
                        t("recordedBy")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        recordedBy
                    )}
                </strong>

            </div>


            ${
                notes
                    ? `
                    <div
                        class="info-item"
                        style="grid-column: 1 / -1;">

                        <span>
                            ${escapeHtml(
                                t("notes")
                            )}
                        </span>

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


        <div
            style="
                margin-top:20px;
                display:flex;
                justify-content:center;
                gap:10px;
                flex-wrap:wrap;
            ">

            <button
                type="button"
                id="printPaymentReceiptBtn"
                class="primary-button">

                ${escapeHtml(
                    t("printReceipt")
                )}

            </button>

        </div>

    `;


    modal.style.display =
        "block";


    const printButton =
        document.getElementById(
            "printPaymentReceiptBtn"
        );


    if (
        printButton
    ) {

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


/* =================================
   Print Payment Receipt
   ================================= */

async function printPaymentReceipt(
    payment
) {

    try {

        closePaymentDetails();


        /*
         * Read school information.
         *
         * If the school settings endpoint
         * is unavailable, fall back to the
         * authenticated user session.
         */

        let schoolSettings = {};


        try {

            const settingsResult =
                await apiRequest(
                    "getSchoolSettings"
                );


            schoolSettings =
                settingsResult.settings ||
                settingsResult.schoolSettings ||
                settingsResult.institution ||
                {};

        } catch (error) {

            console.warn(
                "School settings could not be loaded:",
                error
            );

        }


        const schoolName =
            schoolSettings.name ||
            schoolSettings.schoolName ||
            currentUser?.institutionName ||
            currentUser?.schoolName ||
            institutionId ||
            "School";


        const schoolPhone =
            schoolSettings.phone ||
            schoolSettings.phoneNumber ||
            "";


        const schoolAddress =
            schoolSettings.address ||
            "";


        const schoolEmail =
            schoolSettings.email ||
            "";


        const schoolLogo =
            schoolSettings.logo ||
            schoolSettings.logoUrl ||
            currentUser?.logo ||
            "";


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


        const studentNumber =
            getPaymentStudentNumber(
                payment
            ) ||
            student?.studentNumber ||
            "-";


        const academicYear =
            getPaymentAcademicYear(
                payment
            ) ||
            "-";


        const stage =
            formatStage(
                getStageForPayment(
                    payment
                )
            );


        const className =
            student?.className ||
            student?.class ||
            student?.classNumber ||
            "-";


        const paidMonth =
            formatMonth(
                getPaymentMonth(
                    payment
                )
            );


        const paymentAmount =
            getPaymentAmount(
                payment
            );


        const paidDate =
            getPaymentDate(
                payment
            ) ||
            "-";


        const receiptNumber =
            getReceiptNumber(
                payment
            ) ||
            "-";


        const recordedBy =
            getRecordedBy(
                payment
            ) ||
            "-";


        const notes =
            String(
                payment.notes ||
                ""
            ).trim();


        /*
         * Remove any previous print
         * container.
         */

        const oldPrintArea =
            document.getElementById(
                "bmpPrintReceipt"
            );


        if (
            oldPrintArea
        ) {

            oldPrintArea.remove();

        }


        /*
         * Create receipt print area.
         */

        const printArea =
            document.createElement(
                "div"
            );


        printArea.id =
            "bmpPrintReceipt";


        printArea.innerHTML = `

            ${
                schoolLogo
                    ? `
                    <div class="bmp-receipt-logo">

                        <img
                            src="${escapeHtml(
                                schoolLogo
                            )}"
                            alt="School Logo">

                    </div>
                    `
                    : ""
            }


            <div class="bmp-receipt-school">

                <h1>
                    ${escapeHtml(
                        schoolName
                    )}
                </h1>


                <div class="bmp-receipt-subtitle">

                    ${escapeHtml(
                        getReceiptTitle()
                    )}

                </div>


                ${
                    schoolPhone
                        ? `
                        <div class="bmp-receipt-school-detail">
                            ${escapeHtml(
                                schoolPhone
                            )}
                        </div>
                        `
                        : ""
                }


                ${
                    schoolAddress
                        ? `
                        <div class="bmp-receipt-school-detail">
                            ${escapeHtml(
                                schoolAddress
                            )}
                        </div>
                        `
                        : ""
                }


                ${
                    schoolEmail
                        ? `
                        <div class="bmp-receipt-school-detail">
                            ${escapeHtml(
                                schoolEmail
                            )}
                        </div>
                        `
                        : ""
                }

            </div>


            <div class="bmp-receipt-divider">
                --------------------------------
            </div>


            <div class="bmp-receipt-receipt-number">

                <span>
                    ${escapeHtml(
                        t("receiptNumber")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        receiptNumber
                    )}
                </strong>

            </div>


            <div class="bmp-receipt-divider">
                --------------------------------
            </div>


            <div class="bmp-receipt-row">

                <span>
                    ${escapeHtml(
                        t("studentName")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        studentName
                    )}
                </strong>

            </div>


            <div class="bmp-receipt-row">

                <span>
                    ${escapeHtml(
                        t("studentNumber")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        studentNumber
                    )}
                </strong>

            </div>


            <div class="bmp-receipt-row">

                <span>
                    ${escapeHtml(
                        t("academicYear")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        academicYear
                    )}
                </strong>

            </div>


            <div class="bmp-receipt-row">

                <span>
                    ${escapeHtml(
                        t("stage")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        stage
                    )}
                </strong>

            </div>


            <div class="bmp-receipt-row">

                <span>
                    ${escapeHtml(
                        t("class")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        className
                    )}
                </strong>

            </div>


            <div class="bmp-receipt-divider">
                --------------------------------
            </div>


            <div class="bmp-receipt-row">

                <span>
                    ${escapeHtml(
                        t("month")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        paidMonth
                    )}
                </strong>

            </div>


            <div class="bmp-receipt-amount">

                <span>
                    ${escapeHtml(
                        t("amount")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        paymentAmount.toLocaleString()
                    )}
                    MRU
                </strong>

            </div>


            <div class="bmp-receipt-row">

                <span>
                    ${escapeHtml(
                        t("paymentDate")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        formatReceiptDate(
                            paidDate
                        )
                    )}
                </strong>

            </div>


            <div class="bmp-receipt-row">

                <span>
                    ${escapeHtml(
                        t("recordedBy")
                    )}
                </span>

                <strong>
                    ${escapeHtml(
                        recordedBy
                    )}
                </strong>

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

                        <div>
                            ${escapeHtml(
                                notes
                            )}
                        </div>

                    </div>
                    `
                    : ""
            }


            <div class="bmp-receipt-divider">
                --------------------------------
            </div>


            <div class="bmp-receipt-thanks">

                ${escapeHtml(
                    getReceiptThankYou()
                )}

            </div>


            <div class="bmp-receipt-footer">

                BMP - Business Management Platform

            </div>

        `;


        document.body.appendChild(
            printArea
        );


        addReceiptPrintStyles();


        /*
         * Remove print area after printing.
         */

        const cleanupReceipt =
            function () {

                const currentPrintArea =
                    document.getElementById(
                        "bmpPrintReceipt"
                    );


                if (
                    currentPrintArea
                ) {

                    currentPrintArea.remove();

                }

            };


        window.addEventListener(
            "afterprint",
            cleanupReceipt,
            {
                once:
                    true
            }
        );


        /*
         * Give the browser a moment to
         * render the receipt before opening
         * the print dialog.
         */

        setTimeout(
            function () {

                window.print();

            },
            150
        );

    }

    catch (error) {

        console.error(
            "Receipt printing error:",
            error
        );


        alert(
            error.message ||
            "Failed to prepare receipt."
        );

    }

}


/* =================================
   Receipt Print Styles
   ================================= */

function addReceiptPrintStyles() {

    let style =
        document.getElementById(
            "bmpReceiptPrintStyles"
        );


    if (
        style
    ) {

        return;

    }


    style =
        document.createElement(
            "style"
        );


    style.id =
        "bmpReceiptPrintStyles";


    style.textContent = `

        #bmpPrintReceipt {

            display:
                none;

        }


        @media print {

            @page {

                size:
                    80mm auto;

                margin:
                    4mm;

            }


            html,
            body {

                margin:
                    0 !important;

                padding:
                    0 !important;

            }


            body > * {

                display:
                    none !important;

            }


            #bmpPrintReceipt {

                display:
                    block !important;

                width:
                    72mm;

                max-width:
                    72mm;

                margin:
                    0 auto;

                padding:
                    0;

                background:
                    #ffffff;

                color:
                    #000000;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

                font-size:
                    11px;

                line-height:
                    1.45;

            }


            .bmp-receipt-logo {

                text-align:
                    center;

                margin-bottom:
                    7px;

            }


            .bmp-receipt-logo img {

                max-width:
                    45mm;

                max-height:
                    22mm;

                object-fit:
                    contain;

            }


            .bmp-receipt-school {

                text-align:
                    center;

            }


            .bmp-receipt-school h1 {

                margin:
                    0 0 4px;

                font-size:
                    17px;

                line-height:
                    1.2;

            }


            .bmp-receipt-subtitle {

                font-size:
                    12px;

                font-weight:
                    700;

                margin-bottom:
                    5px;

            }


            .bmp-receipt-school-detail {

                font-size:
                    9px;

                line-height:
                    1.35;

                word-break:
                    break-word;

            }


            .bmp-receipt-divider {

                text-align:
                    center;

                margin:
                    7px 0;

                font-family:
                    "Courier New",
                    monospace;

                white-space:
                    nowrap;

                overflow:
                    hidden;

            }


            .bmp-receipt-receipt-number {

                display:
                    flex;

                justify-content:
                    space-between;

                align-items:
                    flex-start;

                gap:
                    8px;

                font-size:
                    11px;

            }


            .bmp-receipt-receipt-number strong {

                text-align:
                    right;

                max-width:
                    55%;

                word-break:
                    break-word;

            }


            .bmp-receipt-row {

                display:
                    flex;

                justify-content:
                    space-between;

                align-items:
                    flex-start;

                gap:
                    10px;

                margin:
                    4px 0;

            }


            .bmp-receipt-row span {

                text-align:
                    left;

            }


            .bmp-receipt-row strong {

                text-align:
                    right;

                max-width:
                    52%;

                word-break:
                    break-word;

            }


            .bmp-receipt-amount {

                display:
                    flex;

                justify-content:
                    space-between;

                align-items:
                    center;

                gap:
                    10px;

                margin:
                    9px 0;

                padding:
                    7px 0;

                border-top:
                    1px solid #000;

                border-bottom:
                    1px solid #000;

                font-size:
                    13px;

            }


            .bmp-receipt-amount strong {

                font-size:
                    15px;

                text-align:
                    right;

            }


            .bmp-receipt-notes {

                margin-top:
                    7px;

                padding-top:
                    5px;

                border-top:
                    1px dashed #000;

            }


            .bmp-receipt-notes > div {

                margin-top:
                    3px;

                white-space:
                    pre-wrap;

                word-break:
                    break-word;

            }


            .bmp-receipt-thanks {

                text-align:
                    center;

                margin-top:
                    8px;

                font-weight:
                    600;

            }


            .bmp-receipt-footer {

                text-align:
                    center;

                margin-top:
                    8px;

                font-size:
                    8px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =================================
   Receipt Title
   ================================= */

function getReceiptTitle() {

    const titles = {

        en:
            "Official Payment Receipt",

        ar:
            "إيصال دفع رسمي",

        fr:
            "Reçu de paiement officiel"

    };


    return (
        titles[currentLanguage] ||
        titles.en
    );

}


/* =================================
   Receipt Thank You
   ================================= */

function getReceiptThankYou() {

    const messages = {

        en:
            "Thank you for your payment.",

        ar:
            "شكراً لكم على الدفع.",

        fr:
            "Merci pour votre paiement."

    };


    return (
        messages[currentLanguage] ||
        messages.en
    );

}


/* =================================
   Receipt Date
   ================================= */

function formatReceiptDate(
    value
) {

    if (!value) {

        return "-";

    }


    const parsed =
        new Date(
            value
        );


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return parsed.toLocaleDateString(
        currentLanguage === "ar"
            ? "ar"
            : currentLanguage === "fr"
                ? "fr-FR"
                : "en-GB"
    );

}


/* =================================
   Navigation
   ================================= */

function getNavigationInstitutionId() {

    if (
        institutionId
    ) {

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


    if (
        recordPaymentButton
    ) {

        recordPaymentButton.addEventListener(
            "click",
            goToRecordPayment
        );

    }


    if (
        applyFiltersButton
    ) {

        applyFiltersButton.addEventListener(
            "click",
            applyFilters
        );

    }


    if (
        resetFiltersButton
    ) {

        resetFiltersButton.addEventListener(
            "click",
            resetFilters
        );

    }


    if (
        retryButton
    ) {

        retryButton.addEventListener(
            "click",
            initializePage
        );

    }


    if (
        searchInput
    ) {

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


    if (
        academicYear
    ) {

        academicYear.addEventListener(
            "change",
            applyFilters
        );

    }


    if (
        paymentMonth
    ) {

        paymentMonth.addEventListener(
            "change",
            applyFilters
        );

    }


    if (
        stageFilter
    ) {

        stageFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (
        modalCloseButton
    ) {

        modalCloseButton.addEventListener(
            "click",
            closePaymentDetails
        );

    }


    if (
        modalOverlay
    ) {

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
   Language Initialization
   ================================= */

function initializeLanguage() {

    currentLanguage =
        getSavedLanguage();


    ensureLanguageSelector();

    applyLanguage();


    /*
     * Allow another page/component
     * to change the language.
     */

    window.addEventListener(
        "bmpLanguageChanged",
        event => {

            const language =
                event.detail?.language;


            if (
                language
            ) {

                setLanguage(
                    language
                );

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
            t(
                "errors.authentication"
            )
        );

        return;

    }


    console.log(
        "Institution ID:",
        institutionId
    );


    const paymentsResult =
        await loadPayments();


    await loadStudents();


    loadAcademicYears();


    applyLanguage();


    if (
        paymentsResult
    ) {

        applyFilters();

    }

}


/* =================================
   Start
   ================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeLanguage();

        setupEventListeners();

        initializePage();

    }
);
