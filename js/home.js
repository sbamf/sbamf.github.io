var start = new Date('2022-4-14');
var today = new Date();
var time = today.getTime() - start.getTime();


var years = document.getElementById("years");
years.textContent = "total years: " + (time / 31556952000).toFixed(2);

var days = document.getElementById("days");
days.textContent = "total days: " + (time / 86400000).toFixed(2);

var seconds = document.getElementById("seconds");
seconds.textContent = "total seconds: " + (time / 1000).toFixed(2);



var year = today.getFullYear().toString();
var month = today.toLocaleString('default', { month: 'long' });
var day = today.getDate().toString()
var currentDate = day.concat(' ', month, ' ', year);
console.log(currentDate)
document.getElementById("date").innerHTML = currentDate;