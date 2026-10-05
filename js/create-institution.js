// =====================================================
// BMP Create Institution
// =====================================================


// =====================================================
// Elements
// =====================================================

const institutionType =
    document.getElementById(
        "institutionType"
    );

const institutionId =
    document.getElementById(
        "institutionId"
    );

const institutionName =
    document.getElementById(
        "institutionName"
    );

const institutionPhone =
    document.getElementById(
        "institutionPhone"
    );

const institutionEmail =
    document.getElementById(
        "institutionEmail"
    );

const licenseStart =
    document.getElementById(
        "licenseStart"
    );

const licenseEnd =
    document.getElementById(
        "licenseEnd"
    );

const mainUsername =
    document.getElementById(
        "mainUsername"
    );

const mainPassword =
    document.getElementById(
        "mainPassword"
    );

const institutionLogo =
    document.getElementById(
        "institutionLogo"
    );

const createButton =
    document.getElementById(
        "createButton"
    );

const cancelButton =
    document.getElementById(
        "cancelButton"
    );


// =====================================================
// Generate Institution ID
// =====================================================

function generateInstitutionId() {

    const currentYear =
        new Date()
            .getFullYear()
            .toString()
            .slice(-2);

    const institutions =
        JSON.parse(
            localStorage.getItem(
                "bmpInstitutions"
            )
        ) || [];


    const institutionNumber =
        institutions.length + 1;


    const formattedNumber =
        String(
            institutionNumber
        ).padStart(
            4,
            "0"
        );


    return `MP${formattedNumber}${currentYear}`;
}


// =====================================================
// Set Institution ID
// =====================================================

institutionId.value =
    generateInstitutionId();


// =====================================================
// Read Logo
// =====================================================

function readLogoFile() {

    return new Promise(
        function (resolve, reject) {

            // No logo selected
            if (
                !institutionLogo.files ||
                institutionLogo.files.length === 0
            ) {

                resolve(null);

                return;
            }


            const file =
                institutionLogo.files[0];


            // Check file type

            const allowedTypes = [
                "image/png",
                "image/jpeg",
                "image/webp"
            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                reject(
                    "Invalid logo format. Please use PNG, JPG or WEBP."
                );

                return;
            }


            // Optional size limit
            // 2 MB

            if (
                file.size >
                2 * 1024 * 1024
            ) {

                reject(
                    "Logo file must be smaller than 2 MB."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );
                };


            reader.onerror =
                function () {

                    reject(
                        "Unable to read the logo file."
                    );
                };


            reader.readAsDataURL(
                file
            );
        }
    );
}


// =====================================================
// Create Institution
// =====================================================

createButton.addEventListener(
    "click",
    async function () {

        const type =
            institutionType.value;

        const name =
            institutionName.value.trim();

        const phone =
            institutionPhone.value.trim();

        const email =
            institutionEmail.value.trim();

        const startDate =
            licenseStart.value;

        const endDate =
            licenseEnd.value;

        const username =
            mainUsername.value.trim();

        const password =
            mainPassword.value;


        // =================================================
        // Validation
        // =================================================

        if (!type) {

            alert(
                "Please select the institution type."
            );

            return;
        }


        if (!name) {

            alert(
                "Please enter the institution name."
            );

            return;
        }


        if (!startDate) {

            alert(
                "Please select the license start date."
            );

            return;
        }


        if (!endDate) {

            alert(
                "Please select the license end date."
            );

            return;
        }


        if (
            new Date(endDate) <
            new Date(startDate)
        ) {

            alert(
                "License end date cannot be before the start date."
            );

            return;
        }


        if (!username) {

            alert(
                "Please enter the main username."
            );

            return;
        }


        if (!password) {

            alert(
                "Please enter the main password."
            );

            return;
        }


        // =================================================
        // Read Logo
        // =================================================

        let logo = null;


        try {

            logo =
                await readLogoFile();

        } catch (error) {

            alert(error);

            return;
        }


        // =================================================
        // Get Existing Institutions
        // =================================================

        const institutions =
            JSON.parse(
                localStorage.getItem(
                    "bmpInstitutions"
                )
            ) || [];


        // =================================================
        // Check Username
        // =================================================

        const usernameExists =
            institutions.some(
                function (item) {

                    return (
                        item.username &&
                        item.username.toLowerCase() ===
                        username.toLowerCase()
                    );

                }
            );


        if (usernameExists) {

            alert(
                "This username is already in use."
            );

            return;
        }


        // =================================================
        // Create Institution Object
        // =================================================

        const newInstitution = {

            id:
                institutionId.value,

            type:
                type,

            name:
                name,

            phone:
                phone,

            email:
                email,

            logo:
                logo,

            licenseStart:
                startDate,

            licenseEnd:
                endDate,

            status:
                "active",

            username:
                username,

            password:
                password,

            createdAt:
                new Date().toISOString()

        };


        // =================================================
        // Save Institution
        // =================================================

        institutions.push(
            newInstitution
        );


        localStorage.setItem(
            "bmpInstitutions",
            JSON.stringify(
                institutions
            )
        );


        // =================================================
        // Activity Log
        // =================================================

        if (
            typeof logActivity ===
            "function"
        ) {

            logActivity({

                institutionId:
                    newInstitution.id,

                username:
                    "Owner",

                role:
                    "Admin",

                action:
                    "Created Institution",

                details:
                    `${newInstitution.type}: ${newInstitution.name}`

            });
        }


        // =================================================
        // Success
        // =================================================

        alert(
            "Institution created successfully."
        );


        // =================================================
        // Redirect
        // =================================================

        window.location.href =
            `institution.html?id=${encodeURIComponent(
                newInstitution.id
            )}`;
    }
);


// =====================================================
// Cancel
// =====================================================

cancelButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "institutions.html";
    }
);
