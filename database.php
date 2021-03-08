<?php
// Content of database.php

// login as prepared user with restricted permissions
// also has update now for comments and stories
$mysqli = new mysqli('localhost', 'cal_client', 'client_version', 'calendar');

// error message if cannot connect
if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>
