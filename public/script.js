const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Display user message
  const userMessage = document.createElement('div');
  userMessage.className = 'message user-message';
  userMessage.textContent = `You: ${message}`;
  chatBox.appendChild(userMessage);
  userInput.value = '';

  // Call xAI Grok API
  try {
    const response = await fetch('https://api.x.ai/v1/grok', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_XAI_API_KEY' // Replace with your xAI API key
      },
      body: JSON.stringify({
        prompt: message,
        model: 'grok-3'
      })
    });

    const data = await response.json();
    const aiResponse = data.text || 'Sorry, I could not process your request.';

    // Display AI response
    const aiMessage = document.createElement('div');
    aiMessage.className = 'message ai-message';
    aiMessage.textContent = `AI: ${aiResponse}`;
    chatBox.appendChild(aiMessage);
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'message ai-message';
    errorMessage.textContent = 'AI: Error connecting to the API.';
    chatBox.appendChild(errorMessage);
  }

  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;
}