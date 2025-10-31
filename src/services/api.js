/**
 * Call OpenAI API for chat completions
 * @param {string} userMessage - The user's message
 * @param {Array} messageHistory - Previous messages in the conversation
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<string>} - AI response
 */
export async function callOpenAI(userMessage, messageHistory, apiKey) {
  if (!apiKey) {
    return 'Please set your OpenAI API key in settings to use AI responses.';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI campus assistant. Help students with questions about courses, schedules, campus facilities, events, and general campus life. Be friendly, concise, and informative.'
          },
          ...messageHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return `Error: ${error.message}. Please check your API key and try again.`;
  }
}
