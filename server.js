require("dotenv").config();
const express = require('express');
const Groq = require('groq-sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.APP_PASSWORD || '1408';
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.json({ success: true, token: Buffer.from(PASSWORD).toString('base64') });
  } else {
    res.status(401).json({ success: false, error: 'Access denied.' });
  }
});

function authMiddleware(req, res, next) {
  const token = req.headers['x-auth-token'];
  if (token === Buffer.from(PASSWORD).toString('base64')) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', authMiddleware, async (req, res) => {
  const { messages } = req.body;
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not set' });
  }
  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2048,
      messages: [
        { role: 'system', content: 'You are 3XPLOIT_AI, a hacker-themed coding assistant. Help with code, debugging, and building apps. Be concise and technical.' },
        ...messages
      ]
    });
    const reply = completion.choices[0]?.message?.content || '';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reach AI core.' });
  }
});

app.listen(PORT, () => console.log(`NEURAL_OS running on http://localhost:${PORT}`));
