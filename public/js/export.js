function exportChat() {
  if (!chatMessages || chatMessages.length === 0) {
    alert('No chat history to export!');
    return;
  }
  const lines = chatMessages.map(m => {
    const role = m.role === 'assistant' ? '3XPLOIT_AI' : 'OPERATOR';
    return `[${role}]\n${m.content}\n`;
  }).join('\n---\n\n');

  const header = `3XPLOIT_OS // CHAT EXPORT\nDate: ${new Date().toLocaleString()}\n${'='.repeat(40)}\n\n`;
  const full = header + lines;

  const blob = new Blob([full], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `3xploit-chat-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  const toast = document.createElement('div');
  toast.textContent = '// CHAT EXPORTED';
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#7c3aed;color:#f5f3ff;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 16px;border-radius:4px;z-index:999;letter-spacing:1px;';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
