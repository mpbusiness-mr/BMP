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
        institutionId: "Institution ID",
        institutionName: "Institution Name",
        institutionType: "Type",

        userInformation: "User Information",
        username: "Username",
        password: "Password",
        role: "Role",

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
        usernameMin:
            "Username must contain at least 3 characters.",
        passwordMin:
            "Password must contain at least 4 characters.",

        userCreated:
            "User created successfully.",
        createFailed:
            "Failed to create user.",
        apiError:
            "An error occurred while communicating with the server."
    },

    ar: {
        pageTitle: "إضافة مستخدم",
        pageDescription: "إنشاء مستخدم جديد لهذه المؤسسة",

        back: "رجوع",

        institutionInformation: "معلومات المؤسسة",
        institutionId: "معرف المؤسسة",
        institutionName: "اسم المؤسسة",
        institutionType: "النوع",

        userInformation: "معلومات المستخدم",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        role: "الدور",

        accessTitle: "الوصول والصلاحيات",
        fullAccessTitle: "صلاحيات تشغيلية كاملة",
        fullAccessDescription:
            "يمكن للمستخدم الوصول إلى وظائف النظام التشغيلية.",
        restrictedTitle: "صلاحيات إدارية محدودة",
        restrictedDescription:
            "يمتلك المستخدم صلاحيات تشغيلية، ولكنه لا يستطيع إدارة المستخدمين أو إعدادات الإدارة.",

        cannotAddUsers: "لا يمكنه إضافة مستخدمين",
        cannotDisableUsers: "لا يمكنه تعطيل المستخدمين",
        cannotEnableUsers: "لا يمكنه تفعيل المستخدمين",
        cannotDisableDirector:
            "لا يمكنه تعطيل المدير",
        cannotDeleteUsers:
            "لا يمكنه حذف المستخدمين",

        cancel: "إلغاء",
        createUser: "إنشاء المستخدم",
        creating: "جارٍ الإنشاء...",

        school: "مدرسة",
        user: "مستخدم",

        loginRequired: "يجب تسجيل الدخول إلى المدرسة.",
        accessDenied: "تم رفض الوصول إلى المؤسسة.",
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
            "فشل إنشاء المستخدم.",
        apiError:
            "حدث خطأ أثناء الاتصال بالخادم."
    },

    fr: {
        pageTitle: "Ajouter un utilisateur",
        pageDescription:
            "Créer un nouvel utilisateur pour cet établissement",

        back: "Retour",

        institutionInformation: "Informations de l'établissement",
        institutionId: "ID de l'établissement",
        institutionName: "Nom de l'établissement",
        institutionType: "Type",

        userInformation: "Informations de l'utilisateur",
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        role: "Rôle",

        accessTitle: "Accès et autorisations",
        fullAccessTitle: "Accès opérationnel complet",
        fullAccessDescription:
            "L'utilisateur peut accéder aux fonctions opérationnelles du système.",
        restrictedTitle: "Administration limitée",
        restrictedDescription:
            "L'utilisateur dispose d'un accès opérationnel mais ne peut pas gérer les utilisateurs ni les paramètres administratifs.",

        cannotAddUsers:
            "Ne peut pas ajouter d'utilisateurs",
        cannotDisableUsers:
            "Ne peut pas désactiver les utilisateurs",
        cannotEnableUsers:
            "Ne peut pas activer les utilisateurs",
        cannotDisableDirector:
            "Ne peut pas désactiver le Directeur / Responsable",
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
            "Échec de la création de l'utilisateur.",
        apiError:
            "Une erreur s'est produite lors de la communication avec le serveur."
    }
};


// =====================================================
// Language
// =====================================================

const currentLanguage =
    localStorage.getItem("bmpLanguage") || "en";

const language =
    translations[currentLanguage]
        ? currentLanguage
        : "en";


function t(key) {

    return (
        translations[language][key] ||
        translations.en[key] ||
        key
    );
}


// =====================================================
// Apply Translations
// =====================================================

function applyTranslations() {

    document.documentElement.lang =
        language;

    document.documentElement.dir =
        language === "ar"
            ? "rtl"
            : "ltr";


    const elements = {

        pageTitle: "pageTitle",
        pageDescription: "pageDescription",

        backButton: "back",

        institutionInformation:
            "institutionInformation",

        institutionIdLabel:
            "institutionId",

        institutionNameLabel:
            "institutionName",

        institutionTypeLabel:
            "institutionType",

        userInformation:
            "userInformation",

        usernameLabel:
            "username",

        passwordLabel:
            "password",

        roleLabel:
            "role",

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


    Object.entries(elements)
        .forEach(
            ([elementId, translationKey]) => {

                const element =
                    document.getElementById(
                        elementId
                    );

                if (element) {

                    element.textContent =
                        t(translationKey);
                }
            }
        );
}


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

institutionIdElement.textContent =
    institutionId || "-";

institutionNameElement.textContent =
    currentUser.institutionName || "-";

institutionTypeElement.textContent =
    t("school");


// =====================================================
// Set Role
// =====================================================

const roleInput =
    document.getElementById(
        "role"
    );

if (roleInput) {

    roleInput.value =
        t("user");
}


// =====================================================
// API Request
// =====================================================

async function apiRequest(
    payload
) {

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
                        JSON.stringify(
                            payload
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const result =
            await response.json();


        return result;

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

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `users.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);


// =====================================================
// Cancel Button
// =====================================================

cancelButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `users.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);


// =====================================================
// Create User
// =====================================================

addUserForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const username =
            usernameInput.value.trim();


        const password =
            passwordInput.value;


        // =================================================
        // Validate Username
        // =================================================

        if (!username) {

            alert(
                t("enterUsername")
            );

            usernameInput.focus();

            return;
        }


        // =================================================
        // Validate Password
        // =================================================

        if (!password) {

            alert(
                t("enterPassword")
            );

            passwordInput.focus();

            return;
        }


        // =================================================
        // Basic Username Validation
        // =================================================

        if (
            username.length < 3
        ) {

            alert(
                t("usernameMin")
            );

            usernameInput.focus();

            return;
        }


        // =================================================
        // Basic Password Validation
        // =================================================

        if (
            password.length < 4
        ) {

            alert(
                t("passwordMin")
            );

            passwordInput.focus();

            return;
        }


        // =================================================
        // Disable Form
        // =================================================

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

            // =============================================
            // Send to Google Apps Script
            // =============================================

            const result =
                await apiRequest({

                    action:
                        "addUser",

                    // Director performing the action
                    institutionId:
                        institutionId,

                    username:
                        currentUser.username,

                    // New user's credentials
                    newUsername:
                        username,

                    newPassword:
                        password
                });


            // =============================================
            // Backend Error
            // =============================================

            if (!result.success) {

                throw new Error(
                    result.message ||
                    t("createFailed")
                );
            }


            // =============================================
            // Success
            // =============================================

            alert(
                t("userCreated")
            );


            // =============================================
            // Return to Users Page
            // =============================================

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


// =====================================================
// Apply Page Translation
// =====================================================

applyTranslations();
