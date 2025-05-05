// Utility functions for the WhatsApp-style chat interface

// Format a timestamp to a readable format
function formatTime(timestamp) {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  return hours + ':' + minutes + ' ' + ampm;
}

// Check if a URL is valid
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// Get the domain name from a URL
function extractDomain(url) {
  if (!url) return '';
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
  } catch (e) {
    return '';
  }
}

// Format file size in a human-readable way
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to detect media type
function detectMediaType(url) {
  if (!url) return 'unknown';
  
  const extension = url.split('.').pop().toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (audioExtensions.includes(extension)) return 'audio';
  if (documentExtensions.includes(extension)) return 'document';
  
  return 'unknown';
}

// Format a phone number
function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Convert newlines to <br> tags
function nl2br(str) {
  if (!str) return '';
  return str.replace(/\n/g, '<br>');
}

// Simple emoji converter (basic example)
function convertEmojis(text) {
  const emojiMap = {
    ':)': '😊',
    ':(': '😢',
    ':D': '😀',
    ';)': '😉',
    ':P': '😛',
    '<3': '❤️'
  };
  
  Object.keys(emojiMap).forEach(emoji => {
    const regex = new RegExp(emoji.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'), 'g');
    text = text.replace(regex, emojiMap[emoji]);
  });
  
  return text;
}

/**
 * Função para fazer a tela rolar para exibir o campo de input quando o teclado virtual é ativado
 * @param {HTMLElement} inputElement - O elemento de input que receberá foco
 */
function scrollToInputOnFocus(inputElement) {
  if (!inputElement) return;
  
  // Função para rolar para o elemento
  const scrollToElement = () => {
    // Espera um momento para que o teclado virtual seja totalmente exibido
    setTimeout(() => {
      // Calcula a posição do elemento
      const rect = inputElement.getBoundingClientRect();
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      
      // Altura da janela visível (pode ser menor quando o teclado virtual estiver aberto)
      const windowHeight = window.innerHeight;
      
      // Se o elemento não estiver totalmente visível, rolamos para ele
      if (elementBottom > windowHeight || elementTop < 0) {
        // Rolamos para o elemento com um pequeno offset para garantir boa visibilidade
        const scrollTarget = elementTop + window.pageYOffset - (windowHeight / 4);
        window.scrollTo({
          top: scrollTarget,
          behavior: 'smooth'
        });
        
        // Em alguns dispositivos, podemos precisar de uma segunda rolagem após um delay maior
        setTimeout(() => {
          const updatedRect = inputElement.getBoundingClientRect();
          if (updatedRect.bottom > windowHeight) {
            window.scrollTo({
              top: window.pageYOffset + (updatedRect.bottom - windowHeight) + 30,
              behavior: 'smooth'
            });
          }
        }, 500);
      }
    }, 300);
  };
  
  // Adiciona listeners para os eventos focus e click
  inputElement.addEventListener('focus', scrollToElement);
  inputElement.addEventListener('click', scrollToElement);
  
  // Também rolamos quando a página for carregada, se o input já estiver focado
  if (document.activeElement === inputElement) {
    scrollToElement();
  }
}

// Exportamos a função para ser usada em outros arquivos
window.scrollToInputOnFocus = scrollToInputOnFocus;