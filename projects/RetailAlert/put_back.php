<?php
session_start();
require 'connect.php';
if(!isset($_SESSION['role']))
    header("Location: index.php");

$r_id = intval($_GET['id']);
$q = "UPDATE assistance_queue SET associate_id = NULL WHERE request_id = ".$r_id.";";

if (mysqli_query($db, $q)){
    mysqli_close($db);
    header('Location: profile.php');
    exit;
} else {
    echo 'error';
}