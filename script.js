/* script.js — fully compatible with your selected CSS */

/* SHORTCUTS */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => r.querySelectorAll(s);

/* FOOTER YEAR */
const y = $('#year');
if (y) y.textContent = new Date().getFullYear();

/* ============================================================
   HEX BACKGROUND GRID
   ============================================================ */
const grid = $('#hex-grid');

function buildHexes() {
  const size = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hex-size'));
  const horiz = size;
  const vert = size * 0.86;

  const cols = Math.ceil(window.innerWidth / horiz);
  const rows = Math.ceil(window.innerHeight / vert);

  grid.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
  grid.innerHTML = '';

  for (let i = 0; i < cols * rows; i++) {
    const h = document.createElement('div');
    h.className = 'hex';
    grid.appendChild(h);
  }

  grid._cols = cols;
  grid._rows = rows;
  grid._horiz = horiz;
  grid._vert = vert;
}

buildHexes();
window.addEventListener('resize', buildHexes);

/* HEX GLOW TRAIL */
document.addEventListener('mousemove', e => {
  const { _cols, _horiz, _vert } = grid;

  const col = Math.floor(e.clientX / _horiz);
  const row = Math.floor(e.clientY / _vert);

  const index = row * _cols + col;
  const hex = grid.children[index];

  if (hex) {
    hex.classList.add('active');
    setTimeout(() => hex.classList.remove('active'), 200);
  }
});

/* ============================================================
   PORTRAIT REVEAL (blur → reveal on tap, shake until reveal)
   ============================================================ */
function setupPortrait(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  const img = card.querySelector('.portrait-img');
  const overlay = card.querySelector('.portrait-overlay');
  const src = card.dataset.src;

  /* blurred background on card */
  card.style.setProperty('--bg-img', `url("${src}")`);

  /* tap to reveal */
  card.addEventListener('click', () => {
    card.classList.remove('not-revealed');
    card.classList.add('revealed');
  });
}

setupPortrait('portraitCardMain');
setupPortrait('portraitCardSmall');

/* ============================================================
   TEXT APPEAR ANIMATION (per-letter every 10 seconds)
   ============================================================ */
function setupAppear() {
  const nodes = $$('.appear-loop');

  nodes.forEach(node => {
    const raw = node.textContent;
    node.textContent = '';

    const wrap = document.createElement('span');
    wrap.className = 'appear-wrapper';

    [...raw].forEach((char, i) => {
      const s = document.createElement('span');
      s.className = 'appear-char';
      s.textContent = char;
      s.style.transitionDelay = `${i * 40}ms`;
      wrap.appendChild(s);
    });

    node.appendChild(wrap);
  });

  function animate() {
    const chars = $$('.appear-char');
    chars.forEach(c => c.classList.remove('in'));
    void document.body.offsetWidth; // force reflow
    chars.forEach(c => c.classList.add('in'));
  }

  animate();
  setInterval(animate, 10000);
}

setupAppear();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const reveals = $$('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(ent => {
    if (ent.isIntersecting) {
      ent.target.classList.add('visible');
      io.unobserve(ent.target);
    }
  });
}, { threshold: 0.15 });

reveals.forEach(r => io.observe(r));
