module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được phép' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Yêu cầu phải có tin nhắn' });
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      let errorMessage = 'Lỗi không xác định từ API';
      try {
        const errorData = await response.text();
        if (response.status === 429) {
          errorMessage = 'Quá giới hạn yêu cầu. Vui lòng thử lại sau.';
        } else if (response.status === 401) {
          errorMessage = 'API key không hợp lệ.';
        } else if (errorData.includes('<!DOCTYPE') || errorData.includes('<html')) {
          errorMessage = 'Nhận được phản hồi HTML thay vì JSON. Kiểm tra endpoint API.';
        }
      } catch (textError) {
        console.error('Lỗi khi đọc phản hồi:', textError);
      }
      return res.status(response.status).json({ error: errorMessage });
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Lỗi phân tích JSON:', jsonError);
      return res.status(500).json({ error: 'Phản hồi API không phải JSON hợp lệ' });
    }

    const aiResponse = data.choices?.[0]?.message?.content || 'Không nhận được phản hồi từ AI';
    res.status(200).json({ text: aiResponse });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};