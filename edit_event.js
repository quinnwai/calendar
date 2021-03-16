window.addEventListener('load', function () {
    console.log(document.getElementsByClassName("edit_event")); //debug
    console.log(document.getElementsByClassName("edit_event")[0].getElementsByClassName("edit")[0]);
    let edit_event_button = document.getElementsByClassName("edit_event")[0].getElementsByClassName("edit")[0]; //should be in a div

    edit_event_button.addEventListener('click', function(){
        //assume there are boxes for id 
        let date = String(document.getElementById("edit_event_date").value); // TODO: make sure date anad time works
        let event_name = String(document.getElementById("edit_event_name").value);

        // import { user, token } from user_auth.js; //TODO: make sure works w/ list thing
        let user = 'firstlast'; //debug TODO: change

        let tag = String(document.getElementById("edit_event_tag").value); //need to figure out what's up with this
        

        // const data = { 'date': date, 'event_name': event_name, 'user': user, 'tag': tag, 'token':token };
        const data = { 'date': date, 'event_name': event_name, 'user': user, 'tag': tag, 'id': id}; //debug
        console.log(data); //debug
        fetch('edit_event.php', {
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
            if(response.success){
                alert("Event successfully edited!")
            }
            else{
                alert(response.message);
            }
        });
    });
});