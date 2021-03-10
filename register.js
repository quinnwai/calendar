//listener for reigstration button click
var register_button = document.getElementById("register")
register_button.addEventListener('click', function(){
    //create json with user info
    let user = String(document.getElementById("new_username").value);
    let pwd = String(document.getElementById("new_password").value);
    let first_name = String(document.getElementById("first_name").value);
    let last_name = String(document.getElementById("last_name").value);

    //post json to php file
    const login_data = { 'username': user, 'password': pwd, 'first_name': first_name, 'last_name': last_name };
    fetch('register.php', {
        method: "POST",
        body: JSON.stringify(login_data)
    })
    .then(res => res.json())
    .then(response => {
        console.log('Results:', JSON.stringify(response));

        if(response.success){
            alert("Welcome " + user +  "!");
        
            //need to clear out new users values as well
            document.getElementById("new_username").value = '';
            document.getElementById("new_password").value = '';
            document.getElementById("first_name").value = '';
            document.getElementById("last_name").value = '';
        }
        else {
            alert(response.message);
            document.getElementById("new_username").value = '';
        }
        
    })

});