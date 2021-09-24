const config = require('./config.js');
const fs = require('fs');
const speech = require('@google-cloud/speech');
const max = require('max-api');

config.config();
let sampleRate = 44100;

max.addHandler('samplerate', (sr) => {
  sampleRate = sr;
});

max.addHandler('bang', ()=> {
  const client = new speech.SpeechClient();

  const quickstart = async function () {


    const filename =  'recording.wav';
    const file = fs.readFileSync(filename);
    const audioBytes = file.toString('base64');
    const audio = {
      content: audioBytes
    };
    
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: sampleRate,
      languageCode: 'ko-KR',
    };
    const request = {
      audio: audio,
      config: config
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
	  .map(result => result.alternatives[0].transcript)
	  .join('\n');
    max.outlet(transcription);
  };
  quickstart();
});

