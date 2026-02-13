console.log("JS Loaded");


// ================= LOGIN PROTECTION =================
if(!localStorage.getItem("loggedUser") && !location.href.includes("index.html")){
alert("Please login first");
location.href="index.html";
}


// ================= USER SYSTEM =================
function getUsers(){
return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users){
localStorage.setItem("users", JSON.stringify(users));
}


// show correct button on first visit
window.addEventListener("DOMContentLoaded",()=>{

let users=getUsers();

let registerBtn=document.getElementById("registerBtn");
let loginBtn=document.getElementById("loginBtn");

if(registerBtn && loginBtn){
if(users.length===0){
loginBtn.style.display="none";
}else{
registerBtn.style.display="none";
}
}

// show welcome if logged in
let u=localStorage.getItem("loggedUser");
let w=document.getElementById("welcome");
if(u && w) w.innerText="Welcome "+u;

});


// ================= REGISTER =================
function register(){

let u=document.getElementById("username")?.value.trim();
let p=document.getElementById("password")?.value.trim();

if(!u || !p){
alert("Enter username and password");
return;
}

let users=getUsers();

if(users.find(x=>x.user===u)){
alert("User already exists");
return;
}

users.push({user:u,pass:p});
saveUsers(users);

alert("Registered! Now login");
location.reload();
}


// ================= LOGIN =================
function login(){

let u=document.getElementById("username")?.value.trim();
let p=document.getElementById("password")?.value.trim();

if(!u || !p){
alert("Enter credentials");
return;
}

let users=getUsers();
let found=users.find(x=>x.user===u && x.pass===p);

if(!found){
alert("Invalid login");
return;
}

localStorage.setItem("loggedUser",u);
location.href="planner.html";
}


// ================= LOGOUT =================
function logout(){
localStorage.removeItem("loggedUser");
location.href="index.html";
}


// ================= SUBJECT STORAGE =================
function getData(){
let u=localStorage.getItem("loggedUser");
return JSON.parse(localStorage.getItem("subjects_"+u) || "[]");
}

function saveData(data){
let u=localStorage.getItem("loggedUser");
localStorage.setItem("subjects_"+u, JSON.stringify(data));
}


// ================= SUBJECT FUNCTIONS =================
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
if(!input) return;

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


// ================= RENDER SUBJECTS =================
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


// ================= CHART =================
window.onload=function(){

let ctx=document.getElementById("chart");
if(!ctx) return;

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
};
