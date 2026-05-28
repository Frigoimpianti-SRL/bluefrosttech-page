import './main.css';

const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8383').replace(/\/$/, '');
const SUCCESS_MESSAGE = '✓ Request received — we will respond within 48 hours';

window.addEventListener('scroll', function () {
  const nav = document.getElementById('navbar');
  const scrolled = window.scrollY > 300;
  nav.classList.toggle('scrolled', scrolled);
  document.querySelectorAll('.nav-links a').forEach((a) => {
    a.style.color = scrolled ? 'var(--gray)' : 'rgba(255,255,255,0.85)';
  });
  const cta = document.querySelector('.nav-cta');
  if (scrolled) {
    cta.style.background = 'var(--blue)';
    cta.style.border = 'none';
    cta.style.color = 'white';
  } else {
    cta.style.background = 'rgba(255,255,255,0.15)';
    cta.style.border = '1px solid rgba(255,255,255,0.4)';
    cta.style.color = 'white';
  }
});

window.sc = function (id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};

function fieldValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function selectedUrgency() {
  const checked = document.querySelector('input[name="urg"]:checked');
  return checked ? checked.value : 'standard';
}

function showSubmitSuccess(button) {
  button.textContent = SUCCESS_MESSAGE;
  button.disabled = true;
}

window.send = async function () {
  const firstName = fieldValue('fn');
  const lastName = fieldValue('ln');
  const company = fieldValue('co');
  const email = fieldValue('em');
  const message = fieldValue('ms');
  const honeypot = fieldValue('website');
  const button = document.getElementById('sb');

  if (!firstName || !lastName || !company || !email || !message) {
    alert('Please fill in all required fields marked with *.');
    return;
  }

  if (honeypot) {
    showSubmitSuccess(button);
    return;
  }

  const payload = {
    firstName,
    lastName,
    company,
    email,
    phone: fieldValue('ph') || undefined,
    country: fieldValue('country') || undefined,
    brand: fieldValue('brand') || undefined,
    oemCode: fieldValue('oe') || undefined,
    quantity: fieldValue('qt') || undefined,
    message,
    urgency: selectedUrgency(),
  };

  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = 'Sending…';

  try {
    const response = await fetch(`${API_BASE}/public/parts-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    showSubmitSuccess(button);
  } catch {
    button.disabled = false;
    button.textContent = originalLabel;
    alert('Unable to send your request right now. Please try again or email info@bluefrosttech.com.');
  }
};
