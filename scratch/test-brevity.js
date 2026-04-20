const fetch = require('node-fetch');

async function testBrevity() {
  const response = await fetch('http://localhost:3000/api/ai-tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionText: 'What is 5 x 5?',
      correctAnswer: '25',
      userAnswer: '10',
      options: ['10', '15', '20', '25'],
      explainMode: false,
      expoundMode: false
    })
  });
  
  const data = await response.json();
  console.log('Sparky Response:', data.hint);
  console.log('Sentence count approx:', data.hint.split(/[.!?]+/).filter(s => s.trim().length > 0).length);
}

testBrevity();
