<?php

/* Code for fetch request... TODO: make sure to import user and token variable


const data = { 'user': user, 'token': token };
fetch('load_events.php', {
    //Add headers
    // Sourced from: https://stackoverflow.com/questions/37269808/react-js-uncaught-in-promise-syntaxerror-unexpected-token-in-json-at-posit
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(data)
})
.then(res => res.json())
.then(response => {
    if(data.success){
        alert("event successfully added!")
    }
    else{
        alert(data.message);
    }
});
*/

header("Content-Type: application/json"); // set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Access json object (associative array)
$user = (string) $json_obj['user'];
$user = (string) $json_obj['token'];

// csrf vibe check
require 'get_token.php';

require 'database.php'; 

// debugging: making sure that this works in aws first
// $user = 'firstlast';

//TODO: require CSRF authentication
// require '';

// Prepared SQL statement
$stmt = $mysqli->prepare("SELECT id, date_time, name, tag, group_name FROM events WHERE username = ?");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

// Bind the parameter(? becomes $user) and get all info
$stmt->bind_param('s', $user);
$stmt->execute();
$result = $stmt->get_result();

// Bind the results
echo "{";
for($count = 0; $row = $result->fetch_assoc(); ++$count){
    if($count != 0){
        echo ", ";
    }
    echo $count;
    echo ":";
	echo json_encode($row);
}
echo "}";

//send json back
// echo json_encode($result);

?>