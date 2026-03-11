// PAGE NAVIGATION

function showSection(id){

document.querySelectorAll(".section").forEach(sec=>{
sec.classList.remove("active");
});

document.getElementById(id).classList.add("active");

}


// VOICE ASSISTANT

let recognition;
let voiceActive=false;

function startVoice(){

recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.continuous=true;
recognition.lang="en-US";

voiceActive=true;

recognition.start();

recognition.onresult=function(event){

let command=event.results[event.results.length-1][0].transcript.toLowerCase();

if(command.includes("home")) showSection("home");
else if(command.includes("about")) showSection("about");
else if(command.includes("skills")) showSection("skills");
else if(command.includes("projects")) showSection("projects");
else if(command.includes("contact")) showSection("contact");

};

}

function stopVoice(){

if(recognition){
recognition.stop();
voiceActive=false;
}

}

function toggleVoice(){

if(voiceActive){
stopVoice();
}else{
startVoice();
}

}


// AI NETWORK ANIMATION

const canvas=document.getElementById("ai-network");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let nodes=[];

for(let i=0;i<50;i++){

nodes.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
vx:(Math.random()-0.5)*1,
vy:(Math.random()-0.5)*1

});

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

nodes.forEach(node=>{

node.x+=node.vx;
node.y+=node.vy;

if(node.x<0||node.x>canvas.width) node.vx*=-1;
if(node.y<0||node.y>canvas.height) node.vy*=-1;

ctx.beginPath();
ctx.arc(node.x,node.y,3,0,Math.PI*2);
ctx.fillStyle="#4a6cf7";
ctx.fill();

nodes.forEach(other=>{

let dist=Math.hypot(node.x-other.x,node.y-other.y);

if(dist<120){

ctx.beginPath();
ctx.moveTo(node.x,node.y);
ctx.lineTo(other.x,other.y);
ctx.strokeStyle="rgba(74,108,247,0.2)";
ctx.stroke();

}

});

});

requestAnimationFrame(draw);

}

draw();