// =====================================================
// BMP Institutions
// =====================================================

// =====================================================
// Admin Session
// =====================================================

const currentAdmin =
    requireAdminLogin();

if (!currentAdmin) {
    throw new Error("Admin login required.");
}


// =====================================================
// Google Apps Script Backend
// =====================================================

const ADMIN_API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Elements
// =====================================================

const tableBody =
    document.getElementById(
        "institutionsTableBody"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const searchInput =
    document.getElementById(
        "searchInstitution"
    );

const typeFilter =
    document.getElementById(
        "typeFilter"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const createInstitutionButton =
    document.getElementById(
        "createInstitutionButton"
    );


// =====================================================
// Institutions Data
// =====================================================

let institutions = [];


// =====================================================
// Load Institutions
// =====================================================

async function loadInstitutions() {

    try {

        const response =
            await fetch(
                ADMIN_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({
                        action:
                            "getInstitutions"
                    })
                }
            );

        const result =
            await response.json();

        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to load institutions."
            );
        }

        institutions =
            result.institutions || [];

        renderInstitutions();

    } catch (error) {

        console.error(
            "Load institutions error:",
            error
        );

        tableBody.innerHTML = "";

        emptyState.style.display =
            "block";

        emptyState.querySelector("h2").textContent =
            "Unable to Load Institutions";

        emptyState.querySelector("p").textContent =
            error.message ||
            "Unable to connect to server.";
    }
}


// =====================================================
// Get Current Status
// =====================================================

function getStatus(institution) {

    if (
        institution.status ===
        "disabled"
    ) {

        return "disabled";
    }

    if (
        institution.licenseEnd
    ) {

        const today =
            new Date();

        const endDate =
            new Date(
                institution.licenseEnd
            );

        if (
            endDate < today
        ) {

            return "expired";
        }
    }

    return "active";
}


// =====================================================
// Render Institutions
// =====================================================

function renderInstitutions() {

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedType =
        typeFilter.value;

    const selectedStatus =
        statusFilter.value;


    const filteredInstitutions =
        institutions.filter(
            institution => {

                const currentStatus =
                    getStatus(
                        institution
                    );


                const institutionName =
                    String(
                        institution.name || ""
                    ).toLowerCase();


                const institutionId =
                    String(
                        institution.id || ""
                    ).toLowerCase();


                const matchesSearch =
                    institutionName.includes(
                        searchValue
                    ) ||
                    institutionId.includes(
                        searchValue
                    );


                const matchesType =
                    selectedType === "all" ||
                    institution.type ===
                        selectedType;


                const matchesStatus =
                    selectedStatus === "all" ||
                    currentStatus ===
                        selectedStatus;


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesStatus
                );
            }
        );


    tableBody.innerHTML = "";


    if (
        filteredInstitutions.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    } else {

        emptyState.style.display =
            "none";
    }


    filteredInstitutions.forEach(
        institution => {

            const status =
                getStatus(
                    institution
                );


            const row =
                document.createElement(
                    "tr"
                );


            const typeName =
                institution.type ===
                    "school"
                    ? "School"
                    : "Restaurant";


            const statusName =
                status
                    .charAt(0)
                    .toUpperCase() +
                status.slice(1);


            row.innerHTML = `
                <td>
                    ${institution.id || "-"}
                </td>

                <td>
                    ${institution.name || "-"}
                </td>

                <td>
                    <span
                        class="type-badge type-${institution.type}">
                        ${typeName}
                    </span>
                </td>

                <td>
                    <span
                        class="status-badge status-${status}">
                        ${statusName}
                    </span>
                </td>

                <td>
                    ${institution.licenseStart || "-"}
                    -
                    ${institution.licenseEnd || "-"}
                </td>

                <td>

                    <button
                        class="action-btn view-btn"
                        onclick="viewInstitution('${institution.id}')">
                        View
                    </button>

                    ${
                        status === "disabled"

                        ?

                        `<button
                            class="action-btn enable-btn"
                            onclick="enableInstitution('${institution.id}')">
                            Enable
                        </button>`

                        :

                        `<button
                            class="action-btn disable-btn"
                            onclick="disableInstitution('${institution.id}')">
                            Disable
                        </button>`
                    }

                </td>
            `;


            tableBody.appendChild(
                row
            );
        }
    );
}


// =====================================================
// View Institution
// =====================================================

function viewInstitution(id) {

    window.location.href =
        `institution.html?id=${encodeURIComponent(id)}`;
}


// =====================================================
// Disable Institution
// =====================================================

async function disableInstitution(id) {

    const institution =
        institutions.find(
            item =>
                item.id === id
        );


    if (!institution) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to disable this institution?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                ADMIN_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "updateInstitutionStatus",

                            institutionId:
                                id,

                            status:
                                "disabled"

                        })
                }
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to disable institution."
            );
        }


        await loadInstitutions();


    } catch (error) {

        console.error(
            "Disable institution error:",
            error
        );

        alert(
            error.message ||
            "Unable to disable institution."
        );
    }
}


// =====================================================
// Enable Institution
// =====================================================

async function enableInstitution(id) {

    const institution =
        institutions.find(
            item =>
                item.id === id
        );


    if (!institution) {
        return;
    }


    try {

        const response =
            await fetch(
                ADMIN_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "updateInstitutionStatus",

                            institutionId:
                                id,

                            status:
                                "active"

                        })
                }
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to enable institution."
            );
        }


        await loadInstitutions();


    } catch (error) {

        console.error(
            "Enable institution error:",
            error
        );

        alert(
            error.message ||
            "Unable to enable institution."
        );
    }
}


// =====================================================
// Search
// =====================================================

searchInput.addEventListener(
    "input",
    renderInstitutions
);


// =====================================================
// Type Filter
// =====================================================

typeFilter.addEventListener(
    "change",
    renderInstitutions
);


// =====================================================
// Status Filter
// =====================================================

statusFilter.addEventListener(
    "change",
    renderInstitutions
);


// =====================================================
// Create Institution
// =====================================================

createInstitutionButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "create-institution.html";
    }
);


// =====================================================
// Initial Load
// =====================================================

loadInstitutions();
