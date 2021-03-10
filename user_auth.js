/* TODO
Check login info using json from SQL db 
*/

//// Send login info to user_auth.php to validate user + create relevant variables ////
let login_button = document.getElementsByClassName("user")[0].getElementsByClassName("login")[0];

login_button.addEventListener('click', function(){
	let user = String(document.getElementById("user_username").value);
    let pwd = String(document.getElementById("user_password").value);

    const login_data = { 'username': user, 'password': pwd };
    fetch('user_auth.php', {
        //Add headers
        // Sourced from: https://stackoverflow.com/questions/37269808/react-js-uncaught-in-promise-syntaxerror-unexpected-token-in-json-at-posit
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(login_data)
    })
    .then(res => res.json())
    .then(response => {
        console.log('Success:', response);

        //if successful login, alert and redirect to calendar page, else alert
        if(response.success){
            alert("welcome " + user + "!");

            //show all the calendar-related stuff
        }
        else {
            alert("Incorrect username or password");
        }
    })
    .catch(error => console.error('Error:', error));
});










/* TODO
if user exists, hide all, trigger event listener for calendar
*/

/* TODO
if not, alert saying username is incorrect
*/