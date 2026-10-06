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


// =====================================================
// Only Director can manage users
// =====================================================

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

    // -------------------------------------------------
    // Safety check
    // -------------------------------------------------

    if (!addUserButton) {

        console.error(
            "Add User button was not found."
        );

    } else {

        // -------------------------------------------------
        // Add User
        // -------------------------------------------------

        addUserButton.type = "button";

        addUserButton.onclick =
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                console.log(
                    "Add User button clicked."
                );

                window.location.href =
                    "add-user.html?id=" +
                    encodeURIComponent(
                        institutionId
                    );
            };
    }


    // -------------------------------------------------
    // Back button
    // -------------------------------------------------

    if (backButton) {

        backButton.type = "button";

        backButton.onclick =
            function (event) {

                event.preventDefault();

                window.location.href =
                    "school.html?id=" +
                    encodeURIComponent(
                        institutionId
                    );
            };
    }


    // -------------------------------------------------
    // Search
    // -------------------------------------------------

    if (searchUser) {

        searchUser.addEventListener(
            "input",
            renderUsers
        );
    }


    // -------------------------------------------------
    // Status filter
    // -------------------------------------------------

    if (userStatusFilter) {

        userStatusFilter.addEventListener(
            "change",
            renderUsers
        );
    }


    // -------------------------------------------------
    // Institution information
    // -------------------------------------------------

    if (institutionTitle) {

        institutionTitle.textContent =
            "Manage users";
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
            "School";
    }


    // -------------------------------------------------
    // Load users
    // -------------------------------------------------

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
            <td
                colspan="5"
                style="text-align:center;padding:25px;"
            >
                Loading users...
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
                "Failed to load users."
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
                "User";


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
                        type="button"
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
                        type="button"
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

            return String(value);
        }


        return date.toLocaleDateString();

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
