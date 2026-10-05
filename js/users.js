
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
                user.username
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
                .charAt(0)
                .toUpperCase() +
            user.status.slice(1);


        let actionButton = "";


        if (user.isMainUser) {

            actionButton = `
                <span class="role-badge">
                    Main Account
                </span>
            `;

        } else if (user.status === "disabled") {

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
                ${user.username}
            </td>

            <td>
                <span class="role-badge">
                    ${role}
                </span>
            </td>

            <td>
                <span
                    class="status-badge status-${user.status}">
                    ${statusName}
                </span>
            </td>

            <td>
                ${createdDate}
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
        return;
    }


    if (user.isMainUser) {

        alert(
            "The main account cannot be disabled."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to disable this user?"
        );


    if (!confirmed) {
        return;
    }


    user.status =
        "disabled";


    saveUsers(users);

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
        return;
    }


    user.status =
        "active";


    saveUsers(users);

    renderUsers();
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
