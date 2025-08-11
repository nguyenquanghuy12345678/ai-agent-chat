export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    res.status(200).json({
      text: data?.choices?.[0]?.message?.content || 'No response from AI'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error connecting to the API' });
  }
}
