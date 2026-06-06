let previewOpen = false;

function togglePreview() {
  const panel = document.getElementById('preview-panel');
  const btn = document.getElementById('preview-toggle-btn');
  previewOpen = !previewOpen;
  panel.style.display = previewOpen ? 'flex' : 'none';
  btn.textContent = previewOpen ? '[ HIDE PREVIEW ]' : '[ LIVE PREVIEW ]';
}

function updatePreview() {
  const code = document.getElementById('preview-code').value;
  const iframe = document.getElementById('preview-frame');
  const blob = new Blob([code], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  iframe.src = url;
}

function copyPreviewCode() {
  const code = document.getElementById('preview-code').value;
  navigator.clipboard.writeText(code);
  const toast = document.createElement('div');
  toast.textContent = '// CODE COPIED';
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#22c55e;color:#07000f;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 16px;border-radius:4px;z-index:999;letter-spacing:1px;';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
