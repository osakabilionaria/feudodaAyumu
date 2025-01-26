// Configurações da API
const apiKey = "sk-fb0d63a2ba044c3e95e42eff70f72809"; // INSIRA SUA CHAVE DA API AQUI
const baseUrl = "https://api.deepseek.com/chat/completions";

// Função para enviar mensagem para a API
async function queryDeepSeek(prompt) {
    console.log("Enviando requisição para a API...");
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
                    { 
                        role: "system", 
                        content: "Você é um assistente útil. Sempre retorne respostas no formato JSON." 
                    },
                    { 
                        role: "user", 
                        content: prompt 
                    }
                ],
                response_format: { type: "json_object" }, // Garante que a resposta seja JSON
                max_tokens: 500, // Define um limite razoável de tokens
                stream: false
            })
        });

        console.log("Resposta recebida:", response);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Dados da resposta:", data);

        // Extrai o conteúdo da resposta JSON
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return JSON.stringify(data.choices[0].message.content, null, 2); // Formata o JSON para exibição
        } else {
            return "Resposta inválida da API.";
        }
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
