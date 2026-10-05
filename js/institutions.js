const tableBody = document.getElementById("institutionsTableBody");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInstitution");
const typeFilter = document.getElementById("typeFilter");
const statusFilter = document.getElementById("statusFilter");

const createInstitutionButton =
    document.getElementById("createInstitutionButton");


// Get institutions from localStorage
function getInstitutions() {
    return JSON.parse(
        localStorage.getItem("bmpInstitutions")
    ) || [];
}


// Save institutions
function saveInstitutions(institutions) {
    localStorage.setItem(
        "bmpInstitutions",
        JSON.stringify(institutions)
    );
}


// Get current status
function getStatus(institution) {

    if (institution.status === "disabled") {
        return "disabled";
    }

    if (institution.licenseEnd) {

        const today = new Date();
        const endDate = new Date(institution.licenseEnd);

        if (endDate < today) {
            return "expired";
        }
    }

    return "active";
}


// Render institutions
function renderInstitutions() {

    const institutions = getInstitutions();

    const searchValue =
        searchInput.value.trim().toLowerCase();

    const selectedType =
        typeFilter.value;

    const selectedStatus =
        statusFilter.value;


    const filteredInstitutions = institutions.filter(institution => {

        const currentStatus = getStatus(institution);

        const matchesSearch =
            institution.name.toLowerCase().includes(searchValue) ||
            institution.id.toLowerCase().includes(searchValue);

        const matchesType =
            selectedType === "all" ||
            institution.type === selectedType;

        const matchesStatus =
            selectedStatus === "all" ||
            currentStatus === selectedStatus;

        return (
            matchesSearch &&
            matchesType &&
            matchesStatus
        );
    });


    tableBody.innerHTML = "";


    if (filteredInstitutions.length === 0) {

        emptyState.style.display = "block";
        return;

    } else {

        emptyState.style.display = "none";
    }


    filteredInstitutions.forEach(institution => {

        const status = getStatus(institution);

        const row = document.createElement("tr");


        const typeName =
            institution.type === "school"
                ? "School"
                : "Restaurant";


        const statusName =
            status.charAt(0).toUpperCase() +
            status.slice(1);


        row.innerHTML = `
            <td>${institution.id}</td>

            <td>${institution.name}</td>

            <td>
                <span class="type-badge type-${institution.type}">
                    ${typeName}
                </span>
            </td>

            <td>
                <span class="status-badge status-${status}">
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


        tableBody.appendChild(row);
    });
}


// View institution
function viewInstitution(id) {

    const institutions = getInstitutions();

    const institution =
        institutions.find(item => item.id === id);

    if (!institution) {
        alert("Institution not found.");
        return;
    }


    alert(
        "Institution Information\n\n" +
        "ID: " + institution.id + "\n" +
        "Name: " + institution.name + "\n" +
        "Type: " + institution.type + "\n" +
        "Phone: " + (institution.phone || "-") + "\n" +
        "Email: " + (institution.email || "-") + "\n" +
        "Username: " + institution.username + "\n" +
        "License: " +
        (institution.licenseStart || "-") +
        " - " +
        (institution.licenseEnd || "-")
    );
}


// Disable institution
function disableInstitution(id) {

    const institutions = getInstitutions();

    const institution =
        institutions.find(item => item.id === id);

    if (!institution) {
        return;
    }


    const confirmed = confirm(
        "Are you sure you want to disable this institution?"
    );

    if (!confirmed) {
        return;
    }


    institution.status = "disabled";

    saveInstitutions(institutions);

    renderInstitutions();
}


// Enable institution
function enableInstitution(id) {

    const institutions = getInstitutions();

    const institution =
        institutions.find(item => item.id === id);

    if (!institution) {
        return;
    }


    institution.status = "active";

    saveInstitutions(institutions);

    renderInstitutions();
}


// Search
searchInput.addEventListener(
    "input",
    renderInstitutions
);


// Type filter
typeFilter.addEventListener(
    "change",
    renderInstitutions
);


// Status filter
statusFilter.addEventListener(
    "change",
    renderInstitutions
);


// Create Institution
createInstitutionButton.addEventListener(
    "click",
    function () {
        window.location.href = "create-institution.html";
    }
);


// Initial render
renderInstitutions();
