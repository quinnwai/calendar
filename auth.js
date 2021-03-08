/* TODO
Check login info using json from SQL db 
*/

//// Send login info to user_auth.php to validate user + create relevant variables ////
console.log(document.getElementsByClassName("user"));
let button = document.getElementsByClassName("user")[0].getElementById("login");
button.addEventListener('click', function(){
    let user = document.body.getElementsByClassName("user")[0].getElementById("username").textContent;
    let pass = document.body.getElementsByClassName("user")[0].getElementById("password").textContent;

    //debugging
    console.log(user);
    console.log(pass);

    // const login_data = { username: user, password: pass };
    // fetch('/user_auth.php', {
    //     method: "POST",
    //     body: JSON.stringify(login_data)
    // }).then

    //   .then(res => res.json())
    //   .then(response => console.log('Success:', JSON.stringify(response)))
    //   .catch(error => console.error('Error:',error))
});










/* TODO
if user exists, hide all, trigger event listener for calendar
*/

/* TODO
if not, alert saying username is incorrect
*/