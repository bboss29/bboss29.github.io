<?php
session_start();
$page_title = "Retail Alert Home";
include('includes/header.php');
?>

<h1 style="font-size: 100px">Retail Alert Prototype</h1>
<h2 style="font-size: 50px">BMN  Incorporated | Group 2</h2>
<h3 style="color: #5a5d57">Brandon Boss | Mayra Mendoza</h3>

<?php

if (isset($_SESSION['role'])) {
    echo '
<div style="margin: 8% auto auto auto; width: 30%;min-width: 300px">
    <a href="profile.php" class="btn btn-primary btn-block">Go to Profile</a>
</div>';
    if ($_SESSION['role'] == "associate") {

    } elseif ($_SESSION['role'] == "customer") {
        echo '
<div style="margin: 20px auto auto auto; width: 30%;min-width: 300px">
    <a href="products.php" class="btn btn-primary btn-block">Search Products</a>
</div>';
    }
}
?>
