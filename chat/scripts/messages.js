// Message data configuration
const messageData = [
  {
    type: 'text',
    content: '⌛️Tu prueba está comenzando...',
    delay: 0,
    skipTyping: true // Esta mensagem deve aparecer sem o efeito de digitando
  },
  {
    type: 'text',
    content: '¡Hola, mi amado! Me alegra mucho y agradezco que hayas decidido seguir tu corazón y encontrarme aquí hoy. 🙏🔮',
    delay: 2000
  },
  {
    type: 'text',
    content: 'Me llamo Serena y me hice famosa en 2023 por <strong>unir almas</strong> gemelas a través de mis dibujos. En solo <strong>2 minutos</strong>, visualizaré y dibujaré el rostro de tu alma gemela...',
    delay: 4000,
    isHTML: true
  },
  {
    type: 'text',
    content: '<strong>¿Puedo empezar a dibujar?</strong> Debo advertirte que esto puede hacerte llorar o conmoverte, pero creo que querrás ver... 💕✨',
    delay: 5000,
    isHTML: true
  }
];

// Current time formatter
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  return hours + ':' + minutes + ' ' + ampm;
}

// Function to create a text message element
function createTextMessage(content, customTime, isHTML) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message received';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageText = document.createElement('div');
  messageText.className = 'message-text';
  
  // Se a mensagem contém HTML, use innerHTML em vez de textContent
  if (isHTML) {
    messageText.innerHTML = content;
  } else {
    messageText.textContent = content;
  }
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = customTime || getCurrentTime();
  
  // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageText);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  return messageEl;
}

// Function to create an image message element
function createImageMessage(imageUrl, caption, customTime) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message received';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const imageContainer = document.createElement('div');
  imageContainer.className = 'message-image-container';
  
  const image = document.createElement('img');
  image.className = 'message-image';
  image.src = imageUrl;
  image.alt = 'Shared image';
  image.loading = 'lazy';
  
  imageContainer.appendChild(image);
  messageContent.appendChild(imageContainer);
  
  if (caption) {
    const captionText = document.createElement('div');
    captionText.className = 'message-text';
    captionText.textContent = caption;
    messageContent.appendChild(captionText);
  }
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = customTime || getCurrentTime();
  
  // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  return messageEl;
}

// Function to create an audio message element
function createAudioMessage(duration, customTime, audioSrc = null) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message received';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const audioPlayer = document.createElement('div');
  audioPlayer.className = 'audio-player';
  
  const playButton = document.createElement('div');
  playButton.className = 'play-button';
  playButton.innerHTML = '<i class="fas fa-play"></i>';
  
  // Se foi fornecido um caminho de áudio, adicionar ao player
  if (audioSrc) {
    playButton.dataset.audioSrc = audioSrc;
  }
  
  const audioTrack = document.createElement('div');
  audioTrack.className = 'audio-track';
  
  const audioProgress = document.createElement('div');
  audioProgress.className = 'audio-progress';
  
  const audioProgressFilled = document.createElement('div');
  audioProgressFilled.className = 'audio-progress-filled';
  
  const audioDuration = document.createElement('div');
  audioDuration.className = 'audio-duration';
  audioDuration.textContent = duration;
  
  audioProgress.appendChild(audioProgressFilled);
  audioTrack.appendChild(audioProgress);
  audioTrack.appendChild(audioDuration);
  
  audioPlayer.appendChild(playButton);
  audioPlayer.appendChild(audioTrack);
  
  messageContent.appendChild(audioPlayer);
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = customTime || getCurrentTime();
  
  // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Add click event to play button
  playButton.addEventListener('click', function() {
    const isPlaying = playButton.classList.contains('playing');
    
    if (isPlaying) {
      playButton.classList.remove('playing');
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      audioProgressFilled.style.width = '0%';
      
      // Se tiver um elemento de áudio real, pausá-lo
      if (playButton.dataset.audioElement) {
        const audioElement = document.getElementById(playButton.dataset.audioElement);
        if (audioElement) {
          audioElement.pause();
        }
      }
    } else {
      playButton.classList.add('playing');
      playButton.innerHTML = '<i class="fas fa-pause"></i>';
      
      // Se tiver um arquivo de áudio especificado, reproduzi-lo
      if (audioSrc) {
        // Verificar se já existe um elemento de áudio para este botão
        let audioElement;
        if (playButton.dataset.audioElement) {
          audioElement = document.getElementById(playButton.dataset.audioElement);
        } else {
          // Criar um elemento de áudio oculto
          audioElement = document.createElement('audio');
          const audioId = 'audio-' + Date.now();
          audioElement.id = audioId;
          audioElement.src = audioSrc;
          audioElement.style.display = 'none';
          document.body.appendChild(audioElement);
          
          // Salvar a referência ao elemento de áudio
          playButton.dataset.audioElement = audioId;
          
          // Configurar evento de atualização do progresso
          audioElement.addEventListener('timeupdate', function() {
            const percent = (audioElement.currentTime / audioElement.duration) * 100;
            audioProgressFilled.style.width = `${percent}%`;
          });
          
          // Configurar evento de fim da reprodução
          audioElement.addEventListener('ended', function() {
            playButton.classList.remove('playing');
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            audioProgressFilled.style.width = '0%';
          });
        }
        
        // Reproduzir o áudio
        audioElement.currentTime = 0;
        audioElement.play();
      } else {
        // Comportamento anterior para simulação quando não há arquivo real
        let progress = 0;
        const interval = setInterval(() => {
          progress += 1;
          audioProgressFilled.style.width = `${progress}%`;
          
          if (progress >= 100) {
            clearInterval(interval);
            playButton.classList.remove('playing');
            playButton.innerHTML = '<i class="fas fa-play"></i>';
          }
        }, 300);
      }
    }
  });
  
  return messageEl;
}

// Function to create a link button message
function createLinkMessage(content, url, preview, customTime) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message received';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  if (preview) {
    const linkPreview = document.createElement('div');
    linkPreview.className = 'link-preview';
    linkPreview.textContent = preview;
    messageContent.appendChild(linkPreview);
  }
  
  const linkText = document.createElement('div');
  linkText.className = 'message-text';
  linkText.textContent = content;
  messageContent.appendChild(linkText);
  
  const linkButton = document.createElement('a');
  linkButton.className = 'link-button';
  linkButton.href = url;
  linkButton.target = '_blank';
  linkButton.textContent = 'Open Link';
  messageContent.appendChild(linkButton);
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = customTime || getCurrentTime();
  
  // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  return messageEl;
}

// Function to create a typing indicator
function createTypingIndicator() {
  const typingEl = document.createElement('div');
  typingEl.className = 'typing-indicator';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    typingEl.appendChild(dot);
  }
  
  return typingEl;
}