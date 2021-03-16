<?php 
session_start();
ini_set("session.cookie_httponly", 1);
header("Content-Type: application/json"); // set the MIME Type to application/json

require 'database.php'; 

// TODO: csrf vibe check
// require 'get_token.php';

// because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
// // this will store the data into an associative array
$json_obj = json_decode($json_str, true);


// make sure not empty
if ($date = "" || $event_name = "" || $user = "" || $tag = ""){
	echo json_encode(array(
		"success" => false,
		"message" => "Make sure to fill out all fields!"
	));
	exit;
}

// TODO: make sure tag is one of the enum values 
// Source: https://stackoverflow.com/questions/2350052/how-can-i-get-enum-possible-values-in-a-mysql-database


// // do actual work of inserting event into SQL
$stmt = $mysqli->prepare("UPDATE `events` SET `date_time`=?, `event_name`=?, `tag`=? where `id`=? AND `username`=?");

$date = DateTime::createFromFormat('Y-m-d\TH:i', (string) $json_obj['date'])->format('Y-m-d H:i:s');
$event_name = (string) $json_obj['event_name'];
$user = (string) $json_obj['user'];
$tag = (string) $json_obj['tag']; //TODO: need to somehow have enum in html or check tag here
$id = (int) $json_obj['id'];

if(!$stmt){
	$error = printf("Query Prep Failed: %s\n", $mysqli->error);

	echo json_encode(array(
		"success" => false,
		"message" => $error
	));
	exit;
}

// bind parameters to execute sql query
$stmt->bind_param('sssss', $date, $event_name, $tag, $id, $user);
$stmt->execute();
$stmt->close();

// if reached here, great success
echo json_encode(array(
    "success" => true
));

exit;