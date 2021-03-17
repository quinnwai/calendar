//hide all calendar elements if necessary
$(".add_event").hide();
$(".edit_event").hide();
$(".toggle_tag").hide();

//check if session exists, if so load all the content
document.addEventListener("DOMContentLoaded", function(){
	fetch('init.php', {
        // Sourced from: https://stackoverflow.com/questions/37269808/react-js-uncaught-in-promise-syntaxerror-unexpected-token-in-json-at-posit
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(response => {
        if(response.success){
            user = response.user;
            token = response.token;
        }
    });
});