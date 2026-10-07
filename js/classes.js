```javascript
// =====================================================
// BMP Classes & Stages
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDdT_T6k0w0AWWK/exec";


// =====================================================
// Authentication
// =====================================================

const currentUser =
    requireSchoolLogin();

if (!currentUser) {

    throw new Error(
        "School login required."
    );

}


const institutionId =
    getActiveInstitutionId();

if (!institutionId) {

    throw new Error(
        "Institution access denied."
    );

}


// =====================================================
// Elements
// =====================================================

const institutionIdElement =
    document.getElementById(
        "institutionId"
    );

const institutionNameElement =
    document.getElementById(
        "institutionName"
    );

const primaryClasses =
    document.getElementById(
        "primaryClasses"
    );

const preparatoryClasses =
    document.getElementById(
        "preparatoryClasses"
    );

const secondaryClasses =
    document.getElementById(
        "secondaryClasses"
    );

const backButton =
    document.getElementById(
        "backButton"
    );


// =====================================================
// Load Classes
// =====================================================

async function loadClasses() {

    try {

        showLoading(
            primaryClasses
        );

        showLoading(
            preparatoryClasses
        );

        showLoading(
            secondaryClasses
        );


        const response =
            await fetch(
                API_URL,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "getClasses",

                            institutionId:
                                institutionId,

                            username:
                                currentUser.username

                        })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to connect to the server."
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Failed to load classes."
            );

        }


        // =============================================
        // Institution
        // =============================================

        if (
            institutionIdElement
        ) {

            institutionIdElement.textContent =
                result.institution &&
                result.institution.id
                    ? result.institution.id
                    : institutionId;

        }


        if (
            institutionNameElement
        ) {

            institutionNameElement.textContent =
                result.institution &&
                result.institution.name
                    ? result.institution.name
                    : "-";

        }


        // =============================================
        // Classes
        // =============================================

        const classes =
            Array.isArray(
                result.classes
            )
                ? result.classes
                : [];


        renderClasses(
            classes
        );


        if (
            result.institution &&
            result.institution.name
        ) {

            document.title =
                `${result.institution.name} - Classes & Stages`;

        }

    }

    catch (error) {

        console.error(
            "Classes loading error:",
            error
        );


        showError(
            primaryClasses
        );

        showError(
            preparatoryClasses
        );

        showError(
            secondaryClasses
        );


        alert(
            error.message ||
            "Failed to load classes."
        );

    }

}


// =====================================================
// Render Classes
// =====================================================

function renderClasses(
    classes
) {

    const primary =
        classes.filter(
            item =>
                String(
                    item.stage || ""
                ).toLowerCase() ===
                "primary"
        );


    const preparatory =
        classes.filter(
            item =>
                String(
                    item.stage || ""
                ).toLowerCase() ===
                "preparatory"
        );


    const secondary =
        classes.filter(
            item =>
                String(
                    item.stage || ""
                ).toLowerCase() ===
                "secondary"
        );


    renderStageClasses(
        primaryClasses,
        primary
    );


    renderStageClasses(
        preparatoryClasses,
        preparatory
    );


    renderStageClasses(
        secondaryClasses,
        secondary
    );

}


// =====================================================
// Render Stage Classes
// =====================================================

function renderStageClasses(
    container,
    classes
) {

    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (
        !classes ||
        classes.length === 0
    ) {

        container.innerHTML = `
            <div class="class-item">

                <div class="class-info">

                    <div>

                        <div class="class-name">
                            No classes found.
                        </div>

                    </div>

                </div>

            </div>
        `;

        return;

    }


    classes.sort(
        (
            a,
            b
        ) =>
            Number(
                a.classNumber || 0
            ) -
            Number(
                b.classNumber || 0
            )
    );


    classes.forEach(
        item => {

            const classNumber =
                String(
                    item.classNumber ||
                    ""
                );


            const className =
                String(
                    item.className ||
                    ""
                );


            const classCode =
                String(
                    item.classCode ||
                    ""
                );


            const classItem =
                document.createElement(
                    "div"
                );


            classItem.className =
                "class-item";


            classItem.style.cursor =
                "pointer";


            classItem.innerHTML = `
                <div class="class-info">

                    <span class="class-number">
                        ${escapeHtml(
                            classNumber
                        )}
                    </span>

                    <div>

                        <div class="class-name">
                            ${escapeHtml(
                                className
                            )}
                        </div>

                        <div class="class-code">
                            Code:
                            ${escapeHtml(
                                classCode
                            )}
                        </div>

                    </div>

                </div>
            `;


            // =========================================
            // Open Class Students Page
            // =========================================

            classItem.onclick =
                function () {

                    const targetUrl =
                        "./school-class.html" +
                        "?stage=" +
                        encodeURIComponent(
                            item.stage
                        ) +
                        "&class=" +
                        encodeURIComponent(
                            item.classNumber
                        );


                    console.log(
                        "Opening class page:",
                        targetUrl
                    );


                    window.location.assign(
                        targetUrl
                    );

                };


            container.appendChild(
                classItem
            );

        }
    );

}


// =====================================================
// Loading
// =====================================================

function showLoading(
    container
) {

    if (!container) {

        return;

    }


    container.innerHTML = `
        <div class="class-item">

            <div class="class-info">

                <div>

                    <div class="class-name">
                        Loading...
                    </div>

                </div>

            </div>

        </div>
    `;

}


// =====================================================
// Error
// =====================================================

function showError(
    container
) {

    if (!container) {

        return;

    }


    container.innerHTML = `
        <div class="class-item">

            <div class="class-info">

                <div>

                    <div class="class-name">
                        Failed to load classes.
                    </div>

                </div>

            </div>

        </div>
    `;

}


// =====================================================
// Escape HTML
// =====================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


// =====================================================
// Back
// =====================================================

if (
    backButton
) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                `school.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );

}


// =====================================================
// Initialize
// =====================================================

loadClasses();
```
