let recognition;
let voiceActive=false;

function showSection(id){

document.querySelectorAll(".section").forEach(sec=>{
sec.classList.remove("active");
});

document.getElementById(id).classList.add("active");

}

function startVoice(){

if(voiceActive) return;

recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.continuous = true;
recognition.lang = "en-US";

voiceActive=true;

recognition.start();

recognition.onresult=function(event){

let command = event.results[event.results.length-1][0].transcript.toLowerCase();

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