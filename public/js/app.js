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
    const target = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${target}-panel`).classList.add('active');
    if (target === 'terminal') document.getElementById('term-input').focus();
  });
});

document.getElementById('user-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
document.getElementById('user-input').addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('term-input').addEventListener('keydown', handleTermInput);

renderInitialMessage();
initTerminal();
