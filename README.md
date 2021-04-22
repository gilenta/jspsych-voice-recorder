# jspsych-voice-recorder.js
Custom jsPsych plugin to record sound snippets and save them to server as mp3 files. Last maintained in January 2019 (Update: there are several better alternatives being developed - see this thread for info: https://github.com/jspsych/jsPsych/issues/494)

The plugin is based on https://github.com/mattdiamond/Recorderjs and https://github.com/cwilso/AudioRecorder for recording to .wav format and https://github.com/Audior/Recordmp3js for converting the files to mp3.

In order for the plugin to work, the main experiment file needs to contain a request to access the user's microphone (see recorder_demo.html). The experiment will only start once the audio stream has been initiated. 

The plugin itself is in jspsych-master/custom-plugins. 

## Notes
The plugin currently only works on Chrome. It can technically run on Firefox and Safari, too, but if more recordings are taken in sequence these browser are likely to crash and / or not save the the recordings in their entirety. Even is Chrome is used, audio quality may start to deterioriate after a long series of recording taken in sequence (e.g. over 100 snippets of 6 seconds each). 







