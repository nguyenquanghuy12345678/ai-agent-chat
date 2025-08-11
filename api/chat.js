module.exports = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.x.ai/v1/grok', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}` // Use environment variable
      },
      body: JSON.stringify({
        prompt: message,
        model: 'grok-3'
      })
    });

    const data = await response.json();
    res.status(200).json({ text: data.text || 'No response from AI' });
  } catch (error) {
    res.status(500).json({ error: 'Error connecting to the API' });
  }
};