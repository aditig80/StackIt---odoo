/********************  AUTH MODULE  ************************/

// KEY NAMES IN localStorage
const USERS_KEY = 'stackit_users';
const CURR_KEY  = 'stackit_current_user';

// ---------- Helpers ----------
export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function saveUsers(arr) {
  localStorage.setItem(USERS_KEY, JSON.stringify(arr));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURR_KEY) || 'null');
}

export function setCurrentUser(userObj) {
  localStorage.setItem(CURR_KEY, JSON.stringify(userObj));
}

export function logout() {
  localStorage.removeItem(CURR_KEY);
  window.location.reload();
}

// ---------- Register ----------
export function register({ username, email, password }) {
  const users = getUsers();

  // Disallow duplicate email / username
  if (users.some(u => u.email === email || u.username === username)) {
    return { ok: false, msg: 'User already exists' };
  }

  const newUser = { username, email, password, role: 'User' };
  users.push(newUser);
  saveUsers(users);
  return { ok: true, msg: 'Registered! You can now log in.' };
}

// ---------- Login ----------
export function login({ email, password }) {
  const users = getUsers();

  // Hard‑coded admin
  if (email === 'admin@stackit.dev' && password === 'admin123') {
    setCurrentUser({ username: 'admin', email, role: 'Admin' });
    return { ok: true };
  }

  const found = users.find(u => u.email === email && u.password === password);
  if (!found) return { ok: false, msg: 'Invalid credentials' };

  setCurrentUser({ username: found.username, email: found.email, role: found.role });
  return { ok: true };
}
