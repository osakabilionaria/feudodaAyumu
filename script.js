// IMPORTANT: Replace with your actual DeepSeek API key here
const API_KEY = 'sk-fb0d63a2ba044c3e95e42eff70f72809';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let messages = [];

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Display user message
    displayMessage(userMessage, 'user-message');
    userInput.value = '';

    // Prepare messages for API
    messages.push({role: 'user', content: userMessage});

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Display AI message
        displayMessage(aiResponse, 'ai-message');

        // Add AI response to messages
        messages.push({role: 'assistant', content: aiResponse});
    } catch (error) {
        console.error('API Error:', error);
        displayMessage('Sorry, there was an error.', 'ai-message');
    }
}

function displayMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add(className);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
