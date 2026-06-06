function loadSnippets() {
  const s = localStorage.getItem('exploit_snippets');
  return s ? JSON.parse(s) : [];
}

function saveSnippetsList(snippets) {
  localStorage.setItem('exploit_snippets', JSON.stringify(snippets));
}

function saveSnippet(code, language = 'code') {
  const snippets = loadSnippets();
  const snippet = {
    id: Date.now(),
    code,
    language,
    date: new Date().toLocaleDateString()
  };
  snippets.unshift(snippet);
  saveSnippetsList(snippets);
  showSnippetToast();
}

function showSnippetToast() {
  const toast = document.createElement('div');
  toast.textContent = '// SNIPPET SAVED';
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#7c3aed;color:#f5f3ff;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 16px;border-radius:4px;z-index:999;letter-spacing:1px;';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
  playReceive();
}

function deleteSnippet(id) {
  const snippets = loadSnippets().filter(s => s.id !== id);
  saveSnippetsList(snippets);
  renderSnippets();
}

function copySnippet(code) {
  navigator.clipboard.writeText(code);
  const toast = document.createElement('div');
  toast.textContent = '// COPIED TO CLIPBOARD';
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#22c55e;color:#07000f;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 16px;border-radius:4px;z-index:999;letter-spacing:1px;';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function renderSnippets() {
  const container = document.getElementById('snippets-list');
  if (!container) return;
  const snippets = loadSnippets();
  if (snippets.length === 0) {
    container.innerHTML = '<div style="color:#7c3aed;font-size:12px;text-align:center;padding:20px;">// NO SNIPPETS SAVED YET</div>';
    return;
  }
  container.innerHTML = snippets.map(s => `
    <div style="background:#0a0018;border:1px solid #7c3aed44;border-radius:4px;padding:12px;display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:10px;color:#7c3aed;letter-spacing:1px;">${s.language.toUpperCase()} // ${s.date}</span>
        <div style="display:flex;gap:6px;">
          <button onclick="copySnippet(\`${s.code.replace(/`/g,'\\`')}\`)" style="background:#1a0030;color:#4ade80;border:1px solid #4ade8044;font-family:'Share Tech Mono',monospace;font-size:10px;padding:3px 8px;border-radius:3px;cursor:pointer;">COPY</button>
          <button onclick="deleteSnippet(${s.id})" style="background:#1a0030;color:#f87171;border:1px solid #f8717144;font-family:'Share Tech Mono',monospace;font-size:10px;padding:3px 8px;border-radius:3px;cursor:pointer;">DEL</button>
        </div>
      </div>
      <pre style="font-size:11px;color:#c4b5fd;white-space:pre-wrap;word-break:break-word;max-height:100px;overflow-y:auto;">${s.code.substring(0,300)}${s.code.length>300?'...':''}</pre>
    </div>
  `).join('');
}

function openSnippets() {
  document.getElementById('snippets-modal').style.display = 'flex';
  renderSnippets();
}

function closeSnippets() {
  document.getElementById('snippets-modal').style.display = 'none';
}
