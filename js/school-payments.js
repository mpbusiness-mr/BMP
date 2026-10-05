/* =================================
   School Payments - BMP
   ================================= */

// =====================================================
// Authentication
// =====================================================

const currentUser = requireSchoolLogin();

if (!currentUser) {
    throw new Error("School login required.");
}

const institutionId =
    getActiveInstitutionId();

if (!institutionId) {
    throw new Error("Institution access denied.");
}


// =====================================================
// Storage Keys
// =====================================================

const studentsKey = "bmpStudents";

const paymentsKey = "bmpPayments";

const institutionsKey = "bmpInstitutions";


/* =================================
   Helpers
   ================================= */

function getData(key) {
    return JSON.parse(
        localStorage.getItem(key)
    ) || [];
}

function saveData(key, data) {
    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}


/* =================================
   Institution
   ================================= */

function loadInstitution() {

    const institutions =
        getData(institutionsKey);

    const institution =
        institutions.find(
            item =>
                item.id === institutionId
        );

    if (!institution) {
        alert("Institution not found.");
        return null;
    }

    document.getElementById(
        "institutionId"
    ).textContent =
        institution.id || "-";

    document.getElementById(
        "institutionName"
    ).textContent =
        institution.name || "-";

    return institution;
}


/* =================================
   Academic Year
   ================================= */

function getCurrentAcademicYear() {

    const now = new Date();

    let year = now.getFullYear();

    /*
       School year:
       October → June
    */

    if (now.getMonth() < 9) {
        year--;
    }

    return `${year}-${year + 1}`;
}


function loadAcademicYearFilter() {

    const students =
        getData(studentsKey);

    const payments =
        getData(paymentsKey);

    const years = new Set();

    students.forEach(student => {

        if (
            student.institutionId ===
            institutionId
        ) {
            if (student.academicYear) {
                years.add(
                    student.academicYear
                );
            }
        }

    });

    payments.forEach(payment => {

        if (
            payment.institutionId ===
            institutionId
        ) {
            if (payment.academicYear) {
                years.add(
                    payment.academicYear
                );
            }
        }

    });

    const select =
        document.getElementById(
            "academicYearFilter"
        );

    const sortedYears =
        Array.from(years).sort().reverse();

    sortedYears.forEach(year => {

        const option =
            document.createElement("option");

        option.value = year;
        option.textContent = year;

        select.appendChild(option);

    });

    const currentYear =
        getCurrentAcademicYear();

    if (years.has(currentYear)) {
        select.value = currentYear;
    }

}


/* =================================
   Student Lookup
   ================================= */

function getStudent(studentId) {

    const students =
        getData(studentsKey);

    return students.find(
        student =>
            student.id === studentId &&
            student.institutionId ===
            institutionId
    );
}


/* =================================
   Load Payments
   ================================= */

function getInstitutionPayments() {

    const payments =
        getData(paymentsKey);

    return payments.filter(
        payment =>
            payment.institutionId ===
            institutionId
    );

}


/* =================================
   Render Payments
   ================================= */

function renderPayments() {

    const students =
        getData(studentsKey);

    let payments =
        getInstitutionPayments();

    const academicYear =
        document.getElementById(
            "academicYearFilter"
        ).value;

    const month =
        document.getElementById(
            "monthFilter"
        ).value;

    const stage =
        document.getElementById(
            "stageFilter"
        ).value;

    const search =
        document.getElementById(
            "searchInput"
        ).value
        .trim()
        .toLowerCase();


    /* =============================
       Filters
       ============================= */

    payments = payments.filter(payment => {

        if (
            academicYear &&
            payment.academicYear !==
            academicYear
        ) {
            return false;
        }

        if (
            month &&
            payment.month !== month
        ) {
            return false;
        }

        const student =
            students.find(
                item =>
                    item.id ===
                    payment.studentId
            );

        if (!student) {
            return false;
        }

        if (
            stage &&
            student.stage !== stage
        ) {
            return false;
        }

        if (search) {

            const studentName =
                (
                    student.name || ""
                ).toLowerCase();

            const studentNumber =
                (
                    student.studentNumber || ""
                ).toLowerCase();

            if (
                !studentName.includes(search) &&
                !studentNumber.includes(search)
            ) {
                return false;
            }

        }

        return true;

    });


    /* =============================
       Sort
       ============================= */

    payments.sort(
        (a, b) =>
            new Date(b.paymentDate) -
            new Date(a.paymentDate)
    );


    /* =============================
       Summary
       ============================= */

    const totalPayments =
        payments.length;

    const totalAmount =
        payments.reduce(
            (total, payment) =>
                total +
                Number(payment.amount || 0),
            0
        );

    document.getElementById(
        "totalPayments"
    ).textContent =
        totalPayments;

    document.getElementById(
        "totalAmount"
    ).textContent =
        totalAmount.toLocaleString();


    document.getElementById(
        "currentAcademicYear"
    ).textContent =
        academicYear ||
        getCurrentAcademicYear();


    /* =============================
       Table
       ============================= */

    const tbody =
        document.getElementById(
            "paymentsTableBody"
        );

    const emptyState =
        document.getElementById(
            "emptyState"
        );

    tbody.innerHTML = "";


    if (payments.length === 0) {

        emptyState.style.display =
            "block";

        return;

    }

    emptyState.style.display =
        "none";


    payments.forEach(payment => {

        const student =
            students.find(
                item =>
                    item.id ===
                    payment.studentId
            );

        if (!student) {
            return;
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${student.studentNumber || "-"}
            </td>

            <td>
                ${student.name || "-"}
            </td>

            <td>
                ${payment.academicYear || "-"}
            </td>

            <td>
                ${payment.month || "-"}
            </td>

            <td>
                ${Number(
                    payment.amount || 0
                ).toLocaleString()}
            </td>

            <td>
                ${formatDate(
                    payment.paymentDate
                )}
            </td>

            <td>
                ${payment.receiptNumber || "-"}
            </td>

            <td>
                ${payment.recordedBy || "-"}
            </td>

        `;

        tbody.appendChild(row);

    });

}


/* =================================
   Date Format
   ================================= */

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parsed =
        new Date(date);

    if (isNaN(parsed)) {
        return date;
    }

    return parsed.toLocaleDateString();

}


/* =================================
   Events
   ================================= */

document
    .getElementById(
        "academicYearFilter"
    )
    .addEventListener(
        "change",
        renderPayments
    );


document
    .getElementById(
        "monthFilter"
    )
    .addEventListener(
        "change",
        renderPayments
    );


document
    .getElementById(
        "stageFilter"
    )
    .addEventListener(
        "change",
        renderPayments
    );


document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        renderPayments
    );


/* =================================
   Back
   ================================= */

document
    .getElementById(
        "backButton"
    )
    .addEventListener(
        "click",
        () => {

            window.location.href =
                `school.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );


/* =================================
   Record Payment
   ================================= */

document
    .getElementById(
        "addPaymentButton"
    )
    .addEventListener(
        "click",
        () => {

            window.location.href =
                `school-record-payment.html?id=${encodeURIComponent(
                    institutionId
                )}`;

        }
    );


/* =================================
   Initialize
   ================================= */

const institution =
    loadInstitution();

if (institution) {

    loadAcademicYearFilter();

    renderPayments();

}
