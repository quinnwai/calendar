/* TODO
Add event listener for successful login, 1 variable for logged-in, 1 for show calendar (uncertain how to do that)
also TODO: ensure there's no security issues here
*/

/*
create calendar layout with 5x7 grid, back button, front button
if user is logged in, events loaded into boxes (how?)
else just the calendar no events
*/

let user = "firstlast";

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

// let currentWeek = new Week(9);
// console.log(currentWeek.sunday);

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

let currentMonth = new Month(2021, 2); //  March 2021
let allEvents = [];
initCalendar();

console.log(currentMonth.getDateObject(2));


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
	
	// allEvents.forEach(el => {
	// 	console.log(el);
	// 	console.log(el.date_time);
	// 	if (el.date_time.getMonth() == currentMonth) {
	// 		monthEvents.push(el);
	// 	}
	// });
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
			
            //increment day
            dayOfMonth++;
            }
            else {
                //empty cells for every cell after the real month data ends
                document.getElementById("day-display" + i + "," + j).innerHTML = "";
            }
        }
    }
	loadEventData();
		
}


//	Code for fetch request... TODO: make sure to import user and token variable

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
	console.log(response);
	allEvents.push({"dateTime": (el.date_time), "name": el.event_name, "tag": el.tag});
	console.log(allEvents);
});
for(let i = 0; i<allEvents.length; i++){
	console.log(allEvents[i].dateTime);
		//check if month matches, display event if it does
		let month = parseInt(allEvents[i].dateTime.substring(5, 7));
		//currentMonth + 1 because it starts at 0, while sql starts at 1
		if (month == (currentMonth.month+1)) {
			let day = parseInt(allEvents[i].dateTime.substring(8, 10))
			let box =  day + currentMonth.getDateObject(1).getDay();
			let r = Math.floor(box/7);
			let c = (box % 7-1);
			let time = allEvents[i].dateTime.substring(11, 16);
			console.log(time);
			document.getElementById("day-display" + r + "," + c).innerHTML+= 
			 "<p>"+ time + " - " + allEvents[i].name + "(" + allEvents[i].tag + ")" + "</p>";
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
		
		for(var d in days){
			// You can see console.log() output in your JavaScript debugging tool, like Firebug,
			// WebWit Inspector, or Dragonfly.
			console.log(days[d].toISOString());
		}
	}
	 displayCalendarData(currentMonth);
}