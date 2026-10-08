// =====================================================
// BMP · Add Institution User
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// State
// =====================================================

let currentUser    = null;
let institutionId  = null;

let currentLanguage = "ar";


// =====================================================
// Translations
// =====================================================

const TRANSLATIONS = {

    en: {
        pageTitle: "Add User",
        pageDescription: "Create a new user for this institution",
        back: "Back",

        institutionInformation: "Institution Information",
        institutionIdLabel: "Institution ID",
        institutionNameLabel: "Institution Name",
        institutionTypeLabel: "Type",

        userInformation: "User Information",
        usernameLabel: "Username",
        usernamePlaceholder: "Enter username",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter password",
        roleLabel: "Role",

        accessTitle: "Access & Permissions",
        fullAccessTitle: "Full Operational Access",
        fullAccessDescription:
            "The user can access the operational features of the system.",

        restrictedTitle: "Restricted Administration",
        restrictedDescription:
            "The user has operational access but cannot manage users or administrative settings.",

        cannotAddUsers: "Cannot add users",
        cannotDisableUsers: "Cannot disable users",
        cannotEnableUsers: "Cannot enable users",
        cannotDisableDirector: "Cannot disable the Director / Manager",
        cannotDeleteUsers: "Cannot delete users",

        cancel: "Cancel",
        createUser: "Create User",
        creating: "Creating...",

        school: "School",
        user: "User",

        loginRequired: "School login required.",
        accessDenied: "Institution access denied.",
        directorOnly: "Only the Director can add users.",
        directorRequired: "Director access required.",

        enterUsername: "Please enter a username.",
        enterPassword: "Please enter a password.",
        usernameMin: "Username must contain at least 3 characters.",
        passwordMin: "Password must contain at least 4 characters.",

        userCreated: "User created successfully.",
        createFailed: "Failed to create user."
    },

    ar: {
        pageTitle: "إضافة مستخدم",
        pageDescription: "إنشاء مستخدم جديد لهذه المؤسسة",
        back: "رجوع",

        institutionInformation: "معلومات المؤسسة",
        institutionIdLabel: "معرف المؤسسة",
        institutionNameLabel: "اسم المؤسسة",
        institutionTypeLabel: "النوع",

        userInformation: "معلومات المستخدم",
        usernameLabel: "اسم المستخدم",
        usernamePlaceholder: "أدخل اسم المستخدم",
        passwordLabel: "كلمة المرور",
        passwordPlaceholder: "أدخل كلمة المرور",
        roleLabel: "الدور",

        accessTitle: "الوصول والصلاحيات",
        fullAccessTitle: "صلاحيات تشغيلية كاملة",
        fullAccessDescription:
            "يمكن للمستخدم الوصول إلى وظائف النظام التشغيلية.",

        restrictedTitle: "صلاحيات إدارية محدودة",
        restrictedDescription:
            "يمتلك المستخدم صلاحيات تشغيلية، ولكنه لا يستطيع إدارة المستخدمين أو الإعدادات الإدارية.",

        cannotAddUsers: "لا يمكنه إضافة مستخدمين",
        cannotDisableUsers: "لا يمكنه تعطيل المستخدمين",
        cannotEnableUsers: "لا يمكنه تفعيل المستخدمين",
        cannotDisableDirector: "لا يمكنه تعطيل المدير",
        cannotDeleteUsers: "لا يمكنه حذف المستخدمين",

        cancel: "إلغاء",
        createUser: "إنشاء المستخدم",
        creating: "جارٍ الإنشاء...",

        school: "مدرسة",
        user: "مستخدم",

        loginRequired: "يجب تسجيل الدخول إلى المدرسة.",
        accessDenied: "تم رفض الوصول إلى المؤسسة.",
        directorOnly: "المدير فقط يمكنه إضافة المستخدمين.",
        directorRequired: "صلاحيات المدير مطلوبة.",

        enterUsername: "يرجى إدخال اسم المستخدم.",
        enterPassword: "يرجى إدخال كلمة المرور.",
        usernameMin: "يجب أن يحتوي اسم المستخدم على 3 أحرف على الأقل.",
        passwordMin: "يجب أن تحتوي كلمة المرور على 4 أحرف على الأقل.",

        userCreated: "تم إنشاء المستخدم بنجاح.",
        createFailed: "فشل إنشاء المستخدم."
    },

    fr: {
        pageTitle: "Ajouter un utilisateur",
        pageDescription: "Créer un nouvel utilisateur pour cet établissement",
        back: "Retour",

        institutionInformation: "Informations de l'établissement",
        institutionIdLabel: "ID de l'établissement",
        institutionNameLabel: "Nom de l'établissement",
        institutionTypeLabel: "Type",

        userInformation: "Informations de l'utilisateur",
        usernameLabel: "Nom d'utilisateur",
        usernamePlaceholder: "Entrez le nom d'utilisateur",
        passwordLabel: "Mot de passe",
        passwordPlaceholder: "Entrez le mot de passe",
        roleLabel: "Rôle",

        accessTitle: "Accès et autorisations",
        fullAccessTitle: "Accès opérationnel complet",
        fullAccessDescription:
            "L'utilisateur peut accéder aux fonctions opérationnelles du système.",

        restrictedTitle: "Administration limitée",
        restrictedDescription:
            "L'utilisateur dispose d'un accès opérationnel mais ne peut pas gérer les utilisateurs ni les paramètres administratifs.",

        cannotAddUsers: "Ne peut pas ajouter d'utilisateurs",
        cannotDisableUsers: "Ne peut pas désactiver les utilisateurs",
        cannotEnableUsers: "Ne peut pas activer les utilisateurs",
        cannotDisableDirector: "Ne peut pas désactiver le Directeur",
        cannotDeleteUsers: "Ne peut pas supprimer les utilisateurs",

        cancel: "Annuler",
        createUser: "Créer l'utilisateur",
        creating: "Création...",

        school: "École",
        user: "Utilisateur",

        loginRequired: "Connexion à l'école requise.",
        accessDenied: "Accès à l'établissement refusé.",
        directorOnly: "Seul le Directeur peut ajouter des utilisateurs.",
        directorRequired: "Les droits du Directeur sont requis.",

        enterUsername: "Veuillez saisir un nom d'utilisateur.",
        enterPassword: "Veuillez saisir un mot de passe.",
        usernameMin: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
        passwordMin: "Le mot de passe doit contenir au moins 4 caractères.",

        userCreated: "Utilisateur créé avec succès.",
        createFailed: "Échec de la création de l'utilisateur."
    }

};


// =====================================================
// Translation helper
// =====================================================

function t(key) {
    const lang = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return (lang && lang[key]) || TRANSLATIONS.en[key] || key;
}


// =====================================================
// Language
// =====================================================

function getSavedLanguage() {
    const v = localStorage.getItem("bmpLanguage");
    if (v && ["en", "ar", "fr"].indexOf(v.toLowerCase()) !== -1) {
        return v.toLowerCase();
    }
    return "ar";
}

function setLanguage(language) {
    language = String(language || "ar").toLowerCase().trim();
    if (!TRANSLATIONS[language]) language = "ar";

    currentLanguage = language;
    try { localStorage.setItem("bmpLanguage", language); } catch (e) {}

    applyLanguage();
}

function applyLanguage() {

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir  = currentLanguage === "ar" ? "rtl" : "ltr";

    document.body.classList.remove("lang-ar", "lang-fr", "lang-en");
    document.body.classList.add("lang-" + currentLanguage);

    document.title = t("pageTitle") + " - BMP";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const key = el.getAttribute("data-i18n");
        const value = TRANSLATIONS[currentLanguage][key];
        if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
        const key = el.getAttribute("data-i18n-placeholder");
        const value = TRANSLATIONS[currentLanguage][key];
        if (value !== undefined) el.placeholder = value;
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });

    // Role field uses the translated "User" label
    const roleInput = document.getElementById("role");
    if (roleInput) roleInput.value = t("user");
}


// =====================================================
// Authentication
// =====================================================

function initializeAuthentication() {

    try {
        if (typeof requireSchoolLogin === "function") {
            currentUser = requireSchoolLogin();
        }
    } catch (error) {
        console.error("Authentication error:", error);
    }

    if (!currentUser) {
        try {
            currentUser = JSON.parse(localStorage.getItem("bmpCurrentUser") || "null");
        } catch (error) {
            currentUser = null;
        }
    }

    if (!currentUser) return false;

    institutionId = String(currentUser.institutionId || "").trim();
    return Boolean(institutionId);
}

function getCurrentUsername() {
    if (currentUser && currentUser.username) return String(currentUser.username).trim();
    if (currentUser && currentUser.userName) return String(currentUser.userName).trim();
    if (currentUser && currentUser.name)     return String(currentUser.name).trim();
    return "";
}


// =====================================================
// API request — clean, no abort
// =====================================================

function apiRequest(payload) {
    return new Promise(function (resolve, reject) {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        })
        .then(function (response) {
            if (!response.ok) throw new Error("HTTP " + response.status);
            return response.text();
        })
        .then(function (text) {
            let result;
            try { result = JSON.parse(text); }
            catch (e) { throw new Error("Invalid response"); }
            resolve(result);
        })
        .catch(function (error) {
            reject(error);
        });
    });
}


// =====================================================
// Element refs
// =====================================================

const institutionIdElement   = document.getElementById("institutionId");
const institutionNameElement = document.getElementById("institutionName");
const institutionTypeElement = document.getElementById("institutionType");
const addUserForm            = document.getElementById("addUserForm");
const usernameInput          = document.getElementById("username");
const passwordInput          = document.getElementById("password");
const roleInput              = document.getElementById("role");
const backButton             = document.getElementById("backButton");
const cancelButton           = document.getElementById("cancelButton");
const createUserButton       = document.getElementById("createUserButton");


// =====================================================
// Update institution display
// =====================================================

function updateInstitutionDisplay() {
    if (institutionIdElement)   institutionIdElement.textContent   = institutionId || "-";
    if (institutionNameElement) institutionNameElement.textContent =
        (currentUser && currentUser.institutionName) || "-";
    if (institutionTypeElement) institutionTypeElement.textContent = t("school");
    if (roleInput)              roleInput.value = t("user");
}


// =====================================================
// Navigation helpers
// =====================================================

function goBackToUsers() {
    window.location.href =
        "users.html?id=" + encodeURIComponent(institutionId);
}


// =====================================================
// Create user
// =====================================================

function createUser(event) {

    event.preventDefault();

    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    // Validation
    if (!username) {
        alert(t("enterUsername"));
        if (usernameInput) usernameInput.focus();
        return;
    }

    if (username.length < 3) {
        alert(t("usernameMin"));
        if (usernameInput) usernameInput.focus();
        return;
    }

    if (!password) {
        alert(t("enterPassword"));
        if (passwordInput) passwordInput.focus();
        return;
    }

    if (password.length < 4) {
        alert(t("passwordMin"));
        if (passwordInput) passwordInput.focus();
        return;
    }

    // Disable button + spinner
    if (createUserButton) {
        createUserButton.disabled = true;
        createUserButton.classList.add("loading");
        const label = createUserButton.querySelector(".btn-label");
        if (label) label.textContent = t("creating");
    }

    // Send
    apiRequest({
        action:       "addUser",
        institutionId: institutionId,
        username:      getCurrentUsername(),
        newUsername:   username,
        newPassword:   password
    })
    .then(function (result) {

        if (!result.success) {
            throw new Error(result.message || t("createFailed"));
        }

        alert(t("userCreated"));

        // Clear the users cache so users.html sees the new user
        try {
            sessionStorage.removeItem("bmp_users_" + institutionId);
        } catch (e) {}

        goBackToUsers();
    })
    .catch(function (error) {
        console.error("Create User Error:", error);
        alert(error.message || t("createFailed"));

        if (createUserButton) {
            createUserButton.disabled = false;
            createUserButton.classList.remove("loading");
            const label = createUserButton.querySelector(".btn-label");
            if (label) label.textContent = t("createUser");
        }
    });
}


// =====================================================
// Initialize
// =====================================================

function initializePage() {

    // Language first
    currentLanguage = getSavedLanguage();
    applyLanguage();

    // Auth check
    const authenticated = initializeAuthentication();
    if (!authenticated) {
        // requireSchoolLogin already redirected
        return;
    }

    // Director-only guard
    const role = String(currentUser.role || "").trim().toLowerCase();
    if (role !== "director") {
        alert(t("directorOnly"));
        window.location.href =
            "school.html?id=" + encodeURIComponent(institutionId);
        return;
    }

    // Header info
    updateInstitutionDisplay();

    // Buttons
    if (backButton)   backButton.addEventListener("click", goBackToUsers);
    if (cancelButton) cancelButton.addEventListener("click", goBackToUsers);

    // Form
    if (addUserForm) addUserForm.addEventListener("submit", createUser);
}


// =====================================================
// Boot
// =====================================================

document.addEventListener("DOMContentLoaded", initializePage);
