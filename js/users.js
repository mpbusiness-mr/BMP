// =====================================================
// BMP Institution Users
// Google Sheets / Apps Script Version
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Translations
// =====================================================

const translations = {

    en: {
        pageTitle: "Institution Users - BMP Admin",
        institutionUsers: "Institution Users",
        manageUsers: "Manage users for this institution",
        back: "Back",
        institutionId: "Institution ID",
        institutionName: "Institution Name",
        type: "Type",
        school: "School",
        users: "Users",
        manageAccounts: "Manage accounts and user access",
        addUser: "+ Add User",
        searchUsername: "Search by username...",
        allStatuses: "All Statuses",
        active: "Active",
        disabled: "Disabled",
        username: "Username",
        role: "Role",
        status: "Status",
        created: "Created",
        actions: "Actions",
        noUsersFound: "No Users Found",
        noUsersMatching: "There are no users matching your search.",
        loadingUsers: "Loading users...",
        failedLoadUsers: "Failed to load users.",
        protected: "Protected",
        enable: "Enable",
        disable: "Disable",
        userNotFound: "User not found.",
        directorCannotDisable: "The Director cannot be disabled.",
        directorProtected: "The Director account is protected.",
        confirmDisable: "Are you sure you want to disable user",
        confirmEnable: "Are you sure you want to enable user",
        userDisabled: "User disabled successfully.",
        userEnabled: "User enabled successfully.",
        failedDisable: "Failed to disable user.",
        failedEnable: "Failed to enable user.",
        directorOnly: "Only the Director can manage users.",
        schoolLoginRequired: "School login required.",
        institutionDenied: "Institution access denied.",
        user: "User"
    },

    ar: {
        pageTitle: "مستخدمو المؤسسة - BMP Admin",
        institutionUsers: "مستخدمو المؤسسة",
        manageUsers: "إدارة مستخدمي هذه المؤسسة",
        back: "رجوع",
        institutionId: "معرّف المؤسسة",
        institutionName: "اسم المؤسسة",
        type: "النوع",
        school: "مدرسة",
        users: "المستخدمون",
        manageAccounts: "إدارة الحسابات وصلاحيات المستخدمين",
        addUser: "+ إضافة مستخدم",
        searchUsername: "البحث باسم المستخدم...",
        allStatuses: "جميع الحالات",
        active: "نشط",
        disabled: "معطل",
        username: "اسم المستخدم",
        role: "الدور",
        status: "الحالة",
        created: "تاريخ الإنشاء",
        actions: "الإجراءات",
        noUsersFound: "لم يتم العثور على مستخدمين",
        noUsersMatching: "لا يوجد مستخدمون مطابقون لبحثك.",
        loadingUsers: "جارٍ تحميل المستخدمين...",
        failedLoadUsers: "فشل تحميل المستخدمين.",
        protected: "محمي",
        enable: "تفعيل",
        disable: "تعطيل",
        userNotFound: "المستخدم غير موجود.",
        directorCannotDisable: "لا يمكن تعطيل حساب المدير.",
        directorProtected: "حساب المدير محمي.",
        confirmDisable: "هل أنت متأكد أنك تريد تعطيل المستخدم",
        confirmEnable: "هل أنت متأكد أنك تريد تفعيل المستخدم",
        userDisabled: "تم تعطيل المستخدم بنجاح.",
        userEnabled: "تم تفعيل المستخدم بنجاح.",
        failedDisable: "فشل تعطيل المستخدم.",
        failedEnable: "فشل تفعيل المستخدم.",
        directorOnly: "المدير فقط يمكنه إدارة المستخدمين.",
        schoolLoginRequired: "يجب تسجيل الدخول إلى المدرسة.",
        institutionDenied: "تم رفض الوصول إلى المؤسسة.",
        user: "مستخدم"
    },

    fr: {
        pageTitle: "Utilisateurs de l'établissement - BMP Admin",
        institutionUsers: "Utilisateurs de l'établissement",
        manageUsers: "Gérer les utilisateurs de cet établissement",
        back: "Retour",
        institutionId: "ID de l'établissement",
        institutionName: "Nom de l'établissement",
        type: "Type",
        school: "École",
        users: "Utilisateurs",
        manageAccounts: "Gérer les comptes et les accès utilisateurs",
        addUser: "+ Ajouter un utilisateur",
        searchUsername: "Rechercher par nom d'utilisateur...",
        allStatuses: "Tous les statuts",
        active: "Actif",
        disabled: "Désactivé",
        username: "Nom d'utilisateur",
        role: "Rôle",
        status: "Statut",
        created: "Créé le",
        actions: "Actions",
        noUsersFound: "Aucun utilisateur trouvé",
        noUsersMatching: "Aucun utilisateur ne correspond à votre recherche.",
        loadingUsers: "Chargement des utilisateurs...",
        failedLoadUsers: "Échec du chargement des utilisateurs.",
        protected: "Protégé",
        enable: "Activer",
        disable: "Désactiver",
        userNotFound: "Utilisateur introuvable.",
        directorCannotDisable: "Le directeur ne peut pas être désactivé.",
        directorProtected: "Le compte du directeur est protégé.",
        confirmDisable: "Êtes-vous sûr de vouloir désactiver l'utilisateur",
        confirmEnable: "Êtes-vous sûr de vouloir activer l'utilisateur",
        userDisabled: "Utilisateur désactivé avec succès.",
        userEnabled: "Utilisateur activé avec succès.",
        failedDisable: "Échec de la désactivation de l'utilisateur.",
        failedEnable: "Échec de l'activation de l'utilisateur.",
        directorOnly: "Seul le directeur peut gérer les utilisateurs.",
        schoolLoginRequired: "Connexion à l'école requise.",
        institutionDenied: "Accès à l'établissement refusé.",
        user: "Utilisateur"
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


// =====================================================
// Translation Helper
// =====================================================

function t(key) {
    return (
        translations[currentLanguage] &&
        translations[currentLanguage][key]
    ) || translations.en[key] || key;
}


// =====================================================
// Apply Translation
// =====================================================

function applyTranslations() {

    document.documentElement.lang =
        currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";

    const pageTitle =
        document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.textContent =
            t("institutionUsers");
    }

    document.title =
        t("pageTitle");

    const institutionTitle =
        document.getElementById("institutionTitle");

    if (institutionTitle) {
        institutionTitle.textContent =
            t("manageUsers");
    }

    const backButton =
        document.getElementById("backButton");

    if (backButton) {
        backButton.textContent =
            t("back");
    }

    const labelInstitutionId =
        document.getElementById("labelInstitutionId");

    if (labelInstitutionId) {
        labelInstitutionId.textContent =
            t("institutionId");
    }

    const labelInstitutionName =
        document.getElementById("labelInstitutionName");

    if (labelInstitutionName) {
        labelInstitutionName.textContent =
            t("institutionName");
    }

    const labelType =
        document.getElementById("labelType");

    if (labelType) {
        labelType.textContent =
            t("type");
    }

    const usersTitle =
        document.getElementById("usersTitle");

    if (usersTitle) {
        usersTitle.textContent =
            t("users");
    }

    const usersDescription =
        document.getElementById("usersDescription");

    if (usersDescription) {
        usersDescription.textContent =
            t("manageAccounts");
    }

    const addUserButton =
        document.getElementById("addUserButton");

    if (addUserButton) {
        addUserButton.textContent =
            t("addUser");
    }

    const searchUser =
        document.getElementById("searchUser");

    if (searchUser) {
        searchUser.placeholder =
            t("searchUsername");
    }

    const statusFilter =
        document.getElementById("userStatusFilter");

    if (statusFilter) {

        const allOption =
            statusFilter.querySelector(
                'option[value="all"]'
            );

        const activeOption =
            statusFilter.querySelector(
                'option[value="active"]'
            );

        const disabledOption =
            statusFilter.querySelector(
                'option[value="disabled"]'
            );

        if (allOption) {
            allOption.textContent =
                t("allStatuses");
        }

        if (activeOption) {
            activeOption.textContent =
                t("active");
        }

        if (disabledOption) {
            disabledOption.textContent =
                t("disabled");
        }
    }

    const thUsername =
        document.getElementById("thUsername");

    if (thUsername) {
        thUsername.textContent =
            t("username");
    }

    const thRole =
        document.getElementById("thRole");

    if (thRole) {
        thRole.textContent =
            t("role");
    }

    const thStatus =
        document.getElementById("thStatus");

    if (thStatus) {
        thStatus.textContent =
            t("status");
    }

    const thCreated =
        document.getElementById("thCreated");

    if (thCreated) {
        thCreated.textContent =
            t("created");
    }

    const thActions =
        document.getElementById("thActions");

    if (thActions) {
        thActions.textContent =
            t("actions");
    }

    const emptyTitle =
        document.getElementById("emptyTitle");

    if (emptyTitle) {
        emptyTitle.textContent =
            t("noUsersFound");
    }

    const emptyDescription =
        document.getElementById("emptyDescription");

    if (emptyDescription) {
        emptyDescription.textContent =
            t("noUsersMatching");
    }
}


// =====================================================
// Check School Session
// =====================================================

const currentUser =
    requireSchoolLogin();

if (!currentUser) {
    throw new Error(
        t("schoolLoginRequired")
    );
}


// =====================================================
// Institution
// =====================================================

const institutionId =
    getActiveInstitutionId();

if (!institutionId) {
    throw new Error(
        t("institutionDenied")
    );
}


// =====================================================
// Only Director can manage users
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
            currentUser.institutionId
        )}`;

    throw new Error(
        "Director access required."
    );
}


// =====================================================
// Elements
// =====================================================

const institutionTitle =
    document.getElementById("institutionTitle");

const institutionIdElement =
    document.getElementById("institutionId");

const institutionNameElement =
    document.getElementById("institutionName");

const institutionTypeElement =
    document.getElementById("institutionType");

const usersTableBody =
    document.getElementById("usersTableBody");

const emptyState =
    document.getElementById("emptyState");

const searchUser =
    document.getElementById("searchUser");

const userStatusFilter =
    document.getElementById("userStatusFilter");

const addUserButton =
    document.getElementById("addUserButton");

const backButton =
    document.getElementById("backButton");


// =====================================================
// Local Page State
// =====================================================

let users = [];


// =====================================================
// Initialize
// =====================================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeUsersPage
    );

} else {

    initializeUsersPage();
}


// =====================================================
// Initialize Users Page
// =====================================================

async function initializeUsersPage() {

    applyTranslations();

    if (!addUserButton) {

        console.error(
            "Add User button was not found."
        );

    } else {

        addUserButton.type =
            "button";

        addUserButton.onclick =
            function(event) {

                event.preventDefault();
                event.stopPropagation();

                window.location.href =
                    "add-user.html?id=" +
                    encodeURIComponent(
                        institutionId
                    );
            };
    }


    if (backButton) {

        backButton.type =
            "button";

        backButton.onclick =
            function(event) {

                event.preventDefault();

                window.location.href =
                    "school.html?id=" +
                    encodeURIComponent(
                        institutionId
                    );
            };
    }


    if (searchUser) {

        searchUser.addEventListener(
            "input",
            renderUsers
        );
    }


    if (userStatusFilter) {

        userStatusFilter.addEventListener(
            "change",
            renderUsers
        );
    }


    if (institutionIdElement) {

        institutionIdElement.textContent =
            institutionId;
    }

    if (institutionNameElement) {

        institutionNameElement.textContent =
            currentUser.institutionName ||
            "-";
    }

    if (institutionTypeElement) {

        institutionTypeElement.textContent =
            t("school");
    }


    await loadUsers();
}


// =====================================================
// API Request Helper
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
// Load Users
// =====================================================

async function loadUsers() {

    if (!usersTableBody) {
        return;
    }

    usersTableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;padding:25px;">
                ${escapeHtml(t("loadingUsers"))}
            </td>
        </tr>
    `;


    if (emptyState) {
        emptyState.style.display =
            "none";
    }


    try {

        const result =
            await apiRequest({

                action:
                    "getUsers",

                institutionId:
                    institutionId,

                username:
                    currentUser.username
            });


        if (!result.success) {

            throw new Error(
                result.message ||
                t("failedLoadUsers")
            );
        }


        users =
            Array.isArray(result.users)
                ? result.users
                : [];


        renderUsers();

    } catch (error) {

        console.error(error);


        usersTableBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#b00020;
                    "
                >
                    ${escapeHtml(t("failedLoadUsers"))}
                </td>
            </tr>
        `;


        alert(
            error.message ||
            t("failedLoadUsers")
        );
    }
}


// =====================================================
// Render Users
// =====================================================

function renderUsers() {

    if (!usersTableBody) {
        return;
    }


    const searchValue =
        searchUser
            ? searchUser.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        userStatusFilter
            ? userStatusFilter.value
            : "all";


    const filteredUsers =
        users.filter(
            user => {

                const matchesSearch =
                    String(
                        user.username || ""
                    )
                    .toLowerCase()
                    .includes(
                        searchValue
                    );


                const matchesStatus =
                    selectedStatus === "all" ||
                    String(
                        user.status || ""
                    )
                    .toLowerCase() ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );


    usersTableBody.innerHTML = "";


    if (
        filteredUsers.length === 0
    ) {

        if (emptyState) {
            emptyState.style.display =
                "block";
        }

        return;
    }


    if (emptyState) {
        emptyState.style.display =
            "none";
    }


    filteredUsers.forEach(
        user => {

            const row =
                document.createElement(
                    "tr"
                );


            const role =
                user.role ||
                t("user");


            const createdDate =
                user.createdAt
                    ? formatDate(
                        user.createdAt
                    )
                    : "-";


            const status =
                String(
                    user.status ||
                    "active"
                )
                .trim()
                .toLowerCase();


            const statusName =
                status === "active"
                    ? t("active")
                    : status === "disabled"
                        ? t("disabled")
                        : status;


            let actionButton =
                "";


            const isDirector =
                String(
                    user.role || ""
                )
                .trim()
                .toLowerCase() ===
                "director";


            if (isDirector) {

                actionButton = `
                    <span
                        style="
                            color:#777;
                            font-size:13px;
                        "
                    >
                        ${escapeHtml(t("protected"))}
                    </span>
                `;

            } else if (
                status === "disabled"
            ) {

                actionButton = `
                    <button
                        type="button"
                        class="action-btn enable-btn"
                        onclick="enableUser('${escapeJs(
                            user.userId ||
                            user.id
                        )}')"
                    >
                        ${escapeHtml(t("enable"))}
                    </button>
                `;

            } else {

                actionButton = `
                    <button
                        type="button"
                        class="action-btn disable-btn"
                        onclick="disableUser('${escapeJs(
                            user.userId ||
                            user.id
                        )}')"
                    >
                        ${escapeHtml(t("disable"))}
                    </button>
                `;
            }


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        user.username ||
                        "-"
                    )}
                </td>

                <td>
                    <span class="role-badge">
                        ${escapeHtml(
                            role
                        )}
                    </span>
                </td>

                <td>
                    <span
                        class="status-badge status-${escapeHtml(
                            status
                        )}"
                    >
                        ${escapeHtml(
                            statusName
                        )}
                    </span>
                </td>

                <td>
                    ${escapeHtml(
                        createdDate
                    )}
                </td>

                <td>
                    ${actionButton}
                </td>

            `;


            usersTableBody.appendChild(
                row
            );
        }
    );
}


// =====================================================
// Disable User
// =====================================================

async function disableUser(
    userId
) {

    const user =
        users.find(
            item =>
                String(
                    item.userId ||
                    item.id
                ) ===
                String(userId)
        );


    if (!user) {

        alert(
            t("userNotFound")
        );

        return;
    }


    if (
        String(
            user.role || ""
        )
        .trim()
        .toLowerCase() ===
        "director"
    ) {

        alert(
            t("directorCannotDisable")
        );

        return;
    }


    if (
        String(
            user.status || ""
        )
        .trim()
        .toLowerCase() ===
        "disabled"
    ) {

        return;
    }


    const confirmed =
        confirm(
            `${t("confirmDisable")} "${user.username}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        setUsersLoading(true);


        const result =
            await apiRequest({

                action:
                    "updateUserStatus",

                institutionId:
                    institutionId,

                username:
                    currentUser.username,

                userId:
                    user.userId ||
                    user.id,

                status:
                    "disabled"
            });


        if (!result.success) {

            throw new Error(
                result.message ||
                t("failedDisable")
            );
        }


        alert(
            t("userDisabled")
        );


        await loadUsers();

    } catch (error) {

        console.error(error);


        alert(
            error.message ||
            t("failedDisable")
        );

    } finally {

        setUsersLoading(false);
    }
}


// =====================================================
// Enable User
// =====================================================

async function enableUser(
    userId
) {

    const user =
        users.find(
            item =>
                String(
                    item.userId ||
                    item.id
                ) ===
                String(userId)
        );


    if (!user) {

        alert(
            t("userNotFound")
        );

        return;
    }


    if (
        String(
            user.role || ""
        )
        .trim()
        .toLowerCase() ===
        "director"
    ) {

        alert(
            t("directorProtected")
        );

        return;
    }


    if (
        String(
            user.status || ""
        )
        .trim()
        .toLowerCase() ===
        "active"
    ) {

        return;
    }


    const confirmed =
        confirm(
            `${t("confirmEnable")} "${user.username}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        setUsersLoading(true);


        const result =
            await apiRequest({

                action:
                    "updateUserStatus",

                institutionId:
                    institutionId,

                username:
                    currentUser.username,

                userId:
                    user.userId ||
                    user.id,

                status:
                    "active"
            });


        if (!result.success) {

            throw new Error(
                result.message ||
                t("failedEnable")
            );
        }


        alert(
            t("userEnabled")
        );


        await loadUsers();

    } catch (error) {

        console.error(error);


        alert(
            error.message ||
            t("failedEnable")
        );

    } finally {

        setUsersLoading(false);
    }
}


// =====================================================
// Loading State
// =====================================================

function setUsersLoading(
    loading
) {

    if (!addUserButton) {
        return;
    }


    addUserButton.disabled =
        loading;


    if (loading) {

        addUserButton.style.opacity =
            "0.6";

    } else {

        addUserButton.style.opacity =
            "";
    }
}


// =====================================================
// Format Date
// =====================================================

function formatDate(
    value
) {

    try {

        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value);
        }


        return date.toLocaleDateString(
            currentLanguage === "ar"
                ? "ar"
                : currentLanguage === "fr"
                    ? "fr-FR"
                    : "en-US"
        );

    } catch (error) {

        return String(value);
    }
}


// =====================================================
// Escape HTML
// =====================================================

function escapeHtml(
    value
) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// Escape JavaScript String
// =====================================================

function escapeJs(
    value
) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');
}
