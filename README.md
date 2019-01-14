# jspsych-voice-recorder.js
Custom jsPsych plugin to record sound snippets and save them to server as mp3 files.

It is based on https://github.com/mattdiamond/Recorderjs and https://github.com/cwilso/AudioRecorder for recording to .wav format and some other contribution I saw that I will **find and add** for converting the files to mp3.

In order for the plugin to work, the main experiment file needs to contain a request to access the user's microphone (example included). The experiment will only start once the audio stream has been initiated. 

The plugin itself is in jspsych-master/custom-plugins. The files included in the repository should suffice to launch the demo experiment included (**check**: does it need to be uploaded to server?).

## Notes
The plugin currently only works on Chrome. It can technically run on Firefox and Safari, too, but if more recordings are taken in sequence these browser are likely to crash and / or not save the the recordings in their entirety. Even is Chrome is used, audio quality may start to deterioriate after a long series of recording taken in sequence (e.g. over 100 snippets of 6 seconds each). 





