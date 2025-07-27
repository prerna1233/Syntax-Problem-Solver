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
Explain the topic "${topic}" in JavaScript using the Why–What–How–Where format:

1. Why use ${topic}?
- Explain why this concept is important, with a real-life analogy or scenario that makes it memorable for beginners.

2. What is ${topic}?
- Give a clear, beginner-friendly definition. Use simple language and a relatable metaphor if possible.

3. How do we use ${topic}?
- Show the syntax and a practical code example. Explain each part of the code step by step.

4. Where is ${topic} used in real projects?
- Give a real-world use case or scenario where this concept is essential in JavaScript development.

Make the explanation detailed, practical, and easy to understand for someone new to programming. Avoid jargon. Use bullet points or short paragraphs for clarity.

After the explanation, generate 10 multiple choice questions (MCQs) based on this topic and explanation. Each question should be related to the concept, its use, and practical understanding.

Format each MCQ like this:
Q1. ...
A. ...
B. ...
C. ...
D. ...
Answer: ...
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





