<?php
//just check CSRF token across webpage
//be sure to include this for all sites getting post data

if(!hash_equals($_SESSION['token'], $json_obj['token'])){
    session_destroy();
    echo json_encode(array(
		"success" => false,
        "message" => "Request forgery detected, please login again"
	));
    exit;
}
?>
