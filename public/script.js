const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

async function loadHistory() {
  try {
    const response = await fetch('/api/history', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (data.history) {
      data.history.forEach(({ message, response }) => {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.textContent = `You: ${message}`;
        chatBox.appendChild(userMessage);

        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai-message';
        aiMessage.textContent = `AI: ${response}`;
        chatBox.appendChild(aiMessage);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    const aiResponse = data.text || 'No response from AI';

    // Display AI response
    const aiMessage = document.createElement('div');
    aiMessage.className = 'message ai-message';
    aiMessage.textContent = `AI: ${aiResponse}`;
    chatBox.appendChild(aiMessage);

    // Save to history (if history endpoint exists)
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, response: aiResponse })
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'message ai-message';
    errorMessage.textContent = `AI: ${error.message}`;
    chatBox.appendChild(errorMessage);
  }

  // Scroll to the bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Load history on page load
document.addEventListener('DOMContentLoaded', loadHistory);