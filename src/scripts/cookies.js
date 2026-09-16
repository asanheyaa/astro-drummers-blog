export function initCookiesPopup() {
	const COOKIE_NAME = 'drummersblog_cookies_accepted';
const COOKIE_DAYS = 7;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict`;
}

function initCookiesPopup() {
  const popup = document.querySelector('[data-cookies-popup]');
  if (!popup) return;

  const closeButton = popup.querySelector('[data-cookies-popup-close]');
  if (!closeButton) return;

  const alreadyAccepted = getCookie(COOKIE_NAME);

  if (!alreadyAccepted) {
	setTimeout(() => {
		popup.classList.add('--visible');
	}, 3000);
  }

  closeButton.addEventListener('click', () => {
    setCookie(COOKIE_NAME, 'true', COOKIE_DAYS);
    popup.classList.remove('--visible');
  });
}

initCookiesPopup();
}