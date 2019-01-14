/*
jsPsych plugin that records audio clips, converts them to mp3 and saves them to the server
Giulia Bovolenta
Based on Recorder.js by Matt Diamond
*/
/*
License (MIT)
Copyright © 2013 Matt Diamond
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of 
the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
*/

jsPsych.plugins["voice-recorder"] = (function () {

  var plugin = {};
    


    // ================ PLUGIN INFO ===========
  
  plugin.info = {
    name: "voice-recorder",
    description: "",
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: '',
        description: 'Any content here will be displayed on screen - can be HTML.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: -1,
        description: 'The duration of recording.'
      },
      stim_num: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus number',
        default: 'test',
        description: 'Identifier number for trial stimulus'
      }
    }
  }

    
    ///// ============== RUN TRIAL =============== ////
    
  plugin.trial = function(display_element, trial) {
      
    
   // ------ VISUAL FEATURES ------ //
   
   // show prompt if there is one
   if (trial.prompt !== "") {
      display_element.innerHTML = trial.prompt;
   }
      
            
   
  
   // ------ SOUND RECORDER ----- //
        
  
  
      
  var WORKER_PATH = 'scripts/recorder/recorderWorker.js';
  var encoderWorker = new Worker('scripts/recorder/mp3Worker.js');
  console.log("New encoder worker created");

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    var numChannels = config.numChannels || 2;
    this.context = source.context;
    this.node = (this.context.createScriptProcessor ||
                 this.context.createJavaScriptNode).call(this.context,
                 bufferLen, numChannels, numChannels);
      
    var worker = new Worker(config.workerPath || WORKER_PATH);
      
    console.log("New worker created");
      
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate,
        numChannels: numChannels
      }
    });
    var recording = false,
      currCallback;

    this.node.onaudioprocess = function(e){
      if (!recording) return;
      var buffer = [];
      for (var channel = 0; channel < numChannels; channel++){
          buffer.push(e.inputBuffer.getChannelData(channel));
      }
        
      
      worker.postMessage({
        command: 'record',
        buffer: buffer
      });
    }

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    }

    this.record = function(){
      recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffer = function(cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffer' })
    }

    this.exportWAV = function(type){
      type = type || config.type || 'audio/wav';
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    }

	//Mp3 conversion
    worker.onmessage = function(e){
      var blob = e.data;
	  //console.log("the blob " +  blob + " " + blob.size + " " + blob.type);

	  var arrayBuffer;
	  var fileReader = new FileReader();

	  fileReader.onload = function(){
		arrayBuffer = this.result;
		var buffer = new Uint8Array(arrayBuffer),
        data = parseWav(buffer);

        console.log(data);
          
        
        // Get total and average sample value (to check for recording volume)
        var samplesSum = data.samples.reduce((a, b) => a + b, 0);
        var samplesAvg = samplesSum / data.samples.length; 

        
        // If sample value is too low, add one count to audioStrikes variable
        if (samplesAvg < 2) {  // 
            window.lowVolume = true;
        }
        
        //console.log(data.samples);


        encoderWorker.postMessage({ cmd: 'init', config:{
            mode : 3,
			channels:1,
			samplerate: data.sampleRate,
			bitrate: data.bitsPerSample
        }});

        encoderWorker.postMessage({ cmd: 'encode', buf: Uint8ArrayToFloat32Array(data.samples) });
        encoderWorker.postMessage({ cmd: 'finish'});
        encoderWorker.onmessage = function(e) {
            if (e.data.cmd == 'data') {

				console.log("Done converting to Mp3");

				var mp3Blob = new Blob([new Uint8Array(e.data.buf)], {type: 'audio/mp3'});
				uploadAudio(mp3Blob);
            }
        };
	  };

	  fileReader.readAsArrayBuffer(blob);


    }


	function encode64(buffer) {
		var binary = '',
			bytes = new Uint8Array( buffer ),
			len = bytes.byteLength;

		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode( bytes[ i ] );
		}
		return window.btoa( binary );
	}

	function parseWav(wav) {
		function readInt(i, bytes) {
			var ret = 0,
				shft = 0;

			while (bytes) {
				ret += wav[i] << shft;
				shft += 8;
				i++;
				bytes--;
			}
			return ret;
		}
		if (readInt(20, 2) != 1) throw 'Invalid compression code, not PCM';
		if (readInt(22, 2) != 1) throw 'Invalid number of channels, not 1';
		return {
			sampleRate: readInt(24, 4),
			bitsPerSample: readInt(34, 2),
			samples: wav.subarray(44)
		};
	}

	function Uint8ArrayToFloat32Array(u8a){
		var f32Buffer = new Float32Array(u8a.length);
		for (var i = 0; i < u8a.length; i++) {
			var value = u8a[i<<1] + (u8a[(i<<1)+1]<<8);
			if (value >= 0x8000) value |= ~0x7FFF;
			f32Buffer[i] = value / 0x8000;
		}
		return f32Buffer;
	}

	function uploadAudio(mp3Data){
		var reader = new FileReader();
		reader.onload = function(event){
			var fd = new FormData();
			var mp3Name = encodeURIComponent('Id_' + window.subjectID + '_' + ('000' + trial.stim_num).slice(-3)  + '.mp3');
			console.log("mp3name = " + mp3Name);
            fd.append('subjectID', window.subjectID); // Add subject ID
			fd.append('fname', mp3Name);
			fd.append('data', event.target.result);
			$.ajax({
				type: 'POST',
				url: 'scripts/recorder/upload.php',
				data: fd,
				processData: false,
				contentType: false
			}).done(function(data) {
				//console.log(data);
				console.log("File " + mp3Name + " uploaded.");
			});
		};
		reader.readAsDataURL(mp3Data);
	}

    source.connect(this.node);
    this.node.connect(this.context.destination);    //this should not be necessary
  };
      

      
  // --- Recorder functions --- //
      
  function startRecording() {
    recorder && recorder.record();
    //console.log("Start");
  }

  function stopRecording() {
    recorder && recorder.stop();
    //console.log("Stop");
    // create WAV download link using audio data blob
    createDownloadLink();
    recorder.clear();
  }

  function createDownloadLink() {
    recorder && recorder.exportWAV();
  }


      
      
    ////// ------- Execute trial ------ ///////
      
      

    // Create new recorder object
    var recorder;
    recorder = new Recorder(window.input, {
            numChannels: 1
                 });
    console.log('Recorder initialised.');


    // Start recording
    $("img").ready(startRecording);

    // Stop recording 
    setTimeout(stopRecording,trial.trial_duration - 100);
    
 

    // data saving
    var trial_data = {
      trial_duration: trial.trial_duration
    };

                   
    // end trial if time limit is set
    if (trial.trial_duration > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        jsPsych.finishTrial(trial_data);
      }, trial.trial_duration);
    }

  };
  return plugin;
})();
