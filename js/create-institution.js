const institutionType =
    document.getElementById("institutionType");

const institutionId =
    document.getElementById("institutionId");

const createButton =
    document.getElementById("createButton");

const cancelButton =
    document.getElementById("cancelButton");


// Generate Institution ID
function generateInstitutionId() {

    const currentYear =
        new Date()
            .getFullYear()
            .toString()
            .slice(-2);


    // Temporary demo counter
    let institutions =
        JSON.parse(
            localStorage.getItem("bmpInstitutions")
        ) || [];


    const institutionNumber =
        institutions.length + 1;


    const formattedNumber =
        String(institutionNumber)
            .padStart(4, "0");


    return `MP${formattedNumber}${currentYear}`;
}


// Generate ID when institution type is selected
institutionType.addEventListener(
    "change",
    function () {

        if (institutionType.value !== "") {

            institutionId.value =
                generateInstitutionId();

        } else {

            institutionId.value = "";
        }
    }
);


// Create Institution
createButton.addEventListener(
    "click",
    function () {

        const name =
            document
                .getElementById("institutionName")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const licenseStart =
            document
                .getElementById("licenseStart")
                .value;


        const licenseEnd =
            document
                .getElementById("licenseEnd")
                .value;


        const username =
            document
                .getElementById("mainUsername")
                .value
                .trim();


        const password =
            document
                .getElementById("mainPassword")
                .value;


        // Validation

        if (institutionType.value === "") {

            alert(
                "Please select the institution type."
            );

            return;
        }


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


        if (password === "") {

            alert(
                "Please enter the main password."
            );

            return;
        }


        // Create institution

        const newInstitution = {

            id:
                institutionId.value,

            name:
                name,

            type:
                institutionType.value,

            phone:
                phone,

            email:
                email,

            licenseStart:
                licenseStart,

            licenseEnd:
                licenseEnd,

            username:
                username,

            password:
                password,

            status:
                "active",

            createdAt:
                new Date().toISOString()
        };


        // Get institutions

        let institutions =
            JSON.parse(
                localStorage.getItem("bmpInstitutions")
            ) || [];


        // Add institution

        institutions.push(
            newInstitution
        );


        // Save institutions

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
                    newInstitution.id,

                userId:
                    "ADMIN",

                username:
                    "Admin",

                role:
                    "Admin",

                action:
                    "Created Institution",

                details:
                    `Created ${
                        newInstitution.type === "school"
                            ? "School"
                            : "Restaurant"
                    } "${newInstitution.name}"`
            });
        }


        alert(
            "Institution created successfully."
        );


        // Return to institutions

        window.location.href =
            "institutions.html";
    }
);


// Cancel

cancelButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "institutions.html";
    }
);
