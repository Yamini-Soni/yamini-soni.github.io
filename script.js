function startVoice(){

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.start();

recognition.onresult = function(event){

let command = event.results[0][0].transcript.toLowerCase();

if(command.includes("about"))
location.hash = "#about";

else if(command.includes("skills"))
location.hash = "#skills";

else if(command.includes("projects"))
location.hash = "#projects";

else if(command.includes("contact"))
location.hash = "#contact";

};
}