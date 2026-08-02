/* ================= ХАЛЯВА.ЕСТЬ — app.js ================= */

/* ---------- динамические даты ---------- */
(() => {
  const now = new Date();
  const NOM = ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'];
  document.querySelectorAll('[data-date="month-year-upper"]').forEach(el => { el.textContent = `${NOM[now.getMonth()]} ${now.getFullYear()}`; });
  document.querySelectorAll('[data-date="year"]').forEach(el => { el.textContent = now.getFullYear(); });
})();

const OFFERS = [
  { rank: 1, name: 'ФОНБЕТ', logo: 'assets/logos/fonbet.png', category: 'Бездеп', hot: true, amount: '15 000 ₽', desc: '<b>Бездеп.</b> Фрибет за регистрацию и идентификацию. Депозит не нужен вообще. Самый жирный бесплатный кусок на рынке.' },
  { rank: 2, name: 'WINLINE', logo: 'assets/logos/winline.png', category: 'Депозит', amount: '10 000 ₽', desc: 'До 10 фрибетов по 1 000 ₽ после верификации. Активация — депозит <b>от 1 000 ₽</b>.' },
  { rank: 3, name: 'BETBOOM', logo: 'assets/logos/betboom.png', category: 'Депозит', amount: '10 000 ₽', desc: '5 фрибетов на 10 000 ₽ за депозит <b>от 100 ₽</b> и оборот. Бонус: бездеп 1 000 ₽ в приложении по промокоду.' },
  { rank: 4, name: 'PARI', logo: 'assets/logos/pari.png', category: 'Депозит', amount: '5 000 ₽', desc: '5 фрибетов по 1 000 ₽ после идентификации и первого депозита <b>от 1 000 ₽</b>. Просто и по-честному.' },
  { rank: 5, name: 'БЕТСИТИ', logo: 'assets/logos/betcity.png', category: 'Бездеп', amount: '2 000 ₽', desc: '<b>Бездеп.</b> Фрибет до 2 000 ₽ после регистрации.' },
  { rank: 6, name: 'МЕЛБЕТ', logo: 'assets/logos/melbet.png', category: 'Депозит', hot: true, amount: '30 000 ₽', desc: '<b>Максимальная сумма подборки.</b> До 30 000 ₽ за первый депозит от 1 000 ₽ и серию из 5 ставок. Хочешь много — ставь много.' },
  { rank: 7, name: 'БАЛТБЕТ', logo: 'assets/logos/baltbet.png', category: 'Бездеп', amount: '8 000 ₽', desc: '<b>Бездеп-рулетка.</b> После регистрации крутишь барабан: фрибет до 8 000 ₽. Нужна идентификация.' },
  { rank: 8, name: 'LEON', logo: 'assets/logos/leon.png', category: 'По акции', amount: '3 000 ₽', desc: 'Фрибет по промокоду за первую ставку <b>от 1 000 ₽</b>. За депозит и ставку в лайве — до 3 000 ₽.' },
  { rank: 9, name: 'MARATHONBET', logo: 'assets/logos/marathonbet.png', category: 'Депозит', amount: '11 111 ₽', desc: '6 фрибетов этапами: депозит от 500 ₽ + выигрышные ставки с кф <b>от 2.00</b>. Марафон, а не спринт.' },
];

/* ---------- render rows ---------- */
const rowsEl = document.getElementById('rows');
rowsEl.innerHTML = OFFERS.map((o, i) => `
  <div class="row" data-row>
    <button class="row__head" aria-expanded="false" aria-controls="rowBody${i}">
      <span class="row__idx">${String(o.rank).padStart(2, '0')}</span>
      <span class="row__logo"><img src="${o.logo}" alt="Логотип ${o.name}" loading="lazy"></span>
      <span class="row__name">
        ${o.name}
        <span class="row__badge ${o.hot ? 'row__badge--hot' : ''}">${o.hot ? '★ ' : ''}${o.category.toUpperCase()}</span>
      </span>
      <span class="row__amount">${o.amount}</span>
      <span class="row__toggle" aria-hidden="true">+</span>
    </button>
    <div class="row__body" id="rowBody${i}">
      <div>
        <div class="row__inner">
          <p class="row__desc">${o.desc}</p>
          <a class="row__cta" href="#" aria-label="Забрать бонус ${o.name}">ЗАБРАТЬ →</a>
        </div>
      </div>
    </div>
  </div>
`).join('');

/* ---------- accordion ---------- */
rowsEl.querySelectorAll('[data-row]').forEach(row => {
  const head = row.querySelector('.row__head');
  head.addEventListener('click', () => {
    const isOpen = row.classList.contains('is-open');
    rowsEl.querySelectorAll('.is-open').forEach(r => {
      r.classList.remove('is-open');
      r.querySelector('.row__head').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      row.classList.add('is-open');
      head.setAttribute('aria-expanded', 'true');
    }
  });
});
/* open first row by default */
const first = rowsEl.querySelector('[data-row]');
first.classList.add('is-open');
first.querySelector('.row__head').setAttribute('aria-expanded', 'true');

/* ---------- counters: slot-machine style, snappy ---------- */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = new Intl.NumberFormat('ru-RU');

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target;
    const target = +el.dataset.count;
    if (reduceMotion) { el.textContent = fmt.format(target); return; }
    const steps = 18;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i >= steps) {
        el.textContent = fmt.format(target);
        clearInterval(iv);
      } else {
        /* deterministic pseudo-random shuffle toward target */
        const progress = i / steps;
        const jitter = Math.round(target * (1 - progress) * ((i % 3) - 1) * 0.35);
        el.textContent = fmt.format(Math.max(0, Math.round(target * progress) + jitter));
      }
    }, 55);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => io.observe(el));

/* ---------- reveal ---------- */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('[data-reveal]').forEach(el => revealIO.observe(el));

/* ---------- hero words: stamp-in on load ---------- */
if (!reduceMotion) {
  document.querySelectorAll('[data-word]').forEach((w, i) => {
    w.style.opacity = '0';
    w.style.transform = 'scale(1.25)';
    setTimeout(() => {
      w.style.transition = 'opacity .12s steps(2), transform .18s cubic-bezier(.34,1.56,.64,1)';
      w.style.opacity = '1';
      w.style.transform = 'scale(1)';
    }, 180 + i * 160);
  });
}
