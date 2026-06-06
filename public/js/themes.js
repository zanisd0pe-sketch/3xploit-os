const hackerThemes = {
  purple: {
    name: 'PURPLE GHOST',
    main: '#a855f7', secondary: '#7c3aed', dark: '#6d28d9',
    bg: '#07000f', bg2: '#0f0020', bg3: '#1a0030',
    text: '#e9d5ff', green: '#4ade80', red: '#f87171',
    font: "'Share Tech Mono', monospace"
  },
  matrix: {
    name: 'MATRIX GREEN',
    main: '#22c55e', secondary: '#16a34a', dark: '#15803d',
    bg: '#000800', bg2: '#001200', bg3: '#002200',
    text: '#bbf7d0', green: '#4ade80', red: '#f87171',
    font: "'Share Tech Mono', monospace"
  },
  redteam: {
    name: 'RED TEAM',
    main: '#ef4444', secondary: '#dc2626', dark: '#b91c1c',
    bg: '#0f0000', bg2: '#1a0000', bg3: '#2a0000',
    text: '#fecaca', green: '#4ade80', red: '#f87171',
    font: "'Share Tech Mono', monospace"
  },
  icehack: {
    name: 'ICE HACK',
    main: '#06b6d4', secondary: '#0891b2', dark: '#0e7490',
    bg: '#00080f', bg2: '#00101a', bg3: '#001a2a',
    text: '#cffafe', green: '#4ade80', red: '#f87171',
    font: "'Share Tech Mono', monospace"
  },
  goldroot: {
    name: 'GOLD ROOT',
    main: '#f59e0b', secondary: '#d97706', dark: '#b45309',
    bg: '#0f0800', bg2: '#1a1000', bg3: '#2a1800',
    text: '#fef3c7', green: '#4ade80', red: '#f87171',
    font: "'Share Tech Mono', monospace"
  },
  phantom: {
    name: 'PHANTOM WHITE',
    main: '#e2e8f0', secondary: '#94a3b8', dark: '#64748b',
    bg: '#080810', bg2: '#0f0f1a', bg3: '#1a1a2a',
    text: '#f8fafc', green: '#4ade80', red: '#f87171',
    font: "'Share Tech Mono', monospace"
  }
};

function applyHackerTheme(themeName) {
  const t = hackerThemes[themeName] || hackerThemes.purple;
  const r = document.documentElement.style;
  r.setProperty('--purple', t.main);
  r.setProperty('--purple2', t.secondary);
  r.setProperty('--purple3', t.dark);
  r.setProperty('--bg', t.bg);
  r.setProperty('--bg2', t.bg2);
  r.setProperty('--bg3', t.bg3);
  r.setProperty('--light', t.text);
  r.setProperty('--green', t.green);
  r.setProperty('--red', t.red);
  document.body.style.background = t.bg;
}

function getThemeNames() {
  return Object.entries(hackerThemes).map(([key, val]) => ({key, name: val.name}));
}
