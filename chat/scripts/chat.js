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
const STORAGE_KEY = 'whatsapp_chat_data';

// Load chat data from localStorage
function loadChatData() {
  const chatData = localStorage.getItem(STORAGE_KEY);
  if (chatData) {
    const parsedData = JSON.parse(chatData);
    currentMessageIndex = parsedData.currentMessageIndex;
    displayedMessages = parsedData.displayedMessages || [];
    userMessages = parsedData.userMessages || [];
    
    // Restore displayed messages
    if (displayedMessages.length > 0) {
      displayedMessages.forEach(message => {
        let messageEl;
        switch (message.type) {
          case 'text':
            messageEl = createTextMessage(message.content, message.time, message.isHTML);
            break;
          case 'image':
            messageEl = createImageMessage(message.content, message.caption, message.time);
            break;
          case 'audio':
            messageEl = createAudioMessage(message.duration, message.time, message.audioSrc);
            break;
          case 'link':
            messageEl = createLinkMessage(message.content, message.url, message.preview, message.time);
            break;
          default:
            messageEl = createTextMessage(message.content, message.time);
        }
        chatMessages.appendChild(messageEl);
      });
    }
    
    // Restore user messages
    if (userMessages.length > 0) {
      userMessages.forEach(message => {
        const messageEl = document.createElement('div');
        messageEl.className = 'message sent';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = message.content;
        
        const messageTimeContainer = document.createElement('div');
        messageTimeContainer.className = 'message-time-container';
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = message.time;
        
        // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
        const doubleCheck = document.createElement('span');
        doubleCheck.className = 'double-check';
        
        messageTimeContainer.appendChild(messageTime);
        messageTimeContainer.appendChild(doubleCheck);
        
        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTimeContainer);
        messageEl.appendChild(messageContent);
        
        chatMessages.appendChild(messageEl);
      });
    }
    
    // Show buttons if we've reached the end of the predefined messages
    if (currentMessageIndex >= messageData.length) {
      setTimeout(() => {
        showResponseButtons(["¡Sí, quiero descubrir a mi alma gemela!"]);
      }, 1000);
    }
    
    // Scroll to bottom
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }
}

// Save chat data to localStorage
function saveChatData() {
  const chatData = {
    currentMessageIndex,
    displayedMessages,
    userMessages
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chatData));
}

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
      
      // Salvar no localStorage
      saveChatData();
      
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
          const messageEl = createTextMessage(nextMessageContent, getCurrentTime(), true);
          chatMessages.appendChild(messageEl);
          
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
    // Se todas as mensagens foram exibidas, mostrar os botões de resposta em vez do input padrão
    setTimeout(() => {
      showResponseButtons(["¡Sí, quiero descubrir a mi alma gemela!"]);
    }, 1000);
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
    } else {
      // All messages displayed, show response buttons
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
    
    // Save to local storage
    saveChatData();
    
    // Display next message or show input if done
    currentMessageIndex++;
    if (currentMessageIndex < messageData.length) {
      setTimeout(() => {
        displayMessage(messageData[currentMessageIndex]);
      }, messageInfo.delay || 2000);
    } else {
      // All messages displayed, show response buttons
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
    
    // Save to local storage
    saveChatData();
    
    // Display next message or show response buttons if done
    currentMessageIndex++;
    if (currentMessageIndex < messageData.length) {
      setTimeout(() => {
        displayMessage(messageData[currentMessageIndex]);
      }, messageData[currentMessageIndex].delay);
    } else {
      // All messages displayed, show response buttons
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
  
  // Try to load existing chat data
  loadChatData();
  
  // If no previous messages, start displaying messages after a short delay
  if (displayedMessages.length === 0) {
    console.log('No previous messages, starting new conversation');
  setTimeout(() => {
    displayMessage(messageData[currentMessageIndex]);
  }, 1000);
  } else {
    console.log('Found previous messages:', displayedMessages.length);
    // If we have previous messages but haven't displayed all of them yet,
    // continue from where we left off
    if (currentMessageIndex < messageData.length) {
      console.log('Continuing from message index:', currentMessageIndex);
  setTimeout(() => {
        displayMessage(messageData[currentMessageIndex]);
      }, 1000);
    } else {
      // Se todas as mensagens foram exibidas, mostrar os botões de resposta
      console.log('All messages displayed, showing response buttons');
    setTimeout(() => {
        showResponseButtons(["¡Sí, quiero descubrir a mi alma gemela!"]);
      }, 1000);
    }
  }
});

// Clear chat history - utility function for testing
window.clearChatHistory = function() {
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
    if (parseInt(progressBar.style.width || '0') >= 100) {
      progressBar.style.width = '0%';
    }
    
    // Simulate audio playback
    let progress = parseInt(progressBar.style.width || '0');
    const interval = setInterval(() => {
      progress += 1;
      progressBar.style.width = `${progress}%`;
      
      if (progress >= 100) {
        clearInterval(interval);
        playButton.classList.remove('playing');
        playButton.innerHTML = '<i class="fas fa-play"></i>';
      }
    }, 300);
    
    playButton.dataset.intervalId = interval;
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
  
  // Focar no campo de entrada
  setTimeout(() => {
    input.focus();
  }, 100);
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
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
  
  // Salvar no localStorage
  saveChatData();
  
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
      const messageEl = createTextMessage(nextMessageContent, getCurrentTime(), true);
      chatMessages.appendChild(messageEl);
      
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
          const message1El = createTextMessage(message1Content, getCurrentTime(), true);
          chatMessages.appendChild(message1El);
          
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
              const message2El = createTextMessage(message2Content, getCurrentTime(), false);
              chatMessages.appendChild(message2El);
              
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
                  const audioEl = createAudioMessage("0:17", getCurrentTime(), "assets/1.mp3");
                  chatMessages.appendChild(audioEl);
                  
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
                        const messageEl = createTextMessage(nextMessageContent, getCurrentTime(), true);
                        chatMessages.appendChild(messageEl);
                        
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
  
  // Salvar no localStorage
  saveChatData();
  
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
      const messageEl = createTextMessage(nextMessageContent, getCurrentTime(), false);
      chatMessages.appendChild(messageEl);
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar o campo de entrada para o signo após um pequeno delay
      setTimeout(() => {
        showSignInput();
      }, 500);
    }, 2000); // 2 segundos para simular a digitação
  }, 1000); // 1 segundo após a resposta do usuário (delay normal)
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
  
  // Focar no campo de entrada
  setTimeout(() => {
    input.focus();
  }, 100);
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
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
  
  // Salvar no localStorage
  saveChatData();
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Armazenar o signo para uso futuro
  const userSign = signText;
  
  // Encontrar o nome do usuário (corrigindo a lógica para obter o nome correto)
  let userName = ""; // Valor padrão caso não encontre
  
  // Procurar nas mensagens do usuário por um nome
  // O nome do usuário geralmente é a segunda mensagem do usuário
  // A primeira mensagem é a resposta do botão inicial "¡Sí, quiero descubrir a mi alma gemela!"
  if (userMessages.length > 1) {
    userName = userMessages[1].content;
  }
  
  // Exibir a próxima mensagem mencionando o nome e o signo
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Criar e mostrar a mensagem personalizada com nome e signo
      const nextMessageContent = `Qué casualidad, <strong>${userName}</strong>, yo también soy <strong>${userSign}</strong>.`;
      const messageEl = createTextMessage(nextMessageContent, getCurrentTime(), true);
      chatMessages.appendChild(messageEl);
      
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
          const birthdateMessageEl = createTextMessage(birthdateMessageContent, getCurrentTime(), false);
          chatMessages.appendChild(birthdateMessageEl);
          
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
  
  // Focar no campo de entrada
  setTimeout(() => {
    input.focus();
  }, 100);
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
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
  
  // Salvar no localStorage
  saveChatData();
  
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
      const birthtimeMessageEl = createTextMessage(birthtimeMessageContent, getCurrentTime(), false);
      chatMessages.appendChild(birthtimeMessageEl);
      
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
  
  // Focar no campo de entrada
  setTimeout(() => {
    input.focus();
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
  
  // Salvar no localStorage
  saveChatData();
  
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
      const loveLifeMessageEl = createTextMessage(loveLifeMessageContent, getCurrentTime(), false);
      chatMessages.appendChild(loveLifeMessageEl);
      
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
    
    // Salvar no localStorage
    saveChatData();
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Delay para resposta do bot
    setTimeout(() => {
        showTypingIndicator();
        
        // Enviar mensagem após um certo tempo
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = "Me alegra saber que te va bien en la vida.";
            const messageEl = createTextMessage(botResponse, getCurrentTime(), false);
            chatMessages.appendChild(messageEl);
            
            // Segunda mensagem
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    const botResponse2 = "Generalmente, las personas que buscan pareja suelen tener suerte en sus relaciones, y tú pareces ser una de ellas.";
                    const messageEl2 = createTextMessage(botResponse2, getCurrentTime(), false);
                    chatMessages.appendChild(messageEl2);
                    
                    // Áudio mensagem
                    setTimeout(() => {
                        showTypingIndicator();
                        
                        setTimeout(() => {
                            hideTypingIndicator();
                            const audioEl = createAudioMessage("0:15", getCurrentTime(), "assets/2.mp3");
                            chatMessages.appendChild(audioEl);
                            
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
                                        const messageEl3 = createTextMessage(botResponse3, getCurrentTime(), false);
                                        chatMessages.appendChild(messageEl3);
                                        
                                        // Primeira imagem com texto explicativo
                                        setTimeout(() => {
                                            showTypingIndicator();
                                            
                                            setTimeout(() => {
                                                hideTypingIndicator();
                                                const imageEl1 = createImageMessage("assets/img-1.png", null, getCurrentTime());
                                                chatMessages.appendChild(imageEl1);
                                                
                                                setTimeout(() => {
                                                    showTypingIndicator();
                                                    
                                                    setTimeout(() => {
                                                        hideTypingIndicator();
                                                        const imageText1 = "¡Esta es Mayara, ella adquirió nuestra oferta adicional que revela el nombre y características de la persona del dibujo!";
                                                        const textMessageEl1 = createTextMessage(imageText1, getCurrentTime(), false);
                                                        chatMessages.appendChild(textMessageEl1);
                                                        
                                                        // Segunda imagem com texto explicativo
                                                        setTimeout(() => {
                                                            showTypingIndicator();
                                                            
                                                            setTimeout(() => {
                                                                hideTypingIndicator();
                                                                const imageEl2 = createImageMessage("assets/img-2.webp", null, getCurrentTime());
                                                                chatMessages.appendChild(imageEl2);
                                                                
                                                                setTimeout(() => {
                                                                    showTypingIndicator();
                                                                    
                                                                    setTimeout(() => {
                                                                        hideTypingIndicator();
                                                                        const imageText2 = "Esta es Olivia. ¡En menos de un mes, ya encontró a la persona del dibujo!";
                                                                        const textMessageEl2 = createTextMessage(imageText2, getCurrentTime(), false);
                                                                        chatMessages.appendChild(textMessageEl2);
                                                                        
                                                                        // Pergunta final com o nome do usuário
                                                                        setTimeout(() => {
                                                                            showTypingIndicator();
                                                                            
                                                                            setTimeout(() => {
                                                                                hideTypingIndicator();
                                                                                // Obter o nome do userMessages[1] (segunda mensagem)
                                                                                const userName = userMessages.length > 1 ? userMessages[1].content : '';
                                                                                const finalQuestion = `¿No es increíble, <strong>${userName}</strong>? ¿Te gustaría ver también las características de tu alma gemela?`;
                                                                                const finalMessageEl = createTextMessage(finalQuestion, getCurrentTime(), true);
                                                                                chatMessages.appendChild(finalMessageEl);
                                                                                
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
    
    // Salvar no localStorage
    saveChatData();
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Primeira mensagem de confirmação
    setTimeout(() => {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            let botResponse = "Perfecto! Procesaré tu solicitud ahora mismo...";
            const messageEl = createTextMessage(botResponse, getCurrentTime(), false);
            chatMessages.appendChild(messageEl);
            
            // Segunda mensagem perguntando se pode começar o desenho
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    // Obter o nome do usuário (segunda mensagem)
                    const userName = userMessages.length > 1 ? userMessages[1].content : '';
                    const drawMessage = `Perfecto, <strong>${userName}</strong>. ¿Puedo empezar a crear tu dibujo?`;
                    const drawMessageEl = createTextMessage(drawMessage, getCurrentTime(), true);
                    chatMessages.appendChild(drawMessageEl);
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
    
    // Focar no campo de entrada
    setTimeout(() => {
        input.focus();
    }, 100);
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
            const nameMessageEl = createTextMessage(nameMessage, getCurrentTime(), true);
            chatMessages.appendChild(nameMessageEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Mostrar o signo do usuário (corrigido para pegar a terceira mensagem)
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    // Obter o signo do usuário (terceira mensagem)
                    // Corrigido para usar userMessages[3] que é a mensagem do signo
                    const userSign = userMessages.length > 3 ? userMessages[3].content : '';
                    const signMessage = `<strong>${userSign}</strong>`;
                    const signMessageEl = createTextMessage(signMessage, getCurrentTime(), true);
                    chatMessages.appendChild(signMessageEl);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Mostrar a hora do usuário
                    setTimeout(() => {
                        showTypingIndicator();
                        
                        setTimeout(() => {
                            hideTypingIndicator();
                            // Obter a hora do usuário (quinta mensagem)
                            const userTime = userMessages.length > 4 ? userMessages[4].content : '';
                            const timeMessage = `<strong>${userTime}</strong>`;
                            const timeMessageEl = createTextMessage(timeMessage, getCurrentTime(), true);
                            chatMessages.appendChild(timeMessageEl);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                            
                            // Mensagem sobre consulta da carta astral
                            setTimeout(() => {
                                showTypingIndicator();
                                
                                setTimeout(() => {
                                    hideTypingIndicator();
                                    const astralMessage = "Estoy consultando tu carta astral. Por favor, no cruces los brazos ni las piernas. ¡Estoy visualizando información muy importante sobre tu alma gemela!";
                                    const astralMessageEl = createTextMessage(astralMessage, getCurrentTime(), false);
                                    chatMessages.appendChild(astralMessageEl);
                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                    
                                    // Mensagem final sobre análise da carta (com delay maior)
                                    setTimeout(() => {
                                        showTypingIndicator();
                                        
                                        setTimeout(() => {
                                            hideTypingIndicator();
                                            const finalAnalysisMessage = "Analizaré tu Carta profundamente y con mi Don me concentraré para dibujar el rostro que estoy visualizando.";
                                            const finalAnalysisMessageEl = createTextMessage(finalAnalysisMessage, getCurrentTime(), false);
                                            chatMessages.appendChild(finalAnalysisMessageEl);
                                            chatMessages.scrollTop = chatMessages.scrollHeight;
                                            
                                            // Primeira mensagem de áudio (3.mp3)
                                            setTimeout(() => {
                                                showTypingIndicator();
                                                
                                                setTimeout(() => {
                                                    hideTypingIndicator();
                                                    const audioEl1 = createAudioMessage("0:16", getCurrentTime(), "assets/3.mp3");
                                                    chatMessages.appendChild(audioEl1);
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
                                                                const audioEl2 = createAudioMessage("0:11", getCurrentTime(), "assets/4.mp3");
                                                                chatMessages.appendChild(audioEl2);
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
                                                                            const confirmMessageEl = createTextMessage(confirmMessage, getCurrentTime(), false);
                                                                            chatMessages.appendChild(confirmMessageEl);
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
    
    // Salvar no localStorage
    saveChatData();
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Primeira mensagem de confirmação
    setTimeout(() => {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const finalResponse = "¡Perfecto! Ya estoy trabajando en tu dibujo. Te avisaré cuando esté listo.";
            const finalResponseEl = createTextMessage(finalResponse, getCurrentTime(), false);
            chatMessages.appendChild(finalResponseEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Primeira mensagem sobre momento especial
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    const specialMomentMessage = "¡Estás a punto de vivir un momento especial! Pero ahora, presta mucha atención, querida...";
                    const specialMomentEl = createTextMessage(specialMomentMessage, getCurrentTime(), false);
                    chatMessages.appendChild(specialMomentEl);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Segunda mensagem sobre não cobrar pela consulta
                    setTimeout(() => {
                        showTypingIndicator();
                        
                        setTimeout(() => {
                            hideTypingIndicator();
                            const freeConsultMessage = "No cobro nada por la consulta.";
                            const freeConsultEl = createTextMessage(freeConsultMessage, getCurrentTime(), false);
                            chatMessages.appendChild(freeConsultEl);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                            
                            // Primeiro áudio (5.mp3 em vez de 6.mp3)
                            setTimeout(() => {
                                showTypingIndicator();
                                
                                setTimeout(() => {
                                    hideTypingIndicator();
                                    const audioEl1 = createAudioMessage("0:19", getCurrentTime(), "assets/5.mp3");
                                    chatMessages.appendChild(audioEl1);
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
                                                const priceMessage = "La tarifa es de solo <strong>$27</strong>";
                                                const priceMessageEl = createTextMessage(priceMessage, getCurrentTime(), true);
                                                chatMessages.appendChild(priceMessageEl);
                                                chatMessages.scrollTop = chatMessages.scrollHeight;
                                                
                                                // Segundo áudio (6.mp3 em vez de 7.mp3)
                                                setTimeout(() => {
                                                    showTypingIndicator();
                                                    
                                                    setTimeout(() => {
                                                        hideTypingIndicator();
                                                        const audioEl2 = createAudioMessage("0:23", getCurrentTime(), "assets/6.mp3");
                                                        chatMessages.appendChild(audioEl2);
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
                                                                    const paymentMessageEl = createTextMessage(paymentMessage, getCurrentTime(), false);
                                                                    chatMessages.appendChild(paymentMessageEl);
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
                                                                            imageLink.href = 'https://pay.hotmart.com/K99339842P';
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
                                                                            
                                                                            const messageTimeContainer = document.createElement('div');
                                                                            messageTimeContainer.className = 'message-time-container';
                                                                            
                                                                            const messageTime = document.createElement('span');
                                                                            messageTime.className = 'message-time';
                                                                            messageTime.textContent = getCurrentTime();
                                                                            
                                                                            messageTimeContainer.appendChild(messageTime);
                                                                            
                                                                            imageMessageContent.appendChild(imageMessageText);
                                                                            imageMessageContent.appendChild(messageTimeContainer);
                                                                            imageMessageEl.appendChild(imageMessageContent);
                                                                            
                                                                            // Adicionar a mensagem ao chat
                                                                            chatMessages.appendChild(imageMessageEl);
                                                                            chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                            
                                                                            // Adicionar mensagem de áudio após imagem (7.mp3 em vez de 8.mp3)
                                                                            setTimeout(() => {
                                                                                showTypingIndicator();
                                                                                
                                                                                setTimeout(() => {
                                                                                    hideTypingIndicator();
                                                                                    const audioEl = createAudioMessage("0:24", getCurrentTime(), "assets/7.mp3");
                                                                                    chatMessages.appendChild(audioEl);
                                                                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                                    
                                                                                    // Reproduzir o áudio automaticamente após um pequeno delay
                                                                                    setTimeout(() => {
                                                                                        // Encontrar o botão de play do áudio e simular o clique
                                                                                        const playButton = audioEl.querySelector('.play-button');
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