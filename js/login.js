```javascript
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    /*
        Temporary login for development only.
        Real authentication will be added later.
    */

    if (username === "owner" && password === "1234") {

        window.location.href = "admin.html";

    } else {

        loginMessage.textContent =
            "Invalid username or password";

        loginMessage.style.color = "#dc2626";
    }

});
```
