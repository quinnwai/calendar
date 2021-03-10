/* TODO
Add event listener for successful login, 1 variable for logged-in, 1 for show calendar (uncertain how to do that)
also TODO: ensure there's no security issues here
*/

/*
create calendar layout with 5x7 grid, back button, front button
if user is logged in, events loaded into boxes (how?)
else just the calendar no events
*/

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

// For our purposes, we can keep the current month in a variable in the global scope
let currentMonth = new Month(2021, 2); //  March 2021
let currentMonthText = currentMonth.month + 1 + "/" + currentMonth.year;
document.getElementById("current-month-text").innerHTML += currentMonthText;
console.log(currentMonth.getWeeks());
let currentWeek = new Week(currentMonth.getDateObject(1));

let prevSunday = currentWeek.sunday.getDate();

let firstDayOfMonth = currentMonth.getDateObject(1).getDay();

let dayOfMonth = firstDayOfMonth;

let flag = 0;
let week = 0;
while (flag < 2) {
    let weekText = '<tr id = "week-display' + week + '">';
    document.getElementById("month-display").innerHTML += weekText;

let j = 0;
while (j < 7) {

    for (let i = 0; i < firstDayOfMonth; i++) {
        let emptyRows = '<td class="calendar-0lax">' + "" + '</td>';
        document.getElementById("week-display" + week).innerHTML += emptyRows;
        j++;
        
    }
    firstDayOfMonth = 0;
    let date = currentMonth.getDateObject(dayOfMonth).getDate();
    if (date == 1) {     
        flag++;
    }
    if (flag < 2) {
    let dateText =  '<td class="calendar-0lax">' + date + '</td>'; 
    document.getElementById("week-display" + week).innerHTML += dateText;
    dayOfMonth++;
    j++;
    }
    else {
        let emptyRows = '<td class="calendar-0lax">' + "" + '</td>';
        document.getElementById("week-display" + week).innerHTML += emptyRows;
        j++;
    }
}
    document.getElementById("month-display").innerHTML += "</tr>";
    week++;
}


console.log(currentWeek.sunday.getDate());
console.log(currentMonth.getDateObject(1));

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);


// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
function updateCalendar(){
	var weeks = currentMonth.getWeeks();
	
	for(var w in weeks){
		var days = weeks[w].getDates();
		// days contains normal JavaScript Date objects.
		
		alert("Week starting on "+days[0]);
		
		for(var d in days){
			// You can see console.log() output in your JavaScript debugging tool, like Firebug,
			// WebWit Inspector, or Dragonfly.
			console.log(days[d].toISOString());
		}
	}
}