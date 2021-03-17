<?php
session_start();
ini_set("session.cookie_httponly", 1);
header("Content-Type: application/json"); // set the MIME Type to application/json

//check if session varaibles are set... if so, then send back
if(isset($_SESSION['username']) && isset($_SESSION['token'])){
    echo json_encode(array(
        "success" => true,
        "user" => $_SESSION['username'],
        "token" => $_SESSION['token']
    ));
    exit;
}

// else send false
echo json_encode(array(
    "success" => false
));
?>