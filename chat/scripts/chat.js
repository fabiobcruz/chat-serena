// DOM Elements
const chatMessages = document.querySelector('.chat-messages');
// Esses elementos foram removidos do HTML, então não devemos referenciá-los
// const chatInput = document.querySelector('.chat-input');
// const inputField = document.querySelector('.input-field input');
const contactStatus = document.querySelector('.contact-status');

// Variables to track message display
let currentMessageIndex = 0;
let typingIndicator = null;
let displayedMessages = [];
let userMessages = [];
// Removendo a constante STORAGE_KEY pois não vamos mais usar localStorage
// const STORAGE_KEY = 'whatsapp_chat_data';

// Function to show typing indicator
function showTypingIndicator() {
  if (typingIndicator) {
    return; // Already showing
  }
  
  // Atualiza o status do contato para "typing..."
  contactStatus.textContent = 'typing...';
  
  typingIndicator = createTypingIndicator();
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to hide typing indicator
function hideTypingIndicator() {
  if (typingIndicator) {
    chatMessages.removeChild(typingIndicator);
    typingIndicator = null;
    
    // Retorna o status do contato para "online"
    contactStatus.textContent = 'online';
  }
}

// Função para criar os botões de resposta
function showResponseButtons(options) {
  // Se já existe uma área de botões, remova-a primeiro
  const existingButtons = document.querySelector('.response-buttons');
  if (existingButtons) {
    chatMessages.removeChild(existingButtons);
  }
  
  // Verificar se já temos mensagens do usuário que indicam que passou dessa etapa
  if (userMessages.length > 0 && options.includes("¡Sí, quiero descubrir a mi alma gemela!")) {
    // Se já temos mensagens do usuário e estamos tentando mostrar o botão inicial,
    // significa que já passamos dessa etapa e não devemos mostrar o botão novamente
    console.log("Usuário já passou da etapa inicial, não mostrando botão de novo");
    return;
  }
  
  // Criar a área de botões
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'response-buttons';
  
  // Adicionar cada botão de resposta
  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'response-button';
    button.textContent = option;
    
    // Evento de clique para o botão
    button.addEventListener('click', function() {
      // Criar mensagem enviada com o texto do botão
      const messageText = option;
      const currentTime = getCurrentTime();
      
      // Create sent message
      const messageEl = document.createElement('div');
      messageEl.className = 'message sent';
      
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      
      const messageTextEl = document.createElement('div');
      messageTextEl.className = 'message-text';
      messageTextEl.textContent = messageText;
      
      const messageTimeContainer = document.createElement('div');
      messageTimeContainer.className = 'message-time-container';
      
      const messageTime = document.createElement('span');
      messageTime.className = 'message-time';
      messageTime.textContent = currentTime;
      
      // Criar o ícone de duplo check como um span vazio
      const doubleCheck = document.createElement('span');
      doubleCheck.className = 'double-check';
      
      messageTimeContainer.appendChild(messageTime);
      messageTimeContainer.appendChild(doubleCheck);
      
      messageContent.appendChild(messageTextEl);
      messageContent.appendChild(messageTimeContainer);
      messageEl.appendChild(messageContent);
      
      // Add message to chat
      chatMessages.appendChild(messageEl);
      
      // Remover área de botões após clicar
      chatMessages.removeChild(buttonsContainer);
      
      // Armazenar a mensagem do usuário
      userMessages.push({
        content: messageText,
        time: currentTime
      });
      
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Aqui adicionamos a próxima mensagem do fluxo
      setTimeout(() => {
        // Mostrar o indicador de digitação
        showTypingIndicator();
        
        // Após um delay, mostrar a próxima mensagem
        setTimeout(() => {
          // Esconder o indicador de digitação
          hideTypingIndicator();
          
          // Criar e mostrar a próxima mensagem
          const nextMessageContent = "Antes de empezar, ¿podrías decirme <strong>tu nombre</strong>?";
          const nextTime = getCurrentTime();
          const messageEl = createTextMessage(nextMessageContent, nextTime, true);
          chatMessages.appendChild(messageEl);
          
          // Adicionar ao array displayedMessages 
          displayedMessages.push({
            type: 'text',
            content: nextMessageContent,
            time: nextTime,
            isHTML: true
          });
          // Removendo chamada ao saveChatData()
          
          // Rolar para baixo
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Mostrar o campo de entrada de texto para o nome após um pequeno delay
          setTimeout(() => {
            showNameInput();
          }, 500);
        }, 2000); // 2 segundos para simular a digitação
      }, 1000); // 1 segundo após a mensagem do usuário
    });
    
    buttonsContainer.appendChild(button);
  });
  
  // Adicionar os botões ao chat
  chatMessages.appendChild(buttonsContainer);
  
  // Rolar para baixo para mostrar os botões
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to display a message
function displayMessage(messageInfo) {
  // Check if we've already shown all messages
  if (currentMessageIndex >= messageData.length) {
    // Se todas as mensagens foram exibidas e não temos mensagens do usuário,
    // mostrar o botão de resposta inicial apenas se não houver mensagens do usuário
    if (userMessages.length === 0) {
      setTimeout(() => {
        showResponseButtons(["¡Sí, quiero descubrir a mi alma gemela!"]);
      }, 1000);
    }
    return;
  }

  // Check if this message is already displayed (when reloading page)
  if (currentMessageIndex < displayedMessages.length) {
    // Skip showing this message as it should be already displayed
    currentMessageIndex++;
    
    // Continue to next message or show buttons if all messages displayed
    if (currentMessageIndex < messageData.length) {
      setTimeout(() => {
        displayMessage(messageData[currentMessageIndex]);
      }, 500); // Shorter delay for already displayed messages
    } else if (userMessages.length === 0) {
      // All messages displayed and no user messages yet, show response buttons
      setTimeout(() => {
        showResponseButtons(["¡Sí, quiero descubrir a mi alma gemela!"]);
      }, 1000);
    }
    return;
  }
  
  // Verificar se devemos pular o indicador de digitação para esta mensagem
  if (messageInfo.skipTyping) {
    // Criar e mostrar a mensagem diretamente, sem mostrar o indicador de digitação
    let messageEl;
    const currentTime = getCurrentTime();
    
    switch (messageInfo.type) {
      case 'text':
        messageEl = createTextMessage(messageInfo.content, currentTime, messageInfo.isHTML);
        // Store displayed message
        displayedMessages.push({
          type: 'text',
          content: messageInfo.content,
          time: currentTime,
          isHTML: messageInfo.isHTML
        });
        break;
      // Outros casos podem ser adicionados aqui se necessário
    }
    
    // Add message to chat
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Removendo chamada ao saveChatData()
    
    // Display next message or show input if done
    currentMessageIndex++;
    if (currentMessageIndex < messageData.length) {
      setTimeout(() => {
        displayMessage(messageData[currentMessageIndex]);
      }, messageInfo.delay || 2000);
    } else if (userMessages.length === 0) {
      // All messages displayed and no user messages yet, show response buttons
      setTimeout(() => {
        showResponseButtons(["¡Sí, quiero descubrir a mi alma gemela!"]);
      }, 1000);
    }
    return;
  }
  
  // Show typing indicator para mensagens normais
  showTypingIndicator();
  
  // Display message after typing delay (1-3 seconds)
  setTimeout(() => {
    // Hide typing indicator
    hideTypingIndicator();
    
    // Create message based on type
    let messageEl;
    const currentTime = getCurrentTime();
    
    switch (messageInfo.type) {
      case 'text':
        messageEl = createTextMessage(messageInfo.content, currentTime, messageInfo.isHTML);
        // Store displayed message
        displayedMessages.push({
          type: 'text',
          content: messageInfo.content,
          time: currentTime,
          isHTML: messageInfo.isHTML
        });
        break;
      case 'image':
        messageEl = createImageMessage(messageInfo.content, messageInfo.caption, currentTime);
        // Store displayed message
        displayedMessages.push({
          type: 'image',
          content: messageInfo.content,
          caption: messageInfo.caption,
          time: currentTime
        });
        break;
      case 'audio':
        messageEl = createAudioMessage(messageInfo.duration, currentTime, messageInfo.audioSrc);
        // Store displayed message
        displayedMessages.push({
          type: 'audio',
          duration: messageInfo.duration,
          audioSrc: messageInfo.audioSrc,
          time: currentTime
        });
        break;
      case 'link':
        messageEl = createLinkMessage(messageInfo.content, messageInfo.url, messageInfo.preview, currentTime);
        // Store displayed message
        displayedMessages.push({
          type: 'link',
          content: messageInfo.content,
          url: messageInfo.url,
          preview: messageInfo.preview,
          time: currentTime
        });
        break;
      default:
        messageEl = createTextMessage(messageInfo.content, currentTime);
        // Store displayed message
        displayedMessages.push({
          type: 'text',
          content: messageInfo.content,
          time: currentTime
        });
    }
    
    // Add message to chat
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Removendo chamada ao saveChatData()
    
    // Display next message or show response buttons if done
    currentMessageIndex++;
    if (currentMessageIndex < messageData.length) {
      setTimeout(() => {
        displayMessage(messageData[currentMessageIndex]);
      }, messageData[currentMessageIndex].delay);
    } else if (userMessages.length === 0) {
      // All messages displayed and no user messages yet, show response buttons
      setTimeout(() => {
        showResponseButtons(["¡Sí, quiero descubrir a mi alma gemela!"]);
      }, 1000);
    }
  }, Math.random() * 1000 + 1000); // Random delay between 1-2 seconds to simulate typing
}

// Initialize the chat - start with the first message
document.addEventListener('DOMContentLoaded', () => {
  // Depuração para verificar se o evento está sendo acionado
  console.log('DOMContentLoaded event triggered');
  console.log('Current message index:', currentMessageIndex);
  console.log('Message data length:', messageData.length);
  
  // Adicionando listener para os botões de áudio
  document.addEventListener('click', function(e) {
    if (e.target.closest('.play-button')) {
      const playButton = e.target.closest('.play-button');
      const progressBar = playButton.parentElement.querySelector('.audio-progress-filled');
      handleAudioPlayback(playButton, progressBar);
    }
  });
  
  // Removendo a chamada a loadChatData()
  
  // Iniciar exibindo a primeira mensagem
  console.log('No previous messages, starting new conversation');
  setTimeout(() => {
    displayMessage(messageData[currentMessageIndex]);
  }, 1000);
});

// Clear chat history - utility function for testing
window.clearChatHistory = function() {
  // Em caso de erro, limpar os dados corrompidos
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
};

// Handle audio player functionality
document.addEventListener('click', function(e) {
  // Delegated event handling for audio player controls
  if (e.target.closest('.play-button')) {
    const playButton = e.target.closest('.play-button');
    const audioPlayer = playButton.closest('.audio-player');
    const progressBar = audioPlayer.querySelector('.audio-progress-filled');
    
    handleAudioPlayback(playButton, progressBar);
  }
});

// Handle simulated audio playback
function handleAudioPlayback(playButton, progressBar) {
  const isPlaying = playButton.classList.contains('playing');
  
  // Toggle play/pause
  if (isPlaying) {
    // Pause audio
    playButton.classList.remove('playing');
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    clearInterval(playButton.dataset.intervalId);
  } else {
    // Play audio
    playButton.classList.add('playing');
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Reset progress if at the end
    if (parseFloat(progressBar.style.width || '0') >= 100) {
      progressBar.style.width = '0%';
    }
    
    // Buscar a duração do áudio em segundos
    const audioMessage = playButton.closest('.audio-player');
    const durationText = audioMessage ? audioMessage.querySelector('.audio-duration').textContent : '0:00';
    
    // Converter a duração (por exemplo, "0:23") para segundos
    let totalSeconds = 0;
    if (durationText) {
      const parts = durationText.split(':');
      if (parts.length === 2) {
        totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
    }
    
    // Se não conseguir obter a duração, usar um valor padrão
    if (totalSeconds <= 0) {
      totalSeconds = 30; // Padrão de 30 segundos
    }
    
    // Definir a duração total em milissegundos
    const totalDuration = totalSeconds * 1000;
    
    // Definir intervalo de atualização fixo para uma animação suave
    const updateInterval = 50; // 50ms = 20 atualizações por segundo
    
    // Obter o progresso atual como valor decimal entre 0 e 1
    const currentWidth = progressBar.style.width || '0%';
    let progress = parseFloat(currentWidth) / 100;
    if (isNaN(progress)) progress = 0;
    
    // Calcular a quantidade de progresso a ser adicionada em cada atualização
    // Esta é uma fração fixa do tempo total
    const progressIncrement = updateInterval / totalDuration;
    
    // Armazenar o tempo de início para cálculos precisos
    const startTime = Date.now();
    const startProgress = progress;
    
    // Usar requestAnimationFrame para uma animação mais suave
    let animationId;
    const updateProgress = () => {
      // Calcular o tempo decorrido desde o início
      const elapsed = Date.now() - startTime;
      
      // Calcular o progresso com base no tempo decorrido
      // Isso garante que a animação seja consistente independentemente de atrasos
      const expectedProgress = startProgress + (elapsed / totalDuration);
      
      // Limitar o progresso a 100%
      progress = Math.min(expectedProgress, 1);
      
      // Atualizar a largura da barra de progresso
      progressBar.style.width = `${progress * 100}%`;
      
      // Verificar se a reprodução terminou
      if (progress >= 1) {
        cancelAnimationFrame(animationId);
        playButton.classList.remove('playing');
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.style.width = '100%';
      } else {
        // Continuar a animação
        animationId = requestAnimationFrame(updateProgress);
      }
    };
    
    // Iniciar a animação
    animationId = requestAnimationFrame(updateProgress);
    
    // Armazenar o ID da animação para poder cancelá-la depois
    playButton.dataset.animationId = animationId;
    
    // Substituir o handler para o evento de clique no botão de pausa
    const originalClickHandler = playButton.onclick;
    playButton.onclick = function() {
      if (playButton.classList.contains('playing')) {
        cancelAnimationFrame(playButton.dataset.animationId);
      }
      if (originalClickHandler) originalClickHandler();
    };
  }
}

// Comentando os event listeners relacionados aos elementos removidos do HTML
/*
// Handle sending messages
inputField.addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && inputField.value.trim() !== '') {
    const messageText = inputField.value.trim();
    const currentTime = getCurrentTime();
    
    // Create sent message
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTextEl = document.createElement('div');
    messageTextEl.className = 'message-text';
    messageTextEl.textContent = messageText;
    
    const messageTimeContainer = document.createElement('div');
    messageTimeContainer.className = 'message-time-container';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;
    
    // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
    const doubleCheck = document.createElement('span');
    doubleCheck.className = 'double-check';
    
    messageTimeContainer.appendChild(messageTime);
    messageTimeContainer.appendChild(doubleCheck);
    
    messageContent.appendChild(messageTextEl);
    messageContent.appendChild(messageTimeContainer);
    messageEl.appendChild(messageContent);
    
    // Add message to chat
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Store user message
    userMessages.push({
      content: messageText,
      time: currentTime
    });
    
    // Save to local storage
    saveChatData();
    
    // Clear input
    inputField.value = '';
  }
});

// Handle attachment button
const attachmentButton = document.querySelector('.attachment-button');
attachmentButton.addEventListener('click', function() {
  alert('Attachment feature would open here!');
});

// Handle emoji button
const emojiButton = document.querySelector('.emoji-button');
emojiButton.addEventListener('click', function() {
  alert('Emoji picker would open here!');
});

// Handle voice button
const voiceButton = document.querySelector('.voice-button');
voiceButton.addEventListener('click', function() {
  alert('Voice recording would start here!');
});
*/

// Função para criar um campo de entrada de texto para o nome
function showNameInput() {
  // Se já existe um campo, remova-o primeiro
  const existingInput = document.querySelector('.name-input-container');
  if (existingInput) {
    chatMessages.removeChild(existingInput);
  }
  
  // Criar o container do input
  const inputContainer = document.createElement('div');
  inputContainer.className = 'name-input-container';
  
  // Criar o campo de entrada
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Digite seu nome...';
  input.className = 'name-input';
  
  // Criar o botão de envio
  const sendButton = document.createElement('button');
  sendButton.className = 'name-send-button';
  sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
  
  // Adicionar evento de clique no botão de envio
  sendButton.addEventListener('click', function() {
    sendNameResponse(input.value);
  });
  
  // Adicionar evento de tecla no campo de entrada
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendNameResponse(input.value);
    }
  });
  
  // Adicionar os elementos ao container
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  
  // Adicionar o container ao chat
  chatMessages.appendChild(inputContainer);
  
  // Focar no campo de entrada e rolar para garantir visibilidade
  setTimeout(() => {
    input.focus();
    
    // Usar a função de rolagem automática
    if (window.scrollToInputOnFocus) {
      window.scrollToInputOnFocus(input);
    } else {
      // Fallback para o comportamento antigo
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 100);
}

// Função para enviar a resposta do nome
function sendNameResponse(name) {
  // Verificar se o nome foi digitado
  if (!name || name.trim() === '') {
    return;
  }
  
  // Obter o valor limpo
  const nameText = name.trim();
  const currentTime = getCurrentTime();
  
  // Remover o campo de entrada
  const inputContainer = document.querySelector('.name-input-container');
  if (inputContainer) {
    chatMessages.removeChild(inputContainer);
  }
  
  // Criar mensagem enviada com o nome
  const messageEl = document.createElement('div');
  messageEl.className = 'message sent';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageTextEl = document.createElement('div');
  messageTextEl.className = 'message-text';
  messageTextEl.textContent = nameText;
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = currentTime;
  
  // Criar o ícone de duplo check
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTextEl);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Adicionar mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Armazenar a mensagem do usuário
  userMessages.push({
    content: nameText,
    time: currentTime
  });
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Armazenar o nome para uso futuro
  const userName = nameText;
  
  // Exibir a próxima mensagem com o nome do usuário
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Criar e mostrar a próxima mensagem, substituindo {{NOME}} pelo nome do usuário
      const nextMessageContent = `Es un placer hablar contigo, <strong>${userName}</strong>. ¡Tengo muchísimas ganas de empezar a crear tu dibujo!`;
      const currentTime = getCurrentTime();
      const messageEl = createTextMessage(nextMessageContent, currentTime, true);
      chatMessages.appendChild(messageEl);
      
      // Adicionar ao array displayedMessages 
      displayedMessages.push({
        type: 'text',
        content: nextMessageContent,
        time: currentTime,
        isHTML: true
      });
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar a próxima mensagem do fluxo após um delay
      setTimeout(() => {
        // Mostrar o indicador de digitação
        showTypingIndicator();
        
        // Após um delay, mostrar a próxima mensagem
        setTimeout(() => {
          // Esconder o indicador de digitação
          hideTypingIndicator();
          
          // Criar e mostrar a próxima mensagem
          const message1Content = "Tengo el presentimiento de que esta persona llegará a tu vida en los <strong>próximos días</strong> ❤️‍🔥";
          const currentTime1 = getCurrentTime();
          const message1El = createTextMessage(message1Content, currentTime1, true);
          chatMessages.appendChild(message1El);
          
          // Adicionar ao array displayedMessages 
          displayedMessages.push({
            type: 'text',
            content: message1Content,
            time: currentTime1,
            isHTML: true
          });
          // Removendo chamada ao saveChatData()
          
          // Rolar para baixo
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Mostrar a próxima mensagem do fluxo após outro delay
          setTimeout(() => {
            // Mostrar o indicador de digitação
            showTypingIndicator();
            
            // Após um delay, mostrar a próxima mensagem
            setTimeout(() => {
              // Esconder o indicador de digitação
              hideTypingIndicator();
              
              // Criar e mostrar a próxima mensagem
              const message2Content = "Pero antes de continuar, déjame explicarte cómo funciona el procedimiento para que podamos comenzar con tu dibujo.";
              const currentTime2 = getCurrentTime();
              const message2El = createTextMessage(message2Content, currentTime2, false);
              chatMessages.appendChild(message2El);
              
              // Adicionar ao array displayedMessages 
              displayedMessages.push({
                type: 'text',
                content: message2Content,
                time: currentTime2,
                isHTML: false
              });
              // Removendo chamada ao saveChatData()
              
              // Rolar para baixo
              chatMessages.scrollTop = chatMessages.scrollHeight;
              
              // Mostrar a mensagem de áudio após outro delay
              setTimeout(() => {
                // Mostrar o indicador de digitação
                showTypingIndicator();
                
                // Após um delay, mostrar a mensagem de áudio
                setTimeout(() => {
                  // Esconder o indicador de digitação
                  hideTypingIndicator();
                  
                  // Criar e mostrar a mensagem de áudio
                  const currentTime3 = getCurrentTime();
                  const audioEl = createAudioMessage("0:17", currentTime3, "assets/1.mp3");
                  chatMessages.appendChild(audioEl);
                  
                  // Adicionar ao array displayedMessages 
                  displayedMessages.push({
                    type: 'audio',
                    duration: "0:17",
                    audioSrc: "assets/1.mp3",
                    time: currentTime3
                  });
                  // Removendo chamada ao saveChatData()
                  
                  // Rolar para baixo
                  chatMessages.scrollTop = chatMessages.scrollHeight;
                  
                  // Reproduzir o áudio automaticamente após um pequeno delay
                  setTimeout(() => {
                    // Encontrar o botão de play do áudio e simular o clique
                    const playButton = audioEl.querySelector('.play-button');
                    if (playButton) {
                      playButton.click();
                    }
                    
                    // Mostrar a próxima mensagem após 17 segundos (duração completa do áudio)
                    setTimeout(() => {
                      // Mostrar o indicador de digitação
                      showTypingIndicator();
                      
                      // Após um delay, mostrar a próxima mensagem
                      setTimeout(() => {
                        // Esconder o indicador de digitação
                        hideTypingIndicator();
                        
                        // Criar e mostrar a próxima mensagem
                        const nextMessageContent = "<strong>¿Puedo empezar con las preguntas?</strong> Recuerda no cruzar las piernas ni los brazos…";
                        const currentTime4 = getCurrentTime();
                        const messageEl = createTextMessage(nextMessageContent, currentTime4, true);
                        chatMessages.appendChild(messageEl);
                        
                        // Adicionar ao array displayedMessages 
                        displayedMessages.push({
                          type: 'text',
                          content: nextMessageContent,
                          time: currentTime4,
                          isHTML: true
                        });
                        // Removendo chamada ao saveChatData()
                        
                        // Rolar para baixo
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                        
                        // Mostrar botão de resposta após a mensagem
                        setTimeout(() => {
                          showResponseButtons(["Sí, estoy listo"]);
                          
                          // Ajustar o comportamento do botão de resposta específico para o áudio
                          const responseButton = document.querySelector('.response-button');
                          if (responseButton) {
                            // Substituir o event listener existente
                            const newButton = responseButton.cloneNode(true);
                            responseButton.parentNode.replaceChild(newButton, responseButton);
                            
                            // Adicionar novo event listener
                            newButton.addEventListener('click', function() {
                              // Remover os botões
                              const buttonsContainer = document.querySelector('.response-buttons');
                              if (buttonsContainer) {
                                chatMessages.removeChild(buttonsContainer);
                              }
                              
                              // Processar a resposta
                              processAudioResponse("Sí, estoy listo");
                            });
                          }
                        }, 1000);
                      }, 2000); // 2 segundos para simular a digitação
                    }, 17000); // 17 segundos após o início do áudio
                  }, 1000); // 1 segundo após a exibição do áudio
                }, 2000); // 2 segundos para simular a digitação
              }, 2000); // 2 segundos após a mensagem anterior
            }, 2000); // 2 segundos para simular a digitação
          }, 2000); // 2 segundos após a mensagem anterior
        }, 2000); // 2 segundos para simular a digitação
      }, 2000); // 2 segundos após a mensagem personalizada com o nome
    }, 2000); // 2 segundos para simular a digitação
  }, 1000); // 1 segundo após a mensagem do usuário
}

// Função para processar a resposta após ouvir o áudio
function processAudioResponse(responseText) {
  // Obter a hora atual
  const currentTime = getCurrentTime();
  
  // Criar mensagem enviada com o texto da resposta
  const messageEl = document.createElement('div');
  messageEl.className = 'message sent';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageTextEl = document.createElement('div');
  messageTextEl.className = 'message-text';
  messageTextEl.textContent = responseText;
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = currentTime;
  
  // Criar o ícone de duplo check
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTextEl);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Adicionar mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Armazenar a mensagem do usuário
  userMessages.push({
    content: responseText,
    time: currentTime
  });
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Próxima mensagem após o botão "Sí, estoy listo" (usando delay normal)
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Mostrar a mensagem em espanhol sobre o signo
      const nextMessageContent = "¿Cuál es tu signo?";
      const currentTime = getCurrentTime();
      const messageEl = createTextMessage(nextMessageContent, currentTime, false);
      chatMessages.appendChild(messageEl);
      
      // Adicionar ao array displayedMessages 
      displayedMessages.push({
        type: 'text',
        content: nextMessageContent,
        time: currentTime,
        isHTML: false
      });
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar o campo de entrada para o signo após um pequeno delay
      setTimeout(() => {
        showSignInput();
      }, 500);
    }, 2000); // 2 segundos para simular a digitação
  }, 1000); // 1 segundo após a resposta do usuário (delay normal)
}

// Cria uma função helper para facilitar a criação e salvamento de mensagens
function createAndSaveMessage(content, isHTML = false, type = 'text', extraParams = {}) {
  const currentTime = getCurrentTime();
  let messageEl;
  let messageData = {
    type: type,
    time: currentTime,
    ...extraParams
  };
  
  // Cria a mensagem de acordo com o tipo
  switch (type) {
    case 'text':
      messageEl = createTextMessage(content, currentTime, isHTML);
      messageData.content = content;
      messageData.isHTML = isHTML;
      break;
    case 'image':
      messageEl = createImageMessage(content, extraParams.caption, currentTime);
      messageData.content = content;
      messageData.caption = extraParams.caption;
      break;
    case 'audio':
      messageEl = createAudioMessage(extraParams.duration, currentTime, content);
      messageData.audioSrc = content;
      messageData.duration = extraParams.duration;
      break;
    case 'link':
      messageEl = createLinkMessage(content, extraParams.url, extraParams.preview, currentTime);
      messageData.content = content;
      messageData.url = extraParams.url;
      messageData.preview = extraParams.preview;
      break;
  }
  
  // Adiciona a mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Adiciona ao array displayedMessages e salva no localStorage
  displayedMessages.push(messageData);
  saveChatData();
  
  // Rola para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return messageEl;
}

// Função para criar um campo de entrada para o signo
function showSignInput() {
  // Se já existe um campo, remova-o primeiro
  const existingInput = document.querySelector('.sign-input-container');
  if (existingInput) {
    chatMessages.removeChild(existingInput);
  }
  
  // Criar o container do input
  const inputContainer = document.createElement('div');
  inputContainer.className = 'sign-input-container name-input-container'; // Reutilizando os estilos do name-input
  
  // Criar o campo de entrada
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Escribe tu signo...';
  input.className = 'sign-input name-input'; // Reutilizando os estilos do name-input
  
  // Criar o botão de envio
  const sendButton = document.createElement('button');
  sendButton.className = 'sign-send-button name-send-button'; // Reutilizando os estilos do name-send-button
  sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
  
  // Adicionar evento de clique no botão de envio
  sendButton.addEventListener('click', function() {
    sendSignResponse(input.value);
  });
  
  // Adicionar evento de tecla no campo de entrada
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendSignResponse(input.value);
    }
  });
  
  // Adicionar os elementos ao container
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  
  // Adicionar o container ao chat
  chatMessages.appendChild(inputContainer);
  
  // Focar no campo de entrada e rolar para garantir visibilidade
  setTimeout(() => {
    input.focus();
    
    // Usar a função de rolagem automática
    if (window.scrollToInputOnFocus) {
      window.scrollToInputOnFocus(input);
    } else {
      // Fallback para o comportamento antigo
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 100);
}

// Função para enviar a resposta do signo
function sendSignResponse(sign) {
  // Verificar se o signo foi digitado
  if (!sign || sign.trim() === '') {
    return;
  }
  
  // Obter o valor limpo
  const signText = sign.trim();
  const currentTime = getCurrentTime();
  
  // Remover o campo de entrada
  const inputContainer = document.querySelector('.sign-input-container');
  if (inputContainer) {
    chatMessages.removeChild(inputContainer);
  }
  
  // Criar mensagem enviada com o signo
  const messageEl = document.createElement('div');
  messageEl.className = 'message sent';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageTextEl = document.createElement('div');
  messageTextEl.className = 'message-text';
  messageTextEl.textContent = signText;
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = currentTime;
  
  // Criar o ícone de duplo check
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTextEl);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Adicionar mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Armazenar a mensagem do usuário
  userMessages.push({
    content: signText,
    time: currentTime
  });
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Encontrar o nome do usuário (corrigindo a lógica para obter o nome correto)
  let userName = ""; // Valor padrão caso não encontre
  
  // Procurar nas mensagens do usuário por um nome
  // O nome do usuário geralmente é a segunda mensagem do usuário
  // A primeira mensagem é a resposta do botão inicial "¡Sí, quiero descubrir a mi alma gemela!"
  if (userMessages.length > 1) {
    userName = userMessages[1].content;
  }
  
  // Armazenar o índice onde o signo foi salvo para uso futuro
  const signIndex = userMessages.length - 1;
  // Armazenar o signo diretamente em uma variável global para facilitar acesso
  window.userSignData = {
    content: signText,
    index: signIndex
  };
  
  // Exibir a próxima mensagem mencionando o nome e o signo
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Criar e mostrar a mensagem personalizada com nome e signo
      const nextMessageContent = `Qué casualidad, <strong>${userName}</strong>, yo también soy <strong>${signText}</strong>.`;
      const currentTime = getCurrentTime();
      const messageEl = createTextMessage(nextMessageContent, currentTime, true);
      chatMessages.appendChild(messageEl);
      
      // Adicionar ao array displayedMessages 
      displayedMessages.push({
        type: 'text',
        content: nextMessageContent,
        time: currentTime,
        isHTML: true
      });
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar a próxima mensagem - Data de Nascimento
      setTimeout(() => {
        // Mostrar o indicador de digitação
        showTypingIndicator();
        
        // Após um delay, mostrar a próxima mensagem
        setTimeout(() => {
          // Esconder o indicador de digitação
          hideTypingIndicator();
          
          // Criar e mostrar a próxima mensagem
          const birthdateMessageContent = "¿Cual es tu fecha de nacimiento?";
          const currentTime2 = getCurrentTime();
          const birthdateMessageEl = createTextMessage(birthdateMessageContent, currentTime2, false);
          chatMessages.appendChild(birthdateMessageEl);
          
          // Adicionar ao array displayedMessages 
          displayedMessages.push({
            type: 'text',
            content: birthdateMessageContent,
            time: currentTime2,
            isHTML: false
          });
          // Removendo chamada ao saveChatData()
          
          // Rolar para baixo
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Mostrar o campo de entrada para a data de nascimento
          setTimeout(() => {
            showBirthdateInput();
          }, 500);
        }, 2000); // 2 segundos para simular a digitação
      }, 2000); // 2 segundos após a mensagem personalizada
    }, 2000); // 2 segundos para simular a digitação
  }, 1000); // 1 segundo após a resposta do usuário
}

// Função para criar um campo de entrada para a data de nascimento
function showBirthdateInput() {
  // Se já existe um campo, remova-o primeiro
  const existingInput = document.querySelector('.birthdate-input-container');
  if (existingInput) {
    chatMessages.removeChild(existingInput);
  }
  
  // Criar o container do input
  const inputContainer = document.createElement('div');
  inputContainer.className = 'birthdate-input-container name-input-container'; // Reutilizando os estilos
  
  // Criar o campo de entrada
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Ejemplo: 15/03/1990';
  input.className = 'birthdate-input name-input'; // Reutilizando os estilos
  
  // Criar o botão de envio
  const sendButton = document.createElement('button');
  sendButton.className = 'birthdate-send-button name-send-button'; // Reutilizando os estilos
  sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
  
  // Adicionar evento de clique no botão de envio
  sendButton.addEventListener('click', function() {
    sendBirthdateResponse(input.value);
  });
  
  // Adicionar evento de tecla no campo de entrada
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendBirthdateResponse(input.value);
    }
  });
  
  // Adicionar os elementos ao container
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  
  // Adicionar o container ao chat
  chatMessages.appendChild(inputContainer);
  
  // Focar no campo de entrada e rolar para garantir visibilidade
  setTimeout(() => {
    input.focus();
    
    // Usar a função de rolagem automática
    if (window.scrollToInputOnFocus) {
      window.scrollToInputOnFocus(input);
    } else {
      // Fallback para o comportamento antigo
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 100);
}

// Função para enviar a resposta da data de nascimento
function sendBirthdateResponse(birthdate) {
  // Verificar se a data foi digitada
  if (!birthdate || birthdate.trim() === '') {
    return;
  }
  
  // Obter o valor limpo
  const birthdateText = birthdate.trim();
  const currentTime = getCurrentTime();
  
  // Remover o campo de entrada
  const inputContainer = document.querySelector('.birthdate-input-container');
  if (inputContainer) {
    chatMessages.removeChild(inputContainer);
  }
  
  // Criar mensagem enviada com a data
  const messageEl = document.createElement('div');
  messageEl.className = 'message sent';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageTextEl = document.createElement('div');
  messageTextEl.className = 'message-text';
  messageTextEl.textContent = birthdateText;
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = currentTime;
  
  // Criar o ícone de duplo check
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTextEl);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Adicionar mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Armazenar a mensagem do usuário
  userMessages.push({
    content: birthdateText,
    time: currentTime
  });
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Mostrar a próxima mensagem - Hora de Nascimento
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Criar e mostrar a próxima mensagem
      const birthtimeMessageContent = "¿A qué hora naciste? Si no sabes la hora exacta, no te preocupes.";
      const currentTime = getCurrentTime();
      const birthtimeMessageEl = createTextMessage(birthtimeMessageContent, currentTime, false);
      chatMessages.appendChild(birthtimeMessageEl);
      
      // Adicionar ao array displayedMessages 
      displayedMessages.push({
        type: 'text',
        content: birthtimeMessageContent,
        time: currentTime,
        isHTML: false
      });
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar o campo de entrada para a hora de nascimento
      setTimeout(() => {
        showBirthtimeInput();
      }, 500);
    }, 2000); // 2 segundos para simular a digitação
  }, 1000); // 1 segundo após a resposta do usuário
}

// Função para criar um campo de entrada para a hora de nascimento
function showBirthtimeInput() {
  // Se já existe um campo, remova-o primeiro
  const existingInput = document.querySelector('.birthtime-input-container');
  if (existingInput) {
    chatMessages.removeChild(existingInput);
  }
  
  // Criar o container do input
  const inputContainer = document.createElement('div');
  inputContainer.className = 'birthtime-input-container name-input-container'; // Reutilizando os estilos
  
  // Criar o campo de entrada
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Ejemplo: 15:30';
  input.className = 'birthtime-input name-input'; // Reutilizando os estilos
  
  // Criar o botão de envio
  const sendButton = document.createElement('button');
  sendButton.className = 'birthtime-send-button name-send-button'; // Reutilizando os estilos
  sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
  
  // Adicionar evento de clique no botão de envio
  sendButton.addEventListener('click', function() {
    sendBirthtimeResponse(input.value);
  });
  
  // Adicionar evento de tecla no campo de entrada
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendBirthtimeResponse(input.value);
    }
  });
  
  // Adicionar os elementos ao container
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  
  // Adicionar o container ao chat
  chatMessages.appendChild(inputContainer);
  
  // Focar no campo de entrada e rolar para garantir visibilidade
  setTimeout(() => {
    input.focus();
    
    // Usar a função de rolagem automática
    if (window.scrollToInputOnFocus) {
      window.scrollToInputOnFocus(input);
    } else {
      // Fallback para o comportamento antigo
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 100);
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para enviar a resposta da hora de nascimento
function sendBirthtimeResponse(birthtime) {
  // Verificar se a hora foi digitada
  if (!birthtime || birthtime.trim() === '') {
    return;
  }
  
  // Obter o valor limpo
  const birthtimeText = birthtime.trim();
  const currentTime = getCurrentTime();
  
  // Remover o campo de entrada
  const inputContainer = document.querySelector('.birthtime-input-container');
  if (inputContainer) {
    chatMessages.removeChild(inputContainer);
  }
  
  // Criar mensagem enviada com a hora
  const messageEl = document.createElement('div');
  messageEl.className = 'message sent';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageTextEl = document.createElement('div');
  messageTextEl.className = 'message-text';
  messageTextEl.textContent = birthtimeText;
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = currentTime;
  
  // Criar o ícone de duplo check
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTextEl);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Adicionar mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Armazenar a mensagem do usuário
  userMessages.push({
    content: birthtimeText,
    time: currentTime
  });
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Mostrar a mensagem final sobre vida amorosa
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Criar e mostrar a mensagem final
      const loveLifeMessageContent = "Y por último ¿Cómo va tu vida amorosa?";
      const currentTime = getCurrentTime();
      const loveLifeMessageEl = createTextMessage(loveLifeMessageContent, currentTime, false);
      chatMessages.appendChild(loveLifeMessageEl);
      
      // Adicionar ao array displayedMessages 
      displayedMessages.push({
        type: 'text',
        content: loveLifeMessageContent,
        time: currentTime,
        isHTML: false
      });
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar os botões com as opções de vida amorosa após um pequeno delay
      setTimeout(() => {
        const loveLifeOptions = [
          "Estoy en una relación seria.",
          "Estoy conociendo a alguien o hablando con alguien.",
          "¡Estoy soltero/a en este momento!"
        ];
        showLoveLifeOptions(loveLifeOptions);
      }, 1000);
    }, 2000); // 2 segundos para simular a digitação
  }, 1000);
}

// Função para mostrar as opções de vida amorosa
function showLoveLifeOptions(options) {
  // Se já existe uma área de botões, remova-a primeiro
  const existingButtons = document.querySelector('.response-buttons');
  if (existingButtons) {
    chatMessages.removeChild(existingButtons);
  }
  
  // Criar a área de botões
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'response-buttons';
  
  // Adicionar cada botão de resposta
  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'response-button';
    button.textContent = option;
    
    // Evento de clique para o botão
    button.addEventListener('click', function() {
      // Remover os botões
      chatMessages.removeChild(buttonsContainer);
      
      // Processar a resposta escolhida
      processLoveLifeResponse(option);
    });
    
    buttonsContainer.appendChild(button);
  });
  
  // Adicionar os botões ao chat
  chatMessages.appendChild(buttonsContainer);
  
  // Rolar para baixo para mostrar os botões
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para processar a resposta sobre vida amorosa
function processLoveLifeResponse(response) {
    // Esconder os botões
    const responseOptions = document.getElementById('response-options');
    if (responseOptions) {
        responseOptions.innerHTML = '';
        responseOptions.style.display = 'none';
    }
    
    // Obter a hora atual
    const currentTime = getCurrentTime();
    
    // Criar mensagem enviada com o texto da resposta
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTextEl = document.createElement('div');
    messageTextEl.className = 'message-text';
    messageTextEl.textContent = response;
    
    const messageTimeContainer = document.createElement('div');
    messageTimeContainer.className = 'message-time-container';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;
    
    // Criar o ícone de duplo check
    const doubleCheck = document.createElement('span');
    doubleCheck.className = 'double-check';
    
    messageTimeContainer.appendChild(messageTime);
    messageTimeContainer.appendChild(doubleCheck);
    
    messageContent.appendChild(messageTextEl);
    messageContent.appendChild(messageTimeContainer);
    messageEl.appendChild(messageContent);
    
    // Adicionar mensagem ao chat
    chatMessages.appendChild(messageEl);
    
    // Armazenar a mensagem do usuário
    userMessages.push({
        content: response,
        time: currentTime
    });
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Delay para resposta do bot
    setTimeout(() => {
        showTypingIndicator();
        
        // Enviar mensagem após um certo tempo
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = "Me alegra saber que te va bien en la vida.";
            const currentTime = getCurrentTime();
            const messageEl = createTextMessage(botResponse, currentTime, false);
            chatMessages.appendChild(messageEl);
            
            // Adicionar ao array displayedMessages 
            displayedMessages.push({
              type: 'text',
              content: botResponse,
              time: currentTime,
              isHTML: false
            });
            // Removendo chamada ao saveChatData()
            
            // Segunda mensagem
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    const botResponse2 = "Generalmente, las personas que buscan pareja suelen tener suerte en sus relaciones, y tú pareces ser una de ellas.";
                    const currentTime2 = getCurrentTime();
                    const messageEl2 = createTextMessage(botResponse2, currentTime2, false);
                    chatMessages.appendChild(messageEl2);
                    
                    // Adicionar ao array displayedMessages 
                    displayedMessages.push({
                      type: 'text',
                      content: botResponse2,
                      time: currentTime2,
                      isHTML: false
                    });
                    // Removendo chamada ao saveChatData()
                    
                    // Áudio mensagem
                    setTimeout(() => {
                        showTypingIndicator();
                        
                        setTimeout(() => {
                            hideTypingIndicator();
                            const currentTime3 = getCurrentTime();
                            const audioEl = createAudioMessage("0:15", currentTime3, "assets/2.mp3");
                            chatMessages.appendChild(audioEl);
                            
                            // Adicionar ao array displayedMessages 
                            displayedMessages.push({
                              type: 'audio',
                              duration: "0:15",
                              audioSrc: "assets/2.mp3",
                              time: currentTime3
                            });
                            // Removendo chamada ao saveChatData()
                            
                            // Reproduzir o áudio automaticamente após um pequeno delay
                            setTimeout(() => {
                                // Encontrar o botão de play do áudio e simular o clique
                                const playButton = audioEl.querySelector('.play-button');
                                if (playButton) {
                                    playButton.click();
                                }
                                
                                // Última mensagem
                                setTimeout(() => {
                                    showTypingIndicator();
                                    
                                    setTimeout(() => {
                                        hideTypingIndicator();
                                        const botResponse3 = "Voy a enviarles las historias de algunas mujeres que recibieron un dibujo idéntico al de sus parejas...";
                                        const currentTime4 = getCurrentTime();
                                        const messageEl3 = createTextMessage(botResponse3, currentTime4, false);
                                        chatMessages.appendChild(messageEl3);
                                        
                                        // Adicionar ao array displayedMessages 
                                        displayedMessages.push({
                                          type: 'text',
                                          content: botResponse3,
                                          time: currentTime4,
                                          isHTML: false
                                        });
                                        // Removendo chamada ao saveChatData()
                                        
                                        // Primeira imagem com texto explicativo
                                        setTimeout(() => {
                                            showTypingIndicator();
                                            
                                            setTimeout(() => {
                                                hideTypingIndicator();
                                                const currentTime5 = getCurrentTime();
                                                const imageEl1 = createImageMessage("assets/img-1.png", null, currentTime5);
                                                chatMessages.appendChild(imageEl1);
                                                
                                                // Adicionar ao array displayedMessages 
                                                displayedMessages.push({
                                                  type: 'image',
                                                  content: "assets/img-1.png",
                                                  caption: null,
                                                  time: currentTime5
                                                });
                                                // Removendo chamada ao saveChatData()
                                                
                                                setTimeout(() => {
                                                    showTypingIndicator();
                                                    
                                                    setTimeout(() => {
                                                        hideTypingIndicator();
                                                        const imageText1 = "¡Esta es Mayara, ella adquirió nuestra oferta adicional que revela el nombre y características de la persona del dibujo!";
                                                        const currentTime6 = getCurrentTime();
                                                        const textMessageEl1 = createTextMessage(imageText1, currentTime6, false);
                                                        chatMessages.appendChild(textMessageEl1);
                                                        
                                                        // Adicionar ao array displayedMessages 
                                                        displayedMessages.push({
                                                          type: 'text',
                                                          content: imageText1,
                                                          time: currentTime6,
                                                          isHTML: false
                                                        });
                                                        // Removendo chamada ao saveChatData()
                                                        
                                                        // Segunda imagem com texto explicativo
                                                        setTimeout(() => {
                                                            showTypingIndicator();
                                                            
                                                            setTimeout(() => {
                                                                hideTypingIndicator();
                                                                const currentTime7 = getCurrentTime();
                                                                const imageEl2 = createImageMessage("assets/img-2.webp", null, currentTime7);
                                                                chatMessages.appendChild(imageEl2);
                                                                
                                                                // Adicionar ao array displayedMessages 
                                                                displayedMessages.push({
                                                                  type: 'image',
                                                                  content: "assets/img-2.webp",
                                                                  caption: null,
                                                                  time: currentTime7
                                                                });
                                                                // Removendo chamada ao saveChatData()
                                                                
                                                                setTimeout(() => {
                                                                    showTypingIndicator();
                                                                    
                                                                    setTimeout(() => {
                                                                        hideTypingIndicator();
                                                                        const imageText2 = "Esta es Olivia. ¡En menos de un mes, ya encontró a la persona del dibujo!";
                                                                        const currentTime8 = getCurrentTime();
                                                                        const textMessageEl2 = createTextMessage(imageText2, currentTime8, false);
                                                                        chatMessages.appendChild(textMessageEl2);
                                                                        
                                                                        // Adicionar ao array displayedMessages 
                                                                        displayedMessages.push({
                                                                          type: 'text',
                                                                          content: imageText2,
                                                                          time: currentTime8,
                                                                          isHTML: false
                                                                        });
                                                                        // Removendo chamada ao saveChatData()
                                                                        
                                                                        // Pergunta final com o nome do usuário
                                                                        setTimeout(() => {
                                                                            showTypingIndicator();
                                                                            
                                                                            setTimeout(() => {
                                                                                hideTypingIndicator();
                                                                                // Obter o nome do userMessages[1] (segunda mensagem)
                                                                                const userName = userMessages.length > 1 ? userMessages[1].content : '';
                                                                                const finalQuestion = `¿No es increíble, <strong>${userName}</strong>? ¿Te gustaría ver también las características de tu alma gemela?`;
                                                                                const currentTime9 = getCurrentTime();
                                                                                const finalMessageEl = createTextMessage(finalQuestion, currentTime9, true);
                                                                                chatMessages.appendChild(finalMessageEl);
                                                                                
                                                                                // Adicionar ao array displayedMessages 
                                                                                displayedMessages.push({
                                                                                  type: 'text',
                                                                                  content: finalQuestion,
                                                                                  time: currentTime9,
                                                                                  isHTML: true
                                                                                });
                                                                                // Removendo chamada ao saveChatData()
                                                                                
                                                                                // Botões de resposta
                                                                                setTimeout(() => {
                                                                                    const drawingOptions = [
                                                                                        "Sí, quiero ver las características de mi alma gemela!",
                                                                                        "Prefiero ver solo el dibujo, por favor!"
                                                                                    ];
                                                                                    showDrawingOptions(drawingOptions);
                                                                                }, 1000);
                                                                            }, 2000);
                                                                        }, 5000); // Aumentado para 5 segundos
                                                                    }, 2000);
                                                                }, 5000); // Aumentado para 5 segundos
                                                            }, 2000);
                                                        }, 5000); // Aumentado para 5 segundos
                                                    }, 2000);
                                                }, 5000); // Aumentado para 5 segundos
                                            }, 2000);
                                        }, 5000); // Aumentado para 5 segundos
                                    }, 2000);
                                }, 15000); // Tempo para ouvir o áudio
                            }, 1000);
                        }, 2000);
                    }, 1000);
                }, 2000);
            }, 1000);
        }, 2000);
    }, 1000);
}

// Função para mostrar as opções de visualização do desenho
function showDrawingOptions(options) {
    // Se já existe uma área de botões, remova-a primeiro
    const existingButtons = document.querySelector('.response-buttons');
    if (existingButtons) {
        chatMessages.removeChild(existingButtons);
    }
    
    // Criar a área de botões
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'response-buttons';
    
    // Adicionar cada botão de resposta
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'response-button';
        button.textContent = option;
        
        // Evento de clique para o botão
        button.addEventListener('click', function() {
            // Remover os botões
            chatMessages.removeChild(buttonsContainer);
            
            // Processar a resposta escolhida
            processDrawingResponse(option);
        });
        
        buttonsContainer.appendChild(button);
    });
    
    // Adicionar os botões ao chat
    chatMessages.appendChild(buttonsContainer);
    
    // Rolar para baixo para mostrar os botões
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para processar a resposta sobre o desenho
function processDrawingResponse(response) {
    // Obter a hora atual
    const currentTime = getCurrentTime();
    
    // Criar mensagem enviada com o texto da resposta
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTextEl = document.createElement('div');
    messageTextEl.className = 'message-text';
    messageTextEl.textContent = response;
    
    const messageTimeContainer = document.createElement('div');
    messageTimeContainer.className = 'message-time-container';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;
    
    // Criar o ícone de duplo check
    const doubleCheck = document.createElement('span');
    doubleCheck.className = 'double-check';
    
    messageTimeContainer.appendChild(messageTime);
    messageTimeContainer.appendChild(doubleCheck);
    
    messageContent.appendChild(messageTextEl);
    messageContent.appendChild(messageTimeContainer);
    messageEl.appendChild(messageContent);
    
    // Adicionar mensagem ao chat
    chatMessages.appendChild(messageEl);
    
    // Armazenar a mensagem do usuário
    userMessages.push({
        content: response,
        time: currentTime
    });
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Primeira mensagem de confirmação
    setTimeout(() => {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            let botResponse = "Perfecto! Procesaré tu solicitud ahora mismo...";
            const currentTime1 = getCurrentTime();
            const messageEl = createTextMessage(botResponse, currentTime1, false);
            chatMessages.appendChild(messageEl);
            
            // Adicionar ao array displayedMessages 
            displayedMessages.push({
                type: 'text',
                content: botResponse,
                time: currentTime1,
                isHTML: false
            });
            // Removendo chamada ao saveChatData()
            
            // Segunda mensagem perguntando se pode começar o desenho
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    // Obter o nome do usuário (segunda mensagem)
                    const userName = userMessages.length > 1 ? userMessages[1].content : '';
                    const drawMessage = `Perfecto, <strong>${userName}</strong>. ¿Puedo empezar a crear tu dibujo?`;
                    const currentTime2 = getCurrentTime();
                    const drawMessageEl = createTextMessage(drawMessage, currentTime2, true);
                    chatMessages.appendChild(drawMessageEl);
                    
                    // Adicionar ao array displayedMessages 
                    displayedMessages.push({
                        type: 'text',
                        content: drawMessage,
                        time: currentTime2,
                        isHTML: true
                    });
                    // Removendo chamada ao saveChatData()
                    
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Mostrar campo de entrada que não armazena informação
                    setTimeout(() => {
                        showConfirmDrawingInput();
                    }, 1000);
                }, 2000);
            }, 2000);
        }, 2000);
    }, 1000);
}

// Função para mostrar campo de entrada que não armazena informação
function showConfirmDrawingInput() {
    // Se já existe um campo, remova-o primeiro
    const existingInput = document.querySelector('.confirm-drawing-input-container');
    if (existingInput) {
        chatMessages.removeChild(existingInput);
    }
    
    // Criar o container do input
    const inputContainer = document.createElement('div');
    inputContainer.className = 'confirm-drawing-input-container name-input-container';
    
    // Criar o campo de entrada
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Tu respuesta...';
    input.className = 'confirm-drawing-input name-input';
    
    // Criar o botão de envio
    const sendButton = document.createElement('button');
    sendButton.className = 'confirm-drawing-send-button name-send-button';
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
    
    // Adicionar evento de clique no botão de envio
    sendButton.addEventListener('click', function() {
        processConfirmDrawingResponse(input.value);
    });
    
    // Adicionar evento de tecla no campo de entrada
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processConfirmDrawingResponse(input.value);
        }
    });
    
    // Adicionar os elementos ao container
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    
    // Adicionar o container ao chat
    chatMessages.appendChild(inputContainer);
    
    // Focar no campo de entrada e rolar para garantir visibilidade
    setTimeout(() => {
        input.focus();
        
        // Usar a função de rolagem automática
        if (window.scrollToInputOnFocus) {
            window.scrollToInputOnFocus(input);
        } else {
            // Fallback para o comportamento antigo
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 100);
}

// Função para processar a resposta de confirmação (sem armazenar)
function processConfirmDrawingResponse(response) {
    // Verificar se a resposta foi digitada
    if (!response || response.trim() === '') {
        return;
    }
    
    // Obter o valor limpo
    const responseText = response.trim();
    const currentTime = getCurrentTime();
    
    // Remover o campo de entrada
    const inputContainer = document.querySelector('.confirm-drawing-input-container');
    if (inputContainer) {
        chatMessages.removeChild(inputContainer);
    }
    
    // Criar mensagem enviada com a resposta
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTextEl = document.createElement('div');
    messageTextEl.className = 'message-text';
    messageTextEl.textContent = responseText;
    
    const messageTimeContainer = document.createElement('div');
    messageTimeContainer.className = 'message-time-container';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;
    
    // Criar o ícone de duplo check
    const doubleCheck = document.createElement('span');
    doubleCheck.className = 'double-check';
    
    messageTimeContainer.appendChild(messageTime);
    messageTimeContainer.appendChild(doubleCheck);
    
    messageContent.appendChild(messageTextEl);
    messageContent.appendChild(messageTimeContainer);
    messageEl.appendChild(messageContent);
    
    // Adicionar mensagem ao chat
    chatMessages.appendChild(messageEl);
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Continuar com o fluxo - mostrar o nome do usuário
    setTimeout(() => {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            // Obter o nome do usuário (segunda mensagem)
            const userName = userMessages.length > 1 ? userMessages[1].content : '';
            const nameMessage = `<strong>${userName}</strong>`;
            const currentTime = getCurrentTime();
            const nameMessageEl = createTextMessage(nameMessage, currentTime, true);
            chatMessages.appendChild(nameMessageEl);
            
            // Adicionar ao array displayedMessages 
            displayedMessages.push({
                type: 'text',
                content: nameMessage,
                time: currentTime,
                isHTML: true
            });
            // Removendo chamada ao saveChatData()
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Mostrar o signo do usuário (corrigido para pegar a terceira mensagem)
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    // Obter o signo correto do usuário usando a variável armazenada anteriormente
                    const userSign = window.userSignData ? window.userSignData.content : 'Desconhecido';
                    const signMessage = `<strong>${userSign}</strong>`;
                    const currentTime2 = getCurrentTime();
                    const signMessageEl = createTextMessage(signMessage, currentTime2, true);
                    chatMessages.appendChild(signMessageEl);
                    
                    // Adicionar ao array displayedMessages 
                    displayedMessages.push({
                        type: 'text',
                        content: signMessage,
                        time: currentTime2,
                        isHTML: true
                    });
                    // Removendo chamada ao saveChatData()
                    
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Mostrar a hora do usuário
                    setTimeout(() => {
                        showTypingIndicator();
                        
                        setTimeout(() => {
                            hideTypingIndicator();
                            // Obter a hora do usuário (quinta mensagem)
                            const userTime = userMessages.length > 4 ? userMessages[4].content : '';
                            const timeMessage = `<strong>${userTime}</strong>`;
                            const currentTime3 = getCurrentTime();
                            const timeMessageEl = createTextMessage(timeMessage, currentTime3, true);
                            chatMessages.appendChild(timeMessageEl);
                            
                            // Adicionar ao array displayedMessages 
                            displayedMessages.push({
                                type: 'text',
                                content: timeMessage,
                                time: currentTime3,
                                isHTML: true
                            });
                            // Removendo chamada ao saveChatData()
                            
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                            
                            // Mensagem sobre consulta da carta astral
                            setTimeout(() => {
                                showTypingIndicator();
                                
                                setTimeout(() => {
                                    hideTypingIndicator();
                                    const astralMessage = "Estoy consultando tu carta astral. Por favor, no cruces los brazos ni las piernas. ¡Estoy visualizando información muy importante sobre tu alma gemela!";
                                    const currentTime4 = getCurrentTime();
                                    const astralMessageEl = createTextMessage(astralMessage, currentTime4, false);
                                    chatMessages.appendChild(astralMessageEl);
                                    
                                    // Adicionar ao array displayedMessages 
                                    displayedMessages.push({
                                        type: 'text',
                                        content: astralMessage,
                                        time: currentTime4,
                                        isHTML: false
                                    });
                                    // Removendo chamada ao saveChatData()
                                    
                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                    
                                    // Mensagem final sobre análise da carta (com delay maior)
                                    setTimeout(() => {
                                        showTypingIndicator();
                                        
                                        setTimeout(() => {
                                            hideTypingIndicator();
                                            const finalAnalysisMessage = "Analizaré tu Carta profundamente y con mi Don me concentraré para dibujar el rostro que estoy visualizando.";
                                            const currentTime5 = getCurrentTime();
                                            const finalAnalysisMessageEl = createTextMessage(finalAnalysisMessage, currentTime5, false);
                                            chatMessages.appendChild(finalAnalysisMessageEl);
                                            
                                            // Adicionar ao array displayedMessages 
                                            displayedMessages.push({
                                                type: 'text',
                                                content: finalAnalysisMessage,
                                                time: currentTime5,
                                                isHTML: false
                                            });
                                            // Removendo chamada ao saveChatData()
                                            
                                            chatMessages.scrollTop = chatMessages.scrollHeight;
                                            
                                            // Primeira mensagem de áudio (3.mp3)
                                            setTimeout(() => {
                                                showTypingIndicator();
                                                
                                                setTimeout(() => {
                                                    hideTypingIndicator();
                                                    const currentTime6 = getCurrentTime();
                                                    const audioEl1 = createAudioMessage("0:16", currentTime6, "assets/3.mp3");
                                                    chatMessages.appendChild(audioEl1);
                                                    
                                                    // Adicionar ao array displayedMessages 
                                                    displayedMessages.push({
                                                        type: 'audio',
                                                        duration: "0:16",
                                                        audioSrc: "assets/3.mp3",
                                                        time: currentTime6
                                                    });
                                                    // Removendo chamada ao saveChatData()
                                                    
                                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                                    
                                                    // Reproduzir o áudio automaticamente após um pequeno delay
                                                    setTimeout(() => {
                                                        // Encontrar o botão de play do áudio e simular o clique
                                                        const playButton = audioEl1.querySelector('.play-button');
                                                        if (playButton) {
                                                            playButton.click();
                                                        }
                                                        
                                                        // Segunda mensagem de áudio (4.mp3) após 16 segundos
                                                        setTimeout(() => {
                                                            showTypingIndicator();
                                                            
                                                            setTimeout(() => {
                                                                hideTypingIndicator();
                                                                const currentTime7 = getCurrentTime();
                                                                const audioEl2 = createAudioMessage("0:11", currentTime7, "assets/4.mp3");
                                                                chatMessages.appendChild(audioEl2);
                                                                
                                                                // Adicionar ao array displayedMessages 
                                                                displayedMessages.push({
                                                                    type: 'audio',
                                                                    duration: "0:11",
                                                                    audioSrc: "assets/4.mp3",
                                                                    time: currentTime7
                                                                });
                                                                // Removendo chamada ao saveChatData()
                                                                
                                                                chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                
                                                                // Reproduzir o segundo áudio automaticamente após um pequeno delay
                                                                setTimeout(() => {
                                                                    // Encontrar o botão de play do áudio e simular o clique
                                                                    const playButton = audioEl2.querySelector('.play-button');
                                                                    if (playButton) {
                                                                        playButton.click();
                                                                    }
                                                                    
                                                                    // Mensagem de confirmação após 11 segundos
                                                                    setTimeout(() => {
                                                                        showTypingIndicator();
                                                                        
                                                                        setTimeout(() => {
                                                                            hideTypingIndicator();
                                                                            const confirmMessage = "Para enviarte el dibujo en cuanto lo termine, solo necesito tu confirmación. ¡Haz clic en el botón de abajo para confirmar!";
                                                                            const currentTime8 = getCurrentTime();
                                                                            const confirmMessageEl = createTextMessage(confirmMessage, currentTime8, false);
                                                                            chatMessages.appendChild(confirmMessageEl);
                                                                            
                                                                            // Adicionar ao array displayedMessages 
                                                                            displayedMessages.push({
                                                                                type: 'text',
                                                                                content: confirmMessage,
                                                                                time: currentTime8,
                                                                                isHTML: false
                                                                            });
                                                                            // Removendo chamada ao saveChatData()
                                                                            
                                                                            chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                            
                                                                            // Mostrar botão de confirmação
                                                                            setTimeout(() => {
                                                                                const confirmOptions = [
                                                                                    "¡SÍ, DIBUJA A MI ALMA GEMELA!"
                                                                                ];
                                                                                showFinalConfirmation(confirmOptions);
                                                                            }, 1000);
                                                                        }, 2000);
                                                                    }, 11000); // 11 segundos para ouvir o segundo áudio
                                                                }, 1000);
                                                            }, 2000);
                                                        }, 16000); // 16 segundos para ouvir o primeiro áudio
                                                    }, 1000);
                                                }, 2000);
                                            }, 3000);
                                        }, 5000); // 5 segundos de delay conforme solicitado
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 2000);
    }, 1000);
}

// Função para mostrar o botão de confirmação final
function showFinalConfirmation(options) {
    // Se já existe uma área de botões, remova-a primeiro
    const existingButtons = document.querySelector('.response-buttons');
    if (existingButtons) {
        chatMessages.removeChild(existingButtons);
    }
    
    // Criar a área de botões
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'response-buttons';
    
    // Adicionar cada botão de resposta
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'response-button';
        button.textContent = option;
        
        // Evento de clique para o botão
        button.addEventListener('click', function() {
            // Remover os botões
            chatMessages.removeChild(buttonsContainer);
            
            // Processar a resposta final
            processFinalConfirmation(option);
        });
        
        buttonsContainer.appendChild(button);
    });
    
    // Adicionar os botões ao chat
    chatMessages.appendChild(buttonsContainer);
    
    // Rolar para baixo para mostrar os botões
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para processar a confirmação final
function processFinalConfirmation(response) {
    // Obter a hora atual
    const currentTime = getCurrentTime();
    
    // Criar mensagem enviada com o texto da resposta
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTextEl = document.createElement('div');
    messageTextEl.className = 'message-text';
    messageTextEl.textContent = response;
    
    const messageTimeContainer = document.createElement('div');
    messageTimeContainer.className = 'message-time-container';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;
    
    // Criar o ícone de duplo check
    const doubleCheck = document.createElement('span');
    doubleCheck.className = 'double-check';
    
    messageTimeContainer.appendChild(messageTime);
    messageTimeContainer.appendChild(doubleCheck);
    
    messageContent.appendChild(messageTextEl);
    messageContent.appendChild(messageTimeContainer);
    messageEl.appendChild(messageContent);
    
    // Adicionar mensagem ao chat
    chatMessages.appendChild(messageEl);
    
    // Armazenar a mensagem do usuário
    userMessages.push({
        content: response,
        time: currentTime
    });
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Primeira mensagem de confirmação
    setTimeout(() => {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const finalResponse = "¡Perfecto! Ya estoy trabajando en tu dibujo. Te avisaré cuando esté listo.";
            const currentTime1 = getCurrentTime();
            const finalResponseEl = createTextMessage(finalResponse, currentTime1, false);
            chatMessages.appendChild(finalResponseEl);
            
            // Adicionar ao array displayedMessages 
            displayedMessages.push({
                type: 'text',
                content: finalResponse,
                time: currentTime1,
                isHTML: false
            });
            // Removendo chamada ao saveChatData()
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Primeira mensagem sobre momento especial
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    const specialMomentMessage = "¡Estás a punto de vivir un momento especial! Pero ahora, presta mucha atención, querida...";
                    const currentTime2 = getCurrentTime();
                    const specialMomentEl = createTextMessage(specialMomentMessage, currentTime2, false);
                    chatMessages.appendChild(specialMomentEl);
                    
                    // Adicionar ao array displayedMessages 
                    displayedMessages.push({
                        type: 'text',
                        content: specialMomentMessage,
                        time: currentTime2,
                        isHTML: false
                    });
                    // Removendo chamada ao saveChatData()
                    
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Segunda mensagem sobre não cobrar pela consulta
                    setTimeout(() => {
                        showTypingIndicator();
                        
                        setTimeout(() => {
                            hideTypingIndicator();
                            const freeConsultMessage = "No cobro nada por la consulta.";
                            const currentTime3 = getCurrentTime();
                            const freeConsultEl = createTextMessage(freeConsultMessage, currentTime3, false);
                            chatMessages.appendChild(freeConsultEl);
                            
                            // Adicionar ao array displayedMessages 
                            displayedMessages.push({
                                type: 'text',
                                content: freeConsultMessage,
                                time: currentTime3,
                                isHTML: false
                            });
                            // Removendo chamada ao saveChatData()
                            
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                            
                            // Primeiro áudio (5.mp3 em vez de 6.mp3)
                            setTimeout(() => {
                                showTypingIndicator();
                                
                                setTimeout(() => {
                                    hideTypingIndicator();
                                    const currentTime4 = getCurrentTime();
                                    const audioEl1 = createAudioMessage("0:19", currentTime4, "assets/5.mp3");
                                    chatMessages.appendChild(audioEl1);
                                    
                                    // Adicionar ao array displayedMessages 
                                    displayedMessages.push({
                                        type: 'audio',
                                        duration: "0:19",
                                        audioSrc: "assets/5.mp3",
                                        time: currentTime4
                                    });
                                    // Removendo chamada ao saveChatData()
                                    
                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                    
                                    // Reproduzir o áudio automaticamente após um pequeno delay
                                    setTimeout(() => {
                                        // Encontrar o botão de play do áudio e simular o clique
                                        const playButton = audioEl1.querySelector('.play-button');
                                        if (playButton) {
                                            playButton.click();
                                        }
                                        
                                        // Mensagem sobre o valor da tarifa após 19 segundos (em vez de 23)
                                        setTimeout(() => {
                                            showTypingIndicator();
                                            
                                            setTimeout(() => {
                                                hideTypingIndicator();
                                                const priceMessage = "La tarifa es de solo <strong>$23,90</strong>";
                                                const currentTime5 = getCurrentTime();
                                                const priceMessageEl = createTextMessage(priceMessage, currentTime5, true);
                                                chatMessages.appendChild(priceMessageEl);
                                                
                                                // Adicionar ao array displayedMessages 
                                                displayedMessages.push({
                                                    type: 'text',
                                                    content: priceMessage,
                                                    time: currentTime5,
                                                    isHTML: true
                                                });
                                                // Removendo chamada ao saveChatData()
                                                
                                                chatMessages.scrollTop = chatMessages.scrollHeight;
                                                
                                                // Segundo áudio (6.mp3 em vez de 7.mp3)
                                                setTimeout(() => {
                                                    showTypingIndicator();
                                                    
                                                    setTimeout(() => {
                                                        hideTypingIndicator();
                                                        const currentTime6 = getCurrentTime();
                                                        const audioEl2 = createAudioMessage("0:23", currentTime6, "assets/6.mp3");
                                                        chatMessages.appendChild(audioEl2);
                                                        
                                                        // Adicionar ao array displayedMessages 
                                                        displayedMessages.push({
                                                            type: 'audio',
                                                            duration: "0:23",
                                                            audioSrc: "assets/6.mp3",
                                                            time: currentTime6
                                                        });
                                                        // Removendo chamada ao saveChatData()
                                                        
                                                        chatMessages.scrollTop = chatMessages.scrollHeight;
                                                        
                                                        // Reproduzir o segundo áudio automaticamente após um pequeno delay
                                                        setTimeout(() => {
                                                            // Encontrar o botão de play do áudio e simular o clique
                                                            const playButton = audioEl2.querySelector('.play-button');
                                                            if (playButton) {
                                                                playButton.click();
                                                            }
                                                            
                                                            // Mensagem final sobre o pagamento após 23 segundos (em vez de 24)
                                                            setTimeout(() => {
                                                                showTypingIndicator();
                                                                
                                                                setTimeout(() => {
                                                                    hideTypingIndicator();
                                                                    const paymentMessage = "Dejaré un botón abajo para que realices el pago. Después, te enviaré el retrato de tu alma gemela por correo electrónico y te brindaré orientación personal durante los próximos meses para que el universo pueda manifestar rápidamente a la persona destinada a tener una conexión especial contigo.";
                                                                    const currentTime7 = getCurrentTime();
                                                                    const paymentMessageEl = createTextMessage(paymentMessage, currentTime7, false);
                                                                    chatMessages.appendChild(paymentMessageEl);
                                                                    
                                                                    // Adicionar ao array displayedMessages 
                                                                    displayedMessages.push({
                                                                        type: 'text',
                                                                        content: paymentMessage,
                                                                        time: currentTime7,
                                                                        isHTML: false
                                                                    });
                                                                    // Removendo chamada ao saveChatData()
                                                                    
                                                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                    
                                                                    // Adicionar imagem clicável como link para pagamento
                                                                    setTimeout(() => {
                                                                        showTypingIndicator();
                                                                        
                                                                        setTimeout(() => {
                                                                            hideTypingIndicator();
                                                                            
                                                                            // Criar elemento de mensagem para a imagem clicável
                                                                            const imageMessageEl = document.createElement('div');
                                                                            imageMessageEl.className = 'message received';
                                                                            
                                                                            const imageMessageContent = document.createElement('div');
                                                                            imageMessageContent.className = 'message-content';
                                                                            
                                                                            // Criar link clicável
                                                                            const imageLink = document.createElement('a');
                                                                            imageLink.href = 'https://pay.hotmart.com/K99339842P?off=39bpaez7';
                                                                            imageLink.target = '_blank'; // Abrir em nova aba
                                                                            
                                                                            // Adicionar imagem dentro do link
                                                                            const imageElement = document.createElement('img');
                                                                            imageElement.src = 'assets/img-3.png';
                                                                            imageElement.className = 'chat-image';
                                                                            imageElement.alt = 'Realizar pago';
                                                                            
                                                                            // Montar a estrutura
                                                                            imageLink.appendChild(imageElement);
                                                                            
                                                                            const imageMessageText = document.createElement('div');
                                                                            imageMessageText.className = 'message-text image-container';
                                                                            imageMessageText.appendChild(imageLink);
                                                                            
                                                                            const imageTimeContainer = document.createElement('div');
                                                                            imageTimeContainer.className = 'message-time-container';
                                                                            
                                                                            const imageTime = document.createElement('span');
                                                                            imageTime.className = 'message-time';
                                                                            imageTime.textContent = getCurrentTime();
                                                                            
                                                                            imageTimeContainer.appendChild(imageTime);
                                                                            
                                                                            imageMessageContent.appendChild(imageMessageText);
                                                                            imageMessageContent.appendChild(imageTimeContainer);
                                                                            imageMessageEl.appendChild(imageMessageContent);
                                                                            
                                                                            // Adicionar a mensagem ao chat
                                                                            chatMessages.appendChild(imageMessageEl);
                                                                            
                                                                            // Adicionar ao array displayedMessages 
                                                                            const imageTime8 = getCurrentTime();
                                                                            displayedMessages.push({
                                                                                type: 'image',
                                                                                content: 'assets/img-3.png',
                                                                                caption: null,
                                                                                time: imageTime8
                                                                            });
                                                                            // Removendo chamada ao saveChatData()
                                                                            
                                                                            chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                            
                                                                            // Adicionar mensagem de áudio após imagem (7.mp3 em vez de 8.mp3)
                                                                            setTimeout(() => {
                                                                                showTypingIndicator();
                                                                                
                                                                                setTimeout(() => {
                                                                                    hideTypingIndicator();
                                                                                    const currentTime9 = getCurrentTime();
                                                                                    const audioEl3 = createAudioMessage("0:24", currentTime9, "assets/7.mp3");
                                                                                    chatMessages.appendChild(audioEl3);
                                                                                    
                                                                                    // Adicionar ao array displayedMessages 
                                                                                    displayedMessages.push({
                                                                                        type: 'audio',
                                                                                        duration: "0:24",
                                                                                        audioSrc: "assets/7.mp3",
                                                                                        time: currentTime9
                                                                                    });
                                                                                    // Removendo chamada ao saveChatData()
                                                                                    
                                                                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                                    
                                                                                    // Reproduzir o áudio automaticamente após um pequeno delay
                                                                                    setTimeout(() => {
                                                                                        // Encontrar o botão de play do áudio e simular o clique
                                                                                        const playButton = audioEl3.querySelector('.play-button');
                                                                                        if (playButton) {
                                                                                            playButton.click();
                                                                                        }
                                                                                    }, 1000);
                                                                                }, 2000);
                                                                            }, 2000);
                                                                        }, 2000);
                                                                    }, 2000);
                                                                }, 2000);
                                                            }, 23000); // 23 segundos para ouvir o segundo áudio (em vez de 24)
                                                        }, 1000);
                                                    }, 2000);
                                                }, 2000);
                                            }, 2000);
                                        }, 19000); // 19 segundos para ouvir o primeiro áudio (em vez de 23)
                                    }, 1000);
                                }, 2000);
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 2000);
    }, 1000);
}
