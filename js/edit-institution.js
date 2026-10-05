// =====================================================
// Check Admin Session
// =====================================================

const currentAdmin =
    requireAdminLogin();

if (!currentAdmin) {
    throw new Error("Admin login required.");
}


// Get institution ID from URL
const urlParams =
    new URLSearchParams(window.location.search);

const institutionId =
    urlParams.get("id");


// Get institutions
let institutions =
    JSON.parse(
        localStorage.getItem("bmpInstitutions")
    ) || [];


// Find institution
const institution =
    institutions.find(
        item => item.id === institutionId
    );


// Elements
const idInput =
    document.getElementById("institutionId");

const typeInput =
    document.getElementById("institutionType");

const nameInput =
    document.getElementById("institutionName");

const phoneInput =
    document.getElementById("phone");

const emailInput =
    document.getElementById("email");

const licenseStartInput =
    document.getElementById("licenseStart");

const licenseEndInput =
    document.getElementById("licenseEnd");

const usernameInput =
    document.getElementById("mainUsername");

const saveButton =
    document.getElementById("saveButton");

const cancelButton =
    document.getElementById("cancelButton");

const backButton =
    document.getElementById("backButton");


// Check institution
if (!institution) {

    alert("Institution not found.");

    window.location.href =
        "institutions.html";

} else {

    loadInstitution();
}


// Load institution data
function loadInstitution() {

    idInput.value =
        institution.id || "";

    typeInput.value =
        institution.type === "school"
            ? "School"
            : "Restaurant";

    nameInput.value =
        institution.name || "";

    phoneInput.value =
        institution.phone || "";

    emailInput.value =
        institution.email || "";

    licenseStartInput.value =
        institution.licenseStart || "";

    licenseEndInput.value =
        institution.licenseEnd || "";

    usernameInput.value =
        institution.username || "";
}


// Save changes
saveButton.addEventListener(
    "click",
    function () {

        const name =
            nameInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const email =
            emailInput.value.trim();

        const licenseStart =
            licenseStartInput.value;

        const licenseEnd =
            licenseEndInput.value;

        const username =
            usernameInput.value.trim();


        // Validation
        if (name === "") {

            alert(
                "Please enter the institution name."
            );

            return;
        }


        if (licenseStart === "") {

            alert(
                "Please select the license start date."
            );

            return;
        }


        if (licenseEnd === "") {

            alert(
                "Please select the license end date."
            );

            return;
        }


        if (licenseEnd < licenseStart) {

            alert(
                "License end date cannot be before the start date."
            );

            return;
        }


        if (username === "") {

            alert(
                "Please enter the main username."
            );

            return;
        }


        // Update institution
        institution.name =
            name;

        institution.phone =
            phone;

        institution.email =
            email;

        institution.licenseStart =
            licenseStart;

        institution.licenseEnd =
            licenseEnd;

        institution.username =
            username;


        // Save
        localStorage.setItem(
            "bmpInstitutions",
            JSON.stringify(institutions)
        );


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
                    "Edited Institution",

                details:
                    `Updated institution "${institution.name}"`
            });
        }


        alert(
            "Institution updated successfully."
        );


        // Return to details
        window.location.href =
            `institution.html?id=${encodeURIComponent(
                institution.id
            )}`;
    }
);


// Cancel
cancelButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `institution.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);


// Back
backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `institution.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);
