// =====================================================
// Authentication & Permissions
// =====================================================

const currentUser =
    requireSchoolLogin();

if (!currentUser) {
    throw new Error(
        "School login required."
    );
}


// Only Director / Manager
// can manage users.

if (
    currentUser.role !== "Director" &&
    currentUser.role !== "Manager"
) {

    window.location.href =
        "school.html?id=" +
        encodeURIComponent(
            currentUser.institutionId
        );

    throw new Error(
        "User management permission denied."
    );
}


// =====================================================
// Institution
// =====================================================

const institutionId =
    getActiveInstitutionId();

if (!institutionId) {
    throw new Error(
        "Institution access denied."
    );



const urlParams = new URLSearchParams(window.location.search);
const institutionId = urlParams.get("id");


// Get institutions
const institutions =
    JSON.parse(localStorage.getItem("bmpInstitutions")) || [];


// Find institution
const institution = institutions.find(
    item => item.id === institutionId
);


// Elements
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


// Check institution
if (!institution) {

    alert("Institution not found.");

    window.location.href = "institutions.html";

} else {

    initializeUsers();
}


// Initialize
function initializeUsers() {

    institutionTitle.textContent =
        `Manage users for ${institution.name}`;

    institutionIdElement.textContent =
        institution.id;

    institutionNameElement.textContent =
        institution.name;

    institutionTypeElement.textContent =
        institution.type === "school"
            ? "School"
            : "Restaurant";


    createMainUserIfNeeded();

    renderUsers();
}


// Get all users
function getUsers() {

    return JSON.parse(
        localStorage.getItem("bmpUsers")
    ) || [];
}


// Save users
function saveUsers(users) {

    localStorage.setItem(
        "bmpUsers",
        JSON.stringify(users)
    );
}


// Create main account
function createMainUserIfNeeded() {

    let users = getUsers();


    const mainUserExists = users.some(
        user =>
            user.institutionId === institution.id &&
            user.isMainUser === true
    );


    if (mainUserExists) {
        return;
    }


    const mainUser = {

        id:
            "USR-" +
            Date.now(),

        institutionId:
            institution.id,

        username:
            institution.username,

        password:
            institution.password,

        role:
            institution.type === "school"
                ? "Director"
                : "Manager",

        status:
            "active",

        isMainUser:
            true,

        createdAt:
            new Date().toISOString()
    };


    users.push(mainUser);

    saveUsers(users);
}


// Render users
function renderUsers() {

    const users = getUsers();


    const institutionUsers =
        users.filter(
            user =>
                user.institutionId === institution.id
        );


    const searchValue =
        searchUser.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        userStatusFilter.value;


    const filteredUsers =
        institutionUsers.filter(user => {

            const matchesSearch =
                String(user.username || "")
                    .toLowerCase()
                    .includes(searchValue);


            const matchesStatus =
                selectedStatus === "all" ||
                user.status === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );
        });


    usersTableBody.innerHTML = "";


    if (filteredUsers.length === 0) {

        emptyState.style.display = "block";

        return;
    }


    emptyState.style.display = "none";


    filteredUsers.forEach(user => {

        const row =
            document.createElement("tr");


        const role =
            user.role || "User";


        const createdDate =
            user.createdAt
                ? new Date(
                    user.createdAt
                ).toLocaleDateString()
                : "-";


        const statusName =
            user.status
                ? user.status
                    .charAt(0)
                    .toUpperCase() +
                  user.status.slice(1)
                : "Active";


        let actionButton = "";


        // Admin can manage every user,
        // including Director / Manager.
        if (user.status === "disabled") {

            actionButton = `
                <button
                    class="action-btn enable-btn"
                    onclick="enableUser('${user.id}')">
                    Enable
                </button>
            `;

        } else {

            actionButton = `
                <button
                    class="action-btn disable-btn"
                    onclick="disableUser('${user.id}')">
                    Disable
                </button>
            `;
        }


        row.innerHTML = `

            <td>
                ${escapeHtml(user.username || "-")}
            </td>

            <td>
                <span class="role-badge">
                    ${escapeHtml(role)}
                </span>
            </td>

            <td>
                <span
                    class="status-badge status-${escapeHtml(
                        user.status || "active"
                    )}">
                    ${escapeHtml(statusName)}
                </span>
            </td>

            <td>
                ${escapeHtml(createdDate)}
            </td>

            <td>
                ${actionButton}
            </td>

        `;


        usersTableBody.appendChild(row);
    });
}


// Disable user
function disableUser(userId) {

    let users = getUsers();


    const user =
        users.find(
            item => item.id === userId
        );


    if (!user) {

        alert("User not found.");

        return;
    }


    if (user.status === "disabled") {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to disable user "${user.username}"?`
        );


    if (!confirmed) {
        return;
    }


    user.status =
        "disabled";


    saveUsers(users);


    // Activity Log
    if (
        typeof logActivity ===
        "function"
    ) {

        logActivity({

            institutionId:
                institution.id,

            userId:
                "ADMIN",

            username:
                "Admin",

            role:
                "Admin",

            action:
                "Disabled User",

            details:
                `Disabled user "${user.username}" (${user.role || "User"})`
        });
    }


    renderUsers();
}


// Enable user
function enableUser(userId) {

    let users = getUsers();


    const user =
        users.find(
            item => item.id === userId
        );


    if (!user) {

        alert("User not found.");

        return;
    }


    if (user.status === "active") {
        return;
    }


    user.status =
        "active";


    saveUsers(users);


    // Activity Log
    if (
        typeof logActivity ===
        "function"
    ) {

        logActivity({

            institutionId:
                institution.id,

            userId:
                "ADMIN",

            username:
                "Admin",

            role:
                "Admin",

            action:
                "Enabled User",

            details:
                `Enabled user "${user.username}" (${user.role || "User"})`
        });
    }


    renderUsers();
}


// Escape HTML
function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// Search
searchUser.addEventListener(
    "input",
    renderUsers
);


// Status filter
userStatusFilter.addEventListener(
    "change",
    renderUsers
);


// Add User
addUserButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `add-user.html?id=${encodeURIComponent(institution.id)}`;
    }
);


// Back
backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `institution.html?id=${encodeURIComponent(institution.id)}`;
    }
);
