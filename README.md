# jspsych-voice-recorder.js
Custom jsPsych plugin to record sound snippets and save them to server as mp3 files.

It is based on https://github.com/mattdiamond/Recorderjs for recording and some other thing that I will add for saving files as mp3. 

In order for the plugin to work, the main experiment file needs to contain a request to access the user's microphone (example included). The experiment will only start once the audio stream has been initiated. 

## Notes
The plugin currently only works on Chrome. It can technically run on Firefox and Safari, too, but if more recordings are taken in sequence these browser are likely to crash and / or not save the the recordings in their entirety. 

Even is Chrome is used, audio quality may start to deterioriate after a long series of recording taken in sequence (e.g. over 100 snippets of 6 seconds each). 





