// ===== AUTH =====

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('bl_users') || '{}');
  } catch(e) { return {}; }
}

function saveUsers(users) {
  localStorage.setItem('bl_users', JSON.stringify(users));
}

function getCurrentUser() {
  return localStorage.getItem('bl_current') || null;
}

function setCurrentUser(username) {
  if (username) localStorage.setItem('bl_current', username);
  else localStorage.removeItem('bl_current');
}

function getProfile(username) {
  const users = getUsers();
  const u = username || getCurrentUser();
  return u && users[u] ? users[u].profile : null;
}

function saveProfile(profile) {
  const username = getCurrentUser();
  if (!username) return;
  const users = getUsers();
  if (!users[username]) return;
  users[username].profile = profile;
  saveUsers(users);
}

function doLogin() {
  const u = document.getElementById('login-user').value.trim().toLowerCase();
  const p = document.getElementById('login-pass').value;

  if (!u || !p) { showToast('Please enter your username and password', 'error'); return; }

  const users = getUsers();

  if (!users[u]) { showToast('No account found with that username', 'error'); return; }
  if (users[u].password !== p) { showToast('Wrong password', 'error'); return; }

  setCurrentUser(u);
  showToast('Welcome back, ' + users[u].profile.name + '!', 'success');
  setTimeout(() => showDashboard(), 600);
}

function doRegister() {
  const u = document.getElementById('reg-user').value.trim().toLowerCase();
  const e = document.getElementById('reg-email').value.trim();
  const p = document.getElementById('reg-pass').value;
  const p2 = document.getElementById('reg-pass2').value;

  if (!u || !e || !p || !p2) { showToast('Please fill in all fields', 'error'); return; }
  if (!/^[a-z0-9_]{2,20}$/.test(u)) { showToast('Username: 2-20 chars, letters/numbers/underscores only', 'error'); return; }
  if (!e.includes('@')) { showToast('Please enter a valid email', 'error'); return; }
  if (p.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
  if (p !== p2) { showToast("Passwords don't match", 'error'); return; }

  const users = getUsers();
  if (users[u]) { showToast('That username is already taken', 'error'); return; }

  users[u] = {
    password: p,
    email: e,
    profile: createFreshProfile(u)
  };
  saveUsers(users);
  setCurrentUser(u);
  showToast('Account created! Welcome, ' + u + ' 🎉', 'success');
  setTimeout(() => showDashboard(), 600);
}

function doLogout() {
  setCurrentUser(null);
  showPage('auth-page');
}

function createFreshProfile(username) {
  return {
    name: username,
    username: username,
    bio: '',
    location: '',
    pronouns: '',
    website: '',
    avatar: null,
    links: [],
    socials: { twitter:'', instagram:'', tiktok:'', youtube:'', twitch:'', discord:'', github:'', linkedin:'', spotify:'', reddit:'' },
    theme: 'dark-purple',
    bgEffect: 'none',
    font: 'DM Sans',
    colorAccent: '#7c5cfc',
    colorBg: '#0a0a0f',
    colorText: '#f0f0f8',
    colorCard: '#13131a',
    typewriter: false,
    typewriterLines: '',
    badges: [],
    hideViews: false,
    hideBadges: false,
    active: true,
    seoTitle: '',
    seoDesc: '',
    alias1: '',
    alias2: '',
    cursorEffect: false,
    music: { title:'', artist:'', url:'' },
    analytics: { views: 0, clicks: 0, history: Array(30).fill(0) },
    linkClicks: {}
  };
}

function switchAuthTab(tab) {
  // tab is either 'login' or 'register'
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(tab + '-form').classList.add('active');
}
