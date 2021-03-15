<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Calendar Login</title>
    <meta name="login" content="login page for the news site"/>
    <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
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


<!-- user registration -->
<div class="registration">
<h2>New Users</h2>
<p>Want to make an account?</p>

<label>First Name: <input type="text" id="first_name" /> </label> 
<label>Last Name: <input type="text" id="last_name" /> </label> <br><br>
<label>Username: <input type="text" id="new_username" /> </label> 
<label>Password: <input type="password" id="new_password" /> </label>
<button id ="register">register</button>
</div>
<br>

<table id="calendar" class="calendar">
    <thead>
        <td id="current-month-text" colspan="7"> </tr>
        <tr id = "week-days">
        </tr>
    </thead>
    <tbody id = "month-display">
        
    </tbody>
</table>


<button id="prev_month_btn">Previous Month</button>
<button id="next_month_btn">Next Month</button>

</body>
    <!-- <script src="user_auth.js"></script>   -->
    <script src="register.js"></script>
    <script src="combined.js"></script>
    <!-- <script src="calendar.js"></script> -->
</html>