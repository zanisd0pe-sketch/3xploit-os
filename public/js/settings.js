const defaultSettings = {
  matrixOn: true,
  theme: 'purple',
  aiName: '3XPLOIT_AI',
  password: '1408'
};

function loadSettings() {
  const s = localStorage.getItem('exploit_settings');
  return s ? {...defaultSettings, ...JSON.parse(s)} : {...defaultSettings};
}

function saveSettings(s) {
  localStorage.setItem('exploit_settings', JSON.stringify(s));
}

function applyTheme(theme) {
  applyHackerTheme(theme);
}

function toggleMatrix(on) {
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) canvas.style.opacity = on ? '0.35' : '0';
}

function openSettings() {
  const s = loadSettings();
  document.getElementById('settings-modal').style.display = 'flex';
  document.getElementById('setting-matrix').checked = s.matrixOn;
  document.getElementById('setting-ainame').value = s.aiName;
  document.getElementById('setting-theme').value = s.theme;
}

function closeSettings() {
  document.getElementById('settings-modal').style.display = 'none';
}

function saveSettingsForm() {
  const s = loadSettings();
  const newPwd = document.getElementById('setting-password').value.trim();
  const confirmPwd = document.getElementById('setting-password-confirm').value.trim();

  if (newPwd) {
    if (newPwd !== confirmPwd) {
      alert('Passwords do not match!');
      return;
    }
    fetch('/api/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('neural_token') },
      body: JSON.stringify({ password: newPwd })
    });
    localStorage.setItem('neural_token', btoa(newPwd));
    s.password = newPwd;
  }

  s.matrixOn = document.getElementById('setting-matrix').checked;
  s.aiName = document.getElementById('setting-ainame').value.trim() || '3XPLOIT_AI';
  s.theme = document.getElementById('setting-theme').value;

  saveSettings(s);
  applyTheme(s.theme);
  toggleMatrix(s.matrixOn);
  closeSettings();

  const toast = document.createElement('div');
  toast.textContent = '// SETTINGS SAVED';
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#7c3aed;color:#f5f3ff;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 16px;border-radius:4px;z-index:999;letter-spacing:1px;';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function clearChat() {
  if (confirm('Clear all chat history?')) {
    document.getElementById('messages').innerHTML = '';
    chatMessages.length = 0;
    renderInitialMessage();
    closeSettings();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const s = loadSettings();
  applyTheme(s.theme);
  toggleMatrix(s.matrixOn);

  // Greet by name if remembered
  const mem = loadMemory();
  if (mem.name) {
    setTimeout(() => {
      const toast = document.createElement('div');
      toast.textContent = `// WELCOME BACK, ${mem.name.toUpperCase()}`;
      toast.style.cssText = 'position:fixed;top:70px;left:50%;transform:translateX(-50%);background:#7c3aed;color:#f5f3ff;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 16px;border-radius:4px;z-index:999;letter-spacing:1px;';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }, 1000);
  }
});
