// =====================================================
// BMP School Class Students
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
// URL Parameters
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const selectedStage =
    String(
        urlParams.get("stage") ||
        ""
    ).trim();


const selectedClass =
    String(
        urlParams.get("class") ||
        ""
    ).trim();


// =====================================================
// Months
// =====================================================

const months = [

    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June"

];


// =====================================================
// Data
// =====================================================

let students = [];

let payments = [];

let schoolName =
    currentUser.institutionName ||
    "";


// =====================================================
// Elements
// =====================================================

const pageTitle =
    document.getElementById(
        "pageTitle"
    );

const pageSubtitle =
    document.getElementById(
        "pageSubtitle"
    );

const institutionIdElement =
    document.getElementById(
        "institutionId"
    );

const institutionNameElement =
    document.getElementById(
        "institutionName"
    );

const academicYearFilter =
    document.getElementById(
        "academicYearFilter"
    );

const stageNameElement =
    document.getElementById(
        "stageName"
    );

const classNameElement =
    document.getElementById(
        "className"
    );

const studentCountElement =
    document.getElementById(
        "studentCount"
    );

const studentsTableBody =
    document.getElementById(
        "studentsTableBody"
    );

const monthFilter =
    document.getElementById(
        "monthFilter"
    );

const paymentStatusFilter =
    document.getElementById(
        "paymentStatusFilter"
    );

const printUnpaidButton =
    document.getElementById(
        "printUnpaidButton"
    );

const printSchoolName =
    document.getElementById(
        "printSchoolName"
    );

const printClassTitle =
    document.getElementById(
        "printClassTitle"
    );

const printPeriod =
    document.getElementById(
        "printPeriod"
    );

const printUnpaidBody =
    document.getElementById(
        "printUnpaidBody"
    );

const backButton =
    document.getElementById(
        "backButton"
    );


// =====================================================
// Stage Name
// =====================================================

function getStageName(
    stage
) {

    const names = {

        primary:
            "Primary Education",

        preparatory:
            "Preparatory Education",

        secondary:
            "Secondary Education"

    };


    return (
        names[
            String(
                stage || ""
            ).toLowerCase()
        ] ||
        stage ||
        "-"
    );

}


// =====================================================
// Current Academic Year
// =====================================================

function getCurrentAcademicYear() {

    const today =
        new Date();

    const month =
        today.getMonth() + 1;

    const year =
        today.getFullYear();


    if (
        month >= 10
    ) {

        return (
            `${year}-${year + 1}`
        );

    }


    return (
        `${year - 1}-${year}`
    );

}


// =====================================================
// Backend Request
// =====================================================

async function callApi(
    action
) {

    const requestData = {

        action:
            action,

        institutionId:
            institutionId,

        username:
            currentUser.username

    };


    console.log(
        "BMP API Request:",
        requestData
    );


    let response;


    try {

        response =
            await fetch(
                API_URL,
                {
                    method:
                        "POST",

                    redirect:
                        "follow",

                    cache:
                        "no-store",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            requestData
                        )

                }
            );

    }

    catch (error) {

        console.error(
            "BMP API Fetch Error:",
            error
        );


        throw new Error(
            "Failed to fetch Google Apps Script. Check that the Apps Script Web App is deployed and the API URL is correct."
        );

    }


    if (!response.ok) {

        throw new Error(
            "Google Apps Script returned HTTP " +
            response.status
        );

    }


    let result;


    try {

        result =
            await response.json();

    }

    catch (error) {

        console.error(
            "Invalid API response:",
            error
        );


        throw new Error(
            "The Google Apps Script returned an invalid response."
        );

    }


    console.log(
        "BMP API Response:",
        result
    );


    return result;

}


// =====================================================
// Load Class Data
// =====================================================

async function loadClassData() {

    try {

        showLoading();


        if (
            !selectedStage ||
            !selectedClass
        ) {

            throw new Error(
                "Class information is missing."
            );

        }


        // =============================================
        // Students
        // =============================================

        const studentsResult =
            await callApi(
                "getStudents"
            );


        if (
            !studentsResult ||
            !studentsResult.success
        ) {

            throw new Error(
                studentsResult &&
                studentsResult.message
                    ? studentsResult.message
                    : "Failed to load students."
            );

        }


        students =
            Array.isArray(
                studentsResult.students
            )
                ? studentsResult.students
                : [];


        // =============================================
        // Payments
        // =============================================

        const paymentsResult =
            await callApi(
                "getPayments"
            );


        if (
            !paymentsResult ||
            !paymentsResult.success
        ) {

            throw new Error(
                paymentsResult &&
                paymentsResult.message
                    ? paymentsResult.message
                    : "Failed to load payments."
            );

        }


        payments =
            Array.isArray(
                paymentsResult.payments
            )
                ? paymentsResult.payments
                : [];


        // =============================================
        // School Information
        // =============================================

        schoolName =
            currentUser.institutionName ||
            "";


        updateHeader();

        loadAcademicYears();

        renderStudents();

    }

    catch (error) {

        console.error(
            "Class page error:",
            error
        );


        showError();


        alert(
            error.message ||
            "Failed to load class information."
        );

    }

}


// =====================================================
// Update Header
// =====================================================

function updateHeader() {

    const stageName =
        getStageName(
            selectedStage
        );


    if (
        pageTitle
    ) {

        pageTitle.textContent =
            `${stageName} - Class ${selectedClass}`;

    }


    if (
        pageSubtitle
    ) {

        pageSubtitle.textContent =
            "Student payment status";

    }


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
            schoolName ||
            "-";

    }


    if (
        stageNameElement
    ) {

        stageNameElement.textContent =
            stageName;

    }


    if (
        classNameElement
    ) {

        classNameElement.textContent =
            `${stageName} ${selectedClass}`;

    }


    document.title =
        `${stageName} - Class ${selectedClass}`;

}


// =====================================================
// Academic Years
// =====================================================

function loadAcademicYears() {

    if (
        !academicYearFilter
    ) {

        return;

    }


    const years =
        [
            ...new Set(

                students
                    .map(
                        student =>
                            String(
                                student.academicYear ||
                                ""
                            ).trim()
                    )
                    .filter(
                        year =>
                            year !== ""
                    )

            )

        ]
        .sort(
            (
                a,
                b
            ) =>
                b.localeCompare(
                    a
                )
        );


    academicYearFilter.innerHTML =
        "";


    const allOption =
        document.createElement(
            "option"
        );


    allOption.value =
        "";


    allOption.textContent =
        "All Academic Years";


    academicYearFilter.appendChild(
        allOption
    );


    years.forEach(
        year => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                year;


            option.textContent =
                year;


            academicYearFilter.appendChild(
                option
            );

        }
    );


    const currentYear =
        getCurrentAcademicYear();


    if (
        years.includes(
            currentYear
        )
    ) {

        academicYearFilter.value =
            currentYear;

    }

}


// =====================================================
// Get Students In Class
// =====================================================

function getClassStudents() {

    return students.filter(
        student => {

            const stage =
                String(
                    student.stage ||
                    ""
                )
                .trim()
                .toLowerCase();


            const classNumber =
                String(
                    student.class ||
                    ""
                )
                .trim();


            if (
                stage !==
                selectedStage.toLowerCase()
            ) {

                return false;

            }


            if (
                classNumber !==
                selectedClass
            ) {

                return false;

            }


            if (
                academicYearFilter &&
                academicYearFilter.value &&
                String(
                    student.academicYear ||
                    ""
                ).trim() !==
                academicYearFilter.value
            ) {

                return false;

            }


            return true;

        }
    );

}


// =====================================================
// Check Payment
// =====================================================

function isMonthPaid(
    studentId,
    academicYear,
    month
) {

    return payments.some(
        payment => {

            return (

                String(
                    payment.studentId ||
                    ""
                ) ===
                String(
                    studentId ||
                    ""
                )

                &&

                String(
                    payment.academicYear ||
                    ""
                ) ===
                String(
                    academicYear ||
                    ""
                )

                &&

                String(
                    payment.month ||
                    ""
                ) ===
                month

            );

        }
    );

}


// =====================================================
// Get Visible Students
// =====================================================

function getVisibleStudents() {

    const classStudents =
        getClassStudents();


    const selectedMonth =
        monthFilter
            ? monthFilter.value
            : "";


    const selectedStatus =
        paymentStatusFilter
            ? paymentStatusFilter.value
            : "";


    if (
        !selectedMonth ||
        !selectedStatus
    ) {

        if (
            selectedMonth &&
            selectedStatus === ""
        ) {

            return classStudents;

        }


        return classStudents;

    }


    return classStudents.filter(
        student => {

            const studentId =
                student.studentId ||
                student.id ||
                "";


            const year =
                String(
                    student.academicYear ||
                    ""
                );


            const paid =
                isMonthPaid(
                    studentId,
                    year,
                    selectedMonth
                );


            if (
                selectedStatus ===
                "paid"
            ) {

                return paid;

            }


            if (
                selectedStatus ===
                "unpaid"
            ) {

                return !paid;

            }


            return true;

        }
    );

}


// =====================================================
// Render Students
// =====================================================

function renderStudents() {

    if (
        !studentsTableBody
    ) {

        return;

    }


    const visibleStudents =
        getVisibleStudents();


    if (
        studentCountElement
    ) {

        studentCountElement.textContent =
            visibleStudents.length;

    }


    studentsTableBody.innerHTML =
        "";


    if (
        visibleStudents.length ===
        0
    ) {

        studentsTableBody.innerHTML = `
            <tr>

                <td
                    colspan="11"
                    class="empty-state">

                    No students found.

                </td>

            </tr>
        `;

        return;

    }


    visibleStudents.sort(
        (
            a,
            b
        ) =>

            String(
                a.studentNumber ||
                ""
            ).localeCompare(
                String(
                    b.studentNumber ||
                    ""
                ),
                undefined,
                {
                    numeric:
                        true
                }
            )

    );


    visibleStudents.forEach(
        student => {

            const studentId =
                student.studentId ||
                student.id ||
                "";


            const academicYear =
                String(
                    student.academicYear ||
                    ""
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        student.studentNumber ||
                        ""
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        student.name ||
                        ""
                    )}
                </td>

                ${months.map(
                    month => {

                        const paid =
                            isMonthPaid(
                                studentId,
                                academicYear,
                                month
                            );


                        return `

                            <td>

                                <span
                                    class="status-badge ${
                                        paid
                                            ? "paid"
                                            : "unpaid"
                                    }">

                                    ${
                                        paid
                                            ? "Paid"
                                            : "Unpaid"
                                    }

                                </span>

                            </td>

                        `;

                    }

                ).join("")}

            `;


            studentsTableBody.appendChild(
                row
            );

        }
    );

}


// =====================================================
// Print Unpaid List
// =====================================================

function printUnpaidList() {

    const selectedMonth =
        monthFilter
            ? monthFilter.value
            : "";


    if (
        !selectedMonth
    ) {

        alert(
            "Please select a month first."
        );

        return;

    }


    const unpaidStudents =
        getClassStudents()
            .filter(
                student => {

                    const studentId =
                        student.studentId ||
                        student.id ||
                        "";


                    const academicYear =
                        String(
                            student.academicYear ||
                            ""
                        );


                    return !isMonthPaid(
                        studentId,
                        academicYear,
                        selectedMonth
                    );

                }
            );


    if (
        printSchoolName
    ) {

        printSchoolName.textContent =
            schoolName ||
            "School";

    }


    if (
        printClassTitle
    ) {

        printClassTitle.textContent =
            `${getStageName(
                selectedStage
            )} - Class ${selectedClass} - Unpaid Students`;

    }


    if (
        printPeriod
    ) {

        printPeriod.textContent =
            `Month: ${selectedMonth}` +
            ` | Academic Year: ` +
            (
                academicYearFilter &&
                academicYearFilter.value
                    ? academicYearFilter.value
                    : "All Academic Years"
            );

    }


    if (
        printUnpaidBody
    ) {

        printUnpaidBody.innerHTML =
            "";

    }


    if (
        unpaidStudents.length ===
        0
    ) {

        if (
            printUnpaidBody
        ) {

            printUnpaidBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="text-align:center;">

                        All students have paid.

                    </td>

                </tr>

            `;

        }

    }

    else {

        unpaidStudents.forEach(
            student => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${escapeHtml(
                            student.studentNumber ||
                            ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            student.name ||
                            ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            selectedClass
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            student.academicYear ||
                            ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            selectedMonth
                        )}
                    </td>

                    <td>
                        Unpaid
                    </td>

                `;


                printUnpaidBody.appendChild(
                    row
                );

            }
        );

    }


    window.print();

}


// =====================================================
// Filters
// =====================================================

if (
    academicYearFilter
) {

    academicYearFilter.addEventListener(
        "change",
        renderStudents
    );

}


if (
    monthFilter
) {

    monthFilter.addEventListener(
        "change",
        renderStudents
    );

}


if (
    paymentStatusFilter
) {

    paymentStatusFilter.addEventListener(
        "change",
        renderStudents
    );

}


// =====================================================
// Print
// =====================================================

if (
    printUnpaidButton
) {

    printUnpaidButton.addEventListener(
        "click",
        printUnpaidList
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
                `classes.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );

}


// =====================================================
// Loading
// =====================================================

function showLoading() {

    if (
        studentsTableBody
    ) {

        studentsTableBody.innerHTML = `
            <tr>

                <td
                    colspan="11"
                    class="empty-state">

                    Loading students...

                </td>

            </tr>
        `;

    }

}


// =====================================================
// Error
// =====================================================

function showError() {

    if (
        studentsTableBody
    ) {

        studentsTableBody.innerHTML = `
            <tr>

                <td
                    colspan="11"
                    class="empty-state">

                    Failed to load class data.

                </td>

            </tr>
        `;

    }

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
// Initialize
// =====================================================

loadClassData();
