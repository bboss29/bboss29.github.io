<?php
session_start();
$page_title = $_SESSION['username'].'\'s Page';

if($_SESSION['role'] == "associate") {
    include('includes/header.php');
    require('connect.php');

    $user_id = $_SESSION['user_id'];

    $query = "
    SELECT
      request_id,
      associate_id,
      location,
      request_details,
      a.enqueued_since
    FROM
      assistance_queue a
    WHERE
      associate_id = " . $user_id . " AND
      request_complete = 0
    ORDER BY
      a.enqueued_since ASC;";

    $result = mysqli_query($db, $query);
    ?>
    <h1 style="text-align: center;margin-top: 8%; margin-bottom: 20px"> <?php echo $_SESSION['username'] ?>'s Page</h1>
    <h2>Claimed</h2>
    <div style="width: 100%;">
        <table style="width:80%;float: left;margin: auto 10% auto 10%" class="table table-striped table-hover">
            <?php

            if (mysqli_num_rows($result) != 0) {
                echo '
                <thead class="thead-dark">
                    <tr style="width: 100% ">
                        <th>Request ID</th>
                        <th>Customer Request</th>
                        <th>Enqueued Time</th>
                        <th>Location</th>
                        <th>Complete Request</th>
                    </tr>
                </thead>';
                $now = new DateTime();
                while ($row = mysqli_fetch_assoc($result)) {
                    $waiting_since = new DateTime($row['enqueued_since']);
                    echo '
    <tr>
        <td>' . $row['request_id'] . '</td>
        <td>' . $row['request_details'] . '</td>
        <td>' . $now->diff($waiting_since, true)->format('%i minutes') . '</td>
        <td>' . $row['location'] . '</td>
        <td>
            <a href="put_back.php?id=' . $row["request_id"] . '" class="btn btn-danger btn-block">Put Back</a>
            <a href="mark_complete.php?id=' . $row["request_id"] . '" class="btn btn-success btn-block">Mark Completed</a>
        </td>
    </tr>';
                }
            }
            ?>
        </table>
    </div>

    <?php
    $query = "
    SELECT
      request_id,
      associate_id,
      location,
      request_details,
      a.enqueued_since
    FROM
      assistance_queue a
    WHERE
      associate_id IS NULL AND 
      a.enqueued_since IS NOT NULL AND
      request_complete = 0
    ORDER BY
      a.enqueued_since ASC;";

    $result = mysqli_query($db, $query);
    ?>
    <h2>Unclaimed</h2>
    <div style="width: 100%;">
        <table style="width:80%;float: left;margin: auto 10% auto 10%" class="table table-striped table-hover">
            <?php

            if (mysqli_num_rows($result) != 0) {
                echo '
                <thead class="thead-dark">
                    <tr style="width: 100% ">
                        <th>Request ID</th>
                        <th>Customer Request</th>
                        <th>Enqueued Time</th>
                        <th>Location</th>
                        <th>Complete Request</th>
                    </tr>
                </thead>';
                $now = new DateTime();
                while ($row = mysqli_fetch_assoc($result)) {
                    $waiting_since = new DateTime($row['enqueued_since']);
                    echo '
    <tr>
        <td>' . $row['request_id'] . '</td>
        <td>' . $row['request_details'] . '</td>
        <td>' . $now->diff($waiting_since, true)->format('%i minutes') . '</td>
        <td>' . $row['location'] . '</td>
        <td><a href="claim.php?id=' . $row["request_id"] . '" class="btn btn-primary btn-block">Claim</a></td>
    </tr>';
                }
            }
            ?>
        </table>
    </div>
    <?php
} elseif ($_SESSION['role'] == "customer"){
    $page_title = $_SESSION['username'].'\'s Page';
    include('includes/header.php');
    require('connect.php');

    $user_id = $_SESSION['user_id'];
    $query = "SELECT enqueued_since from users WHERE user_id = '$user_id' AND enqueued_since IS NULL";
    $result = mysqli_query($db, $query);
    $not_enqueued = mysqli_fetch_row($result);

    if ($not_enqueued) {
        echo '
<h1 style = "text-align: center;margin-top: 8%; margin-bottom: 20px" > '.$_SESSION['username'].'\'s Page'.'</h1 >
<div style = "margin: auto; width: 30%;min-width: 300px" >
    <div class="form-group" >
        <form class = "form-horizontal" action = "profile.php" method = "post" >
            <input type = "text" name = "cancel" value = "enqueue" hidden >
            <select required class="form-control" name="dept" style="margin-top: 10px">
                <option disabled> Department</option>
                <option value="Male Fashion">Male Fashion</option>
                <option value="Female Fashion">Female Fashion</option>
                <option value="Unisex">Unisex</option>
                <option value="Clearance">Clearance</option>
            </select>
            <input required type = "text" name = "details" class="form-control" placeholder="Type Request Details Here">
            <input type = "submit" name = "submit" value = "I need help!" style = "width: 100%;margin-top: 10px; height: 200px" class="btn btn-danger btn-lg btn-block" >
        </form >
    </div >
    <a href="products.php" class="btn btn-primary btn-block">Search Products</a>
</div >';
    } else {
        echo '
<h1 style = "text-align: center;margin-top: 8%; margin-bottom: 20px" > '.$_SESSION['username'].'\'s Page'.' </h1 >
<div style = "margin: auto; width: 30%;min-width: 300px" >
    <div class="form-group" >
    <div class="alert alert-success" role="alert" style="text-align: center">An associate is on their way!</div>
        <form class = "form-horizontal" action = "profile.php" method = "post" >
            <input type = "text" name = "cancel" value = "dequeue" hidden >
            <input type = "submit" name = "submit" value = "Cancel" style = "width: 100%;margin-top: 10px;" class="btn btn-outline-danger btn-lg btn-block" >
        </form >
    </div >
    <h2 style="margin: 20%">( Targeted Ads )</h2>
</div >';
    }

    if (isset($_POST["submit"])) {
        $details = $_POST['details'];
        $loc = $_POST['dept'];
        $cancel = $_POST['cancel'];
        if ($cancel == "enqueue") {
            $query = "UPDATE users SET enqueued_since = NOW() WHERE user_id = '$user_id'";
            mysqli_query($db, $query);
            $query = "INSERT INTO assistance_queue (customer_id, enqueued_since, request_details, location) VALUES ('$user_id', now(),'$details', '$loc');";
            mysqli_query($db, $query);
        } else {
            $query = "UPDATE users SET enqueued_since = NULL WHERE user_id = '$user_id'";
            mysqli_query($db, $query);
            $query = "UPDATE assistance_queue SET request_complete = TRUE WHERE customer_id = '$user_id'";
            mysqli_query($db, $query);
        }
        header("Location:profile.php");
    }
} else {
    header("Location:index.php");
}