function loadMemory() {
  const m = localStorage.getItem('exploit_memory');
  return m ? JSON.parse(m) : {
    name: '',
    projects: [],
    preferences: [],
    facts: [],
    lastSeen: null
  };
}

function saveMemory(mem) {
  mem.lastSeen = new Date().toISOString();
  localStorage.setItem('exploit_memory', JSON.stringify(mem));
}

function getMemoryContext() {
  const mem = loadMemory();
  if (!mem.name && mem.facts.length === 0) return '';
  
  let context = '\n\n[OPERATOR PROFILE]\n';
  if (mem.name) context += `Name: ${mem.name}\n`;
  if (mem.projects.length > 0) context += `Current projects: ${mem.projects.join(', ')}\n`;
  if (mem.preferences.length > 0) context += `Preferences: ${mem.preferences.join(', ')}\n`;
  if (mem.facts.length > 0) context += `Known facts: ${mem.facts.slice(-5).join(', ')}\n`;
  return context;
}

function extractMemory(userMsg, aiMsg) {
  const mem = loadMemory();
  
  // Extract name
  const nameMatch = userMsg.match(/my name is (\w+)/i) || userMsg.match(/i'm (\w+)/i) || userMsg.match(/call me (\w+)/i);
  if (nameMatch) mem.name = nameMatch[1];
  
  // Extract projects
  const projectMatch = userMsg.match(/working on (.+?)(?:\.|,|$)/i) || userMsg.match(/building (.+?)(?:\.|,|$)/i);
  if (projectMatch && !mem.projects.includes(projectMatch[1])) {
    mem.projects.push(projectMatch[1]);
    if (mem.projects.length > 5) mem.projects.shift();
  }

  // Extract preferences  
  const prefMatch = userMsg.match(/i (?:prefer|like|use|love) (.+?)(?:\.|,|$)/i);
  if (prefMatch && !mem.preferences.includes(prefMatch[1])) {
    mem.preferences.push(prefMatch[1]);
    if (mem.preferences.length > 10) mem.preferences.shift();
  }

  saveMemory(mem);
}

function openMemory() {
  const mem = loadMemory();
  document.getElementById('memory-modal').style.display = 'flex';
  document.getElementById('mem-name').value = mem.name || '';
  document.getElementById('mem-projects').value = mem.projects.join(', ');
  document.getElementById('mem-prefs').value = mem.preferences.join(', ');
  document.getElementById('mem-facts').value = mem.facts.join('\n');
}

function closeMemory() {
  document.getElementById('memory-modal').style.display = 'none';
}

function saveMemoryForm() {
  const mem = loadMemory();
  mem.name = document.getElementById('mem-name').value.trim();
  mem.projects = document.getElementById('mem-projects').value.split(',').map(s=>s.trim()).filter(Boolean);
  mem.preferences = document.getElementById('mem-prefs').value.split(',').map(s=>s.trim()).filter(Boolean);
  mem.facts = document.getElementById('mem-facts').value.split('\n').map(s=>s.trim()).filter(Boolean);
  saveMemory(mem);
  closeMemory();
  const toast = document.createElement('div');
  toast.textContent = '// MEMORY SAVED';
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#22c55e;color:#07000f;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 16px;border-radius:4px;z-index:999;letter-spacing:1px;';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function clearMemory() {
  if (confirm('Clear all AI memory?')) {
    localStorage.removeItem('exploit_memory');
    closeMemory();
  }
}
