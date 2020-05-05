<?php
session_start();
require 'connect.php';
if(!isset($_SESSION['role']))
    header("Location: index.php");

$id = intval($_GET['id']);
$q = "UPDATE assistance_queue, users SET request_complete = TRUE, users.enqueued_since = NULL WHERE request_id = ".$id.";";

if (mysqli_query($db, $q)){
    mysqli_close($db);
    header('Location: profile.php');
    exit;
} else {
    echo 'error';
}