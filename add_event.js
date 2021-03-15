//Sourced from https://stackoverflow.com/questions/32222255/cant-access-the-value-of-htmlcollection
window.addEventListener('load', function () {
    console.log(document.getElementsByClassName("add_event")); //debug
    console.log(document.getElementsByClassName("add_event")[0].getElementsByClassName("add")[0]);
    let add_event_button = document.getElementsByClassName("add_event")[0].getElementsByClassName("add")[0]; //should be in a div

    add_event_button.addEventListener('click', function(){
        //assume there are boxes for id 
        let date = String(document.getElementById("add_event_date").value); // TODO: make sure date anad time works
        let event_name = String(document.getElementById("add_event_name").value);

        // import { user, token } from user_auth.js; //TODO: make sure works w/ list thing
        let user = 'firstlast'; //debug

        let tag = String(document.getElementById("add_event_tag").value); //need to figure out what's up with this
        

        // const data = { 'date': date, 'event_name': event_name, 'user': user, 'tag': tag, 'token':token };
        const data = { 'date': date, 'event_name': event_name, 'user': user, 'tag': tag}; //debug
        console.log(data); //debug
        fetch('add_event.php', {
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
                alert("Event successfully added!")
            }
            else{
                alert(response.message);
            }
        });
    });
});