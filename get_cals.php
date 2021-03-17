<?php 
session_start();
ini_set("session.cookie_httponly", 1);
header("Content-Type: application/json"); // set the MIME Type to application/json

require 'database.php'; 

// because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
// // this will store the data into an associative array
$json_obj = json_decode($json_str, true);

// make sure not empty
if ($user = ""){
	echo json_encode(array(
		"success" => false,
		"message" => "Make sure to Log in!"
	));
	exit;
}

// TODO: csrf vibe check
require 'get_token.php';

// TODO: make sure tag is one of the enum values 
// Source: https://stackoverflow.com/questions/2350052/how-can-i-get-enum-possible-values-in-a-mysql-database

// do actual work of getting users whose calendars he can visit
$stmt = $mysqli->prepare("SELECT (`shared_from`) FROM `sharing` WHERE `shared_with` = ?");

// read in values to bind as params
$username_from = (string) $json_obj['user'];

// //TODO: make sure this works
// // echo "checking sql statement";
if(!$stmt){
	$error = printf("Query Prep Failed: %s\n", $mysqli->error);

	echo json_encode(array(
		"success" => false,
		"message" => $error
	));
	exit;
}

// bind the parameters
$stmt->bind_param('s', $user);
// $stmt->bind_param('s', $tag);
$stmt->execute();

$stmt->close();
// if reached here, great success
echo json_encode(array(
    "success" => true
));
// $sth->closeCursor();

exit;