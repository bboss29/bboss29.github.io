<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?php echo $page_title; ?></title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/solid.css" integrity="sha384-aj0h5DVQ8jfwc8DA7JiM+Dysv7z+qYrFYZR+Qd/TwnmpDI6UaB3GJRRTdY8jYGS4" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/fontawesome.css" integrity="sha384-WK8BzK0mpgOdhCxq86nInFqSWLzR5UAsNg0MGX9aDaIIrFWQ38dGdhwnNCAoXFxL" crossorigin="anonymous">

    <style>
        p {
            text-align: center;
        }

        h3 {
            text-align: center;
            margin: 20px auto 20px auto;
        }

        h2 {
            text-align: center;
            margin: 20px;
        }

        h1 {
            text-align: center;
            margin-top: 8%;
            margin-bottom: 20px
        }
    </style>
</head>
<body>
<nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark justify-content-between">
    <a class="navbar-brand" href="index.php">Retail Alert</a>
    <ul class="navbar-nav">
        <li class="nav-item" style="margin-right: 15px">
            <a href="admin.php" class="btn btn-secondary btn-block">Admin Controls</a>
        </li>
        <li class="nav-item" style="margin-right: 15px">
            <a href="walkthrough.php" class="btn btn-secondary btn-block">Walkthrough</a>
        </li>
        <?php
if (!isset($_SESSION['role'])){
    echo '<li class="nav-item">
        <a class="btn btn-primary btn-block" href="login.php"> Log In </a>
        </li>';
} else {
    echo '
        <li class="nav-item">
            <span class="navbar-text" style="margin-right: 15px">Logged in as '.$_SESSION['role'].' '.$_SESSION['username'].'</span>
        </li>
        <li class="nav-item">
            <a class="btn btn-primary btn-block" href="logout.php"> Log Out </a>
        </li>';
}
        ?>
    </ul>
</nav>