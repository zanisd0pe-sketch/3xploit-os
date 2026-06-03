const canvas=document.getElementById('matrix-canvas');
const ctx=canvas.getContext('2d');
const chars='アイウエオカキクケコ0123456789ABCDEF<>{}[]|/\\;:!=@#$%^&*';
let drops=[];
function initMatrix(){
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  const cols=Math.floor(canvas.width/18);
  drops=Array(cols).fill(0).map(()=>Math.random()*-60);
}
function drawMatrix(){
  ctx.fillStyle='rgba(7,0,15,0.05)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.font='16px "Share Tech Mono",monospace';
  drops.forEach((y,i)=>{
    const char=chars[Math.floor(Math.random()*chars.length)];
    const alpha=Math.random()>0.85?1:0.5;
    ctx.fillStyle=`rgba(168,85,247,${alpha})`;
    ctx.fillText(char,i*18,y*18);
    if(y*18>canvas.height&&Math.random()>0.975)drops[i]=0;
    drops[i]+=0.4;
  });
}
initMatrix();
window.addEventListener('resize',initMatrix);
setInterval(drawMatrix,50);
