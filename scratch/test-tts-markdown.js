const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

async function testMarkdown() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("en-US-AvaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  
  const markdownText = `*   Alright, superstar! First off, great energy jumping right into solving! 
  
  *   Here's the super-secret decoder ring moment! When you see "7 / 12", it literally means "7 divided by 12."`;

  try {
    const { audioStream } = tts.toStream(markdownText);
    audioStream.on('data', (d) => console.log('Received data chunk of size:', d.length));
    audioStream.on('end', () => console.log('Stream finished successfully'));
    audioStream.on('error', (e) => console.error('Stream error:', e));
  } catch (e) {
    console.error('TTS execution error:', e);
  }
}

testMarkdown();
