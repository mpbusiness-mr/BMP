// =====================================================
// BMP · Institution Users
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Config
// =====================================================

const CACHE_TTL = 60 * 1000;   // 1 minute — user list changes often


// =====================================================
// Translations
// =====================================================

const TRANSLATIONS = {

    en: {
        pageTitle: "Institution Users - BMP",
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
        user: "User",

        connectionError: "Unable to connect to the server."
    },

    ar: {
        pageTitle: "مستخدمو المؤسسة - BMP",
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
        user: "مستخدم",

        connectionError: "تعذر الاتصال بالخادم."
    },

    fr: {
        pageTitle: "Utilisateurs de l'établissement - BMP",
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
        failedDisable: "Échec de la désactivation.",
        failedEnable: "Échec de l'activation.",

        directorOnly: "Seul le directeur peut gérer les utilisateurs.",
        schoolLoginRequired: "Connexion à l'école requise.",
        institutionDenied: "Accès à l'établissement refusé.",
        user: "Utilisateur",

        connectionError: "Impossible de se connecter au serveur."
    }

};


// =====================================================
// State
// =====================================================

let currentUser    = null;
let institutionId  = null;

let currentLanguage = "ar";

let users = [];
let usersLoaded = false;


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

    document.title = t("pageTitle");

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

    if (usersLoaded) {
        renderUsers();
    }
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
// Cache helpers
// =====================================================

function getCacheKey() {
    return "bmp_users_" + institutionId;
}

function readCache(ttl) {
    try {
        const raw = sessionStorage.getItem(getCacheKey());
        if (!raw) return { data: null, fresh: false };
        const parsed = JSON.parse(raw);
        if (!parsed || parsed.data === undefined) return { data: null, fresh: false };
        const age = Date.now() - (parsed.ts || 0);
        return { data: parsed.data, fresh: age < ttl };
    } catch (e) {
        return { data: null, fresh: false };
    }
}

function writeCache(data) {
    try {
        sessionStorage.setItem(getCacheKey(), JSON.stringify({ ts: Date.now(), data: data }));
    } catch (e) {}
}

function clearUsersCache() {
    try {
        sessionStorage.removeItem(getCacheKey());
    } catch (e) {}
}


// =====================================================
// API request — no abort, matches your working pattern
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
            catch (e) { throw new Error(t("connectionError")); }
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

const institutionTitleElement = document.getElementById("institutionTitle");
const institutionIdElement    = document.getElementById("institutionId");
const institutionNameElement  = document.getElementById("institutionName");
const institutionTypeElement  = document.getElementById("institutionType");
const usersTableBody          = document.getElementById("usersTableBody");
const emptyState              = document.getElementById("emptyState");
const searchUser              = document.getElementById("searchUser");
const userStatusFilter        = document.getElementById("userStatusFilter");
const addUserButton           = document.getElementById("addUserButton");
const backButton              = document.getElementById("backButton");


// =====================================================
// Escape helpers
// =====================================================

function escapeHtml(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeJs(value) {
    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');
}


// =====================================================
// Format date
// =====================================================

function formatDate(value) {
    if (!value) return "-";
    try {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);

        const locale =
            currentLanguage === "ar" ? "ar" :
            currentLanguage === "fr" ? "fr-FR" : "en-US";

        return date.toLocaleDateString(locale);
    } catch (error) {
        return String(value);
    }
}


// =====================================================
// Update institution display
// =====================================================

function updateInstitutionDisplay() {
    if (institutionIdElement)   institutionIdElement.textContent   = institutionId;
    if (institutionNameElement) institutionNameElement.textContent =
        (currentUser && currentUser.institutionName) || "-";
    if (institutionTypeElement) institutionTypeElement.textContent = t("school");
    if (institutionTitleElement) institutionTitleElement.textContent = t("manageUsers");
}


// =====================================================
// Load users — cache-first
// =====================================================

function loadUsers() {

    const cached = readCache(CACHE_TTL);

    if (cached.data) {
        users = cached.data;
        usersLoaded = true;
        renderUsers();

        if (cached.fresh) return;
    } else {
        showUsersLoadingRow();
    }

    apiRequest({
        action: "getUsers",
        institutionId: institutionId,
        username: getCurrentUsername()
    })
    .then(function (result) {

        if (!result.success) {
            throw new Error(result.message || t("failedLoadUsers"));
        }

        users = Array.isArray(result.users) ? result.users : [];
        usersLoaded = true;

        writeCache(users);
        renderUsers();
    })
    .catch(function (error) {
        console.error("Users loading error:", error);

        if (usersTableBody && !cached.data) {
            usersTableBody.innerHTML =
                '<tr><td colspan="5" style="text-align:center;padding:25px;color:#b00020;">' +
                escapeHtml(error.message || t("failedLoadUsers")) +
                '</td></tr>';
        }
    });
}


function showUsersLoadingRow() {
    if (!usersTableBody) return;
    usersTableBody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;padding:25px;">' +
        escapeHtml(t("loadingUsers")) +
        '</td></tr>';
    if (emptyState) emptyState.style.display = "none";
}


// =====================================================
// Render users
// =====================================================

function renderUsers() {

    if (!usersTableBody) return;

    const searchValue =
        searchUser ? searchUser.value.trim().toLowerCase() : "";

    const selectedStatus =
        userStatusFilter ? userStatusFilter.value : "all";

    const filtered = users.filter(function (user) {

        const matchesSearch =
            String(user.username || "").toLowerCase().includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            String(user.status || "").trim().toLowerCase() === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    usersTableBody.innerHTML = "";

    if (filtered.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        return;
    }

    if (emptyState) emptyState.style.display = "none";

    const fragment = document.createDocumentFragment();

    filtered.forEach(function (user) {

        const row = document.createElement("tr");

        const role = user.role || t("user");
        const createdDate = formatDate(user.createdAt);

        const status = String(user.status || "active").trim().toLowerCase();
        const statusName =
            status === "active" ? t("active") :
            status === "disabled" ? t("disabled") : status;

        const isDirector =
            String(user.role || "").trim().toLowerCase() === "director";

        const userId = user.userId || user.id || "";

        let actionHtml = "";

        if (isDirector) {
            actionHtml =
                '<span style="color:#9aacc1;font-size:0.78rem;font-weight:600;">' +
                escapeHtml(t("protected")) +
                '</span>';
        } else if (status === "disabled") {
            actionHtml =
                '<button type="button" class="action-btn enable-btn" ' +
                'onclick="enableUser(\'' + escapeJs(userId) + '\')">' +
                escapeHtml(t("enable")) +
                '</button>';
        } else {
            actionHtml =
                '<button type="button" class="action-btn disable-btn" ' +
                'onclick="disableUser(\'' + escapeJs(userId) + '\')">' +
                escapeHtml(t("disable")) +
                '</button>';
        }

        row.innerHTML =
            "<td>" + escapeHtml(user.username || "-") + "</td>" +
            '<td><span class="role-badge">' + escapeHtml(role) + '</span></td>' +
            '<td><span class="status-badge status-' + escapeHtml(status) + '">' +
                escapeHtml(statusName) + '</span></td>' +
            "<td>" + escapeHtml(createdDate) + "</td>" +
            "<td>" + actionHtml + "</td>";

        fragment.appendChild(row);
    });

    usersTableBody.appendChild(fragment);
}


// =====================================================
// Disable user
// =====================================================

function disableUser(userId) {

    const user = users.find(function (item) {
        return String(item.userId || item.id) === String(userId);
    });

    if (!user) { alert(t("userNotFound")); return; }

    if (String(user.role || "").trim().toLowerCase() === "director") {
        alert(t("directorCannotDisable"));
        return;
    }

    if (String(user.status || "").trim().toLowerCase() === "disabled") return;

    if (!confirm(t("confirmDisable") + ' "' + user.username + '"?')) return;

    setUsersBusy(true);

    apiRequest({
        action: "updateUserStatus",
        institutionId: institutionId,
        username: getCurrentUsername(),
        userId: user.userId || user.id,
        status: "disabled"
    })
    .then(function (result) {
        if (!result.success) throw new Error(result.message || t("failedDisable"));

        alert(t("userDisabled"));

        // Clear cache so the list refreshes with fresh data
        clearUsersCache();
        usersLoaded = false;
        loadUsers();
    })
    .catch(function (error) {
        console.error(error);
        alert(error.message || t("failedDisable"));
    })
    .then(function () {
        setUsersBusy(false);
    });
}


// =====================================================
// Enable user
// =====================================================

function enableUser(userId) {

    const user = users.find(function (item) {
        return String(item.userId || item.id) === String(userId);
    });

    if (!user) { alert(t("userNotFound")); return; }

    if (String(user.role || "").trim().toLowerCase() === "director") {
        alert(t("directorProtected"));
        return;
    }

    if (String(user.status || "").trim().toLowerCase() === "active") return;

    if (!confirm(t("confirmEnable") + ' "' + user.username + '"?')) return;

    setUsersBusy(true);

    apiRequest({
        action: "updateUserStatus",
        institutionId: institutionId,
        username: getCurrentUsername(),
        userId: user.userId || user.id,
        status: "active"
    })
    .then(function (result) {
        if (!result.success) throw new Error(result.message || t("failedEnable"));

        alert(t("userEnabled"));

        clearUsersCache();
        usersLoaded = false;
        loadUsers();
    })
    .catch(function (error) {
        console.error(error);
        alert(error.message || t("failedEnable"));
    })
    .then(function () {
        setUsersBusy(false);
    });
}


// =====================================================
// Busy state
// =====================================================

function setUsersBusy(busy) {
    if (addUserButton) addUserButton.disabled = busy;

    document.querySelectorAll(".action-btn").forEach(function (btn) {
        btn.disabled = busy;
    });
}


// =====================================================
// Initialize
// =====================================================

function initializeUsersPage() {

    // Director-only guard (after authentication)
    const authenticated = initializeAuthentication();
    if (!authenticated) return;

    const role = String(currentUser.role || "").trim().toLowerCase();
    if (role !== "director") {
        alert(t("directorOnly"));
        window.location.href =
            "school.html?id=" + encodeURIComponent(currentUser.institutionId);
        return;
    }

    // Apply language early (before any render)
    currentLanguage = getSavedLanguage();
    applyLanguage();

    // Wire up top-bar buttons
    if (addUserButton) {
        addUserButton.type = "button";
        addUserButton.onclick = function (event) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href =
                "add-user.html?id=" + encodeURIComponent(institutionId);
        };
    }

    if (backButton) {
        backButton.type = "button";
        backButton.onclick = function (event) {
            event.preventDefault();
            window.location.href =
                "school.html?id=" + encodeURIComponent(institutionId);
        };
    }

    if (searchUser) searchUser.addEventListener("input", renderUsers);
    if (userStatusFilter) userStatusFilter.addEventListener("change", renderUsers);

    // Header info
    updateInstitutionDisplay();

    // Load users
    loadUsers();
}


// =====================================================
// Boot
// =====================================================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeUsersPage);
} else {
    initializeUsersPage();
}
