<?php
DEFINE ('DB_USER', '### REDACTED ###');
DEFINE ('DB_PASSWORD', '### REDACTED ###');
DEFINE ('DB_HOST', '### REDACTED ###');
DEFINE ('DB_NAME', 'retail_alert_db');


$db = @mysqli_connect (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) OR die ('Could not connect to
MySQL: ' . mysqli_connect_error() );

mysqli_set_charset($db, 'utf8');