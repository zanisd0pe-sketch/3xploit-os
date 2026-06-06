async function reviewCode() {
  const code = document.getElementById('review-input').value.trim();
  if (!code) return;

  const btn = document.getElementById('review-btn');
  const output = document.getElementById('review-output');
  btn.disabled = true;
  btn.textContent = 'ANALYZING...';
  output.textContent = '';
  output.classList.remove('visible');

  try {
    const res = await authFetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `You are an expert code reviewer. Review this code thoroughly and provide:

1. SECURITY ISSUES - any vulnerabilities or risks
2. BUGS - logical errors or potential crashes  
3. PERFORMANCE - inefficiencies or optimizations
4. BEST PRACTICES - style and pattern improvements
5. OVERALL SCORE - rate it /10

Be specific and actionable. Use a hacker/security mindset.

Code to review:
\`\`\`
${code}
\`\`\``
        }]
      })
    });
    const data = await res.json();
    output.textContent = data.reply || 'No response.';
    output.classList.add('visible');
  } catch (err) {
    output.textContent = 'ERROR: ' + err.message;
    output.classList.add('visible');
  }

  btn.disabled = false;
  btn.textContent = 'REVIEW ▶';
}

async function optimizeCode() {
  const code = document.getElementById('review-input').value.trim();
  if (!code) return;

  const btn = document.getElementById('optimize-btn');
  const output = document.getElementById('review-output');
  btn.disabled = true;
  btn.textContent = 'OPTIMIZING...';
  output.textContent = '';
  output.classList.remove('visible');

  try {
    const res = await authFetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Optimize and improve this code. Fix any bugs, improve performance, follow best practices. Return the improved code with a brief explanation of changes:\n\n\`\`\`\n${code}\n\`\`\``
        }]
      })
    });
    const data = await res.json();
    output.textContent = data.reply || 'No response.';
    output.classList.add('visible');
  } catch (err) {
    output.textContent = 'ERROR: ' + err.message;
    output.classList.add('visible');
  }

  btn.disabled = false;
  btn.textContent = 'OPTIMIZE ▶';
}
