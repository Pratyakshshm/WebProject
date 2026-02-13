console.log("JS Loaded");


function getUsers(){
return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users){
localStorage.setItem("users", JSON.stringify(users));
}

function register(){
let u=document.getElementById("username").value.trim();
let p=document.getElementById("password").value.trim();

if(!u || !p){
alert("Enter username & password");
return;
}

let users=getUsers();

if(users.find(x=>x.user===u)){
alert("User already exists");
return;
}

users.push({user:u, pass:p});
saveUsers(users);

alert("Registered! Now login.");
}

function login(){
let u=document.getElementById("username").value.trim();
let p=document.getElementById("password").value.trim();

let users=getUsers();
let found=users.find(x=>x.user===u && x.pass===p);

if(found){
localStorage.setItem("loggedUser", u);
showSite();
}else{
alert("Invalid login");
}
}

function logout(){
localStorage.removeItem("loggedUser");
location.reload();
}

function showSite(){
let login=document.getElementById("loginScreen");
let site=document.getElementById("mainSite");

if(login) login.style.display="none";
if(site) site.style.display="block";
}


window.addEventListener("DOMContentLoaded",()=>{
let u=localStorage.getItem("loggedUser");
if(u) showSite();

renderSubjects();
renderChart();
updateTime();
});



function getData(){
let u=localStorage.getItem("loggedUser");
if(!u) return [];
return JSON.parse(localStorage.getItem("subjects_"+u) || "[]");
}

function saveData(data){
let u=localStorage.getItem("loggedUser");
localStorage.setItem("subjects_"+u, JSON.stringify(data));
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
renderChart();
}

function addTask(i){
let input=document.getElementById("taskInput"+i);
if(!input) return;

let text=input.value.trim();
if(!text) return;

let data=getData();
data[i].tasks.push({text:text,done:false});
saveData(data);

renderSubjects();
renderChart();
}

function toggleTask(s,t){
let data=getData();
data[s].tasks[t].done=!data[s].tasks[t].done;
saveData(data);

renderSubjects();
renderChart();
}

function renderSubjects(){
let container=document.getElementById("subjects");
if(!container) return;

container.innerHTML="";
let data=getData();

data.forEach((sub,i)=>{
let div=document.createElement("div");
div.className="subject";

let html=`
<h3>${sub.name}</h3>
<input id="taskInput${i}" placeholder="New task">
<button onclick="addTask(${i})">Add</button>
<ul>
`;

sub.tasks.forEach((task,t)=>{
html+=`
<li class="${task.done?"done":""}" onclick="toggleTask(${i},${t})">
${task.text}
</li>
`;
});

html+="</ul>";
div.innerHTML=html;
container.appendChild(div);
});
}



let time=1500;
let interval;

function startTimer(){
clearInterval(interval);

interval=setInterval(()=>{
time--;
updateTime();

if(time<=0){
clearInterval(interval);
alert("Session Complete!");
}
},1000);
}

function resetTimer(){
clearInterval(interval);
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



function renderChart(){
let ctx=document.getElementById("chart");
if(!ctx || typeof Chart==="undefined") return;

let data=getData();

let labels=data.map(s=>s.name);
let values=data.map(s=>s.tasks.filter(t=>t.done).length);

new Chart(ctx,{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Completed Tasks",
data:values
}]
}
});
}
