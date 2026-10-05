// Admin Panel Navigation


// Institutions button
const institutionsButton =
    document.getElementById("institutionsButton");


// Activity Logs button
const activityLogsButton =
    document.getElementById("activityLogsButton");


// Open Institutions
institutionsButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "institutions.html";
    }
);


// Open Activity Logs
activityLogsButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "activity-logs.html";
    }
);
