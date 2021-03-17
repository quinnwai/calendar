let user = "";
let token = "";

/* ~~~~~~~~~~~Edit Event ~~~~~~~~~~~~ */
function edit_event_form(id){
    $(".edit_event").show();
    //disable all other buttons -- make sure no other action can be done so it is more secure and user friendly
document.getElementsByClassName("add")[0].disabled = true;
document.getElementById("next_month_btn").disabled = true;
document.getElementById("prev_month_btn").disabled = true;
document.getElementsByClassName("logout")[0].disabled = true;
    const eventData = { 'user': user, 'token': token };
    let currentEvents = [];
    fetch('load_events.php', {
        // Sourced from: https://stackoverflow.com/questions/37269808/react-js-uncaught-in-promise-syntaxerror-unexpected-token-in-json-at-posit
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(eventData)
    })
    .then(res => res.json())
    .then(response => {
    response.forEach(el => {
        currentEvents.push({"id": el.id, "dateTime": el.date_time, "name": el.event_name, "tag": el.tag});
    });
    for(let i = 0; i<currentEvents.length; i++){
        //check if month matches, display event if it does
        let month = parseInt(currentEvents[i].dateTime.substring(5, 7));
        //currentMonth + 1 because it starts at 0, while sql starts at 1
        if (month == (currentMonth.month+1)) {
            document.getElementById("d" + currentEvents[i].id).disabled = true;
            //let edit button be enabled for the one that's pressed so he knows which one it is for ease of access
            if (id !== currentEvents[i].id) {
            document.getElementById("e" + currentEvents[i].id).disabled = true;  
            }
            else {
                document.getElementById("edit_event_name").value = currentEvents[i].name;
                document.getElementById("edit_event_date").value = currentEvents[i].dateTime.replace(" ", "T");
                document.getElementById("edit_event_tag").value =  currentEvents[i].tag;
            }
        }
    }
    }
);

    // console.log(document.getElementsByClassName("edit_event")); //debug
    // console.log(document.getElementsByClassName("edit_event")[0].getElementsByClassName("edit")[0]);
    let edit_event_button = document.getElementsByClassName("edit_event")[0].getElementsByClassName("edit")[0]; //should be in a div

    edit_event_button.addEventListener('click', function(){
        //assume there are boxes for id 
        let date = String(document.getElementById("edit_event_date").value); 
        let event_name = String(document.getElementById("edit_event_name").value);

        let tag = String(document.getElementById("edit_event_tag").value);
        

        const data = { 'date': date, 'event_name': event_name, 'user': user, 'tag': tag, 'id': id, 'token': token };
        // const data = { 'date': date, 'event_name': event_name, 'user': user, 'tag': tag, 'id': id}; //debug
        // console.log(data); //debug
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
                updateCalendar();

                //get rid of edit event
                document.getElementById("edit_event_date").value = "";
                document.getElementById("edit_event_name").value = "";
                document.getElementById("edit_event_tag").value = "";
                $(".edit_event").hide();
                document.getElementsByClassName("add")[0].disabled = false;
                document.getElementById("next_month_btn").disabled = false;
                document.getElementById("prev_month_btn").disabled = false;
                document.getElementsByClassName("logout")[0].disabled = false;
            }
            else{
                alert(response.message);
            }
        });
    });
}

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
        // console.log('Success:', response); //debug

        //if successful login, alert and redirect to calendar page, else alert
        if(response.success){
            alert("welcome " + user + "!");

            // update token
            token = response.token;

            // show calendar things + fill events
            updateCalendar();

            // hide login info, show add event info/tag display
            $(".user").hide();
            $(".registration").hide();
            $(".add_event").show();
            $(".toggle_tag").show();

            // create logout button
            const logout_button = document.createElement("button");
            logout_button.className = "logout";
            logout_button.appendChild(document.createTextNode("logout"));
            document.body.appendChild(logout_button);

            //add event listener for logout button
            document.getElementsByClassName("logout")[0].addEventListener('click', function(){
                alert("Successfully logged out!");
                
                if(typeof user !== 'undefined'){
                    user = "";
                    
                }
                if(typeof token !== 'undefined'){
                    token = "";
                }
                
                // call on update calendar
                updateCalendar();

                //delete logout button and show old stuff again
                $(".logout").remove();
                $(".user").show();
                $(".registration").show();
                $(".toggle_tag").hide();
                $(".add_event").hide();
                $(".edit_event").hide();


                //delete session variables
                fetch('logout.php', {});
            });
        }
        else {
            alert("Incorrect username or password");
        }
    })
    .catch(error => console.error('Error:', error));
});


/*                  CALENDAR                        */

(function () {
	"use strict";

	/* Date.prototype.deltaDays(n)
	 * 
	 * Returns a Date object n days in the future.
	 */
	Date.prototype.deltaDays = function (n) {
		// relies on the Date object to automatically wrap between months for us
		return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
	};

	/* Date.prototype.getSunday()
	 * 
	 * Returns the Sunday nearest in the past to this date (inclusive)
	 */
	Date.prototype.getSunday = function () {
		return this.deltaDays(-1 * this.getDay());
	};
}());

/** Week
 * 
 * Represents a week.
 * 
 * Functions (Methods):
 *	.nextWeek() returns a Week object sequentially in the future
 *	.prevWeek() returns a Week object sequentially in the past
 *	.contains(date) returns true if this week's sunday is the same
 *		as date's sunday; false otherwise
 *	.getDates() returns an Array containing 7 Date objects, each representing
 *		one of the seven days in this month
 */
function Week(initial_d) {
	"use strict";

	this.sunday = initial_d.getSunday();		
	
	this.nextWeek = function () {
		return new Week(this.sunday.deltaDays(7));
	};
	
	this.prevWeek = function () {
		return new Week(this.sunday.deltaDays(-7));
	};
	
	this.contains = function (d) {
		return (this.sunday.valueOf() === d.getSunday().valueOf());
	};
	
	this.getDates = function () {
		var dates = [];
		for(var i=0; i<7; i++){
			dates.push(this.sunday.deltaDays(i));
		}
		return dates;
	};
}



/** Month
 * 
 * Represents a month.
 * 
 * Properties:
 *	.year == the year associated with the month
 *	.month == the month number (January = 0)
 * 
 * Functions (Methods):
 *	.nextMonth() returns a Month object sequentially in the future
 *	.prevMonth() returns a Month object sequentially in the past
 *	.getDateObject(d) returns a Date object representing the date
 *		d in the month
 *	.getWeeks() returns an Array containing all weeks spanned by the
 *		month; the weeks are represented as Week objects
 */
function Month(year, month) {
	"use strict";
	
	this.year = year;
	this.month = month;
	this.nextMonth = function () {
		return new Month( year + Math.floor((month+1)/12), (month+1) % 12);
	};
	
	this.prevMonth = function () {
		return new Month( year + Math.floor((month-1)/12), (month+11) % 12);
	};
	
	this.getDateObject = function(d) {
		return new Date(this.year, this.month, d);
	};
	
	this.getWeeks = function () {
		var firstDay = this.getDateObject(1);
		var lastDay = this.nextMonth().getDateObject(0);
		
		var weeks = [];
		var currweek = new Week(firstDay);
		weeks.push(currweek);
		while(!currweek.contains(lastDay)){
			currweek = currweek.nextWeek();
			weeks.push(currweek);
		}
		
		return weeks;
	};
}

///////////////////////////////////////

let currentMonth = new Month(2021, 2); //  March 2021
let allEvents = [];

//if session exists, load all user content
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
        // console.log(response);
        if(response.success){
            // reset global variable in js
            if(typeof user !== 'undefined'){
                user = response.user;
            }
            else{
                let user = response.user;
            }
            if(typeof token !== 'undefined'){
                token = response.token;
            }
            else{
                let token = response.token;
            }
            

            // show calendar things + fill events
            initCalendar();

            // hide login info, show add event info/tag display
            $(".user").hide();
            $(".registration").hide();
            $(".add_event").show();
            $(".toggle_tag").show();
            $(".edit_event").hide();

            // create logout button
            const logout_button = document.createElement("button");
            logout_button.className = "logout";
            logout_button.appendChild(document.createTextNode("logout"));
            document.body.appendChild(logout_button);

            //add event listener for logout button
            document.getElementsByClassName("logout")[0].addEventListener('click', function(){
                alert("Successfully logged out!");
                
                if(typeof user !== 'undefined'){
                    user = "";
                    
                }
                if(typeof token !== 'undefined'){
                    token = "";
                }
                
                // call on update calendar
                updateCalendar();

                //delete logout button and show old stuff again
                $(".logout").remove();
                $(".user").show();
                $(".registration").show();
                $(".toggle_tag").hide();
                $(".add_event").hide();

                //delete session variables
                fetch('logout.php', {});
            });
        }
        else {
            //hide all calendar elements if necessary
            $(".add_event").hide();
            $(".edit_event").hide();
            $(".toggle_tag").hide();

            initCalendar();
        }
    });
    // console.log(user);
    // console.log(token);
});

//initialises calendar with 7 colums and 6 rows
function initCalendar() {
    document.getElementById("month-display").innerHTML += '<tr> <td id="current-month-text" colspan="7"> </td> </tr>';
    document.getElementById("month-display").innerHTML += '<tr id = "week-days">';

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let weekDaysText = "";
    for (let i = 0; i < days.length; i++) {
        weekDaysText += '<th class="calendar-0lax">' + days[i] + '</th>';
    }
    weekDaysText+= "</tr>";
    document.getElementById("week-days").innerHTML = weekDaysText;
    for (let i = 0; i < 6; i++) {
        //giving each table tow appropriate username
        document.getElementById("month-display").innerHTML += '<tr id="week-display' + i + '"></tr>';
        for (let j = 0; j < 7; j++) {
            //giving each table cell appropriate username
            let emptyRows = '<td id = "day-display' + i + "," + j + '" class="calendar-0lax">' + "" + '</td>';
            document.getElementById("week-display" + i).innerHTML += emptyRows;
        }
    }
	displayCalendarData(currentMonth);
}

function displayCalendarData(currentMonth) {
    //flag to know when to stop.. when the month ends
    let flag = 0;

    //first day of month so it can be filled with empty cells
    let firstDayOfMonth = currentMonth.getDateObject(1).getDay();

    //start with first day of month
    let dayOfMonth = 1;

    //update header which displays current month
    let currentMonthText = currentMonth.month + 1 + "/" + currentMonth.year;
    document.getElementById("current-month-text").innerHTML ="Current Month: " + currentMonthText;
        
    //empty cells for all dates before the first of the month
    for (let k = 0; k < firstDayOfMonth; k++) {
        document.getElementById("day-display" + 0 + "," + k).innerHTML = "";	
    }

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            //skip through empty cells
            j += firstDayOfMonth;

            firstDayOfMonth = 0;
            let date = currentMonth.getDateObject(dayOfMonth).getDate();
             if (date == 1) {     
                flag++;
            }
            //flag value of 2 signifies end of month
            if (flag < 2) {
            document.getElementById("day-display" + i + "," + j).innerHTML = date;
            // document.getElementById("day-display" + i + "," + j).value = "";
            // $("#day-display" + i + "," + j).delete();
            // then append child and date
			
            //increment day
            dayOfMonth++;
            }
            else {
                //empty cells for every cell after the real month data ends
                document.getElementById("day-display" + i + "," + j).innerHTML = "";
            }
        }
    }
	if (typeof user !== 'undefined' && user != ""){
		loadEventData();
	}	
}

let tag_display = true;

document.getElementsByClassName("tag_display")[0].addEventListener("click", function(event){
	tag_display = !tag_display // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	// alert("The tag display mode has been changed");
}, false);

function loadEventData() {
    const eventData = { 'user': user, 'token': token };
    allEvents = [];
    // console.log("load event data: "); //debug
    // console.log(eventData);
    fetch('load_events.php', {
        // Sourced from: https://stackoverflow.com/questions/37269808/react-js-uncaught-in-promise-syntaxerror-unexpected-token-in-json-at-posit
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(eventData)
    })
    .then(res => res.json())
    .then(response => {
    response.forEach(el => {
        allEvents.push({"dateTime": (el.date_time), "name": el.event_name, "tag": el.tag, "id": el.id});
    });
    let monthEvents = []
    for(let i = 0; i<allEvents.length; i++){
        //check if month matches, display event if it does
        let month = parseInt(allEvents[i].dateTime.substring(5, 7));
        //currentMonth + 1 because it starts at 0, while sql starts at 1
        if (month == (currentMonth.month+1)) {
            //day for event
            let day = (parseInt(allEvents[i].dateTime.substring(8, 10)));
            //which box contains the event... add empty boxes to day
            let box =  day + parseInt(currentMonth.getDateObject(1).getDay()) - 1;
            //row for event data
            let r = (Math.floor(box/7));
            //column for event data
            let c = (box % 7);
            let time = allEvents[i].dateTime.substring(11, 16);
            document.getElementById("day-display" + r + "," + c).innerHTML+= 
            "<p>"+ time + " - " + allEvents[i].name;
            
            //display tags based on global variable
            if (tag_display){
            document.getElementById("day-display" + r + "," + c).innerHTML+= "(" + allEvents[i].tag + ")";
            }
            //create edit, delete buttons
            document.getElementById("day-display" + r + "," + c).innerHTML+= "</p>"
            +"<button id = e" + allEvents[i].id + "> Edit </button>"
            +"<button id = d" + allEvents[i].id + " > Delete </button>";
        }
    }
    allEvents.forEach(el => {
        //check if month matches, display event if it does
        let month = parseInt(el.dateTime.substring(5, 7));
        //currentMonth + 1 because it starts at 0, while sql starts at 1
        if (month == (currentMonth.month+1)) {

            document.getElementById("e" +el.id).addEventListener("click", function(event){
                // console.log("edit entered");
                edit_event_form(el.id);
            }, false);
            // document.getElementById("e" +allEvents[i].id).addEventListener("click", HandleEditSubmit);
            
            document.getElementById("d" +el.id).addEventListener("click", function(event){

            // console.log(el.id);
            const data = { 'user': user, 'id': el.id, 'token': token};
            // console.log(data); //debug

            fetch('delete_event.php', {
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
                    alert("Successfully deleted the event!");
                    updateCalendar();
                }
                else{
                    alert(response.message);
                }
            });
            }, false);
        }
    });
    }
)};

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
}, false);

// Change the month when the "prev" button is pressed
document.getElementById("prev_month_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
}, false);


// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
function updateCalendar(){
	var weeks = currentMonth.getWeeks();
	
	for(var w in weeks){
		var days = weeks[w].getDates();
		// days contains normal JavaScript Date objects.
		
		// alert("Week starting on "+days[0]);
		
		// for(var d in days){
		// 	// You can see console.log() output in your JavaScript debugging tool, like Firebug,
		// 	// WebWit Inspector, or Dragonfly.
		// 	console.log(days[d].toISOString());
		// }
	}
	 displayCalendarData(currentMonth);
}

/*              Add event material                  */

window.addEventListener('load', function () {
    // console.log(document.getElementsByClassName("add_event")); //debug
    // console.log(document.getElementsByClassName("add_event")[0].getElementsByClassName("add")[0]);
    let add_event_button = document.getElementsByClassName("add_event")[0].getElementsByClassName("add")[0]; //should be in a div

    add_event_button.addEventListener('click', function(){
        //assume there are boxes for id 
        let date = String(document.getElementById("add_event_date").value); 
        let event_name = String(document.getElementById("add_event_name").value);

        // let user = 'firstlast'; //debug

        let tag = String(document.getElementById("add_event_tag").value); //need to figure out what's up with this
        let grp = String(document.getElementById("add_event_grp").value).split(",");
        grp.push(user);

        for(let i = 0; i<grp.length; i++) {
        const data = { 'date': date, 'event_name': event_name, 'user': grp[i], 'tag': tag, 'token': token}; //debug
        // console.log(data); //debug
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
                //for added efficiency - only update calendat if it is at the end of the loop. basically, just update once. 
                if (i === grp.length - 1) {
                updateCalendar();
                }

                document.getElementById("add_event_name").value = "";
                document.getElementById("add_event_date").value = "";
                document.getElementById("add_event_tag").value = "school";
                document.getElementById("add_event_grp").value = "";
            }
            else{
                alert(response.message);
            }
        });
    }
    alert("Event successfully added!");   
    });
});
