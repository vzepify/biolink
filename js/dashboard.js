// ===== DASHBOARD =====

const SOCIAL_LIST = [
  {key:'twitter',icon:'𝕏',label:'Twitter/X'},
  {key:'instagram',icon:'📷',label:'Instagram'},
  {key:'tiktok',icon:'🎵',label:'TikTok'},
  {key:'youtube',icon:'▶️',label:'YouTube'},
  {key:'twitch',icon:'🟣',label:'Twitch'},
  {key:'discord',icon:'💬',label:'Discord'},
  {key:'github',icon:'🐙',label:'GitHub'},
  {key:'linkedin',icon:'💼',label:'LinkedIn'},
  {key:'spotify',icon:'🎧',label:'Spotify'},
  {key:'reddit',icon:'🔴',label:'Reddit'},
];

const BADGE_LIST = [
  {id:'verified',icon:'✅',name:'Verified',color:'#60a5fa',bg:'rgba(59,130,246,0.2)'},
  {id:'developer',icon:'💻',name:'Dev',color:'#a78bfa',bg:'rgba(139,92,246,0.2)'},
  {id:'creator',icon:'🎨',name:'Creator',color:'#f472b6',bg:'rgba(236,72,153,0.2)'},
  {id:'og',icon:'👑',name:'OG',color:'#fbbf24',bg:'rgba(245,158,11,0.2)'},
  {id:'streamer',icon:'📡',name:'Streamer',color:'#a855f7',bg:'rgba(168,85,247,0.2)'},
  {id:'gamer',icon:'🎮',name:'Gamer',color:'#22d3ee',bg:'rgba(6,182,212,0.2)'},
  {id:'artist',icon:'🎭',name:'Artist',color:'#fb923c',bg:'rgba(249,115,22,0.2)'},
  {id:'music',icon:'🎵',name:'Music',color:'#4ade80',bg:'rgba(34,197,94,0.2)'},
];

const THEMES = [
  {id:'dark-purple',bg:'linear-gradient(135deg,#0a0a0f,#1a0a2e)',name:'Purple'},
  {id:'dark-blue',bg:'linear-gradient(135deg,#0a0f1a,#0a1628)',name:'Ocean'},
  {id:'dark-pink',bg:'linear-gradient(135deg,#1a0a14,#2a0a1a)',name:'Rose'},
  {id:'dark-green',bg:'linear-gradient(135deg,#0a1a0a,#0a2a14)',name:'Forest'},
  {id:'midnight',bg:'#000',name:'Midnight'},
  {id:'sunset',bg:'linear-gradient(135deg,#1a0505,#1a0a00)',name:'Sunset'},
  {id:'teal',bg:'linear-gradient(135deg,#001a1a,#00101a)',name:'Teal'},
  {id:'slate',bg:'linear-gradient(135deg,#0f1117,#171923)',name:'Slate'},
  {id:'light',bg:'linear-gradient(135deg,#f8f8ff,#eee8ff)',name:'Light'},
  {id:'warm',bg:'linear-gradient(135deg,#1a1208,#12100a)',name:'Warm'},
];

const BG_EFFECTS = [
  {id:'none',icon:'🚫',label:'None'},
  {id:'aurora',icon:'🌌',label:'Aurora'},
  {id:'grid',icon:'⊞',label:'Grid'},
  {id:'particles',icon:'✨',label:'Particles'},
  {id:'stars',icon:'⭐',label:'Stars'},
  {id:'dots',icon:'·',label:'Dots'},
  {id:'waves',icon:'〜',label:'Waves'},
];

const FONTS = ['DM Sans','Syne','Georgia','Courier New','Trebuchet MS','Impact'];

let linkIdCounter = Date.now();

function showDashboard() {
  const user = getCurrentUser();
  if (!user) { showPage('auth-page'); return; }
  showPage('dashboard-page');
  initDashboard();
  showDashTab('overview');
}

function initDashboard() {
  renderThemeGrid();
  renderBgEffects();
  renderFontOptions();
  renderSocialsGrid();
  renderBadgesGrid();
  loadAllFields();
}

function loadAllFields() {
  const pr = getProfile();
  if (!pr) return;

  // Sidebar
  const sb = document.getElementById('sb-avatar');
  if (pr.avatar) {
    sb.innerHTML = `<img src="${pr.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  } else {
    sb.textContent = (pr.name||'?')[0].toUpperCase();
  }
  document.getElementById('sb-username').textContent = pr.name || pr.username;
  document.getElementById('sb-handle').textContent = '@' + (pr.username || 'user');

  // Profile tab
  const da = document.getElementById('dash-avatar');
  if (pr.avatar) {
    da.innerHTML = `<img src="${pr.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  } else {
    da.textContent = (pr.name||'?')[0].toUpperCase();
  }
  setVal('field-name', pr.name);
  setVal('field-username', pr.username);
  setVal('field-bio', pr.bio);
  setVal('field-location', pr.location);
  setVal('field-pronouns', pr.pronouns);
  setVal('field-website', pr.website);

  // Links
  renderLinksManager();

  // Socials
  SOCIAL_LIST.forEach(s => setVal('social-' + s.key, pr.socials?.[s.key]));

  // Appearance
  setVal('color-accent', pr.colorAccent || '#7c5cfc');
  setVal('color-bg', pr.colorBg || '#0a0a0f');
  setVal('color-text', pr.colorText || '#f0f0f8');
  setVal('color-card', pr.colorCard || '#13131a');
  setChecked('toggle-typewriter', pr.typewriter);
  setVal('typewriter-lines', pr.typewriterLines);
  selectTheme(pr.theme || 'dark-purple');
  selectEffect(pr.bgEffect || 'none');
  selectFont(pr.font || 'DM Sans');

  // Music
  setVal('music-title', pr.music?.title);
  setVal('music-artist', pr.music?.artist);
  setVal('music-url', pr.music?.url);
  document.getElementById('music-title-display').textContent = pr.music?.title || 'Song Title';
  document.getElementById('music-artist-display').textContent = pr.music?.artist || 'Artist Name';

  // Settings
  setChecked('toggle-hide-views', pr.hideViews);
  setChecked('toggle-hide-badges', pr.hideBadges);
  setChecked('toggle-active', pr.active !== false);
  setChecked('toggle-cursor', pr.cursorEffect);
  setVal('seo-title', pr.seoTitle);
  setVal('seo-desc', pr.seoDesc);
  setVal('alias-1', pr.alias1);
  setVal('alias-2', pr.alias2);

  // Badges
  document.querySelectorAll('.badge-item').forEach(b => {
    b.classList.toggle('active', (pr.badges || []).includes(b.dataset.badge));
  });
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}
function setChecked(id, val) {
  const el = document.getElementById(id);
  if (el) el.checked = !!val;
}

function saveAll() {
  const pr = getProfile();
  if (!pr) return;

  pr.name = v('field-name');
  pr.username = v('field-username');
  pr.bio = v('field-bio');
  pr.location = v('field-location');
  pr.pronouns = v('field-pronouns');
  pr.website = v('field-website');

  // Socials
  SOCIAL_LIST.forEach(s => { pr.socials[s.key] = v('social-' + s.key); });

  // Links (read from DOM)
  const linkItems = document.querySelectorAll('.link-item');
  pr.links = [];
  linkItems.forEach(item => {
    const inputs = item.querySelectorAll('input');
    pr.links.push({
      id: item.dataset.id,
      icon: item.querySelector('.link-icon-btn').textContent,
      title: inputs[0].value,
      url: inputs[1].value
    });
  });

  // Appearance
  pr.colorAccent = v('color-accent');
  pr.colorBg = v('color-bg');
  pr.colorText = v('color-text');
  pr.colorCard = v('color-card');
  pr.typewriter = document.getElementById('toggle-typewriter').checked;
  pr.typewriterLines = v('typewriter-lines');

  // Music
  pr.music = { title: v('music-title'), artist: v('music-artist'), url: v('music-url') };

  // Settings
  pr.hideViews = document.getElementById('toggle-hide-views').checked;
  pr.hideBadges = document.getElementById('toggle-hide-badges').checked;
  pr.active = document.getElementById('toggle-active').checked;
  pr.cursorEffect = document.getElementById('toggle-cursor').checked;
  pr.seoTitle = v('seo-title');
  pr.seoDesc = v('seo-desc');
  pr.alias1 = v('alias-1');
  pr.alias2 = v('alias-2');

  saveProfile(pr);
  showToast('Profile saved!', 'success');
  loadAllFields();
}

function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ===== TABS =====
function showDashTab(tab) {
  const tabs = ['overview','profile','links','socials','appearance','analytics','settings'];
  tabs.forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.style.display = t === tab ? '' : 'none';
  });
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.tab === tab);
  });
  if (tab === 'overview') renderOverview();
  if (tab === 'analytics') renderAnalytics();
}

// ===== OVERVIEW =====
function renderOverview() {
  const pr = getProfile();
  if (!pr) return;
  const views = pr.analytics?.views || 0;
  const clicks = pr.analytics?.clicks || 0;
  const linkCount = (pr.links || []).length;
  setText('stat-views', views);
  setText('stat-clicks', clicks);
  setText('stat-ctr', views ? Math.round(clicks / views * 100) + '%' : '0%');
  setText('stat-links', linkCount);

  const hist = (pr.analytics?.history || []).slice(-7);
  const max = Math.max(...hist, 1);
  const chart = document.getElementById('overview-chart');
  if (chart) {
    chart.innerHTML = hist.map(val =>
      `<div style="flex:1;background:linear-gradient(to top,var(--accent),rgba(124,92,252,.25));border-radius:4px 4px 0 0;height:${Math.round(val/max*100)}%;min-height:3px"></div>`
    ).join('');
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ===== ANALYTICS =====
function renderAnalytics() {
  const pr = getProfile();
  if (!pr) return;
  const views = pr.analytics?.views || 0;
  const clicks = pr.analytics?.clicks || 0;
  setText('an-views', views);
  setText('an-unique', Math.round(views * 0.7));
  setText('an-clicks', clicks);
  setText('an-ctr', views ? Math.round(clicks / views * 100) + '%' : '0%');

  const hist = pr.analytics?.history || [];
  const max = Math.max(...hist, 1);
  const cont = document.getElementById('analytics-chart-container');
  if (cont) {
    cont.innerHTML = hist.map((val, i) =>
      `<div style="flex:1;background:linear-gradient(to top,var(--accent),rgba(124,92,252,.2));border-radius:2px 2px 0 0;height:${Math.round(val/max*100)}%;min-height:2px;position:relative">
        ${i % 5 === 0 ? `<span style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:9px;color:var(--muted);white-space:nowrap">${i+1}</span>` : ''}
      </div>`
    ).join('');
  }

  const breakdown = document.getElementById('clicks-breakdown');
  if (breakdown) {
    const links = pr.links || [];
    if (links.length === 0) {
      breakdown.innerHTML = '<p style="color:var(--muted);font-size:14px">No links added yet.</p>';
    } else {
      breakdown.innerHTML = links.map(l => {
        const c = Math.floor(Math.random() * 40 + 2);
        return `<div class="click-row">
          <span style="font-size:18px">${l.icon || '🔗'}</span>
          <span class="click-label">${l.title || 'Untitled'}</span>
          <div class="click-bar-wrap"><div class="click-bar" style="width:${Math.round(c/50*100)}%"></div></div>
          <span class="click-count">${c}</span>
        </div>`;
      }).join('');
    }
  }
}

// ===== LINKS =====
const EMOJIS = ['🌐','📺','🎵','🎮','📸','✉️','💼','📝','🎨','💻','🛒','📱','🎤','🎬','🔗','⭐','❤️','🚀'];

function renderLinksManager() {
  const pr = getProfile();
  const list = document.getElementById('links-list');
  if (!list) return;
  list.innerHTML = '';
  (pr.links || []).forEach(link => {
    const div = document.createElement('div');
    div.className = 'link-item';
    div.dataset.id = link.id;
    div.innerHTML = `
      <span style="color:var(--muted);cursor:grab;font-size:18px;padding:0 4px">⠿</span>
      <button class="link-icon-btn" onclick="cycleEmoji(this)" title="Click to change">${link.icon || '🔗'}</button>
      <div style="flex:1;display:flex;gap:8px">
        <input type="text" placeholder="Link Title" value="${esc(link.title)}" style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:9px 11px;color:var(--text);font-size:13px;font-family:var(--font);outline:none">
        <input type="url" placeholder="https://..." value="${esc(link.url)}" style="flex:2;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:9px 11px;color:var(--text);font-size:13px;font-family:var(--font);outline:none">
      </div>
      <button onclick="deleteLink(this)" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;padding:4px 8px;transition:.2s" onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='var(--muted)'">✕</button>
    `;
    list.appendChild(div);
  });
}

function esc(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function cycleEmoji(btn) {
  const idx = (EMOJIS.indexOf(btn.textContent) + 1) % EMOJIS.length;
  btn.textContent = EMOJIS[idx];
}

function addLink() {
  const pr = getProfile();
  if (!pr.links) pr.links = [];
  pr.links.push({ id: ++linkIdCounter, icon: '🔗', title: '', url: '' });
  saveProfile(pr);
  renderLinksManager();
}

function deleteLink(btn) {
  btn.closest('.link-item').remove();
}

// ===== AVATAR =====
function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Image too large (max 5MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const pr = getProfile();
    pr.avatar = ev.target.result;
    saveProfile(pr);
    loadAllFields();
    showToast('Avatar updated!', 'success');
  };
  reader.readAsDataURL(file);
}

// ===== THEME / APPEARANCE =====
function renderThemeGrid() {
  const grid = document.getElementById('theme-grid');
  if (!grid) return;
  grid.innerHTML = THEMES.map(t => `
    <div>
      <div class="theme-option" data-theme="${t.id}" style="background:${t.bg}" onclick="selectTheme('${t.id}')"></div>
      <div class="theme-label">${t.name}</div>
    </div>
  `).join('');
  const pr = getProfile();
  if (pr) selectTheme(pr.theme || 'dark-purple');
}

function selectTheme(id) {
  const pr = getProfile();
  if (pr) { pr.theme = id; saveProfile(pr); }
  document.querySelectorAll('.theme-option').forEach(o => o.classList.toggle('selected', o.dataset.theme === id));
}

function renderBgEffects() {
  const grid = document.getElementById('bg-effects-grid');
  if (!grid) return;
  grid.innerHTML = BG_EFFECTS.map(e => `
    <div class="effect-option" data-effect="${e.id}" onclick="selectEffect('${e.id}')">
      <span style="font-size:22px;display:block;margin-bottom:4px">${e.icon}</span>${e.label}
    </div>
  `).join('');
  const pr = getProfile();
  if (pr) selectEffect(pr.bgEffect || 'none');
}

function selectEffect(id) {
  const pr = getProfile();
  if (pr) { pr.bgEffect = id; saveProfile(pr); }
  document.querySelectorAll('.effect-option').forEach(o => o.classList.toggle('selected', o.dataset.effect === id));
}

function renderFontOptions() {
  const cont = document.getElementById('font-options');
  if (!cont) return;
  cont.innerHTML = FONTS.map(f => `
    <div class="font-option" data-font="${f}" onclick="selectFont('${f}')" style="font-family:'${f}'">${f}</div>
  `).join('');
  const pr = getProfile();
  if (pr) selectFont(pr.font || 'DM Sans');
}

function selectFont(f) {
  const pr = getProfile();
  if (pr) { pr.font = f; saveProfile(pr); }
  document.querySelectorAll('.font-option').forEach(o => o.classList.toggle('selected', o.dataset.font === f));
}

function updateAccentPreview(val) {
  document.documentElement.style.setProperty('--accent', val);
}

// ===== BADGES =====
function renderBadgesGrid() {
  const grid = document.getElementById('badges-grid');
  if (!grid) return;
  grid.innerHTML = BADGE_LIST.map(b => `
    <div class="badge-item" data-badge="${b.id}" onclick="toggleBadge('${b.id}')">
      <span style="font-size:22px;display:block;margin-bottom:4px">${b.icon}</span>
      <span style="font-size:11px;color:var(--muted)">${b.name}</span>
    </div>
  `).join('');
}

function toggleBadge(id) {
  const pr = getProfile();
  if (!pr.badges) pr.badges = [];
  const idx = pr.badges.indexOf(id);
  if (idx === -1) pr.badges.push(id); else pr.badges.splice(idx, 1);
  saveProfile(pr);
  document.querySelectorAll('.badge-item').forEach(b => {
    b.classList.toggle('active', pr.badges.includes(b.dataset.badge));
  });
}

// ===== SOCIALS GRID =====
function renderSocialsGrid() {
  const grid = document.getElementById('socials-grid');
  if (!grid) return;
  grid.innerHTML = SOCIAL_LIST.map(s => `
    <div style="display:flex;align-items:center;gap:8px;background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:10px 13px">
      <span style="font-size:18px;flex-shrink:0">${s.icon}</span>
      <input type="text" id="social-${s.key}" placeholder="${s.label}" style="flex:1;background:none;border:none;color:var(--text);font-size:13px;font-family:var(--font);outline:none">
    </div>
  `).join('');
}

// ===== HELPERS =====
function copyProfileLink() {
  const pr = getProfile();
  const url = window.location.href.split('?')[0] + '?profile=' + (pr?.username || '');
  navigator.clipboard.writeText(url).then(() => showToast('Profile link copied!', 'success'));
}

function exportData() {
  const pr = getProfile();
  const blob = new Blob([JSON.stringify(pr, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'biolink-profile.json';
  a.click();
  showToast('Data exported!', 'success');
}
