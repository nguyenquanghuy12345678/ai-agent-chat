const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  chatBox.innerHTML += `<div class="message user-message">You: ${message}</div>`;
  userInput.value = '';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    chatBox.innerHTML += `<div class="message ai-message">AI: ${data.text}</div>`;
  } catch (err) {
    chatBox.innerHTML += `<div class="message ai-message">AI: Error connecting to the API.</div>`;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}