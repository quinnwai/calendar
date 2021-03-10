<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Calendar Login</title>
    <meta name="login" content="login page for the news site"/>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <!-- <script src="calendar.js"></script> -->
    <script src="user_auth.js" async></script>
    <script src="register.js" async></script>
    
</head>
<body>

<?php require 'init.php';?>

<div id="box">
    <h1>Calendar</h1>
</div>

<p>
    Your one stop for calendar and other scheduling needs. 
</p>

<!-- user authentication -->
<div class="user">
    <h2>User Sign-In</h2>
    <p>Login here as a registered user</p>

    <label>Username: <input type="text" id="user_username"/> </label>
    <label>Password: <input type="password" id="user_password"/> </label>
    <input type="hidden" name="isUser" value="user"/>
    <button class="login">login</button>
</div>


<!-- guest authentication -->
<div class="guest">
    <h2>Guest Sign-In</h2>
    <p>Don't have an account?</p>
    Proceed as guest: <button id ="login">guest login</button>
</div>



<div class="registration">
<h2>New Users</h2>
<p>Want to make an account?</p>

<label>First Name: <input type="text" id="first_name" /> </label> 
<label>Last Name: <input type="text" id="last_name" /> </label> <br><br>
<label>Username: <input type="text" id="new_username" /> </label> 
<label>Password: <input type="password" id="new_password" /> </label>
<button id ="register">register</button>
</div>

</body> 
</html>