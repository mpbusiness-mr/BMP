// =====================================================
// BMP Admin Backend
// =====================================================

const SPREADSHEET_ID =
    "1Ggln_MH954HffcUpcKlPAM_XuM08N_dePAyQ7XteAKI";

const SHEET_NAME = "Sheet1";


// =====================================================
// Test Google Sheets Connection
// =====================================================

function testConnection() {

    const spreadsheet =
        SpreadsheetApp.openById(
            SPREADSHEET_ID
        );

    const sheet =
        spreadsheet.getSheetByName(
            SHEET_NAME
        );

    const data =
        sheet.getDataRange().getValues();

    Logger.log(data);
}


// =====================================================
// GET API Test
// =====================================================

function doGet() {

    return jsonResponse({

        success: true,

        message:
            "BMP API is running.",

        method:
            "POST",

        status:
            "online"

    });

}


// =====================================================
// Main API
// =====================================================

function doPost(e) {

    try {

        if (
            !e ||
            !e.postData ||
            !e.postData.contents
        ) {

            return jsonResponse({

                success: false,

                message:
                    "No request data received."

            });

        }


        const data =
            JSON.parse(
                e.postData.contents
            );


        const action =
            data.action;


        // =============================================
        // Admin Login
        // =============================================

        if (
            action ===
            "adminLogin"
        ) {

            return adminLogin(
                data
            );

        }


        // =============================================
        // Create Institution
        // =============================================

        if (
            action ===
            "createInstitution"
        ) {

            return createInstitution(
                data
            );

        }


        // =============================================
        // Get Institutions
        // =============================================

        if (
            action ===
            "getInstitutions"
        ) {

            return getInstitutions();

        }


        // =============================================
        // Update Institution Status
        // =============================================

        if (
            action ===
            "updateInstitutionStatus"
        ) {

            return updateInstitutionStatus(
                data
            );

        }


        // =============================================
        // Get Students
        // =============================================

        if (
            action ===
            "getStudents"
        ) {

            return getStudents(
                data
            );

        }


        // =============================================
        // Add Student
        // =============================================

        if (
            action ===
            "addStudent"
        ) {

            return addStudent(
                data
            );

        }


        // =============================================
        // Update Student
        // =============================================

        if (
            action ===
            "updateStudent"
        ) {

            return updateStudent(
                data
            );

        }


        // =============================================
        // Get Institution Users
        // =============================================

        if (
            action ===
            "getUsers"
        ) {

            return getUsers(
                data
            );

        }


        // =============================================
        // Add Institution User
        // =============================================

        if (
            action ===
            "addUser"
        ) {

            return addUser(
                data
            );

        }


        // =============================================
        // Update User Status
        // =============================================

        if (
            action ===
            "updateUserStatus"
        ) {

            return updateUserStatus(
                data
            );

        }


        // =============================================
        // School Login
        // =============================================

        if (
            action ===
            "schoolLogin"
        ) {

            return schoolLogin(
                data
            );

        }


        // =============================================
        // Add Payment
        // =============================================

        if (
            action ===
            "addPayment"
        ) {

            return addPayment(
                data
            );

        }


        // =============================================
        // Get Payments
        // =============================================

        if (
            action ===
            "getPayments"
        ) {

            return getPayments(
                data
            );

        }


        // =============================================
        // Get Classes
        // =============================================

        if (
            action ===
            "getClasses"
        ) {

            return getClasses(
                data
            );

        }


        // =============================================
        // Get Receipt
        // =============================================

        if (
            action ===
            "getReceipt"
        ) {

            return getReceipt(
                data
            );

        }


        // =============================================
        // Get Reports
        // =============================================

        if (
            action ===
            "getReports"
        ) {

            return getReports(
                data
            );

        }


        // =============================================
        // Get School Settings
        // =============================================

        if (
            action ===
            "getSchoolSettings"
        ) {

            return getSchoolSettings(
                data
            );

        }


        // =============================================
        // Update School Settings
        // =============================================

        if (
            action ===
            "updateSchoolSettings"
        ) {

            return updateSchoolSettings(
                data
            );

        }


        // =============================================
        // Unknown Action
        // =============================================

        return jsonResponse({

            success: false,

            message:
                "Unknown action."

        });

    }

    catch (error) {

        return jsonResponse({

            success: false,

            message:
                error.message ||
                "Server error."

        });

    }

}


// =====================================================
// Admin Login
// =====================================================

function adminLogin(data) {

    const username =
        String(
            data.username || ""
        );

    const password =
        String(
            data.password || ""
        );


    const spreadsheet =
        SpreadsheetApp.openById(
            SPREADSHEET_ID
        );


    const sheet =
        spreadsheet.getSheetByName(
            SHEET_NAME
        );


    const rows =
        sheet
            .getDataRange()
            .getValues();


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const id =
            String(
                rows[i][0]
            );

        const sheetUsername =
            String(
                rows[i][1]
            );

        const sheetPassword =
            String(
                rows[i][2]
            );

        const status =
            String(
                rows[i][3]
            );


        if (
            sheetUsername === username &&
            sheetPassword === password
        ) {

            return jsonResponse({

                success: true,

                id:
                    id,

                status:
                    status

            });

        }

    }


    return jsonResponse({

        success: false,

        message:
            "Invalid username or password."

    });

}


// =====================================================
// Create Institution
// =====================================================

function createInstitution(data) {

    const type =
        String(
            data.type || ""
        );

    const name =
        String(
            data.name || ""
        );

    const phone =
        String(
            data.phone || ""
        );

    const email =
        String(
            data.email || ""
        );

    const licenseStart =
        String(
            data.licenseStart || ""
        );

    const licenseEnd =
        String(
            data.licenseEnd || ""
        );

    const username =
        String(
            data.username || ""
        );

    const password =
        String(
            data.password || ""
        );


    if (!type) {

        throw new Error(
            "Institution type is required."
        );

    }


    if (!name) {

        throw new Error(
            "Institution name is required."
        );

    }


    if (!licenseStart) {

        throw new Error(
            "License start date is required."
        );

    }


    if (!licenseEnd) {

        throw new Error(
            "License end date is required."
        );

    }


    if (!username) {

        throw new Error(
            "Main username is required."
        );

    }


    if (!password) {

        throw new Error(
            "Main password is required."
        );

    }


    const masterSpreadsheet =
        SpreadsheetApp.openById(
            SPREADSHEET_ID
        );


    let institutionsSheet =
        masterSpreadsheet.getSheetByName(
            "Institutions"
        );


    if (!institutionsSheet) {

        institutionsSheet =
            masterSpreadsheet.insertSheet(
                "Institutions"
            );


        institutionsSheet.appendRow([

            "institutionId",
            "type",
            "name",
            "phone",
            "email",
            "licenseStart",
            "licenseEnd",
            "status",
            "username",
            "sheetId",
            "sheetUrl",
            "createdAt"

        ]);

    }


    let authSheet =
        masterSpreadsheet.getSheetByName(
            "Schools Authentication"
        );


    if (!authSheet) {

        authSheet =
            masterSpreadsheet.insertSheet(
                "Schools Authentication"
            );


        authSheet.appendRow([

            "institutionId",
            "username",
            "password",
            "role",
            "status",
            "createdAt"

        ]);

    }


    const authRows =
        authSheet
            .getDataRange()
            .getValues();


    for (
        let i = 1;
        i < authRows.length;
        i++
    ) {

        const existingUsername =
            String(
                authRows[i][1]
            )
            .toLowerCase();


        if (
            existingUsername ===
            username.toLowerCase()
        ) {

            throw new Error(
                "This username is already in use."
            );

        }

    }


    const institutionId =
        generateInstitutionId(
            institutionsSheet
        );


    const institutionSpreadsheet =
        SpreadsheetApp.create(
            "BMP - " +
            name +
            " - " +
            institutionId
        );


    const institutionSpreadsheetId =
        institutionSpreadsheet.getId();


    const institutionSpreadsheetUrl =
        institutionSpreadsheet.getUrl();


    setupInstitutionSpreadsheet(
        institutionSpreadsheet,
        {
            id:
                institutionId,

            type:
                type,

            name:
                name,

            phone:
                phone,

            email:
                email,

            licenseStart:
                licenseStart,

            licenseEnd:
                licenseEnd,

            username:
                username
        }
    );


    institutionsSheet.appendRow([

        institutionId,

        type,

        name,

        phone,

        email,

        licenseStart,

        licenseEnd,

        "active",

        username,

        institutionSpreadsheetId,

        institutionSpreadsheetUrl,

        new Date()

    ]);


    authSheet.appendRow([

        institutionId,

        username,

        password,

        "Director",

        "active",

        new Date()

    ]);


    return jsonResponse({

        success: true,

        institution: {

            id:
                institutionId,

            type:
                type,

            name:
                name,

            phone:
                phone,

            email:
                email,

            licenseStart:
                licenseStart,

            licenseEnd:
                licenseEnd,

            status:
                "active",

            username:
                username,

            sheetId:
                institutionSpreadsheetId,

            sheetUrl:
                institutionSpreadsheetUrl

        }

    });

}


// =====================================================
// Get Institutions
// =====================================================

function getInstitutions() {

    const masterSpreadsheet =
        SpreadsheetApp.openById(
            SPREADSHEET_ID
        );


    const institutionsSheet =
        masterSpreadsheet.getSheetByName(
            "Institutions"
        );


    if (!institutionsSheet) {

        return jsonResponse({

            success: true,

            institutions: []

        });

    }


    const rows =
        institutionsSheet
            .getDataRange()
            .getValues();


    const institutions = [];


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        institutions.push({

            id:
                String(
                    rows[i][0] || ""
                ),

            type:
                String(
                    rows[i][1] || ""
                ),

            name:
                String(
                    rows[i][2] || ""
                ),

            phone:
                String(
                    rows[i][3] || ""
                ),

            email:
                String(
                    rows[i][4] || ""
                ),

            licenseStart:
                String(
                    rows[i][5] || ""
                ),

            licenseEnd:
                String(
                    rows[i][6] || ""
                ),

            status:
                String(
                    rows[i][7] || ""
                ),

            username:
                String(
                    rows[i][8] || ""
                ),

            sheetId:
                String(
                    rows[i][9] || ""
                ),

            sheetUrl:
                String(
                    rows[i][10] || ""
                ),

            createdAt:
                rows[i][11] instanceof Date
                    ? rows[i][11].toISOString()
                    : String(
                        rows[i][11] || ""
                    )

        });

    }


    return jsonResponse({

        success: true,

        institutions:
            institutions

    });

}


// =====================================================
// Update Institution Status
// =====================================================

function updateInstitutionStatus(data) {

    const institutionId =
        String(
            data.institutionId || ""
        );

    const newStatus =
        String(
            data.status || ""
        );


    if (!institutionId) {

        throw new Error(
            "Institution ID is required."
        );

    }


    if (
        newStatus !== "active" &&
        newStatus !== "disabled"
    ) {

        throw new Error(
            "Invalid institution status."
        );

    }


    const masterSpreadsheet =
        SpreadsheetApp.openById(
            SPREADSHEET_ID
        );


    const institutionsSheet =
        masterSpreadsheet.getSheetByName(
            "Institutions"
        );


    if (!institutionsSheet) {

        throw new Error(
            "Institutions sheet not found."
        );

    }


    const rows =
        institutionsSheet
            .getDataRange()
            .getValues();


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const existingId =
            String(
                rows[i][0] || ""
            );


        if (
            existingId ===
            institutionId
        ) {

            institutionsSheet
                .getRange(
                    i + 1,
                    8
                )
                .setValue(
                    newStatus
                );


            return jsonResponse({

                success: true,

                institutionId:
                    institutionId,

                status:
                    newStatus

            });

        }

    }


    throw new Error(
        "Institution not found."
    );

}


// =====================================================
// Get Students
// =====================================================

function getStudents(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();


    if (
        !institutionId ||
        !username
    ) {

        return jsonResponse({

            success: false,

            message:
                "Institution ID and username are required."

        });

    }


    const masterSS =
        SpreadsheetApp.openById(
            SPREADSHEET_ID
        );


    const authSheet =
        masterSS.getSheetByName(
            "Schools Authentication"
        );


    if (!authSheet) {

        return jsonResponse({

            success: false,

            message:
                "Authentication sheet not found."

        });

    }


    const authData =
        authSheet
            .getDataRange()
            .getValues();


    if (
        authData.length <= 1
    ) {

        return jsonResponse({

            success: false,

            message:
                "No school users found."

        });

    }


    const authHeaders =
        authData[0];


    const institutionIdIndex =
        authHeaders.indexOf(
            "institutionId"
        );

    const usernameIndex =
        authHeaders.indexOf(
            "username"
        );

    const statusIndex =
        authHeaders.indexOf(
            "status"
        );


    if (
        institutionIdIndex === -1 ||
        usernameIndex === -1 ||
        statusIndex === -1
    ) {

        return jsonResponse({

            success: false,

            message:
                "Authentication sheet structure is invalid."

        });

    }


    const authRow =
        authData
            .slice(1)
            .find(row =>

                String(
                    row[institutionIdIndex]
                ).trim() ===
                institutionId

                &&

                String(
                    row[usernameIndex]
                ).trim().toLowerCase() ===
                username.toLowerCase()

            );


    if (!authRow) {

        return jsonResponse({

            success: false,

            message:
                "User access denied."

        });

    }


    if (
        String(
            authRow[statusIndex]
        )
        .trim()
        .toLowerCase() !==
        "active"
    ) {

        return jsonResponse({

            success: false,

            message:
                "User account is disabled."

        });

    }


    const institution =
        getAuthenticatedInstitution(
            masterSS,
            institutionId
        );


    if (!institution) {

        return jsonResponse({

            success: false,

            message:
                "Institution not found."

        });

    }


    if (
        institution.status
            .toLowerCase() !==
        "active"
    ) {

        return jsonResponse({

            success: false,

            message:
                "Institution is disabled."

        });

    }


    if (!institution.sheetId) {

        return jsonResponse({

            success: false,

            message:
                "Institution database not found."

        });

    }


    const institutionSS =
        SpreadsheetApp.openById(
            institution.sheetId
        );


    const studentsSheet =
        institutionSS.getSheetByName(
            "Students"
        );


    if (!studentsSheet) {

        return jsonResponse({

            success: false,

            message:
                "Students sheet not found."

        });

    }


    const values =
        studentsSheet
            .getDataRange()
            .getValues();


    if (
        values.length <= 1
    ) {

        return jsonResponse({

            success: true,

            students: []

        });

    }


    const headers =
        values[0];


    const students =
        values
            .slice(1)
            .map(row => {

                const student = {};


                headers.forEach(
                    (
                        header,
                        index
                    ) => {

                        student[header] =
                            row[index];

                    }
                );


                return student;

            });


    return jsonResponse({

        success: true,

        students:
            students

    });

}


// =====================================================
// Add Student
// =====================================================

function addStudent(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();

    const academicYear =
        String(
            data.academicYear || ""
        ).trim();

    const studentName =
        String(
            data.name || ""
        ).trim();

    const stage =
        String(
            data.stage || ""
        ).trim();

    const classNumber =
        String(
            data.classNumber || ""
        ).trim();

    const registrationDate =
        String(
            data.registrationDate || ""
        ).trim();


    if (!institutionId) {

        throw new Error(
            "Institution ID is required."
        );

    }


    if (!username) {

        throw new Error(
            "Username is required."
        );

    }


    if (!academicYear) {

        throw new Error(
            "Academic year is required."
        );

    }


    if (!studentName) {

        throw new Error(
            "Student name is required."
        );

    }


    if (!stage) {

        throw new Error(
            "Stage is required."
        );

    }


    if (!classNumber) {

        throw new Error(
            "Class is required."
        );

    }


    if (!registrationDate) {

        throw new Error(
            "Registration date is required."
        );

    }


    const validStages = [
        "primary",
        "preparatory",
        "secondary"
    ];


    if (
        validStages.indexOf(
            stage
        ) === -1
    ) {

        throw new Error(
            "Invalid stage."
        );

    }


    const classLimits = {

        primary: 6,

        preparatory: 4,

        secondary: 3

    };


    const classValue =
        parseInt(
            classNumber,
            10
        );


    if (
        isNaN(classValue) ||
        classValue < 1 ||
        classValue >
            classLimits[stage]
    ) {

        throw new Error(
            "Invalid class."
        );

    }


    const lock =
        LockService.getScriptLock();


    lock.waitLock(
        30000
    );


    try {

        const masterSS =
            SpreadsheetApp.openById(
                SPREADSHEET_ID
            );


        const authenticated =
            authenticateSchoolUser(
                masterSS,
                institutionId,
                username
            );


        if (!authenticated.success) {

            throw new Error(
                authenticated.message
            );

        }


        const institution =
            getAuthenticatedInstitution(
                masterSS,
                institutionId
            );


        if (!institution) {

            throw new Error(
                "Institution not found."
            );

        }


        if (
            institution.status
                .toLowerCase() !==
            "active"
        ) {

            throw new Error(
                "Institution is disabled."
            );

        }


        if (!institution.sheetId) {

            throw new Error(
                "Institution database not found."
            );

        }


        const institutionSS =
            SpreadsheetApp.openById(
                institution.sheetId
            );


        let studentsSheet =
            institutionSS.getSheetByName(
                "Students"
            );


        if (!studentsSheet) {

            studentsSheet =
                institutionSS.insertSheet(
                    "Students"
                );

            studentsSheet.appendRow([

                "studentId",
                "studentNumber",
                "academicYear",
                "name",
                "stage",
                "class",
                "registrationDate",
                "createdAt"

            ]);

        }


        let headers =
            studentsSheet
                .getRange(
                    1,
                    1,
                    1,
                    studentsSheet.getLastColumn()
                )
                .getValues()[0];


        if (
            headers.indexOf(
                "registrationDate"
            ) === -1
        ) {

            const newColumn =
                studentsSheet.getLastColumn() + 1;


            studentsSheet
                .getRange(
                    1,
                    newColumn
                )
                .setValue(
                    "registrationDate"
                );


            headers.push(
                "registrationDate"
            );

        }


        const lastRow =
            studentsSheet.getLastRow();


        let rows = [];


        if (
            lastRow > 1
        ) {

            rows =
                studentsSheet
                    .getRange(
                        2,
                        1,
                        lastRow - 1,
                        studentsSheet.getLastColumn()
                    )
                    .getValues();

        }


        const stageLetter =
            getStudentStageLetter(
                stage
            );


        let highestNumber =
            0;


        const academicYearIndex =
            headers.indexOf(
                "academicYear"
            );

        const studentNumberIndex =
            headers.indexOf(
                "studentNumber"
            );

        const stageIndex =
            headers.indexOf(
                "stage"
            );

        const classIndex =
            headers.indexOf(
                "class"
            );


        rows.forEach(
            row => {

                const rowAcademicYear =
                    String(
                        row[
                            academicYearIndex
                        ] || ""
                    ).trim();

                const rowStage =
                    String(
                        row[
                            stageIndex
                        ] || ""
                    ).trim();

                const rowClass =
                    String(
                        row[
                            classIndex
                        ] || ""
                    ).trim();


                if (
                    rowAcademicYear !==
                        academicYear
                    ||
                    rowStage !==
                        stage
                    ||
                    rowClass !==
                        classNumber
                ) {

                    return;

                }


                const existingNumber =
                    String(
                        row[
                            studentNumberIndex
                        ] || ""
                    ).trim();


                const pattern =
                    new RegExp(
                        "^" +
                        stageLetter +
                        classNumber +
                        "(\\d{3})$"
                    );


                const match =
                    existingNumber.match(
                        pattern
                    );


                if (match) {

                    const number =
                        parseInt(
                            match[1],
                            10
                        );


                    if (
                        number >
                        highestNumber
                    ) {

                        highestNumber =
                            number;

                    }

                }

            }
        );


        const nextNumber =
            highestNumber + 1;


        const formattedNumber =
            String(
                nextNumber
            ).padStart(
                3,
                "0"
            );


        const studentNumber =
            stageLetter +
            classNumber +
            formattedNumber;


        const duplicate =
            rows.some(
                row => {

                    const existing =
                        String(
                            row[
                                studentNumberIndex
                            ] || ""
                        ).trim();


                    return (
                        existing ===
                        studentNumber
                    );

                }
            );


        if (duplicate) {

            throw new Error(
                "This student number already exists. Please try again."
            );

        }


        const studentId =
            generateStudentId();


        const createdAt =
            new Date();


        const newRow =
            new Array(
                headers.length
            ).fill("");


        setColumnValue(
            newRow,
            headers,
            "studentId",
            studentId
        );

        setColumnValue(
            newRow,
            headers,
            "studentNumber",
            studentNumber
        );

        setColumnValue(
            newRow,
            headers,
            "academicYear",
            academicYear
        );

        setColumnValue(
            newRow,
            headers,
            "name",
            studentName
        );

        setColumnValue(
            newRow,
            headers,
            "stage",
            stage
        );

        setColumnValue(
            newRow,
            headers,
            "class",
            classNumber
        );

        setColumnValue(
            newRow,
            headers,
            "registrationDate",
            registrationDate
        );

        setColumnValue(
            newRow,
            headers,
            "createdAt",
            createdAt
        );


        studentsSheet.appendRow(
            newRow
        );


        logActivityBackend(
            institutionSS,
            {
                username:
                    authenticated.username,

                role:
                    authenticated.role,

                action:
                    "Registered Student",

                details:
                    "Registered student \"" +
                    studentName +
                    "\" - " +
                    studentNumber +
                    " - Academic Year: " +
                    academicYear
            }
        );


        return jsonResponse({

            success: true,

            student: {

                studentId:
                    studentId,

                studentNumber:
                    studentNumber,

                academicYear:
                    academicYear,

                name:
                    studentName,

                stage:
                    stage,

                class:
                    classNumber,

                registrationDate:
                    registrationDate,

                createdAt:
                    createdAt.toISOString(),

                registeredBy:
                    authenticated.username

            }

        });

    }

    finally {

        lock.releaseLock();

    }

}


// =====================================================
// Update Student
// =====================================================

function updateStudent(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();

    const studentId =
        String(
            data.studentId || ""
        ).trim();

    const studentName =
        String(
            data.name || ""
        ).trim();

    const stage =
        String(
            data.stage || ""
        ).trim();

    const registrationDate =
        String(
            data.registrationDate || ""
        ).trim();

    const classNumber =
        parseInt(
            data.classNumber,
            10
        );


    if (!institutionId) {

        throw new Error(
            "Institution ID is required."
        );

    }


    if (!username) {

        throw new Error(
            "Username is required."
        );

    }


    if (!studentId) {

        throw new Error(
            "Student ID is required."
        );

    }


    if (!studentName) {

        throw new Error(
            "Student name is required."
        );

    }


    if (!stage) {

        throw new Error(
            "Stage is required."
        );

    }


    if (!registrationDate) {

        throw new Error(
            "Registration date is required."
        );

    }


    const validStages = [
        "primary",
        "preparatory",
        "secondary"
    ];


    if (
        validStages.indexOf(
            stage
        ) === -1
    ) {

        throw new Error(
            "Invalid stage."
        );

    }


    const classLimits = {

        primary: 6,

        preparatory: 4,

        secondary: 3

    };


    if (
        isNaN(classNumber) ||
        classNumber < 1 ||
        classNumber >
            classLimits[stage]
    ) {

        throw new Error(
            "Invalid class."
        );

    }


    const lock =
        LockService.getScriptLock();


    lock.waitLock(
        30000
    );


    try {

        const masterSS =
            SpreadsheetApp.openById(
                SPREADSHEET_ID
            );


        const authenticated =
            authenticateSchoolUser(
                masterSS,
                institutionId,
                username
            );


        if (!authenticated.success) {

            throw new Error(
                authenticated.message
            );

        }


        const institution =
            getAuthenticatedInstitution(
                masterSS,
                institutionId
            );


        if (!institution) {

            throw new Error(
                "Institution not found."
            );

        }


        if (
            String(
                institution.status || ""
            )
            .toLowerCase() !==
            "active"
        ) {

            throw new Error(
                "Institution is disabled."
            );

        }


        if (!institution.sheetId) {

            throw new Error(
                "Institution database not found."
            );

        }


        const institutionSS =
            SpreadsheetApp.openById(
                institution.sheetId
            );


        const studentsSheet =
            institutionSS.getSheetByName(
                "Students"
            );


        if (!studentsSheet) {

            throw new Error(
                "Students sheet not found."
            );

        }


        const lastRow =
            studentsSheet.getLastRow();

        const lastColumn =
            studentsSheet.getLastColumn();


        if (
            lastRow <= 1 ||
            lastColumn <= 0
        ) {

            throw new Error(
                "Student not found."
            );

        }


        const values =
            studentsSheet
                .getRange(
                    1,
                    1,
                    lastRow,
                    lastColumn
                )
                .getValues();


        const headers =
            values[0].map(
                header =>
                    String(
                        header
                    ).trim()
            );


        const studentIdIndex =
            headers.indexOf(
                "studentId"
            );

        const studentNumberIndex =
            headers.indexOf(
                "studentNumber"
            );

        const academicYearIndex =
            headers.indexOf(
                "academicYear"
            );

        const nameIndex =
            headers.indexOf(
                "name"
            );

        const stageIndex =
            headers.indexOf(
                "stage"
            );

        const classIndex =
            headers.indexOf(
                "class"
            );

        const registrationDateIndex =
            headers.indexOf(
                "registrationDate"
            );


        if (
            studentIdIndex === -1 ||
            studentNumberIndex === -1 ||
            academicYearIndex === -1 ||
            nameIndex === -1 ||
            stageIndex === -1 ||
            classIndex === -1 ||
            registrationDateIndex === -1
        ) {

            throw new Error(
                "Students sheet structure is invalid."
            );

        }


        let foundRow =
            -1;

        let oldStudent =
            null;


        for (
            let i = 1;
            i < values.length;
            i++
        ) {

            const row =
                values[i];


            const rowStudentId =
                String(
                    row[
                        studentIdIndex
                    ] || ""
                ).trim();


            if (
                rowStudentId ===
                studentId
            ) {

                foundRow =
                    i + 1;

                oldStudent =
                    row;

                break;

            }

        }


        if (
            foundRow === -1 ||
            !oldStudent
        ) {

            throw new Error(
                "Student not found."
            );

        }


        const oldStudentNumber =
            oldStudent[
                studentNumberIndex
            ];


        const oldAcademicYear =
            oldStudent[
                academicYearIndex
            ];


        studentsSheet
            .getRange(
                foundRow,
                nameIndex + 1
            )
            .setValue(
                studentName
            );


        studentsSheet
            .getRange(
                foundRow,
                stageIndex + 1
            )
            .setValue(
                stage
            );


        studentsSheet
            .getRange(
                foundRow,
                classIndex + 1
            )
            .setValue(
                classNumber
            );


        studentsSheet
            .getRange(
                foundRow,
                registrationDateIndex + 1
            )
            .setValue(
                registrationDate
            );


        logActivityBackend(
            institutionSS,
            {
                username:
                    authenticated.username,

                role:
                    authenticated.role,

                action:
                    "Edited Student",

                details:
                    "Edited student \"" +
                    studentName +
                    "\" - Student Number: " +
                    String(
                        oldStudentNumber
                    ) +
                    " - Academic Year: " +
                    String(
                        oldAcademicYear
                    ) +
                    " - Stage: " +
                    stage +
                    " - Class: " +
                    classNumber
            }
        );


        return jsonResponse({

            success: true,

            message:
                "Student updated successfully.",

            student: {

                studentId:
                    studentId,

                studentNumber:
                    oldStudentNumber,

                academicYear:
                    oldAcademicYear,

                name:
                    studentName,

                stage:
                    stage,

                class:
                    classNumber,

                registrationDate:
                    registrationDate,

                updatedBy:
                    authenticated.username,

                updatedAt:
                    new Date().toISOString()

            }

        });

    }

    finally {

        lock.releaseLock();

    }

}


// =====================================================
// Get Institution Users
// =====================================================

function getUsers(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();


    if (!institutionId) {

        throw new Error(
            "Institution ID is required."
        );

    }


    if (!username) {

        throw new Error(
            "Username is required."
        );

    }


    const masterSS =
        SpreadsheetApp.openById(
            SPREADSHEET_ID
        );


    const authenticated =
        authenticateSchoolUser(
            masterSS,
            institutionId,
            username
        );


    if (!authenticated.success) {

        throw new Error(
            authenticated.message
        );

    }


    if (
        String(
            authenticated.role || ""
        ).toLowerCase() !==
        "director"
    ) {

        throw new Error(
            "Only the Director can manage users."
        );

    }


    const institution =
        getAuthenticatedInstitution(
            masterSS,
            institutionId
        );


    if (!institution) {

        throw new Error(
            "Institution not found."
        );

    }


    if (
        String(
            institution.status || ""
        ).toLowerCase() !==
        "active"
    ) {

        throw new Error(
            "Institution is disabled."
        );

    }


    if (!institution.sheetId) {

        throw new Error(
            "Institution database not found."
        );

    }


    const institutionSS =
        SpreadsheetApp.openById(
            institution.sheetId
        );


    let usersSheet =
        institutionSS.getSheetByName(
            "Users"
        );


    if (!usersSheet) {

        usersSheet =
            institutionSS.insertSheet(
                "Users"
            );

        usersSheet.appendRow([

            "userId",
            "username",
            "role",
            "status",
            "createdAt",
            "permissions"

        ]);

    }


    const lastRow =
        usersSheet.getLastRow();

    const lastColumn =
        usersSheet.getLastColumn();


    if (
        lastRow <= 1 ||
        lastColumn <= 0
    ) {

        return jsonResponse({

            success: true,

            users: []

        });

    }


    const values =
        usersSheet
            .getRange(
                1,
                1,
                lastRow,
                lastColumn
            )
            .getValues();


    const headers =
        values[0].map(
            header =>
                String(
                    header
                ).trim()
        );


    const userIdIndex =
        headers.indexOf(
            "userId"
        );

    const usernameIndex =
        headers.indexOf(
            "username"
        );

    const roleIndex =
        headers.indexOf(
            "role"
        );

    const statusIndex =
        headers.indexOf(
            "status"
        );

    const createdAtIndex =
        headers.indexOf(
            "createdAt"
        );

    const permissionsIndex =
        headers.indexOf(
            "permissions"
        );


    if (
        usernameIndex === -1
    ) {

        throw new Error(
            "Users sheet structure is invalid."
        );

    }


    const users = [];


    for (
        let i = 1;
        i < values.length;
        i++
    ) {

        const row =
            values[i];


        if (
            row.every(
                value =>
                    value === "" ||
                    value === null
            )
        ) {

            continue;

        }


        let permissions = {

            students: true,

            payments: true,

            reports: true,

            receipts: true,

            transactions: true,

            manageUsers: false

        };


        if (
            permissionsIndex !== -1 &&
            row[permissionsIndex]
        ) {

            try {

                permissions =
                    JSON.parse(
                        String(
                            row[
                                permissionsIndex
                            ]
                        )
                    );

            }

            catch (error) {

            }

        }


        if (
            roleIndex !== -1 &&
            String(
                row[
                    roleIndex
                ] || ""
            ).toLowerCase() ===
            "director"
        ) {

            permissions.manageUsers =
                true;

        }


        users.push({

            id:
                userIdIndex !== -1
                    ? String(
                        row[
                            userIdIndex
                        ] || ""
                    )
                    : "",

            userId:
                userIdIndex !== -1
                    ? String(
                        row[
                            userIdIndex
                        ] || ""
                    )
                    : "",

            username:
                String(
                    row[
                        usernameIndex
                    ] || ""
                ),

            role:
                roleIndex !== -1
                    ? String(
                        row[
                            roleIndex
                        ] || ""
                    )
                    : "",

            status:
                statusIndex !== -1
                    ? String(
                        row[
                            statusIndex
                        ] || ""
                    )
                    : "",

            createdAt:
                createdAtIndex !== -1 &&
                row[
                    createdAtIndex
                ] instanceof Date
                    ? row[
                        createdAtIndex
                    ].toISOString()
                    : String(
                        createdAtIndex !== -1
                            ? row[
                                createdAtIndex
                            ] || ""
                            : ""
                    ),

            permissions:
                permissions

        });

    }


    return jsonResponse({

        success: true,

        users:
            users

    });

}


// =====================================================
// Add Institution User
// =====================================================

function addUser(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const requesterUsername =
        String(
            data.username || ""
        ).trim();

    const newUsername =
        String(
            data.newUsername || ""
        ).trim();


    const password =
        String(
            data.password ||
            data.newPassword ||
            ""
        );


    if (!institutionId) {

        throw new Error(
            "Institution ID is required."
        );

    }


    if (!requesterUsername) {

        throw new Error(
            "Requesting username is required."
        );

    }


    if (!newUsername) {

        throw new Error(
            "New username is required."
        );

    }


    if (!password) {

        throw new Error(
            "Password is required."
        );

    }


    if (
        newUsername.length < 3
    ) {

        throw new Error(
            "Username must contain at least 3 characters."
        );

    }


    if (
        password.length < 4
    ) {

        throw new Error(
            "Password must contain at least 4 characters."
        );

    }


    const lock =
        LockService.getScriptLock();


    lock.waitLock(
        30000
    );


    try {

        const masterSS =
            SpreadsheetApp.openById(
                SPREADSHEET_ID
            );


        const authenticated =
            authenticateSchoolUser(
                masterSS,
                institutionId,
                requesterUsername
            );


        if (!authenticated.success) {

            throw new Error(
                authenticated.message
            );

        }


        if (
            String(
                authenticated.role || ""
            ).toLowerCase() !==
            "director"
        ) {

            throw new Error(
                "Only the Director can add users."
            );

        }


        const institution =
            getAuthenticatedInstitution(
                masterSS,
                institutionId
            );


        if (!institution) {

            throw new Error(
                "Institution not found."
            );

        }


        if (
            String(
                institution.status || ""
            ).toLowerCase() !==
            "active"
        ) {

            throw new Error(
                "Institution is disabled."
            );

        }


        if (!institution.sheetId) {

            throw new Error(
                "Institution database not found."
            );

        }


        const authSheet =
            masterSS.getSheetByName(
                "Schools Authentication"
            );


        if (!authSheet) {

            throw new Error(
                "Authentication sheet not found."
            );

        }


        const authValues =
            authSheet
                .getDataRange()
                .getValues();


        if (
            authValues.length === 0
        ) {

            throw new Error(
                "Authentication sheet is empty."
            );

        }


        const authHeaders =
            authValues[0];


        const authUsernameIndex =
            authHeaders.indexOf(
                "username"
            );


        if (
            authUsernameIndex === -1
        ) {

            throw new Error(
                "Authentication sheet structure is invalid."
            );

        }


        for (
            let i = 1;
            i < authValues.length;
            i++
        ) {

            const existingUsername =
                String(
                    authValues[i][
                        authUsernameIndex
                    ] || ""
                )
                .trim()
                .toLowerCase();


            if (
                existingUsername ===
                newUsername.toLowerCase()
            ) {

                throw new Error(
                    "This username is already in use."
                );

            }

        }


        const institutionSS =
            SpreadsheetApp.openById(
                institution.sheetId
            );


        let usersSheet =
            institutionSS.getSheetByName(
                "Users"
            );


        if (!usersSheet) {

            usersSheet =
                institutionSS.insertSheet(
                    "Users"
                );

            usersSheet.appendRow([

                "userId",
                "username",
                "role",
                "status",
                "createdAt",
                "permissions"

            ]);

        }


        let lastColumn =
            usersSheet.getLastColumn();


        let headers =
            usersSheet
                .getRange(
                    1,
                    1,
                    1,
                    lastColumn
                )
                .getValues()[0]
                .map(
                    header =>
                        String(
                            header
                        ).trim()
                );


        if (
            headers.indexOf(
                "permissions"
            ) === -1
        ) {

            lastColumn++;

            usersSheet
                .getRange(
                    1,
                    lastColumn
                )
                .setValue(
                    "permissions"
                );

            headers.push(
                "permissions"
            );

        }


        const userId =
            "USR-" +
            Utilities.getUuid();


        const permissions = {

            students: true,

            payments: true,

            reports: true,

            receipts: true,

            transactions: true,

            manageUsers: false

        };


        const newRow =
            new Array(
                headers.length
            ).fill("");


        setColumnValue(
            newRow,
            headers,
            "userId",
            userId
        );

        setColumnValue(
            newRow,
            headers,
            "username",
            newUsername
        );

        setColumnValue(
            newRow,
            headers,
            "role",
            "User"
        );

        setColumnValue(
            newRow,
            headers,
            "status",
            "active"
        );

        setColumnValue(
            newRow,
            headers,
            "createdAt",
            new Date()
        );

        setColumnValue(
            newRow,
            headers,
            "permissions",
            JSON.stringify(
                permissions
            )
        );


        usersSheet.appendRow(
            newRow
        );


        const now =
            new Date();


        const masterAuthRow =
            new Array(
                authHeaders.length
            ).fill("");


        setColumnValue(
            masterAuthRow,
            authHeaders,
            "institutionId",
            institutionId
        );

        setColumnValue(
            masterAuthRow,
            authHeaders,
            "username",
            newUsername
        );

        setColumnValue(
            masterAuthRow,
            authHeaders,
            "password",
            password
        );

        setColumnValue(
            masterAuthRow,
            authHeaders,
            "role",
            "User"
        );

        setColumnValue(
            masterAuthRow,
            authHeaders,
            "status",
            "active"
        );

        setColumnValue(
            masterAuthRow,
            authHeaders,
            "createdAt",
            now
        );


        authSheet.appendRow(
            masterAuthRow
        );


        logActivityBackend(
            institutionSS,
            {

                username:
                    authenticated.username,

                role:
                    authenticated.role,

                action:
                    "Added User",

                details:
                    "Added user \"" +
                    newUsername +
                    "\" with role User."

            }
        );


        return jsonResponse({

            success: true,

            message:
                "User created successfully.",

            user: {

                userId:
                    userId,

                username:
                    newUsername,

                role:
                    "User",

                status:
                    "active",

                permissions:
                    permissions,

                createdAt:
                    now.toISOString()

            }

        });

    }

    finally {

        lock.releaseLock();

    }

}


// =====================================================
// Update User Status
// =====================================================

function updateUserStatus(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const requesterUsername =
        String(
            data.username || ""
        ).trim();

    const targetUserId =
        String(
            data.userId || ""
        ).trim();

    const newStatus =
        String(
            data.status || ""
        ).trim().toLowerCase();


    if (!institutionId) {

        throw new Error(
            "Institution ID is required."
        );

    }


    if (!requesterUsername) {

        throw new Error(
            "Username is required."
        );

    }


    if (!targetUserId) {

        throw new Error(
            "User ID is required."
        );

    }


    if (
        newStatus !== "active" &&
        newStatus !== "disabled"
    ) {

        throw new Error(
            "Invalid user status."
        );

    }


    const lock =
        LockService.getScriptLock();


    lock.waitLock(
        30000
    );


    try {

        const masterSS =
            SpreadsheetApp.openById(
                SPREADSHEET_ID
            );


        const authenticated =
            authenticateSchoolUser(
                masterSS,
                institutionId,
                requesterUsername
            );


        if (!authenticated.success) {

            throw new Error(
                authenticated.message
            );

        }


        if (
            String(
                authenticated.role || ""
            ).toLowerCase() !==
            "director"
        ) {

            throw new Error(
                "Only the Director can change user status."
            );

        }


        const institution =
            getAuthenticatedInstitution(
                masterSS,
                institutionId
            );


        if (!institution) {

            throw new Error(
                "Institution not found."
            );

        }


        if (
            String(
                institution.status || ""
            ).toLowerCase() !==
            "active"
        ) {

            throw new Error(
                "Institution is disabled."
            );

        }


        if (!institution.sheetId) {

            throw new Error(
                "Institution database not found."
            );

        }


        const institutionSS =
            SpreadsheetApp.openById(
                institution.sheetId
            );


        const usersSheet =
            institutionSS.getSheetByName(
                "Users"
            );


        if (!usersSheet) {

            throw new Error(
                "Users sheet not found."
            );

        }


        const lastRow =
            usersSheet.getLastRow();

        const lastColumn =
            usersSheet.getLastColumn();


        if (
            lastRow <= 1
        ) {

            throw new Error(
                "User not found."
            );

        }


        const values =
            usersSheet
                .getRange(
                    1,
                    1,
                    lastRow,
                    lastColumn
                )
                .getValues();


        const headers =
            values[0].map(
                header =>
                    String(
                        header
                    ).trim()
            );


        const userIdIndex =
            headers.indexOf(
                "userId"
            );

        const usernameIndex =
            headers.indexOf(
                "username"
            );

        const roleIndex =
            headers.indexOf(
                "role"
            );

        const statusIndex =
            headers.indexOf(
                "status"
            );


        if (
            userIdIndex === -1 ||
            usernameIndex === -1 ||
            roleIndex === -1 ||
            statusIndex === -1
        ) {

            throw new Error(
                "Users sheet structure is invalid."
            );

        }


        let foundRow =
            -1;

        let targetUsername =
            "";

        let targetRole =
            "";


        for (
            let i = 1;
            i < values.length;
            i++
        ) {

            const row =
                values[i];


            const rowUserId =
                String(
                    row[
                        userIdIndex
                    ] || ""
                ).trim();


            if (
                rowUserId ===
                targetUserId
            ) {

                foundRow =
                    i + 1;

                targetUsername =
                    String(
                        row[
                            usernameIndex
                        ] || ""
                    ).trim();

                targetRole =
                    String(
                        row[
                            roleIndex
                        ] || ""
                    ).trim();

                break;

            }

        }


        if (
            foundRow === -1
        ) {

            throw new Error(
                "User not found."
            );

        }


        if (
            targetRole.toLowerCase() ===
            "director"
        ) {

            throw new Error(
                "The Director account cannot be disabled."
            );

        }


        usersSheet
            .getRange(
                foundRow,
                statusIndex + 1
            )
            .setValue(
                newStatus
            );


        const authSheet =
            masterSS.getSheetByName(
                "Schools Authentication"
            );


        if (!authSheet) {

            throw new Error(
                "Authentication sheet not found."
            );

        }


        const authLastRow =
            authSheet.getLastRow();

        const authLastColumn =
            authSheet.getLastColumn();


        if (
            authLastRow <= 1
        ) {

            throw new Error(
                "User authentication record not found."
            );

        }


        const authValues =
            authSheet
                .getRange(
                    1,
                    1,
                    authLastRow,
                    authLastColumn
                )
                .getValues();


        const authHeaders =
            authValues[0];


        const authInstitutionIndex =
            authHeaders.indexOf(
                "institutionId"
            );

        const authUsernameIndex =
            authHeaders.indexOf(
                "username"
            );

        const authStatusIndex =
            authHeaders.indexOf(
                "status"
            );


        if (
            authInstitutionIndex === -1 ||
            authUsernameIndex === -1 ||
            authStatusIndex === -1
        ) {

            throw new Error(
                "Authentication sheet structure is invalid."
            );

        }


        let authRowFound =
            false;


        for (
            let i = 1;
            i < authValues.length;
            i++
        ) {

            const rowInstitutionId =
                String(
                    authValues[i][
                        authInstitutionIndex
                    ] || ""
                ).trim();

            const rowUsername =
                String(
                    authValues[i][
                        authUsernameIndex
                    ] || ""
                ).trim();


            if (
                rowInstitutionId ===
                    institutionId
                &&
                rowUsername.toLowerCase() ===
                    targetUsername.toLowerCase()
            ) {

                authSheet
                    .getRange(
                        i + 1,
                        authStatusIndex + 1
                    )
                    .setValue(
                        newStatus
                    );


                authRowFound =
                    true;

                break;

            }

        }


        if (!authRowFound) {

            throw new Error(
                "User authentication record not found."
            );

        }


        const action =
            newStatus === "disabled"
                ? "Disabled User"
                : "Enabled User";


        logActivityBackend(
            institutionSS,
            {

                username:
                    authenticated.username,

                role:
                    authenticated.role,

                action:
                    action,

                details:
                    action +
                    " \"" +
                    targetUsername +
                    "\"."

            }
        );


        return jsonResponse({

            success: true,

            message:
                newStatus === "disabled"
                    ? "User disabled successfully."
                    : "User enabled successfully.",

            user: {

                userId:
                    targetUserId,

                username:
                    targetUsername,

                role:
                    targetRole,

                status:
                    newStatus

            }

        });

    }

    finally {

        lock.releaseLock();

    }

}


// =====================================================
// School Login
// =====================================================

function schoolLogin(data) {

    const username =
        String(
            data.username || ""
        )
        .trim();

    const password =
        String(
            data.password || ""
        );


    if (!username) {

        return jsonResponse({

            success: false,

            message:
                "Username is required."

        });

    }


    if (!password) {

        return jsonResponse({

            success: false,

            message:
                "Password is required."

        });

    }


    const masterSpreadsheet =
        SpreadsheetApp.openById(
            SPREADSHEET_ID
        );


    const authSheet =
        masterSpreadsheet.getSheetByName(
            "Schools Authentication"
        );


    if (!authSheet) {

        return jsonResponse({

            success: false,

            message:
                "Authentication sheet not found."

        });

    }


    const authRows =
        authSheet
            .getDataRange()
            .getValues();


    let authenticatedUser =
        null;


    for (
        let i = 1;
        i < authRows.length;
        i++
    ) {

        const rowUsername =
            String(
                authRows[i][1] || ""
            )
            .trim();

        const rowPassword =
            String(
                authRows[i][2] || ""
            );


        if (
            rowUsername.toLowerCase() ===
            username.toLowerCase() &&
            rowPassword ===
            password
        ) {

            authenticatedUser = {

                institutionId:
                    String(
                        authRows[i][0] || ""
                    ),

                username:
                    rowUsername,

                role:
                    String(
                        authRows[i][3] || ""
                    ),

                status:
                    String(
                        authRows[i][4] || ""
                    )

            };

            break;

        }

    }


    if (!authenticatedUser) {

        return jsonResponse({

            success: false,

            message:
                "Invalid username or password."

        });

    }


    if (
        authenticatedUser.status
            .toLowerCase() !==
        "active"
    ) {

        return jsonResponse({

            success: false,

            message:
                "This user account is disabled."

        });

    }


    const institutionsSheet =
        masterSpreadsheet.getSheetByName(
            "Institutions"
        );


    if (!institutionsSheet) {

        return jsonResponse({

            success: false,

            message:
                "Institutions sheet not found."

        });

    }


    const institutionRows =
        institutionsSheet
            .getDataRange()
            .getValues();


    let institution =
        null;


    for (
        let i = 1;
        i < institutionRows.length;
        i++
    ) {

        const rowId =
            String(
                institutionRows[i][0] || ""
            );


        if (
            rowId ===
            authenticatedUser.institutionId
        ) {

            institution = {

                id:
                    rowId,

                type:
                    String(
                        institutionRows[i][1] || ""
                    ),

                name:
                    String(
                        institutionRows[i][2] || ""
                    ),

                phone:
                    String(
                        institutionRows[i][3] || ""
                    ),

                email:
                    String(
                        institutionRows[i][4] || ""
                    ),

                licenseStart:
                    String(
                        institutionRows[i][5] || ""
                    ),

                licenseEnd:
                    String(
                        institutionRows[i][6] || ""
                    ),

                status:
                    String(
                        institutionRows[i][7] || ""
                    ),

                username:
                    String(
                        institutionRows[i][8] || ""
                    ),

                sheetId:
                    String(
                        institutionRows[i][9] || ""
                    ),

                sheetUrl:
                    String(
                        institutionRows[i][10] || ""
                    )

            };

            break;

        }

    }


    if (!institution) {

        return jsonResponse({

            success: false,

            message:
                "Institution not found."

        });

    }


    if (
        institution.status
            .toLowerCase() !==
        "active"
    ) {

        return jsonResponse({

            success: false,

            message:
                "This institution is disabled."

        });

    }


    if (
        institution.licenseEnd
    ) {

        const licenseEnd =
            new Date(
                institution.licenseEnd
            );

        const now =
            new Date();


        if (
            !isNaN(
                licenseEnd.getTime()
            ) &&
            now >
            licenseEnd
        ) {

            return jsonResponse({

                success: false,

                message:
                    "The institution license has expired."

            });

        }

    }


    return jsonResponse({

        success: true,

        user: {

            id:
                authenticatedUser.institutionId,

            username:
                authenticatedUser.username,

            role:
                authenticatedUser.role,

            status:
                authenticatedUser.status,

            institutionId:
                institution.id,

            institutionType:
                institution.type,

            institutionName:
                institution.name,

            institutionPhone:
                institution.phone,

            institutionEmail:
                institution.email,

            licenseStart:
                institution.licenseStart,

            licenseEnd:
                institution.licenseEnd,

            sheetId:
                institution.sheetId,

            loginTime:
                new Date().toISOString()

        }

    });

}


// =====================================================
// ADD PAYMENT
// =====================================================

function addPayment(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();

    const studentId =
        String(
            data.studentId || ""
        ).trim();

    const academicYear =
        String(
            data.academicYear || ""
        ).trim();

    const month =
        String(
            data.month || ""
        ).trim();

    const amount =
        Number(
            data.amount || 0
        );

    const paymentDate =
        String(
            data.paymentDate ||
            data.date ||
            ""
        ).trim();

    const notes =
        String(
            data.notes || ""
        ).trim();


    if (!institutionId) {

        throw new Error(
            "Institution ID is required."
        );

    }


    if (!username) {

        throw new Error(
            "Username is required."
        );

    }


    if (!studentId) {

        throw new Error(
            "Student ID is required."
        );

    }


    if (!academicYear) {

        throw new Error(
            "Academic year is required."
        );

    }


    if (!month) {

        throw new Error(
            "Month is required."
        );

    }


    if (
        !amount ||
        amount <= 0
    ) {

        throw new Error(
            "A valid payment amount is required."
        );

    }


    if (!paymentDate) {

        throw new Error(
            "Payment date is required."
        );

    }


    const validMonths = [

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


    if (
        validMonths.indexOf(
            month
        ) === -1
    ) {

        throw new Error(
            "Invalid payment month."
        );

    }


    const lock =
        LockService.getScriptLock();


    lock.waitLock(
        30000
    );


    try {

        const masterSS =
            SpreadsheetApp.openById(
                SPREADSHEET_ID
            );


        const authenticated =
            authenticateSchoolUser(
                masterSS,
                institutionId,
                username
            );


        if (!authenticated.success) {

            throw new Error(
                authenticated.message
            );

        }


        const institution =
            getAuthenticatedInstitution(
                masterSS,
                institutionId
            );


        if (!institution) {

            throw new Error(
                "Institution not found."
            );

        }


        if (
            String(
                institution.status || ""
            )
            .toLowerCase() !==
            "active"
        ) {

            throw new Error(
                "Institution is disabled."
            );

        }


        if (!institution.sheetId) {

            throw new Error(
                "Institution database not found."
            );

        }


        // =============================================
        // Check License
        // =============================================

        if (
            institution.licenseEnd
        ) {

            const licenseEnd =
                new Date(
                    institution.licenseEnd
                );

            if (
                !isNaN(
                    licenseEnd.getTime()
                ) &&
                new Date() >
                licenseEnd
            ) {

                throw new Error(
                    "The institution license has expired."
                );

            }

        }


        const institutionSS =
            SpreadsheetApp.openById(
                institution.sheetId
            );


        // =============================================
        // Students Sheet
        // =============================================

        const studentsSheet =
            institutionSS.getSheetByName(
                "Students"
            );


        if (!studentsSheet) {

            throw new Error(
                "Students sheet not found."
            );

        }


        const studentValues =
            studentsSheet
                .getDataRange()
                .getValues();


        if (
            studentValues.length <= 1
        ) {

            throw new Error(
                "Student not found."
            );

        }


        const studentHeaders =
            studentValues[0].map(
                header =>
                    String(
                        header
                    ).trim()
            );


        const studentIdIndex =
            studentHeaders.indexOf(
                "studentId"
            );

        const studentNumberIndex =
            studentHeaders.indexOf(
                "studentNumber"
            );

        const studentYearIndex =
            studentHeaders.indexOf(
                "academicYear"
            );

        const studentNameIndex =
            studentHeaders.indexOf(
                "name"
            );

        const studentStageIndex =
            studentHeaders.indexOf(
                "stage"
            );

        const studentClassIndex =
            studentHeaders.indexOf(
                "class"
            );


        if (
            studentIdIndex === -1 ||
            studentNumberIndex === -1 ||
            studentYearIndex === -1 ||
            studentNameIndex === -1
        ) {

            throw new Error(
                "Students sheet structure is invalid."
            );

        }


        let student =
            null;


        for (
            let i = 1;
            i < studentValues.length;
            i++
        ) {

            const row =
                studentValues[i];


            const rowStudentId =
                String(
                    row[
                        studentIdIndex
                    ] || ""
                ).trim();


            const rowAcademicYear =
                String(
                    row[
                        studentYearIndex
                    ] || ""
                ).trim();


            if (
                rowStudentId ===
                    studentId
                &&
                rowAcademicYear ===
                    academicYear
            ) {

                student = {

                    studentId:
                        rowStudentId,

                    studentNumber:
                        String(
                            row[
                                studentNumberIndex
                            ] || ""
                        ),

                    name:
                        String(
                            row[
                                studentNameIndex
                            ] || ""
                        ),

                    academicYear:
                        rowAcademicYear,

                    stage:
                        studentStageIndex !== -1
                            ? String(
                                row[
                                    studentStageIndex
                                ] || ""
                            )
                            : "",

                    class:
                        studentClassIndex !== -1
                            ? String(
                                row[
                                    studentClassIndex
                                ] || ""
                            )
                            : ""

                };

                break;

            }

        }


        if (!student) {

            throw new Error(
                "Student not found for the selected academic year."
            );

        }


        // =============================================
        // Payments Sheet
        // =============================================

        let paymentsSheet =
            institutionSS.getSheetByName(
                "Payments"
            );


        if (!paymentsSheet) {

            paymentsSheet =
                institutionSS.insertSheet(
                    "Payments"
                );

            paymentsSheet.appendRow([

                "paymentId",
                "studentId",
                "studentNumber",
                "month",
                "amount",
                "date",
                "recordedBy"

            ]);

        }


        const paymentHeaders =
            ensurePaymentHeaders(
                paymentsSheet
            );


        // =============================================
        // Read Existing Payments
        // =============================================

        const paymentLastRow =
            paymentsSheet.getLastRow();

        const paymentLastColumn =
            paymentsSheet.getLastColumn();


        let paymentRows = [];


        if (
            paymentLastRow > 1 &&
            paymentLastColumn > 0
        ) {

            paymentRows =
                paymentsSheet
                    .getRange(
                        2,
                        1,
                        paymentLastRow - 1,
                        paymentLastColumn
                    )
                    .getValues();

        }


        const paymentStudentIdIndex =
            paymentHeaders.indexOf(
                "studentId"
            );

        const paymentAcademicYearIndex =
            paymentHeaders.indexOf(
                "academicYear"
            );

        const paymentMonthIndex =
            paymentHeaders.indexOf(
                "month"
            );


        // =============================================
        // Duplicate Protection
        // =============================================

        const duplicate =
            paymentRows.some(
                row => {

                    const rowStudentId =
                        String(
                            row[
                                paymentStudentIdIndex
                            ] || ""
                        ).trim();

                    const rowAcademicYear =
                        String(
                            row[
                                paymentAcademicYearIndex
                            ] || ""
                        ).trim();

                    const rowMonth =
                        String(
                            row[
                                paymentMonthIndex
                            ] || ""
                        ).trim();


                    return (
                        rowStudentId ===
                        studentId
                        &&
                        rowAcademicYear ===
                        academicYear
                        &&
                        rowMonth ===
                        month
                    );

                }
            );


        if (duplicate) {

            throw new Error(
                "Payment already exists for this student, academic year, and month."
            );

        }


        // =============================================
        // Generate Payment ID
        // =============================================

        const paymentId =
            "PAY-" +
            Utilities.getUuid();


        // =============================================
        // Generate Receipt Number
        // =============================================

        const receiptNumber =
            generatePaymentReceiptNumber(
                paymentRows,
                paymentHeaders
            );


        const now =
            new Date();


        // =============================================
        // Prepare Payment Row
        // =============================================

        const newRow =
            new Array(
                paymentHeaders.length
            ).fill("");


        setColumnValue(
            newRow,
            paymentHeaders,
            "paymentId",
            paymentId
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "studentId",
            student.studentId
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "studentNumber",
            student.studentNumber
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "studentName",
            student.name
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "academicYear",
            academicYear
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "month",
            month
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "amount",
            amount
        );

        // Keep old "date" column working.
        setColumnValue(
            newRow,
            paymentHeaders,
            "date",
            paymentDate
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "paymentDate",
            paymentDate
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "receiptNumber",
            receiptNumber
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "recordedBy",
            authenticated.username
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "notes",
            notes
        );

        setColumnValue(
            newRow,
            paymentHeaders,
            "createdAt",
            now
        );


        // =============================================
        // Save Payment
        // =============================================

        paymentsSheet.appendRow(
            newRow
        );


        // =============================================
        // Activity Log
        // =============================================

        logActivityBackend(
            institutionSS,
            {

                username:
                    authenticated.username,

                role:
                    authenticated.role,

                action:
                    "Recorded School Payment",

                details:
                    "Student " +
                    student.studentNumber +
                    " - " +
                    student.name +
                    " - Academic Year: " +
                    academicYear +
                    " - Month: " +
                    month +
                    " - Amount: " +
                    amount +
                    " - Receipt: " +
                    receiptNumber

            }
        );


        return jsonResponse({

            success: true,

            message:
                "Payment recorded successfully.",

            payment: {

                paymentId:
                    paymentId,

                studentId:
                    student.studentId,

                studentNumber:
                    student.studentNumber,

                studentName:
                    student.name,

                academicYear:
                    academicYear,

                month:
                    month,

                amount:
                    amount,

                paymentDate:
                    paymentDate,

                receiptNumber:
                    receiptNumber,

                recordedBy:
                    authenticated.username,

                notes:
                    notes,

                createdAt:
                    now.toISOString()

            }

        });

    }

    finally {

        lock.releaseLock();

    }

}


// =====================================================
// Get Payments
// =====================================================

function getPayments(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();


    if (!institutionId) {

        throw new Error(
            "Institution ID is required."
        );

    }


    if (!username) {

        throw new Error(
            "Username is required."
        );

    }


    const masterSS =
        SpreadsheetApp.openById(
            SPREADSHEET_ID
        );


    // =============================================
    // Authenticate User
    // =============================================

    const authenticated =
        authenticateSchoolUser(
            masterSS,
            institutionId,
            username
        );


    if (!authenticated.success) {

        throw new Error(
            authenticated.message
        );

    }


    // =============================================
    // Get Institution
    // =============================================

    const institution =
        getAuthenticatedInstitution(
            masterSS,
            institutionId
        );


    if (!institution) {

        throw new Error(
            "Institution not found."
        );

    }


    if (
        String(
            institution.status || ""
        )
        .toLowerCase() !==
        "active"
    ) {

        throw new Error(
            "Institution is disabled."
        );

    }


    if (!institution.sheetId) {

        throw new Error(
            "Institution database not found."
        );

    }


    // =============================================
    // Check License
    // =============================================

    if (
        institution.licenseEnd
    ) {

        const licenseEnd =
            new Date(
                institution.licenseEnd
            );

        if (
            !isNaN(
                licenseEnd.getTime()
            ) &&
            new Date() >
            licenseEnd
        ) {

            throw new Error(
                "The institution license has expired."
            );

        }

    }


    // =============================================
    // Open Institution Spreadsheet
    // =============================================

    const institutionSS =
        SpreadsheetApp.openById(
            institution.sheetId
        );


    let paymentsSheet =
        institutionSS.getSheetByName(
            "Payments"
        );


    if (!paymentsSheet) {

        return jsonResponse({

            success: true,

            payments: []

        });

    }


    // =============================================
    // Ensure New Payment Columns
    // =============================================

    const headers =
        ensurePaymentHeaders(
            paymentsSheet
        );


    const lastRow =
        paymentsSheet.getLastRow();

    const lastColumn =
        paymentsSheet.getLastColumn();


    if (
        lastRow <= 1 ||
        lastColumn <= 0
    ) {

        return jsonResponse({

            success: true,

            payments: []

        });

    }


    const values =
        paymentsSheet
            .getRange(
                2,
                1,
                lastRow - 1,
                lastColumn
            )
            .getValues();


    const payments = [];


    values.forEach(
        row => {

            if (
                row.every(
                    value =>
                        value === "" ||
                        value === null
                )
            ) {

                return;

            }


            const payment = {};


            headers.forEach(
                (
                    header,
                    index
                ) => {

                    let value =
                        row[index];


                    if (
                        value instanceof Date
                    ) {

                        value =
                            value.toISOString();

                    }


                    payment[header] =
                        value;

                }
            );


            // Compatibility with old records
            if (
                !payment.paymentDate &&
                payment.date
            ) {

                payment.paymentDate =
                    payment.date;

            }


            payments.push(
                payment
            );

        }
    );


    return jsonResponse({

        success: true,

        payments:
            payments

    });

}


// =====================================================
// Ensure Payment Sheet Headers
// =====================================================

function ensurePaymentHeaders(
    paymentsSheet
) {

    const requiredHeaders = [

        "paymentId",
        "studentId",
        "studentNumber",
        "month",
        "amount",
        "date",
        "recordedBy",
        "studentName",
        "academicYear",
        "paymentDate",
        "receiptNumber",
        "notes",
        "createdAt"

    ];


    let lastColumn =
        paymentsSheet.getLastColumn();


    if (
        lastColumn === 0
    ) {

        paymentsSheet.appendRow(
            requiredHeaders
        );

        return requiredHeaders;

    }


    let headers =
        paymentsSheet
            .getRange(
                1,
                1,
                1,
                lastColumn
            )
            .getValues()[0]
            .map(
                header =>
                    String(
                        header
                    ).trim()
            );


    if (
        headers.length === 1 &&
        headers[0] === ""
    ) {

        paymentsSheet
            .getRange(
                1,
                1
            )
            .setValue(
                requiredHeaders[0]
            );

        headers =
            [
                requiredHeaders[0]
            ];

    }


    requiredHeaders.forEach(
        header => {

            if (
                headers.indexOf(
                    header
                ) === -1
            ) {

                headers.push(
                    header
                );

                paymentsSheet
                    .getRange(
                        1,
                        headers.length
                    )
                    .setValue(
                        header
                    );

            }

        }
    );


    return headers;

}


// =====================================================
// Generate Payment Receipt Number
// =====================================================

function generatePaymentReceiptNumber(
    paymentRows,
    paymentHeaders
) {

    const receiptIndex =
        paymentHeaders.indexOf(
            "receiptNumber"
        );


    let maxNumber =
        0;


    const currentYear =
        new Date()
            .getFullYear();


    if (
        receiptIndex !== -1
    ) {

        paymentRows.forEach(
            row => {

                const receipt =
                    String(
                        row[
                            receiptIndex
                        ] || ""
                    ).trim();


                const match =
                    receipt.match(
                        /^RC-(\d{4})-(\d+)$/
                    );


                if (!match) {
                    return;
                }


                const receiptYear =
                    Number(
                        match[1]
                    );


                const receiptNumber =
                    Number(
                        match[2]
                    );


                if (
                    receiptYear ===
                    currentYear &&
                    receiptNumber >
                    maxNumber
                ) {

                    maxNumber =
                        receiptNumber;

                }

            }
        );

    }


    return (
        "RC-" +
        currentYear +
        "-" +
        String(
            maxNumber + 1
        ).padStart(
            5,
            "0"
        )
    );

}


// =====================================================
// Authenticate School User
// =====================================================

function authenticateSchoolUser(
    masterSpreadsheet,
    institutionId,
    username
) {

    const authSheet =
        masterSpreadsheet.getSheetByName(
            "Schools Authentication"
        );


    if (!authSheet) {

        return {

            success: false,

            message:
                "Authentication sheet not found."

        };

    }


    const rows =
        authSheet
            .getDataRange()
            .getValues();


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const rowInstitutionId =
            String(
                rows[i][0] || ""
            ).trim();

        const rowUsername =
            String(
                rows[i][1] || ""
            ).trim();

        const rowRole =
            String(
                rows[i][3] || ""
            ).trim();

        const rowStatus =
            String(
                rows[i][4] || ""
            ).trim();


        if (
            rowInstitutionId ===
                institutionId
            &&
            rowUsername.toLowerCase() ===
                username.toLowerCase()
        ) {

            if (
                rowStatus.toLowerCase() !==
                "active"
            ) {

                return {

                    success: false,

                    message:
                        "User account is disabled."

                };

            }


            return {

                success: true,

                username:
                    rowUsername,

                role:
                    rowRole

            };

        }

    }


    return {

        success: false,

        message:
            "User access denied."

    };

}


// =====================================================
// Get Authenticated Institution
// =====================================================

function getAuthenticatedInstitution(
    masterSpreadsheet,
    institutionId
) {

    const institutionsSheet =
        masterSpreadsheet.getSheetByName(
            "Institutions"
        );


    if (!institutionsSheet) {

        return null;

    }


    const rows =
        institutionsSheet
            .getDataRange()
            .getValues();


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const rowId =
            String(
                rows[i][0] || ""
            ).trim();


        if (
            rowId ===
            institutionId
        ) {

            return {

                id:
                    rowId,

                type:
                    String(
                        rows[i][1] || ""
                    ),

                name:
                    String(
                        rows[i][2] || ""
                    ),

                phone:
                    String(
                        rows[i][3] || ""
                    ),

                email:
                    String(
                        rows[i][4] || ""
                    ),

                licenseStart:
                    String(
                        rows[i][5] || ""
                    ),

                licenseEnd:
                    String(
                        rows[i][6] || ""
                    ),

                status:
                    String(
                        rows[i][7] || ""
                    ),

                username:
                    String(
                        rows[i][8] || ""
                    ),

                sheetId:
                    String(
                        rows[i][9] || ""
                    ),

                sheetUrl:
                    String(
                        rows[i][10] || ""
                    )

            };

        }

    }


    return null;

}


// =====================================================
// Get Student Stage Letter
// =====================================================

function getStudentStageLetter(
    stage
) {

    if (
        stage ===
        "primary"
    ) {

        return "A";

    }


    if (
        stage ===
        "preparatory"
    ) {

        return "B";

    }


    if (
        stage ===
        "secondary"
    ) {

        return "C";

    }


    return "";

}


// =====================================================
// Generate Student ID
// =====================================================

function generateStudentId() {

    return (
        "STU-" +
        Utilities.getUuid()
    );

}


// =====================================================
// Set Column Value
// =====================================================

function setColumnValue(
    row,
    headers,
    columnName,
    value
) {

    const index =
        headers.indexOf(
            columnName
        );


    if (
        index !== -1
    ) {

        row[index] =
            value;

    }

}


// =====================================================
// Backend Activity Log
// =====================================================

function logActivityBackend(
    institutionSpreadsheet,
    data
) {

    let logsSheet =
        institutionSpreadsheet.getSheetByName(
            "Activity Logs"
        );


    if (!logsSheet) {

        logsSheet =
            institutionSpreadsheet.insertSheet(
                "Activity Logs"
            );


        logsSheet.appendRow([

            "logId",
            "username",
            "role",
            "action",
            "details",
            "date"

        ]);

    }


    logsSheet.appendRow([

        "LOG-" +
        Utilities.getUuid(),

        data.username || "",

        data.role || "",

        data.action || "",

        data.details || "",

        new Date()

    ]);

}


// =====================================================
// Generate Institution ID
// =====================================================

function generateInstitutionId(
    institutionsSheet
) {

    const currentYear =
        new Date()
            .getFullYear()
            .toString()
            .slice(-2);


    const rows =
        institutionsSheet
            .getDataRange()
            .getValues();


    let highestNumber = 0;


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const id =
            String(
                rows[i][0] || ""
            );


        const match =
            id.match(
                /^MP(\d{4})\d{2}$/
            );


        if (match) {

            const number =
                parseInt(
                    match[1],
                    10
                );


            if (
                number >
                highestNumber
            ) {

                highestNumber =
                    number;

            }

        }

    }


    const nextNumber =
        highestNumber + 1;


    return (
        "MP" +
        String(nextNumber)
            .padStart(4, "0") +
        currentYear
    );

}


// =====================================================
// Setup Institution Spreadsheet
// =====================================================

function setupInstitutionSpreadsheet(
    spreadsheet,
    institution
) {

    const firstSheet =
        spreadsheet.getSheets()[0];


    firstSheet.setName(
        "Institution Info"
    );


    firstSheet.clear();


    firstSheet.getRange(
        "A1:B10"
    ).setValues([

        [
            "Field",
            "Value"
        ],

        [
            "Institution ID",
            institution.id
        ],

        [
            "Type",
            institution.type
        ],

        [
            "Name",
            institution.name
        ],

        [
            "Phone",
            institution.phone
        ],

        [
            "Email",
            institution.email
        ],

        [
            "License Start",
            institution.licenseStart
        ],

        [
            "License End",
            institution.licenseEnd
        ],

        [
            "Status",
            "active"
        ],

        [
            "Director Username",
            institution.username
        ]

    ]);


    // =============================================
    // Users
    // =============================================

    const usersSheet =
        spreadsheet.insertSheet(
            "Users"
        );


    usersSheet.appendRow([

        "userId",
        "username",
        "role",
        "status",
        "createdAt",
        "permissions"

    ]);


    usersSheet.appendRow([

        "USR-001",

        institution.username,

        "Director",

        "active",

        new Date(),

        JSON.stringify({

            students: true,

            payments: true,

            reports: true,

            receipts: true,

            transactions: true,

            manageUsers: true

        })

    ]);


    // =============================================
    // Students
    // =============================================

    const studentsSheet =
        spreadsheet.insertSheet(
            "Students"
        );


    studentsSheet.appendRow([

        "studentId",
        "studentNumber",
        "academicYear",
        "name",
        "stage",
        "class",
        "registrationDate",
        "createdAt"

    ]);


    // =============================================
    // Payments
    // =============================================

    const paymentsSheet =
        spreadsheet.insertSheet(
            "Payments"
        );


    paymentsSheet.appendRow([

        "paymentId",
        "studentId",
        "studentNumber",
        "month",
        "amount",
        "date",
        "recordedBy",
        "studentName",
        "academicYear",
        "paymentDate",
        "receiptNumber",
        "notes",
        "createdAt"

    ]);


    // =============================================
    // Receipts
    // =============================================

    const receiptsSheet =
        spreadsheet.insertSheet(
            "Receipts"
        );


    receiptsSheet.appendRow([

        "receiptId",
        "studentId",
        "studentNumber",
        "month",
        "amount",
        "date",
        "issuedBy"

    ]);


    // =============================================
    // Activity Logs
    // =============================================

    const logsSheet =
        spreadsheet.insertSheet(
            "Activity Logs"
        );


    logsSheet.appendRow([

        "logId",
        "username",
        "role",
        "action",
        "details",
        "date"

    ]);

}


// =====================================================
// JSON Response
// =====================================================

function jsonResponse(data) {

    return ContentService
        .createTextOutput(
            JSON.stringify(data)
        )
        .setMimeType(
            ContentService.MimeType.JSON
        );

}


// =====================================================
// NEW BACKEND FUNCTIONS
// =====================================================


// =====================================================
// Authenticate Additional Page Request
// =====================================================

function bmpAuthenticateRequest(
    institutionId,
    username
) {

    institutionId =
        String(
            institutionId || ""
        ).trim();

    username =
        String(
            username || ""
        ).trim();


    if (!institutionId) {

        throw new Error(
            "Institution ID is required."
        );

    }


    if (!username) {

        throw new Error(
            "Username is required."
        );

    }


    const masterSS =
        SpreadsheetApp.openById(
            SPREADSHEET_ID
        );


    const authenticated =
        authenticateSchoolUser(
            masterSS,
            institutionId,
            username
        );


    if (!authenticated.success) {

        throw new Error(
            authenticated.message
        );

    }


    const institution =
        getAuthenticatedInstitution(
            masterSS,
            institutionId
        );


    if (!institution) {

        throw new Error(
            "Institution not found."
        );

    }


    if (
        String(
            institution.status || ""
        )
        .trim()
        .toLowerCase() !==
        "active"
    ) {

        throw new Error(
            "Institution is disabled."
        );

    }


    if (!institution.sheetId) {

        throw new Error(
            "Institution database not found."
        );

    }


    if (
        institution.licenseEnd
    ) {

        const licenseEnd =
            new Date(
                institution.licenseEnd
            );


        if (
            !isNaN(
                licenseEnd.getTime()
            ) &&
            new Date() >
            licenseEnd
        ) {

            throw new Error(
                "The institution license has expired."
            );

        }

    }


    const institutionSS =
        SpreadsheetApp.openById(
            institution.sheetId
        );


    return {

        masterSS:
            masterSS,

        institutionSS:
            institutionSS,

        institution:
            institution,

        authenticated:
            authenticated

    };

}


// =====================================================
// Classes
// =====================================================

function getClasses(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();


    const context =
        bmpAuthenticateRequest(
            institutionId,
            username
        );


    let classesSheet =
        context.institutionSS
            .getSheetByName(
                "Classes"
            );


    if (!classesSheet) {

        classesSheet =
            context.institutionSS
                .insertSheet(
                    "Classes"
                );


        classesSheet.appendRow([

            "stage",
            "stageCode",
            "stageName",
            "classNumber",
            "className",
            "classCode",
            "status",
            "createdAt"

        ]);


        const classes =
            bmpDefaultClasses();


        classes.forEach(
            item => {

                classesSheet.appendRow([

                    item.stage,

                    item.stageCode,

                    item.stageName,

                    item.classNumber,

                    item.className,

                    item.classCode,

                    "active",

                    new Date()

                ]);

            }
        );

    }


    const lastRow =
        classesSheet.getLastRow();

    const lastColumn =
        classesSheet.getLastColumn();


    if (
        lastRow <= 1 ||
        lastColumn <= 0
    ) {

        return jsonResponse({

            success: true,

            institution: {

                id:
                    context.institution.id,

                name:
                    context.institution.name

            },

            classes:
                []

        });

    }


    const values =
        classesSheet
            .getRange(
                1,
                1,
                lastRow,
                lastColumn
            )
            .getValues();


    const headers =
        values[0].map(
            header =>
                String(
                    header
                ).trim()
        );


    const classes = [];


    values
        .slice(1)
        .forEach(
            row => {

                if (
                    row.every(
                        value =>
                            value === "" ||
                            value === null
                    )
                ) {

                    return;

                }


                const item = {};


                headers.forEach(
                    (
                        header,
                        index
                    ) => {

                        let value =
                            row[index];


                        if (
                            value instanceof Date
                        ) {

                            value =
                                value.toISOString();

                        }


                        item[header] =
                            value;

                    }
                );


                item.id =
                    item.classCode ||
                    "";


                classes.push(
                    item
                );

            }
        );


    return jsonResponse({

        success: true,

        institution: {

            id:
                context.institution.id,

            name:
                context.institution.name

        },

        classes:
            classes

    });

}


// =====================================================
// Default Classes
// =====================================================

function bmpDefaultClasses() {

    const classes = [];


    const stages = [

        {
            stage:
                "primary",

            stageCode:
                "A",

            stageName:
                "Primary Education",

            count:
                6

        },

        {
            stage:
                "preparatory",

            stageCode:
                "B",

            stageName:
                "Preparatory Education",

            count:
                4

        },

        {
            stage:
                "secondary",

            stageCode:
                "C",

            stageName:
                "Secondary Education",

            count:
                3

        }

    ];


    stages.forEach(
        stage => {

            for (
                let number = 1;
                number <= stage.count;
                number++
            ) {

                classes.push({

                    stage:
                        stage.stage,

                    stageCode:
                        stage.stageCode,

                    stageName:
                        stage.stageName,

                    classNumber:
                        String(
                            number
                        ),

                    className:
                        stage.stageName +
                        " " +
                        number,

                    classCode:
                        stage.stageCode +
                        number

                });

            }

        }
    );


    return classes;

}


// =====================================================
// Receipt
// =====================================================

function getReceipt(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();

    const paymentId =
        String(
            data.paymentId || ""
        ).trim();


    if (!paymentId) {

        throw new Error(
            "Payment ID is required."
        );

    }


    const context =
        bmpAuthenticateRequest(
            institutionId,
            username
        );


    const paymentsSheet =
        context.institutionSS
            .getSheetByName(
                "Payments"
            );


    if (!paymentsSheet) {

        throw new Error(
            "Payments sheet not found."
        );

    }


    const values =
        paymentsSheet
            .getDataRange()
            .getValues();


    if (
        values.length <= 1
    ) {

        throw new Error(
            "Payment not found."
        );

    }


    const headers =
        values[0].map(
            header =>
                String(
                    header
                ).trim()
        );


    const paymentIdIndex =
        headers.indexOf(
            "paymentId"
        );


    if (
        paymentIdIndex === -1
    ) {

        throw new Error(
            "Payments sheet structure is invalid."
        );

    }


    let payment =
        null;


    for (
        let i = 1;
        i < values.length;
        i++
    ) {

        const rowPaymentId =
            String(
                values[i][
                    paymentIdIndex
                ] || ""
            ).trim();


        if (
            rowPaymentId ===
            paymentId
        ) {

            payment = {};


            headers.forEach(
                (
                    header,
                    index
                ) => {

                    let value =
                        values[i][
                            index
                        ];


                    if (
                        value instanceof Date
                    ) {

                        value =
                            value.toISOString();

                    }


                    payment[header] =
                        value;

                }
            );


            break;

        }

    }


    if (!payment) {

        throw new Error(
            "Payment not found."
        );

    }


    payment.id =
        payment.paymentId ||
        paymentId;

    payment.institutionId =
        institutionId;


    if (
        !payment.paymentDate &&
        payment.date
    ) {

        payment.paymentDate =
            payment.date;

    }


    let student =
        null;


    const studentsSheet =
        context.institutionSS
            .getSheetByName(
                "Students"
            );


    if (
        studentsSheet
    ) {

        const studentValues =
            studentsSheet
                .getDataRange()
                .getValues();


        if (
            studentValues.length > 1
        ) {

            const studentHeaders =
                studentValues[0].map(
                    header =>
                        String(
                            header
                        ).trim()
                );


            const studentIdIndex =
                studentHeaders.indexOf(
                    "studentId"
                );


            if (
                studentIdIndex !== -1
            ) {

                for (
                    let i = 1;
                    i < studentValues.length;
                    i++
                ) {

                    const row =
                        studentValues[i];


                    const rowStudentId =
                        String(
                            row[
                                studentIdIndex
                            ] || ""
                        ).trim();


                    if (
                        rowStudentId ===
                        String(
                            payment.studentId ||
                            ""
                        ).trim()
                    ) {

                        student = {};


                        studentHeaders.forEach(
                            (
                                header,
                                index
                            ) => {

                                let value =
                                    row[index];


                                if (
                                    value instanceof Date
                                ) {

                                    value =
                                        value.toISOString();

                                }


                                student[header] =
                                    value;

                            }
                        );


                        break;

                    }

                }

            }

        }

    }


    if (
        student
    ) {

        student.id =
            student.studentId ||
            "";

        student.institutionId =
            institutionId;

        student.className =
            student.className ||
            student.class ||
            "";

    }


    return jsonResponse({

        success: true,

        payment:
            payment,

        student:
            student,

        institution: {

            id:
                context.institution.id,

            name:
                context.institution.name,

            phone:
                context.institution.phone,

            email:
                context.institution.email,

            currency:
                bmpReadSetting(
                    context.institutionSS,
                    "currency"
                ) ||
                "MRU",

            logo:
                bmpReadSetting(
                    context.institutionSS,
                    "logo"
                ) ||
                ""

        }

    });

}


// =====================================================
// Reports
// =====================================================

function getReports(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();

    const academicYear =
        String(
            data.academicYear || ""
        ).trim();


    const context =
        bmpAuthenticateRequest(
            institutionId,
            username
        );


    const students =
        bmpReadStudents(
            context.institutionSS,
            institutionId,
            academicYear
        );


    const payments =
        bmpReadPayments(
            context.institutionSS,
            institutionId,
            academicYear
        );


    const paidStudentIds =
        {};


    let totalAmount =
        0;


    payments.forEach(
        payment => {

            const studentId =
                String(
                    payment.studentId ||
                    ""
                );


            if (studentId) {

                paidStudentIds[
                    studentId
                ] =
                    true;

            }


            totalAmount +=
                Number(
                    payment.amount || 0
                );

        }
    );


    return jsonResponse({

        success: true,

        institution: {

            id:
                context.institution.id,

            name:
                context.institution.name

        },

        academicYear:
            academicYear,

        students:
            students,

        payments:
            payments,

        summary: {

            totalStudents:
                students.length,

            totalPayments:
                payments.length,

            totalAmount:
                totalAmount,

            paidStudents:
                Object.keys(
                    paidStudentIds
                ).length,

            unpaidStudents:
                Math.max(
                    0,
                    students.length -
                    Object.keys(
                        paidStudentIds
                    ).length
                ),

            paidMonths:
                payments.length

        }

    });

}


// =====================================================
// Read Students For Reports
// =====================================================

function bmpReadStudents(
    institutionSS,
    institutionId,
    academicYear
) {

    const sheet =
        institutionSS
            .getSheetByName(
                "Students"
            );


    if (!sheet) {

        return [];

    }


    const values =
        sheet
            .getDataRange()
            .getValues();


    if (
        values.length <= 1
    ) {

        return [];

    }


    const headers =
        values[0].map(
            header =>
                String(
                    header
                ).trim()
        );


    const students = [];


    for (
        let i = 1;
        i < values.length;
        i++
    ) {

        const row =
            values[i];


        if (
            row.every(
                value =>
                    value === "" ||
                    value === null
            )
        ) {

            continue;

        }


        const student = {};


        headers.forEach(
            (
                header,
                index
            ) => {

                let value =
                    row[index];


                if (
                    value instanceof Date
                ) {

                    value =
                        value.toISOString();

                }


                student[header] =
                    value;

            }
        );


        if (
            academicYear &&
            String(
                student.academicYear ||
                ""
            ).trim() !==
            academicYear
        ) {

            continue;

        }


        student.id =
            student.studentId ||
            "";

        student.institutionId =
            institutionId;

        student.className =
            student.className ||
            student.class ||
            "";


        students.push(
            student
        );

    }


    return students;

}


// =====================================================
// Read Payments For Reports
// =====================================================

function bmpReadPayments(
    institutionSS,
    institutionId,
    academicYear
) {

    const sheet =
        institutionSS
            .getSheetByName(
                "Payments"
            );


    if (!sheet) {

        return [];

    }


    const values =
        sheet
            .getDataRange()
            .getValues();


    if (
        values.length <= 1
    ) {

        return [];

    }


    const headers =
        values[0].map(
            header =>
                String(
                    header
                ).trim()
        );


    const payments = [];


    for (
        let i = 1;
        i < values.length;
        i++
    ) {

        const row =
            values[i];


        if (
            row.every(
                value =>
                    value === "" ||
                    value === null
            )
        ) {

            continue;

        }


        const payment = {};


        headers.forEach(
            (
                header,
                index
            ) => {

                let value =
                    row[index];


                if (
                    value instanceof Date
                ) {

                    value =
                        value.toISOString();

                }


                payment[header] =
                    value;

            }
        );


        if (
            academicYear &&
            String(
                payment.academicYear ||
                ""
            ).trim() !==
            academicYear
        ) {

            continue;

        }


        payment.id =
            payment.paymentId ||
            "";

        payment.institutionId =
            institutionId;


        if (
            !payment.paymentDate &&
            payment.date
        ) {

            payment.paymentDate =
                payment.date;

        }


        payments.push(
            payment
        );

    }


    return payments;

}


// =====================================================
// School Settings - Get
// =====================================================

function getSchoolSettings(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();


    const context =
        bmpAuthenticateRequest(
            institutionId,
            username
        );


    const settings = {

        institutionId:
            context.institution.id,

        schoolName:
            context.institution.name ||
            "",

        schoolPhone:
            context.institution.phone ||
            "",

        schoolEmail:
            context.institution.email ||
            "",

        academicYear:
            bmpReadSetting(
                context.institutionSS,
                "academicYear"
            ) ||
            "",

        monthlyFee:
            bmpReadSetting(
                context.institutionSS,
                "monthlyFee"
            ) ||
            0,

        currency:
            bmpReadSetting(
                context.institutionSS,
                "currency"
            ) ||
            "MRU",

        logo:
            bmpReadSetting(
                context.institutionSS,
                "logo"
            ) ||
            "",

        licenseStart:
            context.institution.licenseStart ||
            "",

        licenseEnd:
            context.institution.licenseEnd ||
            "",

        status:
            context.institution.status ||
            ""

    };


    return jsonResponse({

        success: true,

        settings:
            settings

    });

}


// =====================================================
// School Settings - Update
// =====================================================

function updateSchoolSettings(data) {

    const institutionId =
        String(
            data.institutionId || ""
        ).trim();

    const username =
        String(
            data.username || ""
        ).trim();


    const context =
        bmpAuthenticateRequest(
            institutionId,
            username
        );


    const schoolName =
        String(
            data.schoolName || ""
        ).trim();

    const schoolPhone =
        String(
            data.schoolPhone || ""
        ).trim();

    const schoolEmail =
        String(
            data.schoolEmail || ""
        ).trim();

    const academicYear =
        String(
            data.academicYear || ""
        ).trim();

    const currency =
        String(
            data.currency || ""
        ).trim();

    const logo =
        String(
            data.logo || ""
        ).trim();


    let monthlyFee =
        0;


    if (
        data.monthlyFee !== undefined &&
        data.monthlyFee !== null &&
        String(
            data.monthlyFee
        ).trim() !== ""
    ) {

        monthlyFee =
            Number(
                data.monthlyFee
            );


        if (
            !isFinite(
                monthlyFee
            ) ||
            monthlyFee < 0
        ) {

            throw new Error(
                "Monthly fee must be a valid amount."
            );

        }

    }


    if (!schoolName) {

        throw new Error(
            "School name is required."
        );

    }


    if (!academicYear) {

        throw new Error(
            "Academic year is required."
        );

    }


    if (!currency) {

        throw new Error(
            "Currency is required."
        );

    }


    const sheet =
        bmpEnsureSettingsSheet(
            context.institutionSS
        );


    bmpSaveSetting(
        sheet,
        "academicYear",
        academicYear
    );

    bmpSaveSetting(
        sheet,
        "monthlyFee",
        monthlyFee
    );

    bmpSaveSetting(
        sheet,
        "currency",
        currency
    );

    bmpSaveSetting(
        sheet,
        "logo",
        logo
    );


    bmpUpdateInstitutionInfoValue(
        context.institutionSS,
        "Name",
        schoolName
    );

    bmpUpdateInstitutionInfoValue(
        context.institutionSS,
        "Phone",
        schoolPhone
    );

    bmpUpdateInstitutionInfoValue(
        context.institutionSS,
        "Email",
        schoolEmail
    );

    bmpUpdateInstitutionInfoValue(
        context.institutionSS,
        "Academic Year",
        academicYear
    );

    bmpUpdateInstitutionInfoValue(
        context.institutionSS,
        "Monthly Fee",
        monthlyFee
    );

    bmpUpdateInstitutionInfoValue(
        context.institutionSS,
        "Currency",
        currency
    );

    bmpUpdateInstitutionInfoValue(
        context.institutionSS,
        "Logo",
        logo
    );


    const institutionsSheet =
        context.masterSS
            .getSheetByName(
                "Institutions"
            );


    if (
        institutionsSheet
    ) {

        const rows =
            institutionsSheet
                .getDataRange()
                .getValues();


        for (
            let i = 1;
            i < rows.length;
            i++
        ) {

            const rowId =
                String(
                    rows[i][0] || ""
                ).trim();


            if (
                rowId ===
                institutionId
            ) {

                institutionsSheet
                    .getRange(
                        i + 1,
                        3
                    )
                    .setValue(
                        schoolName
                    );


                institutionsSheet
                    .getRange(
                        i + 1,
                        4
                    )
                    .setValue(
                        schoolPhone
                    );


                institutionsSheet
                    .getRange(
                        i + 1,
                        5
                    )
                    .setValue(
                        schoolEmail
                    );


                break;

            }

        }

    }


    logActivityBackend(
        context.institutionSS,
        {

            username:
                context.authenticated.username,

            role:
                context.authenticated.role,

            action:
                "Updated School Settings",

            details:
                "Updated school settings."

        }
    );


    return jsonResponse({

        success: true,

        message:
            "Settings saved successfully.",

        settings: {

            institutionId:
                institutionId,

            schoolName:
                schoolName,

            schoolPhone:
                schoolPhone,

            schoolEmail:
                schoolEmail,

            academicYear:
                academicYear,

            monthlyFee:
                monthlyFee,

            currency:
                currency,

            logo:
                logo

        }

    });

}


// =====================================================
// Ensure School Settings Sheet
// =====================================================

function bmpEnsureSettingsSheet(
    institutionSS
) {

    let sheet =
        institutionSS
            .getSheetByName(
                "School Settings"
            );


    if (!sheet) {

        sheet =
            institutionSS
                .insertSheet(
                    "School Settings"
                );


        sheet.appendRow([

            "key",
            "value",
            "updatedAt"

        ]);

    }


    return sheet;

}


// =====================================================
// Read School Setting
// =====================================================

function bmpReadSetting(
    institutionSS,
    key
) {

    const sheet =
        institutionSS
            .getSheetByName(
                "School Settings"
            );


    if (
        !sheet ||
        sheet.getLastRow() <= 1
    ) {

        return "";

    }


    const values =
        sheet
            .getDataRange()
            .getValues();


    for (
        let i = 1;
        i < values.length;
        i++
    ) {

        const rowKey =
            String(
                values[i][0] || ""
            ).trim();


        if (
            rowKey ===
            key
        ) {

            return values[i][1];

        }

    }


    return "";

}


// =====================================================
// Save School Setting
// =====================================================

function bmpSaveSetting(
    sheet,
    key,
    value
) {

    const lastRow =
        sheet.getLastRow();


    if (
        lastRow > 1
    ) {

        const values =
            sheet
                .getRange(
                    2,
                    1,
                    lastRow - 1,
                    1
                )
                .getValues();


        for (
            let i = 0;
            i < values.length;
            i++
        ) {

            const rowKey =
                String(
                    values[i][0] || ""
                ).trim();


            if (
                rowKey ===
                key
            ) {

                sheet
                    .getRange(
                        i + 2,
                        2
                    )
                    .setValue(
                        value
                    );


                sheet
                    .getRange(
                        i + 2,
                        3
                    )
                    .setValue(
                        new Date()
                    );


                return;

            }

        }

    }


    sheet.appendRow([

        key,

        value,

        new Date()

    ]);

}


// =====================================================
// Update Institution Info Value
// =====================================================

function bmpUpdateInstitutionInfoValue(
    institutionSS,
    fieldName,
    value
) {

    const sheet =
        institutionSS
            .getSheetByName(
                "Institution Info"
            );


    if (!sheet) {

        return;

    }


    const values =
        sheet
            .getDataRange()
            .getValues();


    for (
        let i = 0;
        i < values.length;
        i++
    ) {

        const field =
            String(
                values[i][0] || ""
            ).trim();


        if (
            field.toLowerCase() ===
            fieldName.toLowerCase()
        ) {

            sheet
                .getRange(
                    i + 1,
                    2
                )
                .setValue(
                    value
                );


            return;

        }

    }


    /*
     * Add missing field without changing
     * the existing rows.
     */

    sheet.appendRow([

        fieldName,

        value

    ]);

}
