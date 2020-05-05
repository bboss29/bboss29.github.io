<?php
session_start();
$page_title = 'Admin Page';
include('includes/header.php');
require('connect.php');

//users
$query = "
SELECT
  user_id,
  username,
  password,
  role
from
  users;";

$result = mysqli_query($db, $query);
?>
<h1>Users</h1>
<div style="width: 100%;">
    <table style="width:80%;float: left;margin: auto 10% auto 10%" class="table table-striped table-hover">
<?php

if (isset($_POST["user"])) {
    $user_id = $_POST["u_id"];
    $query = "SELECT * FROM users WHERE user_id='$user_id'";
    $result = mysqli_query($db, $query);
    if (mysqli_num_rows($result) == 1) {
        while ($row = mysqli_fetch_array($result)) {
            $_SESSION['username'] = $row['username'];
            $_SESSION['user_id'] = $row['user_id'];
            $_SESSION['role'] = $row['role'];
        }
    }
    header('Location:profile.php');
}

if (isset($_POST["new_user"])) {
    $name = $_POST["name"];
    $role = $_POST["role"];
    $query = "INSERT INTO users (username, password, role) VALUES ('$name', 'test', '$role')";
    mysqli_query($db, $query);
    header("Location:admin.php");
}


if (mysqli_num_rows($result) != 0){
    echo '
            <thead class="thead-dark">
                <tr style="width: 100% ">
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Role</th>
                    <th>Admin</th>
                </tr>
            </thead>';
    while ($row = mysqli_fetch_assoc($result)) {
        echo '
<tr>
    <td>'.$row['user_id'].'</td>
    <td>'.$row['username'].'</td>
    <td>'.$row['password'].'</td>
    <td>'.$row['role'].'</td>
    <td>
        <form class = "form-horizontal" action="admin.php" method="post">
            <input type="number" value="'.$row['user_id'].'" name="u_id" hidden>
            <input type="submit" name="user" value="Log In" class="btn btn-secondary btn-block">
        </form>
    </td>
</tr>';
    }
}
echo '</table></div>
<h3>Add New User</h3>
<div style = "margin: auto; width: 30%;min-width: 300px" >
    <form class = "form-horizontal" action="admin.php" method="post">
        <input required class="form-control" type="text" name="name" placeholder="New Username">
        <select required class="form-control" name="role" style="margin-top: 10px">
            <option disabled selected value="null"> I am a...</option>
            <option value="customer">Customer</option>
            <option value="associate">Associate</option>
        </select>
        <input type="submit" name="new_user" value="Create User" class="btn btn-secondary btn-block">
    </form>
</div>';

//assistance queue
$query = "
SELECT
  request_id,
  customer_id,
  location,
  associate_id,
  request_details,
  a.enqueued_since
FROM
  assistance_queue a
WHERE
  a.enqueued_since IS NOT NULL AND
  request_complete = 0
ORDER BY
  a.enqueued_since ASC;";

$result = mysqli_query($db, $query);
?>
<h1>Assistance Queue</h1>
<div style="width: 100%;">
    <table style="width:80%;float: left;margin: auto 10% auto 10%" class="table table-striped table-hover">
<?php

if (mysqli_num_rows($result) != 0){
    echo '
            <thead class="thead-dark">
                <tr style="width: 100% ">
                    <th>Request ID</th>
                    <th>Customer ID</th>
                    <th>Associate ID</th>
                    <th>Customer Request</th>
                    <th>Location</th>
                    <th>Enqueued Time</th>
                </tr>
            </thead>';
    $now = new DateTime();
    while ($row = mysqli_fetch_assoc($result)) {
        $waiting_since = new DateTime($row['enqueued_since']);
        echo '
<tr>
    <td>'.$row['request_id'].'</td>
    <td>'.$row['customer_id'].'</td>
    <td>'.$row['associate_id'].'</td>
    <td>'.$row['request_details'].'</td>
    <td>' . $row['location'] . '</td>
    <td>'.$now->diff($waiting_since,true)->format('%i minutes').'</td>
</tr>';
    }
}
echo '</table></div>';

// products
$query = "SELECT * from products";
$result = mysqli_query($db, $query);
echo '
<h1>Product Catalog</h1>
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
    </tr>';
    }
}
echo '</table></div>';