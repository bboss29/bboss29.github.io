<?php
session_start();
$page_title = 'Product Page'; //$_SESSION['username'].'\'s Page';
include('includes/header.php');
require('connect.php');

if($_SESSION['role'] !== "customer")
    header("Location:index.php");


echo '<h1 style="text-align: center">Product Info Lookup</h1>';
echo '
<div style = "margin: auto; width: 30%;min-width: 300px" >
    <div class="form-group" >
        <form class = "form-horizontal" action = "products.php" method = "post" >
            <select required class="form-control" name="dept" style="margin-top: 10px">
                <option value="any" selected>Any Department</option>
                <option value="Male Fashion">Male Fashion</option>
                <option value="Female Fashion">Female Fashion</option>
                <option value="Unisex">Unisex</option>
                <option value="Clearance">Clearance</option>
            </select>
            <input required type = "text" name = "keywords" class="form-control" placeholder="Type Keywords Here">
            <input type = "submit" name = "submit" value = "Search" style = "width: 100%;margin-top: 10px" class="btn btn-primary btn-lg btn-block" >
        </form >
    </div >
</div >
<div style = "margin: 25px auto auto auto; width: 30%;min-width: 300px">
    <a href="profile.php" class="btn btn-primary btn-block">Back to Profile</a>
</div>';

if (isset($_POST["submit"])) {
    $keywords = $_POST['keywords'];
    $dept = $_POST['dept'];
    if ($dept !== "any") {
        $query = "SELECT * from products WHERE (name LIKE '%$keywords%' OR sku LIKE '%$keywords%' OR description LIKE '%$keywords%') AND dept = '$dept';";
    } else {
        $query = "SELECT * from products WHERE name LIKE '%$keywords%' OR sku LIKE '%$keywords%' OR description LIKE '%$keywords%';";
    }
    $result = mysqli_query($db, $query);
    echo '
<h2>Search Results</h2>
    <div style="width: 100%;">
        <table style="width:80%;float: left;margin: auto 10% auto 10%" class="table table-striped table-hover">';
    if (mysqli_num_rows($result) != 0) {
        echo '
                <thead class="thead-dark">
                    <tr style="width: 100% ">
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Department</th>
                        <th>Aisle</th>
                        <th>Shelf</th>
                        <th>Help</th>
                    </tr>
                </thead>';
        while ($row = mysqli_fetch_assoc($result)) {
            echo '
    <tr>
        <td>' . $row['sku'] . '</td>
        <td>' . $row['name'] . '</td>
        <td>' . $row['description'] . '</td>
        <td>' . $row['quantity'] . '</td>
        <td>' . $row['dept'] . '</td>
        <td>' . $row['aisle'] . '</td>
        <td>' . $row['shelf'] . '</td>
        <td>
            <form class = "form-horizontal" action = "products.php" method = "post" >
                <input type="text" name="name" value="' . $row["name"] . '" hidden>
                <input type="text" name="dept" value="' . $row["dept"] . '" hidden>
                <input type = "submit" name = "products" value = "Help" class="btn btn-warning btn-block" >
            </form >
        </td>
    </tr>';
        }
    } else {
        echo '<h2> No Results </h2>';
    }
    echo '</table></div>';
}

if (isset($_POST["products"])) {
    $user_id = $_SESSION["user_id"];
    $dept = $_POST["dept"];
    $details = 'I need help with '.$_POST["name"];

    $query = "UPDATE users SET enqueued_since = NOW() WHERE user_id = '$user_id'";
    mysqli_query($db, $query);
    $query = "INSERT INTO assistance_queue (customer_id, enqueued_since, request_details, location) VALUES ('$user_id', now(),'$details', '$dept');";
    mysqli_query($db, $query);

    header("Location:profile.php");
}
