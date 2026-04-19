const fs = require('fs');
const pdf = require('pdf-parse');
let dataBuffer = fs.readFileSync('/Users/jerryrobsonjr/.gemini/antigravity/brain/7b1a46fd-c9e7-487e-9ad1-feedd2fe3ea8/.tempmediaStorage/48aa943b3e2710ed.pdf');
pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(console.error);
