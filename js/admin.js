```html
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>BMP - Admin Panel</title>

    <link rel="stylesheet" href="admin.css">

</head>

<body>

    <div class="admin-layout">

        <!-- Sidebar -->

        <aside class="sidebar">

            <div class="brand">
                <div class="brand-logo">
                    BMP
                </div>

                <div class="brand-name">
                    Business Management Platform
                </div>
            </div>


            <nav class="navigation">

                <button class="nav-item active">
                    <span>Dashboard</span>
                </button>

                <button class="nav-item">
                    <span>Institutions</span>
                </button>

                <button class="nav-item">
                    <span>Licenses</span>
                </button>

                <button class="nav-item">
                    <span>Users</span>
                </button>

                <button class="nav-item">
                    <span>Activity Logs</span>
                </button>

                <button class="nav-item">
                    <span>Backups</span>
                </button>

                <button class="nav-item">
                    <span>Settings</span>
                </button>

            </nav>


            <div class="sidebar-bottom">

                <button
                    class="logout-button"
                    onclick="logout()"
                >
                    Logout
                </button>

            </div>

        </aside>


        <!-- Main Content -->

        <main class="main-content">

            <header class="topbar">

                <div>

                    <h1>Dashboard</h1>

                    <p>
                        Overview of your business management platform
                    </p>

                </div>


                <div class="owner-profile">

                    <div class="owner-avatar">
                        O
                    </div>

                    <div class="owner-info">

                        <strong>Owner</strong>

                        <span>Administrator</span>

                    </div>

                </div>

            </header>


            <!-- Statistics -->

            <section class="statistics">

                <div class="stat-card">

                    <span class="stat-title">
                        Total Institutions
                    </span>

                    <strong id="totalInstitutions">
                        0
                    </strong>

                </div>


                <div class="stat-card">

                    <span class="stat-title">
                        Active Institutions
                    </span>

                    <strong id="activeInstitutions">
                        0
                    </strong>

                </div>


                <div class="s
```
