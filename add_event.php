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
// echo "checking empties";
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
// $stmt = $mysqli->prepare("INSERT INTO events (date_time, event_name, username, tag) VALUES (?, ?, ?, ?)");
$stmt = $mysqli->prepare("INSERT INTO `events` (`date_time`, `event_name`, `username`, `tag`) VALUES (?,?,?,?)");
// // $stmt = $mysqli->prepare("INSERT INTO events (date_time, name, username, tag) VALUES
// // ('2021-03-21 12:00', 'Walk the Dog', 'firstlast', 'sports')");

// access json object (associative array)
// $date = date("Y-m-d\TH:i:s", strtotime("Sun Mar 14 2021 10:29:34 GMT-0500 (Central Daylight Time)"));
// $date = date($json_obj['date']); // TODO: make sure works w/ echo $date;

$date = DateTime::createFromFormat('Y-m-d\TH:i', (string) $json_obj['date'])->format('Y-m-d H:i:s');
// $date = DateTime::createFromFormat('Y-m-d\TH:i', "2021-03-21T12:00")->format('Y-m-d H:i:s'); //debug all the way down
// var_dump($date);
// echo "\n";

$event_name = (string) $json_obj['event_name'];
// $event_name = "Walking the Dog";
// var_dump($event_name);
// echo "\n";

$user = (string) $json_obj['user'];
// $user = "firstlast";
// var_dump($user);
// echo "\n";

$tag = (string) $json_obj['tag']; //TODO: need to somehow have enum in html or check tag here
// $tag = "sports";
// var_dump($tag);
// echo "\n";


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
$stmt->bind_param('ssss', $date, $event_name, $user, $tag);
// $stmt->bind_param('s', $tag);
$stmt->execute();

// TODO: other option with PDO
// $dbh = new PDO('mysql:host=localhost;dbname=calendar', 'cal_client', 'client_version');

// $sth = $dbh->prepare("INSERT INTO `events` (`date_time`, `event_name`, `username`, `tag`) VALUES ('2021-03-21 12:00:00','event',?,'sports')");
// $sth->bindValue(1, $tag, PDO::PARAM_STR);
// $sth->execute();


// $sth->debugDumpParams();
// echo "\n";

// echo "statement executed";

$stmt->close();
// if reached here, great success
echo json_encode(array(
    "success" => true
));
// $sth->closeCursor();

exit;