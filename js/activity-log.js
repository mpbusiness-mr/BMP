// =====================================================
// BMP Activity Log System
// =====================================================


// Get all activity logs
function getActivityLogs() {

    return JSON.parse(
        localStorage.getItem("bmpActivityLogs")
    ) || [];
}


// Save activity logs
function saveActivityLogs(logs) {

    localStorage.setItem(
        "bmpActivityLogs",
        JSON.stringify(logs)
    );
}


// Create a new activity log
function logActivity({
    institutionId = null,
    userId = null,
    username = "System",
    role = "System",
    action = "",
    details = ""
}) {

    const logs =
        getActivityLogs();


    const newLog = {

        id:
            "LOG-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8),

        institutionId:
            institutionId,

        userId:
            userId,

        username:
            username,

        role:
            role,

        action:
            action,

        dateTime:
            new Date().toISOString(),

        details:
            details
    };


    logs.push(newLog);


    saveActivityLogs(logs);


    return newLog;
}
