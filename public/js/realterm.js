async function runRealCommand(cmd) {
  try {
    const res = await authFetch('/api/terminal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd })
    });
    const data = await res.json();
    return data.output || '(no output)';
  } catch (e) {
    return 'ERROR: ' + e.message;
  }
}
