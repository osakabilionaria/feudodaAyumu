async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // Display user message
    displayMessage(userInput, 'user');

    // Clear input field
    document.getElementById('user-input').value = '';

    // Send message to the API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-fb0d63a2ba044c3e95e42eff70f72809' // Adicione sua chave API aqui
        },
        body: JSON.stringify({
            model: 'deepseek-reasoner',
            messages: [{ role: 'user', content: userInput }]
        })
    });

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    // Display bot message
    displayMessage(botResponse, 'bot');
}

function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
