// =====================================================
// BMP Classes & Stages
// =====================================================


// =====================================================
// Get Institution ID
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const institutionId =
    urlParams.get("id");


// =====================================================
// Get Institutions
// =====================================================

const institutions =
    JSON.parse(
        localStorage.getItem(
            "bmpInstitutions"
        )
    ) || [];


// =====================================================
// Find Institution
// =====================================================

const institution =
    institutions.find(
        item =>
            item.id === institutionId
    );


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
// Check Institution
// =====================================================

if (!institution) {

    alert("School not found.");

    window.location.href =
        "institutions.html";

} else {

    initializeClasses();
}


// =====================================================
// Initialize
// =====================================================

function initializeClasses() {

    institutionIdElement.textContent =
        institution.id || "-";

    institutionNameElement.textContent =
        institution.name || "-";

    document.title =
        `${institution.name} - Classes & Stages`;


    renderClasses();
}


// =====================================================
// Render Classes
// =====================================================

function renderClasses() {

    renderStageClasses(
        primaryClasses,
        "A",
        "Primary Class",
        6
    );


    renderStageClasses(
        preparatoryClasses,
        "B",
        "Preparatory Class",
        4
    );


    renderStageClasses(
        secondaryClasses,
        "C",
        "Secondary Class",
        3
    );
}


// =====================================================
// Render Stage Classes
// =====================================================

function renderStageClasses(
    container,
    stageLetter,
    classPrefix,
    numberOfClasses
) {

    container.innerHTML = "";


    for (
        let classNumber = 1;
        classNumber <= numberOfClasses;
        classNumber++
    ) {

        const classCode =
            `${stageLetter}${classNumber}`;


        const classItem =
            document.createElement(
                "div"
            );

        classItem.className =
            "class-item";


        classItem.innerHTML = `
            <div class="class-info">

                <span class="class-number">
                    ${classNumber}
                </span>

                <div>

                    <div class="class-name">
                        ${classPrefix} ${classNumber}
                    </div>

                    <div class="class-code">
                        Code: ${classCode}
                    </div>

                </div>

            </div>
        `;


        container.appendChild(
            classItem
        );
    }
}


// =====================================================
// Back
// =====================================================

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            `school.html?id=${encodeURIComponent(
                institutionId
            )}`;
    }
);
