// ===== PUBLIC PROFILE =====

const THEME_BG_MAP = {
  'dark-purple': 'linear-gradient(135deg,#0a0a0f 0%,#1a0a2e 100%)',
  'dark-blue':   'linear-gradient(135deg,#0a0f1a 0%,#0a1628 100%)',
  'dark-pink':   'linear-gradient(135deg,#1a0a14 0%,#2a0a1a 100%)',
  'dark-green':  'linear-gradient(135deg,#0a1a0a 0%,#0a2a14 100%)',
  'midnight':    '#000',
  'sunset':      'linear-gradient(135deg,#1a0505,#1a0a00)',
  'teal':        'linear-gradient(135deg,#001a1a,#00101a)',
  'slate':       'linear-gradient(135deg,#0f1117,#171923)',
  'light':       'linear-gradient(135deg,#f8f8ff,#eee8ff)',
  'warm':        'linear-gradient(135deg,#1a1208,#12100a)',
};

let twInterval = null;

function viewProfile() {
  saveAll();
  const pr = getProfile();
  if (!pr) return;
  pr.analytics = pr.analytics || { views: 0, clicks: 0, history: Array(30).fill(0) };
  pr.analytics.views++;
  pr.analytics.history[pr.analytics.history.length - 1]++;
  saveProfile(pr);
  showPage('profile-page');
  renderProfile();
}

function renderProfile() {
  const pr = getProfile();
  if (!pr) return;

  const page = document.getElementById('profile-page');
  page.style.background = THEME_BG_MAP[pr.theme || 'dark-purple'];
  page.style.color = pr.theme === 'light' ? '#111' : (pr.colorText || '#f0f0f8');
  page.style.fontFamily = `'${pr.font || 'DM Sans'}',sans-serif`;
  document.documentElement.style.setProperty('--accent', pr.colorAccent || '#7c5cfc');

  // Avatar
  const avatarEl = document.getElementById('prof-avatar');
  if (pr.avatar) {
    avatarEl.innerHTML = `<div class="profile-avatar-ring"></div><img src="${pr.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;position:relative;z-index:1">`;
    avatarEl.style.background = 'transparent';
  } else {
    avatarEl.innerHTML = `<div class="profile-avatar-ring"></div><span style="position:relative;z-index:1;font-size:40px;font-weight:700">${(pr.name || '?')[0].toUpperCase()}</span>`;
    avatarEl.style.background = `linear-gradient(135deg,${pr.colorAccent || '#7c5cfc'},#f72585)`;
  }

  document.getElementById('prof-name').textContent = pr.name || 'Your Name';
  document.getElementById('prof-handle').textContent = '@' + (pr.username || 'user');

  // Bio / Typewriter
  const bioEl = document.getElementById('prof-bio');
  if (twInterval) { clearInterval(twInterval); twInterval = null; }
  if (pr.typewriter && pr.typewriterLines) {
    const lines = pr.typewriterLines.split('\n').filter(Boolean);
    if (lines.length > 0) {
      let lineIdx = 0, charIdx = 0, deleting = false, pauseFrames = 0;
      bioEl.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>';
      const tw = bioEl.querySelector('.typewriter-text');
      twInterval = setInterval(() => {
        if (pauseFrames > 0) { pauseFrames--; return; }
        const cur = lines[lineIdx] || '';
        if (!deleting) {
          tw.textContent = cur.slice(0, ++charIdx);
          if (charIdx >= cur.length) { deleting = true; pauseFrames = 20; }
        } else {
          tw.textContent = cur.slice(0, --charIdx);
          if (charIdx <= 0) { deleting = false; lineIdx = (lineIdx + 1) % lines.length; pauseFrames = 5; }
        }
      }, 80);
    } else {
      bioEl.textContent = pr.bio || '';
    }
  } else {
    bioEl.textContent = pr.bio || '';
  }

  // Badges
  const badgesEl = document.getElementById('prof-badges');
  if (!pr.hideBadges && pr.badges?.length) {
    badgesEl.innerHTML = pr.badges.map(id => {
      const b = BADGE_LIST.find(x => x.id === id);
      return b ? `<span style="padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;background:${b.bg};color:${b.color};display:inline-flex;align-items:center;gap:4px">${b.icon} ${b.name}</span>` : '';
    }).join('');
  } else {
    badgesEl.innerHTML = '';
  }

  // Stats
  const statsEl = document.getElementById('prof-stats');
  if (!pr.hideViews) {
    statsEl.innerHTML = `
      <div style="text-align:center"><div style="font-weight:700;font-size:16px;margin-bottom:2px">${pr.analytics?.views || 0}</div><div>Views</div></div>
      <div style="text-align:center"><div style="font-weight:700;font-size:16px;margin-bottom:2px">${(pr.links || []).length}</div><div>Links</div></div>
    `;
  } else {
    statsEl.innerHTML = '';
  }

  const vc = document.getElementById('view-counter');
  if (vc) vc.textContent = pr.hideViews ? '' : `👁 ${pr.analytics?.views || 0} views`;

  // Socials
  const socialsEl = document.getElementById('prof-socials');
  socialsEl.innerHTML = '';
  SOCIAL_LIST.forEach(s => {
    const val = pr.socials?.[s.key];
    if (val) {
      const pill = document.createElement('a');
      pill.style.cssText = 'padding:7px 14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:20px;font-size:13px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;transition:.2s;text-decoration:none;color:inherit';
      pill.href = val.startsWith('http') ? val : '#';
      pill.target = '_blank';
      pill.innerHTML = `${s.icon} ${s.label}`;
      pill.onmouseover = () => { pill.style.background = 'rgba(255,255,255,.16)'; pill.style.transform = 'translateY(-2px)'; };
      pill.onmouseout = () => { pill.style.background = 'rgba(255,255,255,.08)'; pill.style.transform = ''; };
      socialsEl.appendChild(pill);
    }
  });

  // Music widget
  const existingMusic = document.querySelector('.profile-music');
  if (existingMusic) existingMusic.remove();
  if (pr.music?.title) {
    const mp = document.createElement('div');
    mp.className = 'music-player profile-music';
    mp.style.marginBottom = '16px';
    mp.innerHTML = `
      <div class="music-cover">🎵</div>
      <div class="music-info">
        <div class="music-title">${pr.music.title}</div>
        <div class="music-artist">${pr.music.artist || ''}</div>
        <div class="music-progress"><div class="music-progress-fill"></div></div>
      </div>
      ${pr.music.url ? `<a href="${pr.music.url}" target="_blank" style="background:none;border:none;color:inherit;cursor:pointer;font-size:22px;padding:4px;text-decoration:none">▶</a>` : ''}
    `;
    document.getElementById('prof-links').before(mp);
  }

  // Links
  const linksEl = document.getElementById('prof-links');
  linksEl.innerHTML = '';
  (pr.links || []).filter(l => l.title || l.url).forEach(link => {
    const a = document.createElement('a');
    a.style.cssText = 'display:flex;align-items:center;gap:14px;padding:16px 20px;border-radius:14px;cursor:pointer;transition:.2s;text-decoration:none;color:inherit;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);backdrop-filter:blur(10px);margin-bottom:10px';
    a.href = link.url || '#';
    a.target = '_blank';
    a.innerHTML = `
      <div style="width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(255,255,255,.1);flex-shrink:0">${link.icon || '🔗'}</div>
      <div style="flex:1;font-size:15px;font-weight:500">${link.title || link.url}</div>
      <div style="opacity:.4;font-size:18px">→</div>
    `;
    a.onmouseover = () => { a.style.transform = 'translateY(-2px)'; a.style.background = 'rgba(255,255,255,.12)'; };
    a.onmouseout = () => { a.style.transform = ''; a.style.background = 'rgba(255,255,255,.06)'; };
    linksEl.appendChild(a);
  });

  // BG Effect
  renderBgEffect(pr.bgEffect || 'none');

  // Cursor sparkle
  if (pr.cursorEffect) enableSparkles(); else disableSparkles();
}

function renderBgEffect(effect) {
  const bgEl = document.getElementById('profile-bg-effect');
  bgEl.innerHTML = '';
  bgEl.style.cssText = '';
  bgEl.className = '';

  if (effect === 'aurora') {
    bgEl.className = 'bg-aurora';
  } else if (effect === 'grid') {
    bgEl.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:40px 40px';
  } else if (effect === 'dots') {
    bgEl.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;background-image:radial-gradient(circle,rgba(255,255,255,.12) 1px,transparent 1px);background-size:28px 28px';
  } else if (effect === 'stars') {
    bgEl.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden';
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('div');
      s.style.cssText = `position:absolute;width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;background:rgba(255,255,255,${Math.random()*.8+.2});border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:twinkle ${Math.random()*3+2}s ease-in-out infinite alternate`;
      bgEl.appendChild(s);
    }
  } else if (effect === 'particles') {
    bgEl.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden';
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    canvas.style.cssText = 'position:absolute;inset:0';
    bgEl.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const pts = Array.from({length:40}, () => ({
      x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      vx: (Math.random()-.5)*.5, vy: (Math.random()-.5)*.5,
      r: Math.random()*3+1, a: Math.random()
    }));
    (function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>canvas.width) p.vx*=-1;
        if(p.y<0||p.y>canvas.height) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(124,92,252,${p.a})`; ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  } else if (effect === 'waves') {
    bgEl.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden';
    bgEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 800">
      <path d="M0,400 C360,300 720,500 1440,400 L1440,800 L0,800 Z" fill="rgba(124,92,252,0.05)"><animate attributeName="d" dur="8s" repeatCount="indefinite" values="M0,400 C360,300 720,500 1440,400 L1440,800 L0,800 Z;M0,400 C360,500 720,300 1440,400 L1440,800 L0,800 Z;M0,400 C360,300 720,500 1440,400 L1440,800 L0,800 Z"/></path>
      <path d="M0,300 C360,200 720,400 1440,300 L1440,800 L0,800 Z" fill="rgba(247,37,133,0.04)"><animate attributeName="d" dur="10s" repeatCount="indefinite" values="M0,300 C360,200 720,400 1440,300 L1440,800 L0,800 Z;M0,300 C360,400 720,200 1440,300 L1440,800 L0,800 Z;M0,300 C360,200 720,400 1440,300 L1440,800 L0,800 Z"/></path>
    </svg>`;
  }
}

// ===== SPARKLE CURSOR =====
let sparkleEnabled = false;
function enableSparkles() {
  if (sparkleEnabled) return;
  sparkleEnabled = true;
  document.addEventListener('mousemove', spawnSparkle);
}
function disableSparkles() {
  sparkleEnabled = false;
  document.removeEventListener('mousemove', spawnSparkle);
}
function spawnSparkle(e) {
  const s = document.createElement('div');
  s.textContent = ['✦','★','✶','✸','•'][Math.floor(Math.random()*5)];
  s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;font-size:${Math.random()*12+8}px;color:hsl(${Math.random()*60+260},100%,75%);position:fixed;pointer-events:none;z-index:9999;animation:sparkle-fade .6s ease forwards;user-select:none`;
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 600);
}
