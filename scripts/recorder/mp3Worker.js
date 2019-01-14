/*License (MIT)
Copyright (c) 2014 nusofthq
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
importScripts('libmp3lame.min.js');

var mp3codec;

self.onmessage = function(e) {
	switch (e.data.cmd) {
	case 'init':
		if (!e.data.config) {
			e.data.config = { };
		}
		mp3codec = Lame.init();

		Lame.set_mode(mp3codec, e.data.config.mode || Lame.JOINT_STEREO);
		Lame.set_num_channels(mp3codec, e.data.config.channels || 2);
		Lame.set_num_samples(mp3codec, e.data.config.samples || -1);
		Lame.set_in_samplerate(mp3codec, e.data.config.samplerate || 44100);
		Lame.set_out_samplerate(mp3codec, e.data.config.samplerate || 44100);
		Lame.set_bitrate(mp3codec, e.data.config.bitrate || 128);

		Lame.init_params(mp3codec);
		console.log('Version :', Lame.get_version() + ' / ',
			'Mode: '+Lame.get_mode(mp3codec) + ' / ',
			'Samples: '+Lame.get_num_samples(mp3codec) + ' / ',
			'Channels: '+Lame.get_num_channels(mp3codec) + ' / ',
			'Input Samplate: '+ Lame.get_in_samplerate(mp3codec) + ' / ',
			'Output Samplate: '+ Lame.get_in_samplerate(mp3codec) + ' / ',
			'Bitlate :' +Lame.get_bitrate(mp3codec) + ' / ',
			'VBR :' + Lame.get_VBR(mp3codec));
		break;
	case 'encode':
		var mp3data = Lame.encode_buffer_ieee_float(mp3codec, e.data.buf, e.data.buf);
		self.postMessage({cmd: 'data', buf: mp3data.data});
		break;
	case 'finish':
		var mp3data = Lame.encode_flush(mp3codec);
		self.postMessage({cmd: 'end', buf: mp3data.data});
		Lame.close(mp3codec);
		mp3codec = null;
		self.close();
	}
};
