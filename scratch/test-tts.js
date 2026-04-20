const fetch = require('node-fetch');

async function testTTS() {
  const response = await fetch('http://localhost:3000/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Hello, this is a test of Sparky voice.' })
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('API Error:', error);
    return;
  }
  
  const data = await response.json();
  console.log('Received chunks:', data.chunks?.length);
  if (data.chunks && data.chunks[0]) {
    console.log('Sample base64 length:', data.chunks[0].base64.length);
    console.log('First 50 chars:', data.chunks[0].base64.substring(0, 50));
  }
}

testTTS();
