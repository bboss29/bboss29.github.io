<?php
session_start();
require 'connect.php';
if(!isset($_SESSION['role']))
    header("Location: index.php");

$r_id = intval($_GET['id']);
$a_id = $_SESSION["user_id"];
$q = "UPDATE assistance_queue SET associate_id = ".$a_id." WHERE request_id = ".$r_id.";";

if (mysqli_query($db, $q)){
    mysqli_close($db);
    header('Location: profile.php');
    exit;
} else {
    echo 'error';
}