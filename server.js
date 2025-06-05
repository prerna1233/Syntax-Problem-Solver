

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/getExplanationAndQuiz', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }
try {

const prompt = `
Give a short and clear explanation of the topic "${topic}" in JavaScript. 

Include:
- Proper syntax with an example
- Where conditions are written (inside which brackets)
- Explanation of how different brackets are used:
   - Round brackets () for conditions, function calls, and parameters
   - Curly brackets {} for grouping a block of code (like in if, loops, and functions)
   - Square brackets [] for arrays and accessing elements by index

After the explanation, generate 15 multiple choice questions (MCQs) based on this topic and explanation. 
Each question should be related to the concept, syntax, and bracket usage described above.

Format each MCQ like this:
Q1. What is the correct way to write a condition in an if statement?
A. if {x > 10}
B. if [x > 10]
C. if (x > 10)
D. if x > 10
Answer: C
`;


  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
            role: 'user'
          }
        ]
      })
    }
  );


  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini raw response:', errorText); // ✅ Add this
    throw new Error('Gemini API failed');
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    return res.status(500).json({ error: 'Invalid response from Gemini' });
  }

  res.json({ reply });
} catch (error) {
  console.error('Error from Gemini API:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});


