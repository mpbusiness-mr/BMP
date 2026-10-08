// =====================================================
// BMP Classes & Stages
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyeIqADYvIS_yynLSYOV3x-Ywn9Uh15O8BteXAyCDMflPcewRfROxDd_T6k0w0AWWK/exec";


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
                    : (
                        currentUser.institutionName ||
                        "-"
                    );

        }


        // =============================================
        // Classes From Backend
        // =============================================

        const classes =
            Array.isArray(
                result.classes
            )
                ? result.classes
                : [];


        if (
            classes.length > 0
        ) {

            renderClasses(
                classes
            );

        } else {

            renderDefaultClasses();

        }


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


        // =============================================
        // Keep Classes Page Working
        // =============================================

        if (
            institutionIdElement
        ) {

            institutionIdElement.textContent =
                institutionId;

        }


        if (
            institutionNameElement
        ) {

            institutionNameElement.textContent =
                currentUser.institutionName ||
                "-";

        }


        renderDefaultClasses();


    }

}


// =====================================================
// Render Classes From Backend
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
// Render Default Classes
// =====================================================

function renderDefaultClasses() {

    renderDefaultStageClasses(
        primaryClasses,
        "primary",
        "A",
        "Primary Class",
        6
    );


    renderDefaultStageClasses(
        preparatoryClasses,
        "preparatory",
        "B",
        "Preparatory Class",
        4
    );


    renderDefaultStageClasses(
        secondaryClasses,
        "secondary",
        "C",
        "Secondary Class",
        3
    );

}


// =====================================================
// Render Default Stage Classes
// =====================================================

function renderDefaultStageClasses(
    container,
    stage,
    stageLetter,
    classPrefix,
    numberOfClasses
) {

    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    for (
        let classNumber = 1;
        classNumber <= numberOfClasses;
        classNumber++
    ) {

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
                    ${classNumber}
                </span>

                <div>

                    <div class="class-name">
                        ${classPrefix}
                        ${classNumber}
                    </div>

                    <div class="class-code">
                        Code:
                        ${stageLetter}${classNumber}
                    </div>

                </div>

            </div>
        `;


        attachClassClick(
            classItem,
            stage,
            classNumber
        );


        container.appendChild(
            classItem
        );

    }

}


// =====================================================
// Render Stage Classes From Backend
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


            const stage =
                String(
                    item.stage ||
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


            attachClassClick(
                classItem,
                stage,
                classNumber
            );


            container.appendChild(
                classItem
            );

        }
    );

}


// =====================================================
// Class Click
// =====================================================

function attachClassClick(
    classItem,
    stage,
    classNumber
) {

    classItem.addEventListener(
        "click",
        function () {

            const url =
                "./school-class.html" +
                "?stage=" +
                encodeURIComponent(
                    stage
                ) +
                "&class=" +
                encodeURIComponent(
                    classNumber
                );


            window.location.href =
                url;

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
