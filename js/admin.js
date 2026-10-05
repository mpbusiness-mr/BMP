// Elements

const institutionsButton =
    document.getElementById("institutionsButton");

const activityLogsButton =
    document.getElementById("activityLogsButton");


// Institutions

institutionsButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "institutions.html";
    }
);


// Activity Logs

activityLogsButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "activity-logs.html";
    }
);
