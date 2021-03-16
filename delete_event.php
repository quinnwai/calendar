<?php 
session_start();
ini_set("session.cookie_httponly", 1);
header("Content-Type: application/json"); // set the MIME Type to application/json

require 'database.php'; 

// because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
// // this will store the data into an associative array
$json_obj = json_decode($json_str, true);

// TODO: csrf vibe check
require 'get_token.php';

// // do actual work of inserting event into SQL
$stmt = $mysqli->prepare("DELETE FROM `events` WHERE `id`=? AND `username`=?");

// store variables from json
$id = (int) $json_obj['id'];
$user = (string) $json_obj['user'];

if(!$stmt){
	$error = printf("Query Prep Failed: %s\n", $mysqli->error);

	echo json_encode(array(
		"success" => false,
		"message" => $error
	));
	exit;
}

// bind parameters to execute sql query
$stmt->bind_param('ss', $id, $user);
$stmt->execute();
$stmt->close();

// if reached here, great success
echo json_encode(array(
    "success" => true
));
exit;
?>