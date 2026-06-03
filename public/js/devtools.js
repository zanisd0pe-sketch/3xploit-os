async function generateApp(){
  const desc=document.getElementById('app-desc').value.trim();
  if(!desc)return;
  const btn=document.querySelector('#dev-tools .dev-card:first-child .dev-btn');
  const output=document.getElementById('app-output');
  btn.disabled=true;btn.textContent='GENERATING...';
  output.textContent='';output.classList.remove('visible');
  try{
    const res=await authFetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:`Generate a complete code scaffold for: ${desc}\n\nProvide file structure and key code. Be concise but complete.`}]})});
    const data=await res.json();
    output.textContent=data.reply||'No response.';
    output.classList.add('visible');
  }catch(err){output.textContent='ERROR: '+err.message;output.classList.add('visible');}
  btn.disabled=false;btn.textContent='GENERATE';
}
async function explainCode(){
  const code=document.getElementById('code-input').value.trim();
  if(!code)return;
  const btn=document.querySelector('#dev-tools .dev-card:last-child .dev-btn');
  const output=document.getElementById('code-output');
  btn.disabled=true;btn.textContent='ANALYZING...';
  output.textContent='';output.classList.remove('visible');
  try{
    const res=await authFetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:`Explain this code clearly and concisely:\n\`\`\`\n${code}\n\`\`\``}]})});
    const data=await res.json();
    output.textContent=data.reply||'No response.';
    output.classList.add('visible');
  }catch(err){output.textContent='ERROR: '+err.message;output.classList.add('visible');}
  btn.disabled=false;btn.textContent='EXPLAIN';
}
