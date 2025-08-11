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

  // Call backend API
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
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