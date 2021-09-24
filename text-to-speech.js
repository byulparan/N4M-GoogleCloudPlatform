const max = require('max-api');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

const config = require('./config.js');

config.config();

max.addHandler('text', (text) => {
  const client = new textToSpeech.TextToSpeechClient();
  async function quickStart() {
    // Construct the request
    const request = {
      input: {text: text},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: 'ko-KR', ssmlGender: 'NEUTRAL'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3'},
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    max.outlet('output.mp3');
  }
  quickStart();
});

