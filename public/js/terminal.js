const termHistory=[];
let histIdx=-1;
const termCommands={
  help:()=>`Available commands:\n  help     show this list\n  clear    clear terminal\n  version  system version\n  whoami   current operator\n  ls       list files\n  status   AI system status\n  run      run a file\n  echo     print message\n  ai       ask AI directly`,
  clear:()=>{document.getElementById('term-output').innerHTML='';return null;},
  version:()=>'3XPLOIT_OS v2.4.1  kernel: 7.7.7-purple',
  whoami:()=>'operator@neural — clearance: ALPHA',
  ls:()=>'drwx  projects/\ndrwx  modules/\n-rw-  server.js\n-rw-  package.json\n-rw-  .env\n-rw-  public/',
  status:()=>'AI CORE    ████████████ ONLINE\nMEMORY     ████████░░░░ 68%\nNETWORK    ████████████ STABLE',
  echo:(args)=>args.join(' '),
  run:(args)=>`Executing ${args[0]||'undefined'}...\n[OK] PID ${Math.floor(Math.random()*9000+1000)}`,
  ai:async(args)=>{
    if(!args.length)return'Usage: ai [question]';
    try{
      const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:args.join(' ')}]})});
      const data=await res.json();
      return data.reply||'No response.';
    }catch{return'ERROR: AI core unreachable.';}
  }
};
function printTermLine(text,cls=''){
  const out=document.getElementById('term-output');
  const span=document.createElement('span');
  span.className=cls;
  span.textContent=text;
  span.style.display='block';
  out.appendChild(span);
  out.scrollTop=out.scrollHeight;
}
function initTerminal(){
  printTermLine("3XPLOIT_OS Terminal v2.4 — type 'help' for commands",'term-out');
  printTermLine('─'.repeat(48));
}
async function handleTermInput(e){
  const input=document.getElementById('term-input');
  if(e.key==='ArrowUp'){if(histIdx<termHistory.length-1)histIdx++;input.value=termHistory[termHistory.length-1-histIdx]||'';e.preventDefault();return;}
  if(e.key==='ArrowDown'){if(histIdx>0)histIdx--;else{histIdx=-1;input.value='';}input.value=termHistory[termHistory.length-1-histIdx]||'';e.preventDefault();return;}
  if(e.key!=='Enter')return;
  const cmd=input.value.trim();
  input.value='';histIdx=-1;
  if(!cmd)return;
  termHistory.push(cmd);
  printTermLine(`root@neural:~$ ${cmd}`,'term-cmd');
  const parts=cmd.split(' ');
  const base=parts[0].toLowerCase();
  const args=parts.slice(1);
  if(termCommands[base]){
    const result=termCommands[base](args);
    if(result&&typeof result.then==='function'){const out=await result;if(out)printTermLine(out,'term-out');}
    else if(result!==null&&result!==undefined)printTermLine(result,'term-out');
  }else{printTermLine(`command not found: ${base} — type 'help'`,'term-err');}
}
