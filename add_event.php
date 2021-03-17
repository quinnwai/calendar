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
if ($date = "" || $event_name = "" || $user = "" || $tag = ""){
	echo json_encode(array(
		"success" => false,
		"message" => "Make sure to fill out all fields!"
	));
	exit;
}

// csrf vibe check
require 'get_token.php';


// do actual work of inserting event into SQL
$stmt = $mysqli->prepare("INSERT INTO `events` (`date_time`, `event_name`, `username`, `tag`) VALUES (?,?,?,?)");

// read in values to bind as params
$date = DateTime::createFromFormat('Y-m-d\TH:i', (string) $json_obj['date'])->format('Y-m-d H:i:s');
$event_name = (string) $json_obj['event_name'];
$user = (string) $json_obj['user'];
$tag = (string) $json_obj['tag'];



// check query
if(!$stmt){
	$error = printf("Query Prep Failed: %s\n", $mysqli->error);

	echo json_encode(array(
		"success" => false,
		"message" => $error
	));
	exit;
}

// bind the parameters
$stmt->bind_param('ssss', $date, $event_name, $user, $tag);
// $stmt->bind_param('s', $tag);
$stmt->execute();

$stmt->close();
// if reached here, great success
echo json_encode(array(
    "success" => true
));

exit;