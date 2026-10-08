/* =================================
   School Record Payment - BMP
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
let institution = null;

let students = [];
let selectedStudent = null;

let pageInitialized = false;

let currentLanguage = "en";


/* =================================
   Translations
   ================================= */

const TRANSLATIONS = {

    en: {

        pageTitle:
            "Record School Payment",

        pageSubtitle:
            "Register a monthly student payment",

        back:
            "Back",

        schoolInformation:
            "School Information",

        institutionId:
            "Institution ID",

        schoolName:
            "School Name",

        paymentInformation:
            "Payment Information",

        academicYear:
            "Academic Year",

        selectAcademicYear:
            "Select Academic Year",

        studentNumber:
            "Student Number",

        enterStudentNumber:
            "Enter student number",

        search:
            "Search",

        studentName:
            "Student Name",

        searchForStudent:
            "Search for a student",

        stage:
            "Stage",

        class:
            "Class",

        month:
            "Month",

        selectMonth:
            "Select Month",

        amount:
            "Amount",

        enterAmount:
            "Enter amount",

        paymentDate:
            "Payment Date",

        receiptNumber:
            "Receipt Number",

        generatedAfterSaving:
            "Generated after saving",

        recordedBy:
            "Recorded By",

        currentUser:
            "Current user",

        notes:
            "Notes",

        optionalNotes:
            "Optional notes",

        cancel:
            "Cancel",

        recordPayment:
            "Record Payment",

        recording:
            "Recording...",

        loadingStudents:
            "Loading students...",

        paymentRecorded:
            "Payment recorded successfully.",

        receipt:
            "Receipt",

        studentFound:
            "Student found",

        studentNotFound:
            "Student not found for this academic year.",

        duplicateStudentNumber:
            "More than one student has this student number. Please contact the administrator.",

        selectAcademicYearFirst:
            "Please select an academic year first.",

        enterStudentNumberFirst:
            "Please enter the student number.",

        validStudent:
            "Please search and select a valid student first.",

        selectMonthError:
            "Please select a month.",

        validAmount:
            "Please enter a valid payment amount.",

        selectPaymentDate:
            "Please select the payment date.",

        studentNotFoundSelectedYear:
            "Student not found for the selected academic year.",

        authenticationFailed:
            "School authentication failed. Please log in again.",

        noStudents:
            "No students were found for this school.",

        institutionMissing:
            "Institution ID is missing.",

        userMissing:
            "Current user is missing.",

        connectionError:
            "Could not connect to the BMP server. Please check the Apps Script Web App URL and your internet connection.",

        invalidResponse:
            "The server returned an invalid response.",

        requestFailed:
            "The request failed.",

        paymentFailed:
            "Failed to record payment.",

        language:
            "Language",

        unknown:
            "-",

        primary:
            "Primary",

        preparatory:
            "Preparatory",

        secondary:
            "Secondary",

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

        }

    },


    ar: {

        pageTitle:
            "تسجيل دفعة مدرسية",

        pageSubtitle:
            "تسجيل دفعة شهرية للطالب",

        back:
            "رجوع",

        schoolInformation:
            "معلومات المدرسة",

        institutionId:
            "معرّف المؤسسة",

        schoolName:
            "اسم المدرسة",

        paymentInformation:
            "معلومات الدفع",

        academicYear:
            "السنة الدراسية",

        selectAcademicYear:
            "اختر السنة الدراسية",

        studentNumber:
            "رقم الطالب",

        enterStudentNumber:
            "أدخل رقم الطالب",

        search:
            "بحث",

        studentName:
            "اسم الطالب",

        searchForStudent:
            "ابحث عن طالب",

        stage:
            "المرحلة",

        class:
            "القسم",

        month:
            "الشهر",

        selectMonth:
            "اختر الشهر",

        amount:
            "المبلغ",

        enterAmount:
            "أدخل المبلغ",

        paymentDate:
            "تاريخ الدفع",

        receiptNumber:
            "رقم الإيصال",

        generatedAfterSaving:
            "يتم إنشاؤه بعد الحفظ",

        recordedBy:
            "سجلها المستخدم",

        currentUser:
            "المستخدم الحالي",

        notes:
            "ملاحظات",

        optionalNotes:
            "ملاحظات اختيارية",

        cancel:
            "إلغاء",

        recordPayment:
            "تسجيل الدفعة",

        recording:
            "جارٍ تسجيل الدفعة...",

        loadingStudents:
            "جارٍ تحميل الطلاب...",

        paymentRecorded:
            "تم تسجيل الدفعة بنجاح.",

        receipt:
            "الإيصال",

        studentFound:
            "تم العثور على الطالب",

        studentNotFound:
            "لم يتم العثور على الطالب في هذه السنة الدراسية.",

        duplicateStudentNumber:
            "يوجد أكثر من طالب يحمل رقم الطالب هذا. يرجى الاتصال بالمسؤول.",

        selectAcademicYearFirst:
            "يرجى اختيار السنة الدراسية أولاً.",

        enterStudentNumberFirst:
            "يرجى إدخال رقم الطالب.",

        validStudent:
            "يرجى البحث عن طالب صالح واختياره أولاً.",

        selectMonthError:
            "يرجى اختيار الشهر.",

        validAmount:
            "يرجى إدخال مبلغ دفع صحيح.",

        selectPaymentDate:
            "يرجى اختيار تاريخ الدفع.",

        studentNotFoundSelectedYear:
            "لم يتم العثور على الطالب في السنة الدراسية المحددة.",

        authenticationFailed:
            "فشل تسجيل دخول المدرسة. يرجى تسجيل الدخول مرة أخرى.",

        noStudents:
            "لم يتم العثور على طلاب لهذه المدرسة.",

        institutionMissing:
            "معرّف المؤسسة غير موجود.",

        userMissing:
            "المستخدم الحالي غير موجود.",

        connectionError:
            "تعذر الاتصال بخادم النظام. يرجى التحقق من رابط النظام واتصال الإنترنت.",

        invalidResponse:
            "أعاد الخادم استجابة غير صالحة.",

        requestFailed:
            "فشل تنفيذ الطلب.",

        paymentFailed:
            "فشل تسجيل الدفعة.",

        language:
            "اللغة",

        unknown:
            "-",

        primary:
            "الابتدائية",

        preparatory:
            "الإعدادية",

        secondary:
            "الثانوية",

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

        }

    },


    fr: {

        pageTitle:
            "Enregistrer un paiement scolaire",

        pageSubtitle:
            "Enregistrer un paiement mensuel de l'élève",

        back:
            "Retour",

        schoolInformation:
            "Informations sur l'établissement",

        institutionId:
            "Identifiant de l'établissement",

        schoolName:
            "Nom de l'établissement",

        paymentInformation:
            "Informations de paiement",

        academicYear:
            "Année scolaire",

        selectAcademicYear:
            "Sélectionner l'année scolaire",

        studentNumber:
            "Numéro de l'élève",

        enterStudentNumber:
            "Entrer le numéro de l'élève",

        search:
            "Rechercher",

        studentName:
            "Nom de l'élève",

        searchForStudent:
            "Rechercher un élève",

        stage:
            "Cycle",

        class:
            "Classe",

        month:
            "Mois",

        selectMonth:
            "Sélectionner le mois",

        amount:
            "Montant",

        enterAmount:
            "Entrer le montant",

        paymentDate:
            "Date du paiement",

        receiptNumber:
            "Numéro du reçu",

        generatedAfterSaving:
            "Généré après l'enregistrement",

        recordedBy:
            "Enregistré par",

        currentUser:
            "Utilisateur actuel",

        notes:
            "Notes",

        optionalNotes:
            "Notes facultatives",

        cancel:
            "Annuler",

        recordPayment:
            "Enregistrer le paiement",

        recording:
            "Enregistrement...",

        loadingStudents:
            "Chargement des élèves...",

        paymentRecorded:
            "Paiement enregistré avec succès.",

        receipt:
            "Reçu",

        studentFound:
            "Élève trouvé",

        studentNotFound:
            "Aucun élève trouvé pour cette année scolaire.",

        duplicateStudentNumber:
            "Plusieurs élèves portent ce numéro. Veuillez contacter l'administrateur.",

        selectAcademicYearFirst:
            "Veuillez d'abord sélectionner une année scolaire.",

        enterStudentNumberFirst:
            "Veuillez entrer le numéro de l'élève.",

        validStudent:
            "Veuillez rechercher et sélectionner un élève valide.",

        selectMonthError:
            "Veuillez sélectionner un mois.",

        validAmount:
            "Veuillez entrer un montant valide.",

        selectPaymentDate:
            "Veuillez sélectionner la date du paiement.",

        studentNotFoundSelectedYear:
            "Élève introuvable pour l'année scolaire sélectionnée.",

        authenticationFailed:
            "L'authentification de l'école a échoué. Veuillez vous reconnecter.",

        noStudents:
            "Aucun élève n'a été trouvé pour cet établissement.",

        institutionMissing:
            "L'identifiant de l'établissement est manquant.",

        userMissing:
            "L'utilisateur actuel est introuvable.",

        connectionError:
            "Impossible de se connecter au serveur BMP. Vérifiez l'URL de l'application et votre connexion Internet.",

        invalidResponse:
            "Le serveur a renvoyé une réponse invalide.",

        requestFailed:
            "La requête a échoué.",

        paymentFailed:
            "Échec de l'enregistrement du paiement.",

        language:
            "Langue",

        unknown:
            "-",

        primary:
            "Primaire",

        preparatory:
            "Collège",

        secondary:
            "Secondaire",

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
   Language
   ================================= */

function getSavedLanguage() {

    const keys = [
        "bmpLanguage",
        "language",
        "selectedLanguage",
        "appLanguage"
    ];


    for (
        const key of keys
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


function setLanguage(language) {

    language =
        String(
            language || "en"
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


    window.dispatchEvent(
        new CustomEvent(
            "bmpLanguageChanged",
            {
                detail: {
                    language:
                        currentLanguage
                }
            }
        )
    );

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
   Apply Language
   ================================= */

function applyLanguage() {

    document.documentElement.lang =
        currentLanguage;


    document.documentElement.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";


    document.title =
        `${t("pageTitle")} - BMP`;


    /* Header */

    const pageTitle =
        document.querySelector(
            ".page-header h1"
        );


    const pageSubtitle =
        document.querySelector(
            ".page-header p"
        );


    const backButton =
        document.getElementById(
            "backButton"
        );


    if (pageTitle) {

        pageTitle.textContent =
            t("pageTitle");

    }


    if (pageSubtitle) {

        pageSubtitle.textContent =
            t("pageSubtitle");

    }


    if (backButton) {

        backButton.textContent =
            t("back");

    }


    /* Section titles */

    const sectionTitles =
        document.querySelectorAll(
            ".card h2"
        );


    if (
        sectionTitles.length >= 2
    ) {

        sectionTitles[0].textContent =
            t("schoolInformation");

        sectionTitles[1].textContent =
            t("paymentInformation");

    }


    /* Labels */

    const labelMap = {

        academicYear:
            "academicYear",

        studentNumberSearch:
            "studentNumber",

        studentName:
            "studentName",

        studentNumber:
            "studentNumber",

        stage:
            "stage",

        className:
            "class",

        month:
            "month",

        amount:
            "amount",

        paymentDate:
            "paymentDate",

        receiptNumber:
            "receiptNumber",

        recordedBy:
            "recordedBy",

        notes:
            "notes"

    };


    Object.keys(
        labelMap
    ).forEach(
        fieldId => {

            const label =
                document.querySelector(
                    `label[for="${fieldId}"]`
                );


            if (label) {

                label.textContent =
                    t(
                        labelMap[fieldId]
                    );

            }

        }
    );


    /* School information labels */

    const infoItems =
        document.querySelectorAll(
            ".info-item span"
        );


    if (
        infoItems.length >= 2
    ) {

        infoItems[0].textContent =
            t("institutionId");

        infoItems[1].textContent =
            t("schoolName");

    }


    /* Student search */

    const searchInput =
        document.getElementById(
            "studentNumberSearch"
        );


    if (searchInput) {

        searchInput.placeholder =
            t("enterStudentNumber");

    }


    const searchButton =
        document.getElementById(
            "searchStudentButton"
        );


    if (searchButton) {

        searchButton.textContent =
            t("search");

    }


    /* Read-only placeholders */

    const studentName =
        document.getElementById(
            "studentName"
        );


    if (
        studentName &&
        !studentName.value
    ) {

        studentName.placeholder =
            t("searchForStudent");

    }


    const studentNumber =
        document.getElementById(
            "studentNumber"
        );


    if (
        studentNumber &&
        !studentNumber.value
    ) {

        studentNumber.placeholder =
            t("studentNumber");

    }


    const stage =
        document.getElementById(
            "stage"
        );


    if (
        stage &&
        !stage.value
    ) {

        stage.placeholder =
            t("stage");

    }


    const className =
        document.getElementById(
            "className"
        );


    if (
        className &&
        !className.value
    ) {

        className.placeholder =
            t("class");

    }


    /* Month options */

    updateMonthOptions();


    /* Academic year first option */

    updateAcademicYearOption();


    /* Amount placeholder */

    const amount =
        document.getElementById(
            "amount"
        );


    if (amount) {

        amount.placeholder =
            t("enterAmount");

    }


    /* Receipt */

    const receiptNumber =
        document.getElementById(
            "receiptNumber"
        );


    if (
        receiptNumber &&
        !receiptNumber.value
    ) {

        receiptNumber.placeholder =
            t("generatedAfterSaving");

    }


    /* Recorded by */

    const recordedBy =
        document.getElementById(
            "recordedBy"
        );


    if (
        recordedBy &&
        !recordedBy.value
    ) {

        recordedBy.placeholder =
            t("currentUser");

    }


    /* Notes */

    const notes =
        document.getElementById(
            "notes"
        );


    if (notes) {

        notes.placeholder =
            t("optionalNotes");

    }


    /* Buttons */

    const cancelButton =
        document.getElementById(
            "cancelButton"
        );


    const recordPaymentButton =
        document.getElementById(
            "recordPaymentButton"
        );


    if (cancelButton) {

        cancelButton.textContent =
            t("cancel");

    }


    if (
        recordPaymentButton &&
        !recordPaymentButton.disabled
    ) {

        recordPaymentButton.textContent =
            t("recordPayment");

    }


    /* Language selector */

    const selector =
        document.getElementById(
            "bmpLanguageSelector"
        );


    const languageLabel =
        document.getElementById(
            "bmpLanguageLabel"
        );


    if (selector) {

        selector.value =
            currentLanguage;

    }


    if (languageLabel) {

        languageLabel.textContent =
            t("language");

    }

}


/* =================================
   Academic Year Option
   ================================= */

function updateAcademicYearOption() {

    const select =
        document.getElementById(
            "academicYear"
        );


    if (!select) {

        return;

    }


    const firstOption =
        select.querySelector(
            'option[value=""]'
        );


    if (firstOption) {

        firstOption.textContent =
            t("selectAcademicYear");

    }

}


/* =================================
   Month Options
   ================================= */

function updateMonthOptions() {

    const select =
        document.getElementById(
            "month"
        );


    if (!select) {

        return;

    }


    select.querySelectorAll(
        "option"
    ).forEach(
        option => {

            if (
                !option.value
            ) {

                option.textContent =
                    t("selectMonth");

                return;

            }


            if (
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


/* =================================
   API Request
   ================================= */

async function apiRequest(
    action,
    data = {}
) {

    if (!institutionId) {

        throw new Error(
            t("institutionMissing")
        );

    }


    const username =
        getCurrentUsername();


    if (!username) {

        throw new Error(
            t("userMissing")
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
            t("connectionError")
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
            t("invalidResponse") +
            " " +
            responseText.substring(
                0,
                300
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

        return t("requestFailed");

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

            key:
                "institutionMissing"

        },

        {
            keys: [
                "current user is missing"
            ],

            key:
                "userMissing"

        },

        {
            keys: [
                "authentication failed",
                "school authentication failed"
            ],

            key:
                "authenticationFailed"

        },

        {
            keys: [
                "could not connect"
            ],

            key:
                "connectionError"

        },

        {
            keys: [
                "invalid response"
            ],

            key:
                "invalidResponse"

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
                item.key
            );

        }

    }


    /*
     * Keep unknown backend errors
     * because they may be important
     * for diagnosis.
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


    if (
        institutionIdElement
    ) {

        institutionIdElement.textContent =
            institution.id ||
            t("unknown");

    }


    if (
        institutionNameElement
    ) {

        institutionNameElement.textContent =
            institution.name ||
            t("unknown");

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
     * October -> June.
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
                    ).trim()
                );

            }

        }
    );


    years.add(
        getCurrentAcademicYear()
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


    const currentValue =
        select.value;


    const years =
        getAvailableAcademicYears();


    select.innerHTML =
        "";


    const firstOption =
        document.createElement(
            "option"
        );


    firstOption.value =
        "";

    firstOption.textContent =
        t("selectAcademicYear");


    select.appendChild(
        firstOption
    );


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
        currentValue &&
        years.includes(
            currentValue
        )
    ) {

        select.value =
            currentValue;

    } else if (
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
            t("requestFailed")
        );


        return false;

    }

}


/* =================================
   Student Helpers
   ================================= */

function getStudentId(
    student
) {

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


function normalizeStudentNumber(
    value
) {

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
                academicYearElement.value ||
                ""
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
            t("selectAcademicYearFirst")
        );

        return;

    }


    if (!studentNumber) {

        clearStudentInformation();

        showError(
            t("enterStudentNumberFirst")
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


    if (
        matches.length === 0
    ) {

        selectedStudent =
            null;

        clearStudentInformation();


        showStudentSearchResult(
            t("studentNotFound"),
            true
        );


        return;

    }


    if (
        matches.length > 1
    ) {

        selectedStudent =
            null;

        clearStudentInformation();


        showStudentSearchResult(
            t("duplicateStudentNumber"),
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


    if (
        studentIdElement
    ) {

        studentIdElement.value =
            getStudentId(
                student
            );

    }


    if (
        studentNameElement
    ) {

        studentNameElement.value =
            student.name ||
            "";

    }


    if (
        studentNumberElement
    ) {

        studentNumberElement.value =
            student.studentNumber ||
            "";

    }


    if (
        stageElement
    ) {

        stageElement.value =
            formatStage(
                student.stage
            );

    }


    if (
        classNameElement
    ) {

        classNameElement.value =
            student.className ||
            student.class ||
            student.classNumber ||
            "";

    }


    showStudentSearchResult(
        `${t("studentFound")}: ${student.name || t("unknown")}`
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
        Boolean(
            isError
        )
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

function formatStage(
    stage
) {

    if (!stage) {

        return t("unknown");

    }


    const value =
        String(
            stage
        )
        .trim()
        .toLowerCase();


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
            t("unknown");

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
        "";


    if (!receiptNumber) {

        element.placeholder =
            t("generatedAfterSaving");

    }

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


function showError(
    message
) {

    const error =
        document.getElementById(
            "errorMessage"
        );


    const success =
        document.getElementById(
            "successMessage"
        );


    if (
        success
    ) {

        success.style.display =
            "none";

        success.textContent =
            "";

    }


    if (
        error
    ) {

        error.textContent =
            String(
                message ||
                t("requestFailed")
            );

        error.style.display =
            "block";

    }


    console.error(
        "BMP Error:",
        message
    );

}


function showSuccess(
    message
) {

    const error =
        document.getElementById(
            "errorMessage"
        );


    const success =
        document.getElementById(
            "successMessage"
        );


    if (
        error
    ) {

        error.style.display =
            "none";

        error.textContent =
            "";

    }


    if (
        success
    ) {

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

async function savePayment(
    event
) {

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
        )?.value.trim() ||
        "";


    /* Validation */

    if (!academicYear) {

        showError(
            t("selectAcademicYearFirst")
        );

        return;

    }


    if (
        !studentId ||
        !selectedStudent
    ) {

        showError(
            t("validStudent")
        );

        return;

    }


    if (!month) {

        showError(
            t("selectMonthError")
        );

        return;

    }


    if (
        !Number.isFinite(
            amount
        ) ||
        amount <= 0
    ) {

        showError(
            t("validAmount")
        );

        return;

    }


    if (!paymentDate) {

        showError(
            t("selectPaymentDate")
        );

        return;

    }


    const student =
        students.find(
            item => {

                return (
                    getStudentId(
                        item
                    ) ===
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
            t("studentNotFoundSelectedYear")
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
            t("recording");

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


        if (
            receiptNumber
        ) {

            setReceiptNumber(
                receiptNumber
            );

        }


        let successMessage =
            t("paymentRecorded");


        if (
            receiptNumber
        ) {

            successMessage +=
                ` ${t("receipt")}: ${receiptNumber}`;

        }


        showSuccess(
            successMessage
        );


        /*
         * Give the user time to see
         * the success message.
         */

        setTimeout(
            () => {

                window.location.href =
                    "school-payments.html?id=" +
                    encodeURIComponent(
                        institutionId
                    );

            },
            1200
        );


    } catch (error) {

        console.error(
            "Payment error:",
            error
        );


        showError(
            error.message ||
            t("paymentFailed")
        );


        if (button) {

            button.disabled =
                false;

            button.textContent =
                t("recordPayment");

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


    if (
        academicYear
    ) {

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


    if (
        searchButton
    ) {

        searchButton.addEventListener(
            "click",
            searchStudentByNumber
        );

    }


    const studentSearch =
        document.getElementById(
            "studentNumberSearch"
        );


    if (
        studentSearch
    ) {

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


    if (
        paymentForm
    ) {

        paymentForm.addEventListener(
            "submit",
            savePayment
        );

    }


    const backButton =
        document.getElementById(
            "backButton"
        );


    if (
        backButton
    ) {

        backButton.addEventListener(
            "click",
            goBack
        );

    }


    const cancelButton =
        document.getElementById(
            "cancelButton"
        );


    if (
        cancelButton
    ) {

        cancelButton.addEventListener(
            "click",
            goBack
        );

    }

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
     * Allows another page/component
     * to synchronize the language.
     */

    window.addEventListener(
        "bmpLanguageChanged",
        event => {

            const language =
                event.detail?.language;


            if (
                language &&
                TRANSLATIONS[language]
            ) {

                currentLanguage =
                    language;

                localStorage.setItem(
                    "bmpLanguage",
                    currentLanguage
                );

                applyLanguage();

            }

        }
    );

}


/* =================================
   Initialize
   ================================= */

async function initializePage() {

    if (
        pageInitialized
    ) {

        return;

    }


    pageInitialized =
        true;


    const authenticated =
        initializeAuthentication();


    if (!authenticated) {

        showError(
            t("authenticationFailed")
        );

        return;

    }


    loadInstitution();

    loadCurrentUser();


    const paymentDate =
        document.getElementById(
            "paymentDate"
        );


    if (
        paymentDate &&
        !paymentDate.value
    ) {

        paymentDate.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }


    setReceiptNumber();


    showSuccess(
        t("loadingStudents")
    );


    const loaded =
        await loadStudentsFromBackend();


    if (!loaded) {

        return;

    }


    if (
        !students.length
    ) {

        showError(
            t("noStudents")
        );

        return;

    }


    loadAcademicYears();

    clearError();

    applyLanguage();

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
