<?php 
//// 0: Setup ////
//connect to database  (require acts like an include to include code from other script into here)
require 'database.php';

header("Content-Type: application/json"); // set the MIME Type to application/json

//get POSTed json and convert to assoc array
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

//Get values from associative array
$is_user = false;
$username = strtolower((string) $json_obj['username']);
$first_name = (string) $json_obj['first_name'];
$last_name = (string) $json_obj['last_name'];
$password = (string) $json_obj['password'];


//// 1: Validate Username ////
//read from the users table
$stmt = $mysqli->prepare("select username from users");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->execute();
$stmt->bind_result($username_db);

//for each username (row) in db, check if username already exists
while($stmt->fetch()){
    if ($username == strtolower($username_db)) {
        $is_user = true;
        break;
    }
}; 
$stmt->close();

//// 2: Add User to Table ////

//if username already exists, tell client and store nothing
if($username == "" || $first_name == "" || $last_name == "" || $password == ""){
    echo json_encode(array(
		"success" => false,
		"message" => "Please fill out all information and try again."
	));
}
else if($is_user){
    echo json_encode(array(
		"success" => false,
		"message" => "This username already exist!"
	));
}
else {
    //else store all user data in new row
    $stmt = $mysqli->prepare("insert into users (username, first_name, last_name, password) values (?, ?, ?, ?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->bind_param('ssss', $username, $first_name, $last_name, password_hash($password, PASSWORD_DEFAULT));
    $stmt->execute();
    $stmt->close();

    echo json_encode(array(
		"success" => true
	));
}
exit;
?>