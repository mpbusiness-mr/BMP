const institutions =
    JSON.parse(localStorage.getItem("bmpInstitutions")) || [];


// Get institution ID from URL
const urlParams = new URLSearchParams(window.location.search);
const institutionId = urlParams.get("id");


// Find institution
const institution = institutions.find(
    item => item.id === institutionId
);


// Elements
const idElement = document.getElementById("institutionId");
const nameElement = document.getElementById("institutionName");
const typeElement = document.getElementById("institutionType");
const statusElement = document.getElementById("institutionStatus");

const phoneElement = document.getElementById("institutionPhone");
const emailElement = document.getElementById("institutionEmail");

const licenseStartElement = document.getElementById("licenseStart");
const licenseEndElement = document.getElementById("licenseEnd");
const licenseStatusElement = document.getElementById("licenseStatus");

const usernameElement = document.getElementById("mainUsername");

const toggleStatusButton =
    document.getElementById("toggleStatusButton");

const backButton =
    document.getElementById("backButton");

const editButton =
    document.getElementById("editButton");
const usersButton =
    document.getElementById("usersButton");


// If institution does not exist
if (!institution) {

    alert("Institution not found.");

    window.location.href = "institutions.html";

} else {

    displayInstitution();
}


// Get institution status
function getInstitutionStatus() {

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


// Display institution
function displayInstitution() {

    const status = getInstitutionStatus();

    idElement.textContent =
        institution.id || "-";

    nameElement.textContent =
        institution.name || "-";

    typeElement.textContent =
        institution.type === "school"
            ? "School"
            : "Restaurant";

    statusElement.textContent =
        status.charAt(0).toUpperCase() +
        status.slice(1);

    phoneElement.textContent =
        institution.phone || "-";

    emailElement.textContent =
        institution.email || "-";

    licenseStartElement.textContent =
        institution.licenseStart || "-";

    licenseEndElement.textContent =
        institution.licenseEnd || "-";

    licenseStatusElement.textContent =
        status === "expired"
            ? "Expired"
            : "Valid";

    usernameElement.textContent =
        institution.username || "-";


    // Update button
    if (status === "disabled") {

        toggleStatusButton.textContent =
            "Enable Institution";

    } else {

        toggleStatusButton.textContent =
            "Disable Institution";
    }
}


// Back button
backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "institutions.html";
    }
);


// Enable / Disable
toggleStatusButton.addEventListener(
    "click",
    function () {

        const currentInstitutions =
            JSON.parse(
                localStorage.getItem("bmpInstitutions")
            ) || [];


        const selectedInstitution =
            currentInstitutions.find(
                item => item.id === institutionId
            );


        if (!selectedInstitution) {

            alert("Institution not found.");

            return;
        }


        if (selectedInstitution.status === "disabled") {

            selectedInstitution.status = "active";

        } else {

            const confirmed = confirm(
                "Are you sure you want to disable this institution?"
            );

            if (!confirmed) {
                return;
            }

            selectedInstitution.status = "disabled";
        }


        localStorage.setItem(
            "bmpInstitutions",
            JSON.stringify(currentInstitutions)
        );


        // Reload page
        window.location.reload();
    }
);


// Edit button
editButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `edit-institution.html?id=${encodeURIComponent(institutionId)}`;
    }
);

// Manage Users button
usersButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `users.html?id=${encodeURIComponent(institutionId)}`;
    }
);
