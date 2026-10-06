// =====================================================
// BMP Institution Users
// Google Sheets / Apps Script Version
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Check School Session
// =====================================================

const currentUser =
    requireSchoolLogin();

if (!currentUser) {
    throw new Error("School login required.");
}


// =====================================================
// Institution
// =====================================================

const institutionId =
    getActiveInstitutionId();

if (!institutionId) {
    throw new Error("Institution access denied.");
}


// Only Director can manage users
if (
    String(currentUser.role || "")
        .trim()
        .toLowerCase() !== "director"
) {

    alert("Only the Director can manage users.");

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
    document.getElementById(
        "institutionTitle"
    );

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

const usersTableBody =
    document.getElementById(
        "usersTableBody"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const searchUser =
    document.getElementById(
        "searchUser"
    );

const userStatusFilter =
    document.getElementById(
        "userStatusFilter"
    );

const addUserButton =
    document.getElementById(
        "addUserButton"
    );

const backButton =
    document.getElementById(
        "backButton"
    );


// =====================================================
// Local Page State
// =====================================================

let users = [];


// =====================================================
// Initialize
// =====================================================

initializeUsers();


// =====================================================
// Initialize Users Page
// =====================================================

async function initializeUsers() {

    institutionTitle.textContent =
        `Manage users`;

    institutionIdElement.textContent =
        institutionId;

    institutionNameElement.textContent =
        currentUser.institutionName ||
        "-";

    institutionTypeElement.textContent =
        "School";


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
// Load Users
// =====================================================

async function loadUsers() {

    usersTableBody.innerHTML = `
        <tr>
            <td
                colspan="5"
                style="text-align:center;padding:25px;"
            >
                Loading users...
            </td>
        </tr>
    `;

    emptyState.style.display = "none";


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
                "Failed to load users."
            );
        }


        users =
            Array.isArray(
                result.users
            )
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
                    Failed to load users.
                </td>
            </tr>
        `;


        alert(
            error.message ||
            "Failed to load users."
        );
    }
}


// =====================================================
// Render Users
// =====================================================

function renderUsers() {

    const searchValue =
        searchUser.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        userStatusFilter.value;


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
                    user.status ===
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

        emptyState.style.display =
            "block";

        return;
    }


    emptyState.style.display =
        "none";


    filteredUsers.forEach(
        user => {

            const row =
                document.createElement(
                    "tr"
                );


            const role =
                user.role ||
                "User";


            const createdDate =
                user.createdAt
                    ? formatDate(
                        user.createdAt
                    )
                    : "-";


            const status =
                user.status ||
                "active";


            const statusName =
                status
                    .charAt(0)
                    .toUpperCase() +
                status.slice(1);


            let actionButton =
                "";


            // =================================================
            // Director cannot be disabled
            // =================================================

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
                        Protected
                    </span>
                `;

            } else if (
                status === "disabled"
            ) {

                actionButton = `
                    <button
                        class="action-btn enable-btn"
                        onclick="enableUser('${escapeJs(
                            user.userId ||
                            user.id
                        )}')"
                    >
                        Enable
                    </button>
                `;

            } else {

                actionButton = `
                    <button
                        class="action-btn disable-btn"
                        onclick="disableUser('${escapeJs(
                            user.userId ||
                            user.id
                        )}')"
                    >
                        Disable
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
            "User not found."
        );

        return;
    }


    // Never allow Director to be disabled
    if (
        String(
            user.role || ""
        )
        .trim()
        .toLowerCase() ===
        "director"
    ) {

        alert(
            "The Director cannot be disabled."
        );

        return;
    }


    if (
        user.status ===
        "disabled"
    ) {

        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to disable user "${user.username}"?`
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
                "Failed to disable user."
            );
        }


        alert(
            "User disabled successfully."
        );


        await loadUsers();

    } catch (error) {

        console.error(error);


        alert(
            error.message ||
            "Failed to disable user."
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
            "User not found."
        );

        return;
    }


    // Director should normally never be disabled,
    // but keep this protection here too.
    if (
        String(
            user.role || ""
        )
        .trim()
        .toLowerCase() ===
        "director"
    ) {

        alert(
            "The Director account is protected."
        );

        return;
    }


    if (
        user.status ===
        "active"
    ) {

        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to enable user "${user.username}"?`
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
                "Failed to enable user."
            );
        }


        alert(
            "User enabled successfully."
        );


        await loadUsers();

    } catch (error) {

        console.error(error);


        alert(
            error.message ||
            "Failed to enable user."
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

            return String(
                value
            );
        }


        return date.toLocaleDateString();

    } catch (error) {

        return String(
            value
        );
    }
}


// =====================================================
// Escape HTML
// =====================================================

function escapeHtml(
    value
) {

    return String(
        value
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


// =====================================================
// Escape JavaScript String
// =====================================================

function escapeJs(
    value
) {

    return String(
        value
    )
    .replace(
        /\\/g,
        "\\\\"
    )
    .replace(
        /'/g,
        "\\'"
    )
    .replace(
        /"/g,
        '\\"'
    );
}


// =====================================================
// Search
// =====================================================

searchUser.addEventListener(
    "input",
    renderUsers
);


// =====================================================
// Status Filter
// =====================================================

userStatusFilter.addEventListener(
    "change",
    renderUsers
);


// =====================================================
// Add User
// =====================================================

addUserButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `add-user.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);


// =====================================================
// Back
// =====================================================

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `school.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);
