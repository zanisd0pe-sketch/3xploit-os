async function githubPush(filename, content, repo, token) {
  try {
    // Get SHA if file exists
    let sha = '';
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
      headers: { 'Authorization': `token ${token}` }
    });
    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }

    // Push file
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `3XPLOIT_OS: update ${filename}`,
        content: btoa(unescape(encodeURIComponent(content))),
        sha: sha || undefined
      })
    });

    if (res.ok) return { success: true };
    const err = await res.json();
    return { success: false, error: err.message };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function openGithub() {
  document.getElementById('github-modal').style.display = 'flex';
}

function closeGithub() {
  document.getElementById('github-modal').style.display = 'none';
}

async function pushToGithub() {
  const token = document.getElementById('gh-token').value.trim();
  const repo = document.getElementById('gh-repo').value.trim();
  const filename = document.getElementById('gh-filename').value.trim();
  const content = document.getElementById('gh-content').value.trim();
  const status = document.getElementById('gh-status');

  if (!token || !repo || !filename || !content) {
    status.textContent = 'ERROR: fill all fields';
    status.style.color = '#f87171';
    return;
  }

  status.textContent = 'Pushing to GitHub...';
  status.style.color = '#a855f7';

  const result = await githubPush(filename, content, repo, token);

  if (result.success) {
    status.textContent = `// PUSHED TO ${repo}/${filename}`;
    status.style.color = '#4ade80';
    playReceive();
  } else {
    status.textContent = 'ERROR: ' + result.error;
    status.style.color = '#f87171';
  }
}

function loadGithubFromPreview() {
  const code = document.getElementById('preview-code')?.value || '';
  document.getElementById('gh-content').value = code;
  document.getElementById('gh-filename').value = 'index.html';
}

function loadGithubFromChat() {
  const pres = document.querySelectorAll('.bubble.ai pre');
  if (pres.length > 0) {
    document.getElementById('gh-content').value = pres[pres.length-1].textContent;
  }
}
