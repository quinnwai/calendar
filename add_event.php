<?php 
header("Content-Type: application/json"); // set the MIME Type to application/json

// because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
// this will store the data into an associative array
$json_obj = json_decode($json_str, true);

// access json object (associative array)
$date = date($json_obj['date']); // TODO: make sure works w/ echo $date;
$event_name = (string) $json_obj['event_name'];
$user = (string) $json_obj['user'];
$tag = (string) $json_obj['tag']; //TODO: need to somehow have enum in html or check tag here

// csrf vibe check
require 'get_token.php';

require 'database.php'; 

// do actual work of inserting event into SQL
$stmt = $mysqli->prepare("INSERT INTO events (date, name, user, tag) VALUES (?, ?, ?, ?)");

//TODO: make sure this works
if(!$stmt){
	$error = printf("Query Prep Failed: %s\n", $mysqli->error);

	echo json_encode(array(
		"success" => false,
		"message" => $error
	));
	exit;
}

// bind the parameter (? becomes $username)
$stmt->bind_param('ssss', $date, $event_name, $user, $tag);
$stmt->execute();

// if reached here, great success
echo json_encode(array(
    "success" => true
));
exit;