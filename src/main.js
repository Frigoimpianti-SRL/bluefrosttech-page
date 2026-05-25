import './main.css';

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

window.send = function () {
  const f = document.getElementById('fn').value.trim();
  const l = document.getElementById('ln').value.trim();
  const c = document.getElementById('co').value.trim();
  const e = document.getElementById('em').value.trim();
  const m = document.getElementById('ms').value.trim();
  if (!f || !l || !c || !e || !m) {
    alert('Please fill in all required fields marked with *.');
    return;
  }
  const b = document.getElementById('sb');
  b.textContent = '✓ Request received — we will respond within 48 hours';
  b.disabled = true;
};
