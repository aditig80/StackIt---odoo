import { getCurrentUser } from './auth.js';

const user = getCurrentUser();
if (!user) return;

const NOTIF_KEY = 'stackit_notifications';

function getAllNotifications() {
  return JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
}

function getUserNotifications() {
  const all = getAllNotifications();
  return all.filter(n => n.to === user.username);
}

function renderNotifUI() {
  const countEl = document.getElementById('notifCount');
  const dropEl = document.getElementById('notifDropdown');
  const bell = document.getElementById('notifIcon');

  if (!bell) return;

  const userNotifs = getUserNotifications();
  const unread = userNotifs.filter(n => !n.read);

  countEl.innerText = unread.length;
  dropEl.innerHTML = unread.length === 0
    ? "<p class='empty-msg'>No new notifications</p>"
    : unread.map(n => `<p>${n.message}</p>`).join('');

  // Toggle dropdown
  bell.onclick = () => {
    dropEl.classList.toggle('show');
    markAllRead();
    renderNotifUI();
  };
}

function markAllRead() {
  const all = getAllNotifications().map(n =>
    n.to === user.username ? { ...n, read: true } : n
  );
  localStorage.setItem(NOTIF_KEY, JSON.stringify(all));
}

// Call on load
renderNotifUI();
