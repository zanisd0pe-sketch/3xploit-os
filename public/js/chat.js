const chatMessages=[];
function renderInitialMessage(){
  typeMessage('ai','Greetings, operator. I am 3XPLOIT_AI — your coding assistant.\n\nI can help with code, debugging, architecture, and building apps.\n\nType your command to begin.\n\nTip: Ask me for terminal commands and I will make them copyable!');
}
async function sendMessage(){
  const input=document.getElementById('user-input');
  const text=input.value.trim();
  if(!text)return;
  input.value='';
  input.style.height='auto';
  addBubble('user',text);
  chatMessages.push({role:'user',content:text});
  const sendBtn=document.getElementById('send-btn');
  sendBtn.disabled=true;
  const typingId=addTypingBubble();
  try{
    const res=await authFetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:chatMessages})});
    const data=await res.json();
    if(!res.ok)throw new Error(data.error||'Unknown error');
    chatMessages.push({role:'assistant',content:data.reply});
    removeTyping(typingId);
    typeMessage('ai',data.reply);
    playReceive();
  }catch(err){
    removeTyping(typingId);
    addBubble('ai','ERROR: '+err.message);
  }
  sendBtn.disabled=false;
  input.focus();
}

function renderMarkdown(text){
  let e=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Code blocks with copy button
  e=e.replace(/```(\w*)\n?([\s\S]*?)```/g,(match,lang,code)=>{
    const escaped=code.trim();
    const isCmd=lang==='bash'||lang==='sh'||lang==='shell'||lang==='';
    const btnColor=isCmd?'#4ade80':'#a855f7';
    const btnText=isCmd?'COPY CMD':'COPY';
    return `<div style="position:relative;margin:8px 0;">
      <div style="display:flex;justify-content:space-between;align-items:center;background:#0a0018;border:1px solid #7c3aed44;border-bottom:none;padding:4px 10px;border-radius:4px 4px 0 0;">
        <span style="font-size:10px;color:#7c3aed;letter-spacing:1px;">${lang||'code'}</span>
        <div style="display:flex;gap:6px;">
          ${isCmd?`<button onclick="runInTerminal(\`${escaped.replace(/`/g,'\\`')}\`)" style="background:#1a0030;color:#4ade80;border:1px solid #4ade8044;font-family:'Share Tech Mono',monospace;font-size:10px;padding:3px 8px;border-radius:3px;cursor:pointer;">RUN</button>`:''}
          <button onclick="copyCode(\`${escaped.replace(/`/g,'\\`')}\`)" style="background:#1a0030;color:${btnColor};border:1px solid ${btnColor}44;font-family:'Share Tech Mono',monospace;font-size:10px;padding:3px 8px;border-radius:3px;cursor:pointer;">${btnText}</button>
          ${lang==='html'?`<button onclick="previewHTML(\`${escaped.replace(/`/g,'\\`')}\`)" style="background:#1a0030;color:#818cf8;border:1px solid #818cf844;font-family:'Share Tech Mono',monospace;font-size:10px;padding:3px 8px;border-radius:3px;cursor:pointer;">PREVIEW</button>`:''}
        </div>
      </div>
      <pre style="background:#0a0018;border:1px solid #7c3aed44;border-top:none;border-radius:0 0 4px 4px;padding:10px;font-size:12px;color:#c4b5fd;white-space:pre-wrap;word-break:break-word;margin:0;">${escaped}</pre>
    </div>`;
  });
  e=e.replace(/`([^`]+)`/g,'<code style="background:#0f001f;padding:1px 5px;border-radius:3px;font-size:12px;color:#c084fc;">$1</code>');
  e=e.replace(/\n/g,'<br>');
  return e;
}

function copyCode(code){
  navigator.clipboard.writeText(code);
  const toast=document.createElement('div');
  toast.textContent='// COPIED TO CLIPBOARD';
  toast.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#22c55e;color:#07000f;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 16px;border-radius:4px;z-index:999;letter-spacing:1px;';
  document.body.appendChild(toast);
  setTimeout(()=>toast.remove(),2000);
  playReceive();
}

function runInTerminal(cmd){
  // Switch to terminal tab and pre-fill command
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab')[1].classList.add('active');
  document.getElementById('terminal-panel').classList.add('active');
  const termInput=document.getElementById('term-input');
  termInput.value=cmd;
  termInput.focus();
  playTabSwitch();
  const toast=document.createElement('div');
  toast.textContent='// COMMAND LOADED — press ENTER to run';
  toast.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#7c3aed;color:#f5f3ff;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 16px;border-radius:4px;z-index:999;letter-spacing:1px;';
  document.body.appendChild(toast);
  setTimeout(()=>toast.remove(),3000);
}

function previewHTML(code){
  document.getElementById('preview-code').value=code;
  if(!previewOpen)togglePreview();
  updatePreview();
  // Switch to dev tab
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab')[2].classList.add('active');
  document.getElementById('dev-panel').classList.add('active');
}

function typeMessage(role,text){
  const container=document.getElementById('messages');
  const div=document.createElement('div');
  div.className=`bubble ${role}`;
  const sender=document.createElement('div');
  sender.className='sender';
  const s=typeof loadSettings==='function'?loadSettings():{aiName:'3XPLOIT_AI'};
  sender.textContent=role==='ai'?`// ${s.aiName}`:'// OPERATOR';
  div.appendChild(sender);
  const content=document.createElement('div');
  div.appendChild(content);
  container.appendChild(div);
  container.scrollTop=container.scrollHeight;
  if(role!=='ai'){content.innerHTML=renderMarkdown(text);return;}
  let i=0;
  const speed=6;
  function type(){
    if(i<text.length){
      content.innerHTML=renderMarkdown(text.slice(0,i+1));
      i++;
      container.scrollTop=container.scrollHeight;
      setTimeout(type,speed);
    }
  }
  type();
}

function addBubble(role,text){
  const container=document.getElementById('messages');
  const div=document.createElement('div');
  div.className=`bubble ${role}`;
  const sender=document.createElement('div');
  sender.className='sender';
  sender.textContent=role==='ai'?'// 3XPLOIT_AI':'// OPERATOR';
  div.appendChild(sender);
  const content=document.createElement('div');
  content.innerHTML=renderMarkdown(text);
  div.appendChild(content);
  container.appendChild(div);
  container.scrollTop=container.scrollHeight;
}

function addTypingBubble(){
  const container=document.getElementById('messages');
  const div=document.createElement('div');
  const id='typing-'+Date.now();
  div.id=id;
  div.className='bubble ai';
  div.innerHTML='<div class="sender">// 3XPLOIT_AI</div><span class="typing-dots"><span>█</span><span>█</span><span>█</span></span>';
  container.appendChild(div);
  container.scrollTop=container.scrollHeight;
  return id;
}

function removeTyping(id){
  const el=document.getElementById(id);
  if(el)el.remove();
}
