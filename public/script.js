const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const errorMessage = document.getElementById('errorMessage');
const sendButton = document.getElementById('sendButton');
const loadingIndicator = document.getElementById('loadingIndicator');

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
    console.error('Lỗi tải lịch sử:', error);
    errorMessage.textContent = 'Không thể tải lịch sử trò chuyện.';
    errorMessage.style.display = 'block';
  }
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Hiển thị loading và vô hiệu hóa input/nút
  userInput.disabled = true;
  sendButton.disabled = true;
  loadingIndicator.style.display = 'inline';
  errorMessage.style.display = 'none';

  // Hiển thị tin nhắn người dùng
  const userMessage = document.createElement('div');
  userMessage.className = 'message user-message';
  userMessage.textContent = `You: ${message}`;
  chatBox.appendChild(userMessage);
  userInput.value = '';

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

    const aiResponse = data.text || 'Không nhận được phản hồi từ AI';

    // Hiển thị phản hồi AI
    const aiMessage = document.createElement('div');
    aiMessage.className = 'message ai-message';
    aiMessage.textContent = `AI: ${aiResponse}`;
    chatBox.appendChild(aiMessage);

    // Lưu lịch sử
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, response: aiResponse })
    });
  } catch (error) {
    console.error('Lỗi:', error);
    errorMessage.textContent = `Lỗi: ${error.message}`;
    errorMessage.style.display = 'block';
  } finally {
    // Ẩn loading và kích hoạt lại input/nút
    userInput.disabled = false;
    sendButton.disabled = false;
    loadingIndicator.style.display = 'none';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', loadHistory);