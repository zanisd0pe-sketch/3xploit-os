let recognition = null;
let isListening = false;

function initVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.log('Voice not supported');
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    const input = document.getElementById('user-input');
    input.value = transcript;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    stopListening();
    sendMessage();
  };

  recognition.onerror = () => stopListening();
  recognition.onend = () => stopListening();
}

function toggleVoice() {
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  if (!recognition) initVoice();
  if (!recognition) return;
  try {
    recognition.start();
    isListening = true;
    const btn = document.getElementById('voice-btn');
    if (btn) {
      btn.style.background = '#ef4444';
      btn.style.boxShadow = '0 0 12px #ef4444';
      btn.textContent = '⏹';
    }
    playGlitch();
  } catch(e) {}
}

function stopListening() {
  if (recognition) try { recognition.stop(); } catch(e) {}
  isListening = false;
  const btn = document.getElementById('voice-btn');
  if (btn) {
    btn.style.background = '#7c3aed';
    btn.style.boxShadow = 'none';
    btn.textContent = '🎤';
  }
}

window.addEventListener('DOMContentLoaded', initVoice);
