<?php


header("Content-Type: application/json"); // set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Access json object (associative array)
$user = (string) $json_obj['user'];

// // csrf vibe check
// require 'get_token.php';

require 'database.php'; 

// debugging: making sure that this works in aws first
// $user = 'firstlast';

//TODO: require CSRF authentication
// require '';

// Prepared SQL statement
$stmt = $mysqli->prepare("SELECT id, date_time, event_name, tag, group_name FROM events WHERE username = ? ORDER BY date_time ASC");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->bind_param('s', $user);
$stmt->execute();
$result = $stmt->get_result();

// load in SQL data and 
$rows = array();
while ($row = $result->fetch_assoc()) {
   $row = array_map('htmlentities', $row); // escape output

   $rows[] = $row;
}
print json_encode($rows); // convert to json file type

$stmt->close();
?>