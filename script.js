// Configurações da API
const apiKey = "sk-fb0d63a2ba044c3e95e42eff70f72809"; // INSIRA SUA CHAVE DA API AQUI
const baseUrl = "https://api.deepseek.com/chat/completions";

// Função para enviar mensagem para a API
async function queryDeepSeek(prompt) {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-reasoner",
                messages: [
                    { role: "system", content: "Você é um assistente útil." },
                    { role: "user", content: prompt }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content; // Retorna a resposta do chatbot
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        return "Desculpe, ocorreu um erro ao processar sua mensagem.";
    }
}

// Função para enviar mensagem do usuário e exibir a resposta
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (message === "") return;

    appendMessage('user-message', message);
    userInput.value = '';

    // Chama a API e exibe a resposta
    const botResponse = await queryDeepSeek(message);
    appendMessage('bot-message', botResponse);
}

// Função para adicionar mensagens ao chat
function appendMessage(className, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}