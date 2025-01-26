// Configurações da API
const apiKey = "sk-fb0d63a2ba044c3e95e42eff70f72809"; // INSIRA SUA CHAVE DA API AQUI
const baseUrl = "https://api.deepseek.com/chat/completions";

// Histórico de mensagens para conversas multi-round
let messageHistory = [];

// Função para enviar mensagem para a API
async function queryDeepSeek(prompt) {
    console.log("Enviando requisição para a API...");

    // Adiciona a mensagem do usuário ao histórico
    messageHistory.push({ role: "user", content: prompt });

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-reasoner",
                messages: messageHistory,
                max_tokens: 4000 // Define um limite razoável de tokens
            })
        });

        console.log("Resposta recebida:", response);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Dados da resposta:", data);

        // Extrai o conteúdo da resposta
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const reasoningContent = data.choices[0].message.reasoning_content; // Cadeia de Pensamento
            const finalContent = data.choices[0].message.content; // Resposta final

            // Adiciona a resposta do assistente ao histórico
            messageHistory.push({ role: "assistant", content: finalContent });

            return { reasoningContent, finalContent };
        } else {
            throw new Error("Resposta inválida da API.");
        }
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        return { reasoningContent: null, finalContent: "Desculpe, ocorreu um erro ao processar sua mensagem." };
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
    const { reasoningContent, finalContent } = await queryDeepSeek(message);

    // Exibe a Cadeia de Pensamento (opcional)
    if (reasoningContent) {
        appendMessage('bot-message', `🔍 Cadeia de Pensamento: ${reasoningContent}`);
    }

    // Exibe a resposta final
    appendMessage('bot-message', finalContent);
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
