```javascript
// ==========================================
// BMP - Institutions
// Temporary development data
// ==========================================


const institutions = [

    {
        id: "SCH-0001",
        name: "Al Noor School",
        type: "school",
        status: "active",
        license: "01/10/2026 - 31/08/2027"
    },

    {
        id: "RES-0001",
        name: "My Restaurant",
        type: "restaurant",
        status: "active",
        license: "01/10/2026 - 31/08/2027"
    },

    {
        id: "SCH-0002",
        name: "Future School",
        type: "school",
        status: "disabled",
        license: "01/09/2026 - 31/08/2027"
    },

    {
        id: "RES-0002",
        name: "Example Restaurant",
        type: "restaurant",
        status: "expired",
        license: "01/01/2026 - 30/09/2026"
    }

];


// ==========================================
// Elements
// ==========================================

const tableBody =
    document.getElementById("institutionsTableBody");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInstitution");

const typeFilter =
    document.getElementById("typeFilter");

const statusFilter =
    document.getElementById("statusFilter");

const createButton =
    document.getElementById("createInstitutionButton");


// ==========================================
// Display Institutions
// ==========================================

function displayInstitutions() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedType =
        typeFilter.value;

    const selectedStatus =
        statusFilter.value;


    const filteredInstitutions =
        institutions.filter(function (institution) {

            const matchesSearch =
                institution.name
                    .toLowerCase()
                    .includes(search)

                ||

                institution.id
                    .toLowerCase()
                    .includes(search);


            const matchesType =
                selectedType === "all"

                ||

                institution.type === selectedType;


            const matchesStatus =
                selectedStatus === "all"

                ||

                institution.status === selectedStatus;


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

    }


    emptyState.style.display = "none";


    filteredInstitutions.forEach(function (institution) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${institution.id}
            </td>

            <td>
                ${institution.name}
            </td>

            <td>
                <span class="type type-${institution.type}">
                    ${formatType(institution.type)}
                </span>
            </td>

            <td>
                <span class="status status-${institution.status}">
                    ${formatStatus(institution.status)}
                </span>
            </td>

            <td>
                ${institution.license}
            </td>

            <td>

                <div class="actions">

                    <button
                        class="action-button"
                        onclick="viewInstitution('${institution.id}')"
                    >
                        View
                    </button>

                    <button
                        class="action-button"
                        onclick="toggleInstitution('${institution.id}')"
                    >
                        ${institution.status === "disabled"
                            ? "Enable"
                            : "Disable"}
                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ==========================================
// Format Type
// ==========================================

function formatType(type) {

    if (type === "school") {
        return "School";
    }

    if (type === "restaurant") {
        return "Restaurant";
    }

    return type;

}


// ==========================================
// Format Status
// ==========================================

function formatStatus(status) {

    if (status === "active") {
        return "Active";
    }

    if (status === "disabled") {
        return "Disabled";
    }

    if (status === "expired") {
        return "Expired";
    }

    return status;

}


// ==========================================
// View Institution
// ==========================================

function viewInstitution(id) {

    const institution =
        institutions.find(function (item) {

            return item.id === id;

        });


    if (!institution) {
        return;
    }


    alert(
        "Institution:\n\n" +

        "ID: " + institution.id +

        "\nName: " + institution.name +

        "\nType: " + formatType(institution.type) +

        "\nStatus: " + formatStatus(institution.status) +

        "\nLicense: " + institution.license
    );

}


// ==========================================
// Enable / Disable Institution
// ==========================================

function toggleInstitution(id) {

    const institution =
        institutions.find(function (item) {

            return item.id === id;

        });


    if (!institution) {
        return;
    }


    if (institution.status === "disabled") {

        institution.status = "active";

    } else {

        institution.status = "disabled";

    }


    displayInstitutions();

}


// ==========================================
// Create Institution
// ==========================================

createButton.addEventListener(
    "click",
    function () {

        alert(
            "Create Institution module will be added next."
        );

    }
);


// ==========================================
// Filters
// ==========================================

searchInput.addEventListener(
    "input",
    displayInstitutions
);


typeFilter.addEventListener(
    "change",
    displayInstitutions
);


statusFilter.addEventListener(
    "change",
    displayInstitutions
);


// ==========================================
// Initial Display
// ==========================================

displayInstitutions();
```
