// =====================================================
// BMP Institution Details
// =====================================================


// =====================================================
// Check Admin Session
// =====================================================

const currentAdmin =
    requireAdminLogin();

if (!currentAdmin) {
    throw new Error("Admin login required.");
}


// =====================================================
// URL Parameters
// =====================================================


// =====================================================
// URL Parameters
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const institutionId =
    urlParams.get("id");


// =====================================================
// Storage
// =====================================================

let institutions =
    JSON.parse(
        localStorage.getItem(
            "bmpInstitutions"
        )
    ) || [];


// =====================================================
// Find Institution
// =====================================================

let institution =
    institutions.find(
        item =>
            item.id === institutionId
    );


// =====================================================
// Elements
// =====================================================

const institutionLogo =
    document.getElementById(
        "institutionLogo"
    );

const institutionLogoPreview =
    document.getElementById(
        "institutionLogoPreview"
    );


// =====================================================
// Check Institution
// =====================================================

if (!institution) {

    alert(
        "Institution not found."
    );

    window.location.href =
        "institutions.html";

}


// =====================================================
// Display Institution
// =====================================================

if (institution) {

    loadInstitution();

}


// =====================================================
// Load Institution
// =====================================================

function loadInstitution() {

    // -------------------------------------------------
    // Existing page fields
    // -------------------------------------------------

    const elements = {

        id:
            document.getElementById(
                "institutionId"
            ),

        name:
            document.getElementById(
                "institutionName"
            ),

        type:
            document.getElementById(
                "institutionType"
            ),

        phone:
            document.getElementById(
                "institutionPhone"
            ),

        email:
            document.getElementById(
                "institutionEmail"
            ),

        status:
            document.getElementById(
                "institutionStatus"
            ),

        licenseStart:
            document.getElementById(
                "licenseStart"
            ),

        licenseEnd:
            document.getElementById(
                "licenseEnd"
            ),

        username:
            document.getElementById(
                "mainUsername"
            )

    };


    if (elements.id) {

        elements.id.textContent =
            institution.id || "-";
    }


    if (elements.name) {

        elements.name.textContent =
            institution.name || "-";
    }


    if (elements.type) {

        elements.type.textContent =
            institution.type || "-";
    }


    if (elements.phone) {

        elements.phone.textContent =
            institution.phone || "-";
    }


    if (elements.email) {

        elements.email.textContent =
            institution.email || "-";
    }


    if (elements.status) {

        elements.status.textContent =
            getInstitutionStatus();
    }


    if (elements.licenseStart) {

        elements.licenseStart.textContent =
            institution.licenseStart || "-";
    }


    if (elements.licenseEnd) {

        elements.licenseEnd.textContent =
            institution.licenseEnd || "-";
    }


    if (elements.username) {

        elements.username.textContent =
            institution.username || "-";
    }


    // -------------------------------------------------
    // Logo
    // -------------------------------------------------

    loadInstitutionLogo();


    // -------------------------------------------------
    // Page Title
    // -------------------------------------------------

    document.title =
        `${institution.name || "Institution"} - BMP`;
}


// =====================================================
// Institution Status
// =====================================================

function getInstitutionStatus() {

    if (
        institution.status ===
        "disabled"
    ) {

        return "Disabled";
    }


    if (institution.licenseEnd) {

        const today =
            new Date();

        const endDate =
            new Date(
                institution.licenseEnd
            );


        if (endDate < today) {

            return "Expired";
        }
    }


    return "Active";
}


// =====================================================
// Load Logo
// =====================================================

function loadInstitutionLogo() {

    if (
        !institutionLogoPreview
    ) {

        return;
    }


    institutionLogoPreview.innerHTML =
        "";


    if (
        institution.logo
    ) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            institution.logo;


        image.alt =
            `${institution.name || "Institution"} Logo`;


        institutionLogoPreview.appendChild(
            image
        );

    } else {

        const text =
            document.createElement(
                "span"
            );


        text.textContent =
            "No Logo";


        institutionLogoPreview.appendChild(
            text
        );
    }
}


// =====================================================
// Read Logo
// =====================================================

function readLogoFile(
    file
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            if (!file) {

                reject(
                    "Please select a logo."
                );

                return;
            }


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
// Change Logo
// =====================================================

if (institutionLogo) {

    institutionLogo.addEventListener(
        "change",
        async function () {

            const file =
                institutionLogo.files[0];


            if (!file) {

                return;
            }


            try {

                const newLogo =
                    await readLogoFile(
                        file
                    );


                institution.logo =
                    newLogo;


                // Save

                localStorage.setItem(
                    "bmpInstitutions",
                    JSON.stringify(
                        institutions
                    )
                );


                // Refresh preview

                loadInstitutionLogo();


                // Activity Log

                if (
                    typeof logActivity ===
                    "function"
                ) {

                    logActivity({

                        institutionId:
                            institution.id,

                        username:
                            "Owner",

                        role:
                            "Admin",

                        action:
                            "Changed Institution Logo",

                        details:
                            `Updated logo for ${institution.name}`

                    });
                }


                alert(
                    "Institution logo updated successfully."
                );


            } catch (error) {

                alert(error);


                // Reset input

                institutionLogo.value =
                    "";
            }

        }
    );
}


// =====================================================
// Back
// =====================================================

const backButton =
    document.getElementById(
        "backButton"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "institutions.html";
        }
    );
}


// =====================================================
// Edit Institution
// =====================================================

const editButton =
    document.getElementById(
        "editButton"
    );


if (editButton) {

    editButton.addEventListener(
        "click",
        function () {

            window.location.href =
                `edit-institution.html?id=${encodeURIComponent(
                    institution.id
                )}`;

        }
    );
}


// =====================================================
// Manage Users
// =====================================================

const usersButton =
    document.getElementById(
        "usersButton"
    );


if (usersButton) {

    usersButton.addEventListener(
        "click",
        function () {

            window.location.href =
                `users.html?id=${encodeURIComponent(
                    institution.id
                )}`;

        }
    );
}
