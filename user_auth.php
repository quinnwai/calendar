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

//TODO: make sure this works
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
	$_SESSION['username'] = $username;
    $_SESSION['isUser'] = true;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

	echo json_encode(array(
		"success" => true,
		"token" => $_SESSION['token']
		//TODO: figure out how to pass csrf token through js (local variable?)
	));
}
else {
	echo json_encode(array(
		"success" => false
	));
}

exit;
// session_start();
// // IMPORTANT: Always use authenticate after using database.php so there is access to the tables //
// require 'database.php'; 

//get post js information



// // Sourced from https://codepen.io/dericksozo/post/fetch-api-json-php
// $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

// if ($contentType === "application/json") {
//   //Receive the RAW post data
//   $content = trim(file_get_contents("php://input"));

//   $decoded = json_decode($content, true);

//   //If json_decode failed, the JSON is invalid
//   if(!is_array($decoded)) {

//   } else {
//     // Send error back to user
//     triggerError("JSON is not readable");
//   }
// }

// // Use a prepared statement
// $stmt = $mysqli->prepare("SELECT COUNT(*), password FROM users WHERE username=?");

// // Bind the parameter (? becomes $username) //TODO: fix
// $user = strtolower((string)($_POST['username']));
// $stmt->bind_param('s', $user);
// $stmt->execute();

// // Bind the results
// $stmt->bind_result($count, $pwd_hash);
// $stmt->fetch();

// //TODO: fix this and have username
// $pwd_guess = (string)$_POST['password']; 

// // Compare the submitted password to the actual password hash
// if($count == 1 && password_verify($pwd_guess, $pwd_hash)){
// 	// set user, CSRF token, and boolean value for later reference
// 	$_SESSION['user'] = $user;
//     $_SESSION['isUser'] = true;
//     $_SESSION['token'] = bin2hex(random_bytes(32));
//     // post session token and isUser

//     // Send json with relevant info
//     // Sourced by https://www.w3schools.com/js/js_json_php.asp
//     $myObj->token = $_SESSION['token'];
//     $myObj->isUser = $_SESSION['isUser'];

//     $myJSON = json_encode($myObj);

//     echo $myJSON;
// // }

// $stmt->close();
?>