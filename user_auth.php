<?php 
require 'database.php'; 

header("Content-Type: application/json"); // set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Access json object (associative array)
$user = (string) $json_obj['username'];
$pwd_guess = (string) $json_obj['password'];

// // debugging
// $user = 'username';
// $pwd = 'password';

// Check to see if the username and password are valid
// Use a prepared statement
$stmt = $mysqli->prepare("SELECT COUNT(*), password FROM users WHERE username=?");

// make sure query works
if(!$stmt){
	$error = printf("Query Prep Failed: %s\n", $mysqli->error);

	echo json_encode(array(
		"success" => false,
		"message" => $error
	));
	
	exit;
}

// Bind the parameter (? becomes $username)
$stmt->bind_param('s', $user);
$stmt->execute();

// Bind the results
$stmt->bind_result($count, $pwd_hash);
$stmt->fetch();

// Compare the submitted password to the actual password hash
if($count == 1 && password_verify($pwd_guess, $pwd_hash)){
    session_start();
	ini_set("session.cookie_httponly", 1);
	$_SESSION['username'] = $user;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

	echo json_encode(array(
		"success" => true,
		"token" => $_SESSION['token']
	));
}
else {
	echo json_encode(array(
		"success" => false
	));
}

exit;
?>