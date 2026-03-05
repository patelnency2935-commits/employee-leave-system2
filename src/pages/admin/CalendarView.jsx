import React, { useState, useEffect } from "react";

export default function CalendarView() {

const today = new Date();

const [currentDate,setCurrentDate] = useState(new Date());
const [holidays,setHolidays] = useState([]);
const [holidayName,setHolidayName] = useState("");
const [holidayDate,setHolidayDate] = useState("");

useEffect(()=>{

const saved = JSON.parse(localStorage.getItem("holidays")) || [];
setHolidays(saved);

},[]);


const saveHolidays = (data)=>{
localStorage.setItem("holidays",JSON.stringify(data));
setHolidays(data);
};


const addHoliday = ()=>{

if(!holidayName || !holidayDate) return;

const exists = holidays.find(h=>h.date === holidayDate);

if(exists){
alert("Holiday already exists");
return;
}

const newHoliday = {
name:holidayName,
date:holidayDate
};

const updated = [...holidays,newHoliday];

saveHolidays(updated);

setHolidayName("");
setHolidayDate("");

};


const deleteHoliday = (date)=>{

const updated = holidays.filter(h=>h.date !== date);

saveHolidays(updated);

};


const daysInMonth = new Date(
currentDate.getFullYear(),
currentDate.getMonth()+1,
0
).getDate();


const firstDay = new Date(
currentDate.getFullYear(),
currentDate.getMonth(),
1
).getDay();


const prevMonth = ()=>{
setCurrentDate(
new Date(
currentDate.getFullYear(),
currentDate.getMonth()-1,
1
)
);
};


const nextMonth = ()=>{
setCurrentDate(
new Date(
currentDate.getFullYear(),
currentDate.getMonth()+1,
1
)
);
};


const goToday = ()=>{
setCurrentDate(new Date());
};


const renderCells = ()=>{

const cells = [];

for(let i=0;i<firstDay;i++){
cells.push(<div className="calendar-cell empty"></div>);
}

for(let d=1; d<=daysInMonth; d++){

const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

const holiday = holidays.find(h=>h.date === dateStr);

const isToday =
d === today.getDate() &&
currentDate.getMonth() === today.getMonth() &&
currentDate.getFullYear() === today.getFullYear();

cells.push(

<div className={`calendar-cell ${isToday ? "today" : ""} ${holiday ? "holiday-cell" : ""}`}>

<div className="date-number">{d}</div>

{holiday && (
<div className="holiday-tag">

<span className="holiday-icon">🎉</span>
{holiday.name}

<button
className="delete-btn"
onClick={()=>deleteHoliday(holiday.date)}
>
✕
</button>

</div>
)}

</div>

);

}

return cells;

};


return (

<div className="calendar-wrapper">

<h2>Calendar View</h2>

<div className="today-indicator">
Today : {today.toDateString()}
</div>

<div className="calendar-controls">

<button onClick={goToday}>Today</button>
<button onClick={prevMonth}>Back</button>
<button onClick={nextMonth}>Next</button>

<h3>
{currentDate.toLocaleString("default",{month:"long"})}
{" "}
{currentDate.getFullYear()}
</h3>

</div>


<div className="holiday-form">

<input
type="text"
placeholder="Holiday name"
value={holidayName}
onChange={(e)=>setHolidayName(e.target.value)}
/>

<input
type="date"
value={holidayDate}
onChange={(e)=>setHolidayDate(e.target.value)}
/>

<button onClick={addHoliday}>Add Holiday</button>

</div>


<div className="calendar-grid">

<div className="day">Sun</div>
<div className="day">Mon</div>
<div className="day">Tue</div>
<div className="day">Wed</div>
<div className="day">Thu</div>
<div className="day">Fri</div>
<div className="day">Sat</div>

{renderCells()}

</div>


<style>{`

.calendar-wrapper{
padding:30px;
}

.calendar-controls{
display:flex;
gap:10px;
align-items:center;
margin-bottom:20px;
}

.calendar-controls button{
background:#2563eb;
color:white;
border:none;
padding:8px 14px;
border-radius:6px;
cursor:pointer;
}

.today-indicator{
background:#2563eb;
color:white;
padding:8px 14px;
border-radius:6px;
display:inline-block;
margin-bottom:15px;
font-weight:500;
}

.holiday-form{
margin-bottom:20px;
display:flex;
gap:10px;
}

.holiday-form input{
padding:8px;
border:1px solid #ccc;
border-radius:6px;
}

.holiday-form button{
background:#16a34a;
color:white;
border:none;
padding:8px 12px;
border-radius:6px;
cursor:pointer;
}

.calendar-grid{
display:grid;
grid-template-columns:repeat(7,1fr);
gap:12px;
}

.day{
font-weight:bold;
text-align:center;
}

.calendar-cell{
background:white;
border-radius:12px;
padding:8px;
height:110px;
box-shadow:0 3px 8px rgba(0,0,0,0.1);
position:relative;
transition:0.2s;
}

.calendar-cell:hover{
transform:scale(1.03);
}

.calendar-cell.empty{
background:transparent;
box-shadow:none;
}

.date-number{
font-weight:bold;
}

.today{
border:2px solid #2563eb;
background:#eff6ff;
}

.holiday-cell{
background:#fff1f2;
border:2px solid #ef4444;
}

.holiday-tag{
background:#ef4444;
color:white;
padding:4px 8px;
border-radius:8px;
font-size:12px;
margin-top:8px;
display:flex;
align-items:center;
gap:4px;
width:fit-content;
}

.holiday-icon{
font-size:14px;
}

.delete-btn{
background:white;
color:red;
border:none;
cursor:pointer;
border-radius:6px;
padding:0px 6px;
font-size:12px;
margin-left:4px;
}

`}</style>

</div>

);

}