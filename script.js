function getData(){
return JSON.parse(localStorage.getItem("subjects") || "[]");
}

function saveData(data){
localStorage.setItem("subjects", JSON.stringify(data));
}

function addSubject(){
let input=document.getElementById("subjectInput");
if(!input) return;

let name=input.value.trim();
if(!name) return;

let data=getData();
data.push({name:name,tasks:[]});
saveData(data);
input.value="";
renderSubjects();
}

function addTask(index){
let input=document.getElementById("taskInput"+index);
let text=input.value.trim();
if(!text) return;

let data=getData();
data[index].tasks.push({text:text,done:false});
saveData(data);
renderSubjects();
}

function toggleTask(s,t){
let data=getData();
data[s].tasks[t].done=!data[s].tasks[t].done;
saveData(data);
renderSubjects();
}

console.log('js loaded');
function renderSubjects(){
let container=document.getElementById("subjects");
if(!container) return;


container.innerHTML="";
let data=getData();


data.forEach((sub,i)=>{
let div=document.createElement("div");
div.className="subject";


let html=`<h3>${sub.name}</h3>
<input id="taskInput${i}" placeholder="New task">
<button onclick="addTask(${i})">Add</button>
<ul>`;


sub.tasks.forEach((task,t)=>{
html+=`<li class="${task.done?"done":""}" onclick="toggleTask(${i},${t})">${task.text}</li>`;
});


html+="</ul>";
div.innerHTML=html;
container.appendChild(div);
});
}


renderSubjects();




// ================= TIMER =================
let time=1500;
let interval;


function startTimer(){
clearInterval(interval);
interval=setInterval(()=>{
time--;
updateTime();
if(time<=0) clearInterval(interval);
},1000);
}


function resetTimer(){
time=1500;
updateTime();
}


function updateTime(){
let el=document.getElementById("time");
if(!el) return;
let m=Math.floor(time/60);
let s=time%60;
el.innerText=`${m}:${s<10?"0"+s:s}`;
}




// ================= STATS CHART =================
window.onload=function(){
let ctx=document.getElementById("chart");
if(!ctx) return;


let data=getData();


let labels=data.map(s=>s.name);
let values=data.map(s=>s.tasks.filter(t=>t.done).length);


new Chart(ctx,{
type:"bar",
data:{labels:labels,datasets:[{label:"Completed Tasks",data:values}]}
});
}