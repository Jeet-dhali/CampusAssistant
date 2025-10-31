// utils/storage.js

/**
 * Load chat history from storage
 * @returns {Promise<Array|null>} - Chat messages or null
 */
export async function loadChatHistory() {
  try {
    const result = await window.storage.get('chat-history');
    if (result && result.value) {
      return JSON.parse(result.value);
    }
    return null;
  } catch (error) {
    console.log('No chat history found:', error);
    return null;
  }
}

/**
 * Save chat history to storage
 * @param {Array} messages - Array of message objects
 * @returns {Promise<boolean>} - Success status
 */
export async function saveChatHistory(messages) {
  try {
    await window.storage.set('chat-history', JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error('Failed to save chat history:', error);
    return false;
  }
}

/**
 * Clear chat history from storage
 * @returns {Promise<boolean>} - Success status
 */
export async function clearChatHistory() {
  try {
    await window.storage.delete('chat-history');
    return true;
  } catch (error) {
    console.error('Failed to clear chat history:', error);
    return false;
  }
}

/**
 * Load API key from storage
 * @returns {Promise<string|null>} - API key or null
 */
export async function loadApiKey() {
  try {
    const result = await window.storage.get('openai-api-key');
    if (result && result.value) {
      return result.value;
    }
    return null;
  } catch (error) {
    console.log('No API key found:', error);
    return null;
  }
}

/**
 * Save API key to storage
 * @param {string} apiKey - The API key to save
 * @returns {Promise<boolean>} - Success status
 */
export async function saveApiKey(apiKey) {
  try {
    await window.storage.set('openai-api-key', apiKey);
    return true;
  } catch (error) {
    console.error('Failed to save API key:', error);
    return false;
  }
}

/**
 * Save user preferences
 * @param {Object} preferences - User preferences object
 * @returns {Promise<boolean>} - Success status
 */
export async function savePreferences(preferences) {
  try {
    await window.storage.set('user-preferences', JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Failed to save preferences:', error);
    return false;
  }
}

/**
 * Load user preferences
 * @returns {Promise<Object|null>} - Preferences object or null
 */
export async function loadPreferences() {
  try {
    const result = await window.storage.get('user-preferences');
    if (result && result.value) {
      return JSON.parse(result.value);
    }
    return null;
  } catch (error) {
    console.log('No preferences found:', error);
    return null;
  }
}