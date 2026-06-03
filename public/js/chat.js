const chatMessages=[];
function renderInitialMessage(){
  addBubble('ai','Greetings, operator. I am 3XPLOIT_AI — your coding assistant.\n\nI can help with code, debugging, architecture, and building apps.\n\nType your command to begin.');
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
    addBubble('ai',data.reply);
  }catch(err){
    removeTyping(typingId);
    addBubble('ai','ERROR: '+err.message);
  }
  sendBtn.disabled=false;
  input.focus();
}
function renderMarkdown(text){
  let e=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  e=e.replace(/```(\w*)\n?([\s\S]*?)```/g,(_,l,c)=>`<pre>${c.trim()}</pre>`);
  e=e.replace(/`([^`]+)`/g,'<code>$1</code>');
  e=e.replace(/\n/g,'<br>');
  return e;
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
