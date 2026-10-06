// =====================================================
// BMP School Dashboard
// =====================================================


// =====================================================
// Translations
// =====================================================

const translations = {

    en: {

        language: "Language",

        back: "Back",

        institutionId: "Institution ID",

        schoolNameLabel: "School Name",

        status: "Status",

        students: "Students",

        studentsDescription:
            "Register, search and manage students.",

        payments: "Payments",

        paymentsDescription:
            "Manage monthly student payments.",

        receipts: "Receipts",

        receiptsDescription:
            "View and manage payment receipts.",

        reports: "Reports",

        reportsDescription:
            "View school statistics and reports.",

        classesStages: "Classes & Stages",

        classesStagesDescription:
            "Manage academic stages and classes.",

        users: "Users",

        usersDescription:
            "Manage school users and access.",

        settings: "Settings",

        settingsDescription:
            "Manage school settings.",

        logout: "Logout",

        schoolDashboard:
            "School Dashboard",

        manageSchoolOperations:
            "Manage school operations",

        active: "Active",

        disabled: "Disabled",

        expired: "Expired",

        school: "School"

    },


    ar: {

        language: "اللغة",

        back: "رجوع",

        institutionId: "رقم المؤسسة",

        schoolNameLabel: "اسم المدرسة",

        status: "الحالة",

        students: "الطلاب",

        studentsDescription:
            "تسجيل الطلاب والبحث عنهم وإدارتهم.",

        payments: "المدفوعات",

        paymentsDescription:
            "إدارة المدفوعات الشهرية للطلاب.",

        receipts: "الإيصالات",

        receiptsDescription:
            "عرض وإدارة إيصالات الدفع.",

        reports: "التقارير",

        reportsDescription:
            "عرض إحصائيات وتقارير المدرسة.",

        classesStages: "المراحل والأقسام",

        classesStagesDescription:
            "إدارة المراحل الدراسية والأقسام.",

        users: "المستخدمون",

        usersDescription:
            "إدارة مستخدمي المدرسة والصلاحيات.",

        settings: "الإعدادات",

        settingsDescription:
            "إدارة إعدادات المدرسة.",

        logout: "تسجيل الخروج",

        schoolDashboard:
            "لوحة تحكم المدرسة",

        manageSchoolOperations:
            "إدارة عمليات المدرسة",

        active: "نشطة",

        disabled: "معطلة",

        expired: "منتهية",

        school: "المدرسة"

    },


    fr: {

        language: "Langue",

        back: "Retour",

        institutionId: "ID de l'établissement",

        schoolNameLabel: "Nom de l'école",

        status: "Statut",

        students: "Élèves",

        studentsDescription:
            "Inscrire, rechercher et gérer les élèves.",

        payments: "Paiements",

        paymentsDescription:
            "Gérer les paiements mensuels des élèves.",

        receipts: "Reçus",

        receiptsDescription:
            "Consulter et gérer les reçus de paiement.",

        reports: "Rapports",

        reportsDescription:
            "Consulter les statistiques et rapports de l'école.",

        classesStages: "Classes et niveaux",

        classesStagesDescription:
            "Gérer les niveaux scolaires et les classes.",

        users: "Utilisateurs",

        usersDescription:
            "Gérer les utilisateurs et les accès de l'école.",

        settings: "Paramètres",

        settingsDescription:
            "Gérer les paramètres de l'école.",

        logout: "Déconnexion",

        schoolDashboard:
            "Tableau de bord de l'école",

        manageSchoolOperations:
            "Gérer les opérations de l'école",

        active: "Active",

        disabled: "Désactivée",

        expired: "Expirée",

        school: "École"

    }

};


// =====================================================
// Current Language
// =====================================================

let currentLanguage =
    localStorage.getItem(
        "bmpLanguage"
    ) || "en";


// =====================================================
// Check Session
// =====================================================

const currentUser =
    requireSchoolLogin();

if (!currentUser) {
    throw new Error(
        "School login required."
    );
}


// =====================================================
// Get Institution ID
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const institutionId =
    urlParams.get("id");


// =====================================================
// Prevent Access To Another Institution
// =====================================================

if (
    institutionId &&
    institutionId !==
        currentUser.institutionId
) {

    window.location.href =
        "school.html?id=" +
        encodeURIComponent(
            currentUser.institutionId
        );

    throw new Error(
        "Institution access denied."
    );
}


// =====================================================
// Use Session Institution
// =====================================================

const activeInstitutionId =
    currentUser.institutionId;


// =====================================================
// Build Institution From Current Session
// =====================================================

const institution = {

    id:
        currentUser.institutionId,

    type:
        currentUser.institutionType || "",

    name:
        currentUser.institutionName || "",

    phone:
        currentUser.institutionPhone || "",

    email:
        currentUser.institutionEmail || "",

    licenseStart:
        currentUser.licenseStart || "",

    licenseEnd:
        currentUser.licenseEnd || "",

    status:
        "active",

    sheetId:
        currentUser.sheetId || ""

};


// =====================================================
// Institution Data Validation
// =====================================================

if (
    !institution.id ||
    !institution.name
) {

    localStorage.removeItem(
        "bmpCurrentUser"
    );

    window.location.href =
        "school-login.html";

    throw new Error(
        "Invalid institution session."
    );
}


// =====================================================
// Check Institution Status
// =====================================================

function getInstitutionStatus(
    institution
) {

    if (
        institution.status ===
        "disabled"
    ) {

        return "disabled";

    }


    if (
        institution.licenseEnd
    ) {

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const licenseEnd =
            new Date(
                institution.licenseEnd
            );

        licenseEnd.setHours(
            0,
            0,
            0,
            0
        );


        if (
            !isNaN(
                licenseEnd.getTime()
            ) &&
            licenseEnd < today
        ) {

            return "expired";

        }

    }


    return "active";
}


// =====================================================
// Translate Status
// =====================================================

function translateStatus(
    status
) {

    const key =
        String(
            status || ""
        ).toLowerCase();

    return (
        translations[currentLanguage][key]
        ||
        status
    );

}


// =====================================================
// Apply Language
// =====================================================

function applyLanguage(
    language
) {

    if (
        !translations[language]
    ) {

        language = "en";

    }


    currentLanguage =
        language;


    localStorage.setItem(
        "bmpLanguage",
        language
    );


    // =============================================
    // Direction
    // =============================================

    document.documentElement.lang =
        language;

    document.documentElement.dir =
        language === "ar"
            ? "rtl"
            : "ltr";


    // =============================================
    // Static Text
    // =============================================

    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(
            function (element) {

                const key =
                    element.getAttribute(
                        "data-i18n"
                    );

                if (
                    translations[language][key]
                ) {

                    element.textContent =
                        translations[language][key];

                }

            }
        );


    // =============================================
    // Dashboard Header
    // =============================================

    if (schoolInfo) {

        schoolInfo.textContent =
            institution.phone ||
            institution.email ||
            translations[
                language
            ].manageSchoolOperations;

    }


    // =============================================
    // School Name
    // =============================================

    if (schoolName) {

        if (
            institution.name
        ) {

            schoolName.textContent =
                institution.name;

        } else {

            schoolName.textContent =
                translations[
                    language
                ].schoolDashboard;

        }

    }


    // =============================================
    // Status
    // =============================================

    if (statusElement) {

        statusElement.textContent =
            translateStatus(
                getInstitutionStatus(
                    institution
                )
            );

    }


    // =============================================
    // Language Selector
    // =============================================

    const languageSelect =
        document.getElementById(
            "languageSelect"
        );

    if (
        languageSelect
    ) {

        languageSelect.value =
            language;

    }

}


// =====================================================
// Dashboard Elements
// =====================================================

const schoolName =
    document.getElementById(
        "schoolName"
    );

const schoolInfo =
    document.getElementById(
        "schoolInfo"
    );

const institutionIdElement =
    document.getElementById(
        "institutionId"
    );

const statusElement =
    document.getElementById(
        "institutionStatus"
    );

const institutionNameElement =
    document.getElementById(
        "institutionName"
    );

const usersButton =
    document.getElementById(
        "usersButton"
    );


// =====================================================
// Display Institution
// =====================================================

if (schoolName) {

    schoolName.textContent =
        institution.name ||
        translations[
            currentLanguage
        ].school;

}


if (schoolInfo) {

    schoolInfo.textContent =
        institution.phone ||
        institution.email ||
        translations[
            currentLanguage
        ].manageSchoolOperations;

}


if (institutionIdElement) {

    institutionIdElement.textContent =
        institution.id;

}


if (institutionNameElement) {

    institutionNameElement.textContent =
        institution.name;

}


if (statusElement) {

    statusElement.textContent =
        translateStatus(
            getInstitutionStatus(
                institution
            )
        );

}


// =====================================================
// Language Selector
// =====================================================

const languageSelect =
    document.getElementById(
        "languageSelect"
    );


if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        function () {

            applyLanguage(
                languageSelect.value
            );

        }
    );

}


// =====================================================
// Navigation Helper
// =====================================================

function openSchoolPage(
    page
) {

    window.location.href =
        page +
        "?id=" +
        encodeURIComponent(
            activeInstitutionId
        );

}


// =====================================================
// Back Button
// =====================================================

const backButton =
    document.getElementById(
        "backButton"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

}


// =====================================================
// Logout
// =====================================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            logoutUser();

        }
    );

}


// =====================================================
// Dashboard Buttons
// =====================================================

document
    .getElementById("studentsButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "students.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


document
    .getElementById("paymentsButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "school-payments.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


document
    .getElementById("receiptsButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "school-receipt.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


document
    .getElementById("reportsButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "school-reports.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


document
    .getElementById("classesButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "classes.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


// =====================================================
// Users Button
// Director Only
// =====================================================

if (usersButton) {

    const role =
        String(
            currentUser.role || ""
        )
        .trim()
        .toLowerCase();


    if (
        role !== "director"
    ) {

        // User should not see user management
        usersButton.style.display =
            "none";

    } else {

        usersButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "users.html?id=" +
                    encodeURIComponent(
                        activeInstitutionId
                    );

            }
        );

    }

}


document
    .getElementById("settingsButton")
    ?.addEventListener(
        "click",
        function () {

            window.location.href =
                "school-settings.html?id=" +
                encodeURIComponent(
                    activeInstitutionId
                );

        }
    );


// =====================================================
// Initialize Language
// =====================================================

applyLanguage(
    currentLanguage
);
