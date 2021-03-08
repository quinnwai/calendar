<?php 
session_start();
$_SESSION['user'] = "";
$_SESSION['isUser'] = false;
$_SESSION['token'] = bin2hex(random_bytes(32));
?>