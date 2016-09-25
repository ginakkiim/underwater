var delay, filter, phaser, chorus;
function tunaDemo() {
    //create an instance of Tuna by passing the AudioContext we use
    var tuna = new Tuna(audioContext);
    delay = new tuna.Delay({
        feedback: 0.65,
        delayTime: 110, //this will create a short "slap back" delay
        wetLevel: 0.9,
        dryLevel: 1,
        cutoff: 500,
        bypass: true
    });
    filter = new tuna.Filter({
        frequency: 200, //20 to 22050
        Q: 50, //0.001 to 100
        gain: -30, //-40 to 40 (in decibels)
        filterType: "lowpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
        bypass: true
    });
    chorus = new tuna.Chorus({
        rate: 0.7,         //0.01 to 8+
        feedback: 0.9,     //0 to 1+
        delay: 0.01,     //0 to 1
        bypass: true          //the value 1 starts the effect as bypassed, 0 or 1
    });
    phaser = new tuna.Phaser({
        rate: 0.5,                     //0.01 to 8 is a decent range, but higher values are possible
        depth: 1,                    //0 to 1
        feedback: 0.7,                 //0 to 1+
        stereoPhase: 20,               //0 to 180
        baseModulationFrequency: 500,  //500 to 1500
        bypass: true
    });


    //connect the source to the input property of the Tuna delay
    source.connect(delay.input);
    source.connect(filter.input);
    source.connect(chorus.input);
    source.connect(phaser.input);;
    delay.connect(audioContext.destination);
    filter.connect(audioContext.destination);
    chorus.connect(audioContext.destination);
    phaser.connect(audioContext.destination)
    //start playing!
    source.start(audioContext.currentTime);
}

/*
    This is just the boilerplate needed to load an audio file and provide the dry/wet button functionality
*/

var AC = "AudioContext" in window ? AudioContext : "webkitAudioContext" in window ? webkitAudioContext : document.write("Web Audio not supported");
var audioContext = new AC();
var source = audioContext.createBufferSource();
var xhr = new XMLHttpRequest();

xhr.open("GET", "https://upload.wikimedia.org/wikipedia/en/9/9f/Sample_of_%22Another_Day_in_Paradise%22.ogg");
xhr.responseType = "arraybuffer";
xhr.onload = function(e) {
    audioContext.decodeAudioData(e.target.response, function(b) {
        source.buffer = b;
        tunaDemo();
    })
}

xhr.send(null);


/*
    Setup underwater button
*/
function toggle(){
    if(delay.bypass == true){
        console.log("underwater mode ON");
        document.getElementById("frame").className = "oceanBackground";
        document.getElementById("underwater").innerText = "underwater";
        delay.bypass = false;
        filter.bypass = false;
        chorus.bypass = false;
        phaser.bypass = false;
    }else{
        console.log("underwater mode OFF");
        document.getElementById("frame").className = "";
        document.getElementById("underwater").innerText = "above water";
        delay.bypass = true;
        filter.bypass = true;
        chorus.bypass = true;
        phaser.bypass = true;
    }
};