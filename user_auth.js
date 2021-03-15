let user = "";
let token = "";

//// Send login info to user_auth.php to validate user + create relevant variables ////
let login_button = document.getElementsByClassName("user")[0].getElementsByClassName("login")[0];

login_button.addEventListener('click', function(){
	user = String(document.getElementById("user_username").value);
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

            //store token
            token = response.token;

            // TODO: show calendar things + fill events
            updateCalendar();

            // hide login stuff
            $(".user").hide();
            $(".registration").hide();

            // create logout button
            const logout_button = document.createElement("button");
            logout_button.className = "logout";
            logout_button.appendChild(document.createTextNode("logout"));
            document.body.appendChild(logout_button);

            //add event listener for logout button
            document.getElementsByClassName("logout")[0].addEventListener('click', function(){
                // TODO: make sure it works
                if(typeof user !== 'undefined'){
                    user = "";
                    
                }
                if(typeof user !== 'undefined'){
                    token = "";
                }


                // TODO: call on calendar
                updateCalendar();

                

                //delete logout button and show old stuff again
                $(".logout").remove();
                $(".user").show();
                $(".registration").show();
            });


            /* TODO: do all calendar-related stuff including...
                - create logout button w/ event listener
                - show add/remove/edit event options
                - hide all login stuff
            */

            // export tokens and username for other files (TODO: make sure works)
            token = response.token; // TODO: make sure this is accesible outside of the things
            // export {user, token};
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

