<?php
//just check CSRF token across webpage
//be sure to include this for all sites getting post data

if(!hash_equals($_SESSION['token'], $_POST['token'])){
    session_destroy();
    die("Request forgery detected, please login again");
}
?>
