// =====================================================
// BMP Create Institution
// =====================================================


// =====================================================
// Google Apps Script Backend
// =====================================================

const ADMIN_API_URL =
    "https://script.google.com/macros/s/AKfycbwlXk0Y75gfNdEbURP-SroKfsOATgyyi_lqznUv1NBHauwqCdmlIYSZGXwkF_XqlZ4OBA/exec";


// =====================================================
// Check Admin Session
// =====================================================

const currentAdmin =
    requireAdminLogin();

if (!currentAdmin) {

    throw new Error(
        "Admin login required."
    );

}


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
// Read Logo
// =====================================================

function readLogoFile() {

    return new Promise(
        function (resolve, reject) {

            if (
                !institutionLogo.files ||
                institutionLogo.files.length === 0
            ) {

                resolve(null);

                return;

            }


            const file =
                institutionLogo.files[0];


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


        // =============================================
        // Validation
        // =============================================

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


        // =============================================
        // Logo
        // =============================================

        let logo = null;


        try {

            logo =
                await readLogoFile();

        } catch (error) {

            alert(error);

            return;

        }


        // =============================================
        // Disable Button
        // =============================================

        createButton.disabled = true;

        createButton.textContent =
            "Creating...";


        try {

            // =========================================
            // Send To Backend
            // =========================================

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
                                    "createInstitution",

                                type:
                                    type,

                                name:
                                    name,

                                phone:
                                    phone,

                                email:
                                    email,

                                licenseStart:
                                    startDate,

                                licenseEnd:
                                    endDate,

                                username:
                                    username,

                                password:
                                    password,

                                logo:
                                    logo

                            })

                    }
                );


            const result =
                await response.json();


            // =========================================
            // Backend Error
            // =========================================

            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Unable to create institution."
                );

            }


            // =========================================
            // Success
            // =========================================

            alert(
                "Institution created successfully."
            );


            // =========================================
            // Redirect
            // =========================================

            window.location.href =
                "institutions.html";


        } catch (error) {

            console.error(
                "Create institution error:",
                error
            );


            alert(
                error.message ||
                "Unable to create institution."
            );


            createButton.disabled =
                false;

            createButton.textContent =
                "Create Institution";

        }

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
