// =====================================================
// Check Admin Session
// =====================================================

const currentAdmin =
    requireAdminLogin();

if (!currentAdmin) {
    throw new Error("Admin login required.");
}


// Get logs
function getActivityLogs() {

    return JSON.parse(
        localStorage.getItem("bmpActivityLogs")
    ) || [];
}


// Elements
const logsTableBody =
    document.getElementById("logsTableBody");

const emptyState =
    document.getElementById("emptyState");

const searchLog =
    document.getElementById("searchLog");

const institutionFilter =
    document.getElementById("institutionFilter");

const roleFilter =
    document.getElementById("roleFilter");

const backButton =
    document.getElementById("backButton");


// Render logs
function renderLogs() {

    const logs =
        getActivityLogs();


    const searchValue =
        searchLog.value
            .trim()
            .toLowerCase();


    const selectedInstitution =
        institutionFilter.value;


    const selectedRole =
        roleFilter.value;


    const filteredLogs =
        logs.filter(
            log => {

                const searchableText =
                    [
                        log.institutionId,
                        log.username,
                        log.action,
                        log.details
                    ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    searchableText.includes(
                        searchValue
                    );


                const matchesInstitution =
                    selectedInstitution === "all" ||
                    log.institutionId ===
                        selectedInstitution;


                const matchesRole =
                    selectedRole === "all" ||
                    log.role === selectedRole;


                return (
                    matchesSearch &&
                    matchesInstitution &&
                    matchesRole
                );
            }
        );


    // Newest first
    filteredLogs.sort(
        (a, b) =>
            new Date(b.dateTime) -
            new Date(a.dateTime)
    );


    logsTableBody.innerHTML = "";


    if (filteredLogs.length === 0) {

        emptyState.style.display =
            "block";

        return;
    }


    emptyState.style.display =
        "none";


    filteredLogs.forEach(
        log => {

            const row =
                document.createElement("tr");


            const dateTime =
                log.dateTime
                    ? new Date(
                        log.dateTime
                    ).toLocaleString()
                    : "-";


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        log.institutionId || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        log.username || "-"
                    )}
                </td>

                <td>
                    <span class="role-badge">
                        ${escapeHtml(
                            log.role || "-"
                        )}
                    </span>
                </td>

                <td>
                    <span class="action-text">
                        ${escapeHtml(
                            log.action || "-"
                        )}
                    </span>
                </td>

                <td>
                    ${dateTime}
                </td>

                <td class="details-cell">
                    ${escapeHtml(
                        log.details || "-"
                    )}
                </td>

            `;


            logsTableBody.appendChild(
                row
            );
        }
    );
}


// Load institutions into filter
function loadInstitutionFilter() {

    const institutions =
        JSON.parse(
            localStorage.getItem("bmpInstitutions")
        ) || [];


    institutions.forEach(
        institution => {

            const option =
                document.createElement("option");


            option.value =
                institution.id;


            option.textContent =
                `${institution.id} - ${institution.name}`;


            institutionFilter.appendChild(
                option
            );
        }
    );
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
searchLog.addEventListener(
    "input",
    renderLogs
);


// Institution filter
institutionFilter.addEventListener(
    "change",
    renderLogs
);


// Role filter
roleFilter.addEventListener(
    "change",
    renderLogs
);


// Back button
backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "admin.html";
    }
);


// Initialize
loadInstitutionFilter();

renderLogs();
