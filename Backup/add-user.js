// =====================================================
// BMP Add Institution User
// Google Sheets / Apps Script Version
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Translations
// =====================================================

const translations = {

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
        passwordLabel: "Password",
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
        cannotDisableDirector:
            "Cannot disable the Director / Manager",
        cannotDeleteUsers:
            "Cannot delete users",

        cancel: "Cancel",
        createUser: "Create User",
        creating: "Creating...",

        school: "School",
        user: "User",

        loginRequired: "School login required.",
        accessDenied: "Institution access denied.",
        directorOnly: "Only the Director can add users.",
        directorRequired: "Director access required.",

        enterUsername:
            "Please enter a username.",
        enterPassword:
            "Please enter a password.",
        usernameMin:
            "Username must contain at least 3 characters.",
        passwordMin:
            "Password must contain at least 4 characters.",

        userCreated:
            "User created successfully.",
        createFailed:
            "Failed to create user."
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
        passwordLabel: "كلمة المرور",
        roleLabel: "الدور",

        accessTitle: "الوصول والصلاحيات",
        fullAccessTitle: "صلاحيات تشغيلية كاملة",
        fullAccessDescription:
            "يمكن للمستخدم الوصول إلى وظائف النظام التشغيلية.",

        restrictedTitle: "صلاحيات إدارية محدودة",
        restrictedDescription:
            "يمتلك المستخدم صلاحيات تشغيلية، ولكنه لا يستطيع إدارة المستخدمين أو الإعدادات الإدارية.",

        cannotAddUsers:
            "لا يمكنه إضافة مستخدمين",
        cannotDisableUsers:
            "لا يمكنه تعطيل المستخدمين",
        cannotEnableUsers:
            "لا يمكنه تفعيل المستخدمين",
        cannotDisableDirector:
            "لا يمكنه تعطيل المدير",
        cannotDeleteUsers:
            "لا يمكنه حذف المستخدمين",

        cancel: "إلغاء",
        createUser: "إنشاء المستخدم",
        creating: "جارٍ الإنشاء...",

        school: "مدرسة",
        user: "مستخدم",

        loginRequired:
            "يجب تسجيل الدخول إلى المدرسة.",
        accessDenied:
            "تم رفض الوصول إلى المؤسسة.",
        directorOnly:
            "المدير فقط يمكنه إضافة المستخدمين.",
        directorRequired:
            "صلاحيات المدير مطلوبة.",

        enterUsername:
            "يرجى إدخال اسم المستخدم.",
        enterPassword:
            "يرجى إدخال كلمة المرور.",
        usernameMin:
            "يجب أن يحتوي اسم المستخدم على 3 أحرف على الأقل.",
        passwordMin:
            "يجب أن تحتوي كلمة المرور على 4 أحرف على الأقل.",

        userCreated:
            "تم إنشاء المستخدم بنجاح.",
        createFailed:
            "فشل إنشاء المستخدم."
    },


    fr: {
        pageTitle: "Ajouter un utilisateur",
        pageDescription:
            "Créer un nouvel utilisateur pour cet établissement",

        back: "Retour",

        institutionInformation:
            "Informations de l'établissement",
        institutionIdLabel:
            "ID de l'établissement",
        institutionNameLabel:
            "Nom de l'établissement",
        institutionTypeLabel:
            "Type",

        userInformation:
            "Informations de l'utilisateur",
        usernameLabel:
            "Nom d'utilisateur",
        passwordLabel:
            "Mot de passe",
        roleLabel:
            "Rôle",

        accessTitle:
            "Accès et autorisations",
        fullAccessTitle:
            "Accès opérationnel complet",
        fullAccessDescription:
            "L'utilisateur peut accéder aux fonctions opérationnelles du système.",

        restrictedTitle:
            "Administration limitée",
        restrictedDescription:
            "L'utilisateur dispose d'un accès opérationnel mais ne peut pas gérer les utilisateurs ni les paramètres administratifs.",

        cannotAddUsers:
            "Ne peut pas ajouter d'utilisateurs",
        cannotDisableUsers:
            "Ne peut pas désactiver les utilisateurs",
        cannotEnableUsers:
            "Ne peut pas activer les utilisateurs",
        cannotDisableDirector:
            "Ne peut pas désactiver le Directeur",
        cannotDeleteUsers:
            "Ne peut pas supprimer les utilisateurs",

        cancel: "Annuler",
        createUser: "Créer l'utilisateur",
        creating: "Création...",

        school: "École",
        user: "Utilisateur",

        loginRequired:
            "Connexion à l'école requise.",
        accessDenied:
            "Accès à l'établissement refusé.",
        directorOnly:
            "Seul le Directeur peut ajouter des utilisateurs.",
        directorRequired:
            "Les droits du Directeur sont requis.",

        enterUsername:
            "Veuillez saisir un nom d'utilisateur.",
        enterPassword:
            "Veuillez saisir un mot de passe.",
        usernameMin:
            "Le nom d'utilisateur doit contenir au moins 3 caractères.",
        passwordMin:
            "Le mot de passe doit contenir au moins 4 caractères.",

        userCreated:
            "Utilisateur créé avec succès.",
        createFailed:
            "Échec de la création de l'utilisateur."
    }
};


// =====================================================
// Current Language
// =====================================================

let currentLanguage =
    localStorage.getItem("bmpLanguage") || "en";


if (!translations[currentLanguage]) {
    currentLanguage = "en";
}


function t(key) {

    return (
        translations[currentLanguage][key] ||
        translations.en[key] ||
        key
    );
}


// =====================================================
// Apply Translations
// =====================================================

function applyTranslations() {

    document.documentElement.lang =
        currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";


    const translationMap = {

        pageTitle:
            "pageTitle",

        pageDescription:
            "pageDescription",

        backButton:
            "back",

        institutionInformation:
            "institutionInformation",

        institutionIdLabel:
            "institutionIdLabel",

        institutionNameLabel:
            "institutionNameLabel",

        institutionTypeLabel:
            "institutionTypeLabel",

        userInformation:
            "userInformation",

        usernameLabel:
            "usernameLabel",

        passwordLabel:
            "passwordLabel",

        roleLabel:
            "roleLabel",

        accessTitle:
            "accessTitle",

        fullAccessTitle:
            "fullAccessTitle",

        fullAccessDescription:
            "fullAccessDescription",

        restrictedTitle:
            "restrictedTitle",

        restrictedDescription:
            "restrictedDescription",

        cannotAddUsers:
            "cannotAddUsers",

        cannotDisableUsers:
            "cannotDisableUsers",

        cannotEnableUsers:
            "cannotEnableUsers",

        cannotDisableDirector:
            "cannotDisableDirector",

        cannotDeleteUsers:
            "cannotDeleteUsers",

        cancelButton:
            "cancel",

        createUserButton:
            "createUser"
    };


    Object.keys(translationMap)
        .forEach(function (elementId) {

            const element =
                document.getElementById(
                    elementId
                );

            if (!element) {
                return;
            }


            element.textContent =
                t(
                    translationMap[elementId]
                );
        });
}


// =====================================================
// Apply Translation Immediately
// =====================================================

applyTranslations();


// =====================================================
// Check School Session
// =====================================================

const currentUser =
    requireSchoolLogin();

if (!currentUser) {

    throw new Error(
        t("loginRequired")
    );
}


// =====================================================
// Institution
// =====================================================

const institutionId =
    getActiveInstitutionId();

if (!institutionId) {

    throw new Error(
        t("accessDenied")
    );
}


// =====================================================
// Only Director Can Add Users
// =====================================================

if (
    String(currentUser.role || "")
        .trim()
        .toLowerCase() !== "director"
) {

    alert(
        t("directorOnly")
    );

    window.location.href =
        `school.html?id=${encodeURIComponent(
            institutionId
        )}`;

    throw new Error(
        t("directorRequired")
    );
}


// =====================================================
// Elements
// =====================================================

const institutionIdElement =
    document.getElementById(
        "institutionId"
    );

const institutionNameElement =
    document.getElementById(
        "institutionName"
    );

const institutionTypeElement =
    document.getElementById(
        "institutionType"
    );

const addUserForm =
    document.getElementById(
        "addUserForm"
    );

const usernameInput =
    document.getElementById(
        "username"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const roleInput =
    document.getElementById(
        "role"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const cancelButton =
    document.getElementById(
        "cancelButton"
    );


// =====================================================
// Display Institution Information
// =====================================================

if (institutionIdElement) {

    institutionIdElement.textContent =
        institutionId || "-";
}


if (institutionNameElement) {

    institutionNameElement.textContent =
        currentUser.institutionName || "-";
}


if (institutionTypeElement) {

    institutionTypeElement.textContent =
        t("school");
}


// =====================================================
// Display Role
// =====================================================

if (roleInput) {

    roleInput.value =
        t("user");
}


// =====================================================
// API Request
// =====================================================

async function apiRequest(payload) {

    try {

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
                `HTTP ${response.status}`
            );
        }


        return await response.json();

    } catch (error) {

        console.error(
            "API Error:",
            error
        );

        throw error;
    }
}


// =====================================================
// Back Button
// =====================================================

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                `users.html?id=${encodeURIComponent(
                    institutionId
                )}`;
        }
    );
}


// =====================================================
// Cancel Button
// =====================================================

if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        function () {

            window.location.href =
                `users.html?id=${encodeURIComponent(
                    institutionId
                )}`;
        }
    );
}


// =====================================================
// Create User
// =====================================================

if (addUserForm) {

    addUserForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                usernameInput.value.trim();


            const password =
                passwordInput.value;


            // =============================================
            // Validate Username
            // =============================================

            if (!username) {

                alert(
                    t("enterUsername")
                );

                usernameInput.focus();

                return;
            }


            // =============================================
            // Validate Password
            // =============================================

            if (!password) {

                alert(
                    t("enterPassword")
                );

                passwordInput.focus();

                return;
            }


            // =============================================
            // Username Length
            // =============================================

            if (username.length < 3) {

                alert(
                    t("usernameMin")
                );

                usernameInput.focus();

                return;
            }


            // =============================================
            // Password Length
            // =============================================

            if (password.length < 4) {

                alert(
                    t("passwordMin")
                );

                passwordInput.focus();

                return;
            }


            // =============================================
            // Disable Submit Button
            // =============================================

            const submitButton =
                addUserForm.querySelector(
                    'button[type="submit"]'
                );


            const originalText =
                submitButton
                    ? submitButton.textContent
                    : "";


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    t("creating");
            }


            try {

                // =========================================
                // Send to Google Apps Script
                // =========================================

                const result =
                    await apiRequest({

                        action:
                            "addUser",

                        institutionId:
                            institutionId,

                        username:
                            currentUser.username,

                        newUsername:
                            username,

                        newPassword:
                            password
                    });


                // =========================================
                // Backend Error
                // =========================================

                if (!result.success) {

                    throw new Error(
                        result.message ||
                        t("createFailed")
                    );
                }


                // =========================================
                // Success
                // =========================================

                alert(
                    t("userCreated")
                );


                // =========================================
                // Return to Users Page
                // =========================================

                window.location.href =
                    `users.html?id=${encodeURIComponent(
                        institutionId
                    )}`;


            } catch (error) {

                console.error(
                    "Create User Error:",
                    error
                );


                alert(
                    error.message ||
                    t("createFailed")
                );


                // Restore button
                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalText;
                }
            }
        }
    );
}
