<?php
// clear login-related session variables and redirect
// Source: PHP documentation to remove variables rather than entire session https://www.php.net/manual/en/function.session-destroy.php
session_start();
session_destroy();
?>