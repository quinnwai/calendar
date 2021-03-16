let user = "";
let token = "";

/* ~~~~~~~~~~~Edit Event ~~~~~~~~~~~~ */
function edit_event_form(id){
    $(".edit_event").show();

    console.log(document.getElementsByClassName("edit_event")); //debug
    console.log(document.getElementsByClassName("edit_event")[0].getElementsByClassName("edit")[0]);
    let edit_event_button = document.getElementsByClassName("edit_event")[0].getElementsByClassName("edit")[0]; //should be in a div

    edit_event_button.addEventListener('click', function(){
        //assume there are boxes for id 
        let date = String(document.getElementById("edit_event_date").value); // TODO: make sure date anad time works
        let event_name = String(document.getElementById("edit_event_name").value);

        // import { user, token } from user_auth.js; //TODO: make sure works w/ list thing

        let tag = String(document.getElementById("edit_event_tag").value); //need to figure out what's up with this
        
        // let id = Integer(edit_event_button.id);

        const data = { 'date': date, 'event_name': event_name, 'user': user, 'tag': tag, 'id': id, 'token': token };
        // const data = { 'date': date, 'event_name': event_name, 'user': user, 'tag': tag, 'id': id}; //debug
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
                updateCalendar();

                //get rid of edit event
                document.getElementById("edit_event_date").value = "";
                document.getElementById("edit_event_name").value = "";
                document.getElementById("edit_event_tag").value = "";
                $(".edit_event").hide();
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
        console.log('Success:', response);

        //if successful login, alert and redirect to calendar page, else alert
        if(response.success){
            alert("welcome " + user + "!");

            // TODO: show calendar things + fill events
            updateCalendar();

            // hide login info, show add event info
            $(".user").hide();
            $(".registration").hide();
            $(".add_event").show();

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
                if(typeof token !== 'undefined'){
                    token = "";
                }
                
                // TODO: call on update calendar
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

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let weekDaysText = "";
for (let i = 0; i < days.length; i++) {
  weekDaysText += '<th class="calendar-0lax">' + days[i] + '</th>';
}
document.getElementById("week-days").innerHTML = weekDaysText;

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

document.addEventListener("DOMContentLoaded", function(){
	initCalendar();
});

//initialises calendar with 7 colums and 6 rows
function initCalendar() {
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
	let c = 0;

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
	if (typeof user !== 'undefined'){
		loadEventData();
	}	
}

let tag_display = true;

//	Code for fetch request... TODO: make sure to import user and token variable
document.getElementsByClassName("tag_display")[0].addEventListener("click", function(event){
	tag_display = !tag_display // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	alert("The tag display mode has been changed");
}, false);

function loadEventData() {
const eventData = { 'user': user
// , 'token': token 
};
allEvents = [];
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
for(let i = 0; i<allEvents.length; i++){
		//check if month matches, display event if it does
		let month = parseInt(allEvents[i].dateTime.substring(5, 7));
		//currentMonth + 1 because it starts at 0, while sql starts at 1
		if (month == (currentMonth.month+1)) {
			let day = parseInt(allEvents[i].dateTime.substring(8, 10))
			let box =  day + currentMonth.getDateObject(1).getDay();
			let r = Math.floor(box/7);
			let c = (box % 7-1);
			let time = allEvents[i].dateTime.substring(11, 16);
			document.getElementById("day-display" + r + "," + c).innerHTML+= 
			 "<p>"+ time + " - " + allEvents[i].name;
			 
			 if (tag_display){
			 document.getElementById("day-display" + r + "," + c).innerHTML+= "(" + allEvents[i].tag + ")";
			 }
			 
			 document.getElementById("day-display" + r + "," + c).innerHTML+= "</p>"
			 +"<button id = e" + allEvents[i].id + "> Edit </button>"
			 +"<button id = d" + allEvents[i].id + " > Delete </button>";
             document.getElementById("e" +allEvents[i].id).addEventListener("click", function(event){
                console.log("edit entered");
                edit_event_form(allEvents[i].id);
            }, false);
           
            document.getElementById("d" +allEvents[i].id).addEventListener("click", function(event){

               //TODO: send out delete request
               console.log(allEvents[i].id);
               const data = { 'user': user, 'id': allEvents[i].id, 'token': token};
               console.log(data); //debug

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
	}
})};

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	alert("The new month is "+ (currentMonth.month + 1) +" "+currentMonth.year);
}, false);

// Change the month when the "prev" button is pressed
document.getElementById("prev_month_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	alert("The new month is "+ (currentMonth.month + 1) +" "+currentMonth.year);
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
        let grp = String(document.getElementById("add_event_grp").value).split(" ");
        grp.push(user);

        for(let i = 0; i<grp.length; i++) {
        // const data = { 'date': date, 'event_name': event_name, 'user': user, 'tag': tag, 'token':token };
        const data = { 'date': date, 'event_name': event_name, 'user': grp[i], 'tag': tag, 'token': token}; //debug
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
                //for added efficiency - only update calendat if it is at the end of the loop. basically, just update once. 
                if (i === grp.length - 1) {
                updateCalendar();
                }
            }
            else{
                alert(response.message);
            }
        });
    }
    alert("Event successfully added!");   
    });
});
