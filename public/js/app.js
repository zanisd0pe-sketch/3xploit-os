const token = localStorage.getItem('neural_token');
if (!token) window.location.href = '/login.html';

async function authFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'x-auth-token': token
    }
  });
  if (res.status === 401) {
    localStorage.removeItem('neural_token');
    window.location.href = '/login.html';
  }
  return res;
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    playTabSwitch();
    const target = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${target}-panel`).classList.add('active');
    if (target === 'terminal') document.getElementById('term-input').focus();
  });
});

document.getElementById('user-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); playSend(); sendMessage(); }
});
document.getElementById('user-input').addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});
document.getElementById('send-btn').addEventListener('click', () => { playSend(); sendMessage(); });
document.getElementById('term-input').addEventListener('keydown', handleTermInput);

// AI bubble toggle
function toggleAiBubble() {
  const bubble = document.getElementById('ai-bubble');
  const isOpen = bubble.style.display === 'flex';
  bubble.style.display = isOpen ? 'none' : 'flex';
  playGlitch();
}

async function sendBubbleMessage() {
  const input = document.getElementById('ai-bubble-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  const msgs = document.getElementById('ai-bubble-messages');
  const userDiv = document.createElement('div');
  userDiv.style.cssText = 'text-align:right;color:#e9d5ff;font-size:12px;margin:4px 0;';
  userDiv.textContent = text;
  msgs.appendChild(userDiv);
  msgs.scrollTop = msgs.scrollHeight;
  playSend();
  try {
    const res = await authFetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: text }] })
    });
    const data = await res.json();
    const aiDiv = document.createElement('div');
    aiDiv.style.cssText = 'text-align:left;color:#a855f7;font-size:12px;margin:4px 0;';
    aiDiv.textContent = data.reply || 'No response.';
    msgs.appendChild(aiDiv);
    msgs.scrollTop = msgs.scrollHeight;
    playReceive();
  } catch(e) {}
}

document.getElementById('ai-bubble-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendBubbleMessage();
});

renderInitialMessage();
initTerminal();
