(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* ---------- Preloader ---------- */
  const loader = $('.loader');
  const countEl = $('[data-loader-count]');
  const bar = $('.loader__bar span');
  const start = performance.now();
  const minTime = reduced ? 0 : 1600;
  let pageLoaded = false;
  addEventListener('load', () => (pageLoaded = true));
  setTimeout(() => (pageLoaded = true), 4000); // never block on slow images

  (function tick(now) {
    const t = clamp((now - start) / minTime, 0, 1);
    const target = pageLoaded ? t : Math.min(t, 0.9);
    const eased = 1 - Math.pow(1 - target, 3);
    const pct = Math.round(eased * 100);
    countEl.textContent = pct;
    bar.style.width = pct + '%';
    if (pct >= 100) return finishLoading();
    requestAnimationFrame(tick);
  })(start);

  function finishLoading() {
    loader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    setTimeout(() => document.body.classList.add('is-ready'), 200);
    setTimeout(() => loader.remove(), 1200);
  }

  /* ---------- Nav: hide on scroll, progress, active link ---------- */
  const nav = $('[data-nav]');
  const progress = $('.progress span');
  let lastY = scrollY;

  function onScroll() {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  }

  const navLinks = $$('.nav__links a');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(a => { const s = $(a.getAttribute('href')); if (s) sectionObserver.observe(s); });

  /* ---------- Mobile menu ---------- */
  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', !open);
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  $$('[data-reveal]').forEach((el, i) => {
    // stagger siblings in the same grid
    const sibs = $$(':scope > [data-reveal]', el.parentElement);
    el.style.transitionDelay = (sibs.indexOf(el) * 0.08) + 's';
    revealObserver.observe(el);
  });

  /* ---------- Word-by-word light-up ---------- */
  const statement = $('[data-words]');
  statement.innerHTML = statement.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span> `).join('');
  const words = $$('.w', statement);
  function lightWords() {
    const r = statement.getBoundingClientRect();
    const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35), 0, 1);
    const lit = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
  }

  /* ---------- Parallax ---------- */
  const parallax = $$('[data-parallax]');
  function doParallax() {
    if (reduced) return;
    parallax.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const speed = parseFloat(el.dataset.parallax);
      el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - innerHeight / 2) * -speed}px, 0)`;
    });
  }

  /* ---------- Horizontal pinned gallery ---------- */
  const hSection = $('[data-hscroll]');
  const hTrack = $('[data-htrack]');
  function sizeHScroll() {
    const distance = hTrack.scrollWidth - innerWidth;
    hSection.style.height = (innerHeight + Math.max(distance, 0)) + 'px';
  }
  function doHScroll() {
    const r = hSection.getBoundingClientRect();
    const distance = hTrack.scrollWidth - innerWidth;
    const p = clamp(-r.top / (r.height - innerHeight || 1), 0, 1);
    hTrack.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
  }

  /* ---------- Scroll loop ---------- */
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); lightWords(); doParallax(); doHScroll(); ticking = false; });
  }, { passive: true });
  addEventListener('resize', () => { sizeHScroll(); doHScroll(); lightWords(); });
  addEventListener('load', () => { sizeHScroll(); doHScroll(); });
  sizeHScroll(); onScroll(); lightWords(); doParallax(); doHScroll();

  /* ---------- Counters ---------- */
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countObserver.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
      const dur = reduced ? 0 : 2000, t0 = performance.now();
      (function step(now) {
        const t = dur ? clamp((now - t0) / dur, 0, 1) : 1;
        const v = Math.round(end * (1 - Math.pow(1 - t, 4)));
        el.innerHTML = v.toLocaleString() + `<span class="suf">${suf}</span>`;
        if (t < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countObserver.observe(el));

  /* ---------- Custom cursor + magnetic buttons ---------- */
  if (finePointer && !reduced) {
    const cursor = $('.cursor');
    const label = $('.cursor__label');
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.classList.add('is-visible'); });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    (function loop() {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    })();
    $$('a, button, summary, .chips label').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
    $$('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-label'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-label'));
    });

    $$('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => (btn.style.transform = ''));
    });

    /* Program list floating image */
    const float = $('.plist__float');
    const floatImg = $('img', float);
    let fx = 0, fy = 0, tx = 0, ty = 0, active = false;
    const plist = $('[data-plist]');
    $$('.plist__item', plist).forEach(item => {
      item.addEventListener('mouseenter', () => { floatImg.src = item.dataset.img; float.classList.add('is-on'); active = true; });
    });
    plist.addEventListener('mouseleave', () => { float.classList.remove('is-on'); active = false; });
    plist.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function floatLoop() {
      const dx = tx - fx;
      fx += dx * 0.12; fy += (ty - fy) * 0.12;
      const rot = clamp(dx * 0.05, -12, 12);
      float.style.transform = `translate(${fx}px, ${fy}px) translate(-50%, -50%) scale(${active ? 1 : 0.6}) rotate(${rot}deg)`;
      requestAnimationFrame(floatLoop);
    })();
    // preload program images
    $$('.plist__item').forEach(i => { const im = new Image(); im.src = i.dataset.img; });
  }

  /* ---------- Schedule ---------- */
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const C = { marcus: 'Marcus Reyes', sasha: 'Sasha Lindqvist', ethan: 'Ethan Brooks', lena: 'Lena Okafor' };
  const weekday = [
    ['05:30', 'Strength Foundations', 'Barbell basics · 60 min', C.marcus, 3],
    ['06:45', 'Engine Room', 'Conditioning · 45 min', C.sasha, 5],
    ['12:00', 'Lunch Lift', 'Express strength · 40 min', C.ethan, 3],
    ['17:30', 'Hypertrophy Upper', 'Bodybuilding split · 60 min', C.ethan, 4],
    ['18:45', 'Powerlifting Club', 'Squat / Bench / Deadlift · 90 min', C.marcus, 4],
    ['20:00', 'Mobility Flow', 'Recovery · 45 min', C.lena, 1]
  ];
  const schedule = {
    Mon: weekday,
    Tue: [['06:00', 'River Valley Run Club', 'Outdoor · 50 min', C.sasha, 3], ...weekday.slice(1, 4), ['19:00', 'Hyrox Prep', 'Race simulation · 75 min', C.sasha, 5]],
    Wed: weekday.map(r => r[1] === 'Hypertrophy Upper' ? ['17:30', 'Hypertrophy Lower', 'Bodybuilding split · 60 min', C.ethan, 4] : r),
    Thu: [...weekday.slice(0, 3), ['17:30', 'Kettlebell Complex', 'Strength-endurance · 45 min', C.sasha, 4], ['19:00', 'Pain-Free Lifting', 'Rehab & technique · 60 min', C.lena, 2]],
    Fri: [...weekday.slice(0, 4), ['18:30', 'Friday Night Lights', 'Partner WOD · 60 min', C.sasha, 5]],
    Sat: [['08:00', 'River Valley Run Club', 'Outdoor · 60 min', C.sasha, 3], ['09:30', 'Team Strength', 'Community class · 75 min', C.marcus, 4], ['11:00', 'Open Platform', 'Coach on floor · 120 min', C.marcus, 3], ['13:00', 'Mobility Flow', 'Recovery · 45 min', C.lena, 1]],
    Sun: [['09:00', 'Sunday Reset', 'Mobility & breath · 60 min', C.lena, 1], ['10:30', 'Engine Room', 'Conditioning · 45 min', C.sasha, 5], ['12:00', 'Technique Clinic', 'Olympic lifts · 90 min', C.marcus, 3]]
  };
  const levels = ['', 'Easy', 'Light', 'Moderate', 'Hard', 'Max'];
  const tabsEl = $('[data-tabs]');
  const schedEl = $('[data-sched]');
  const todayIdx = (new Date().getDay() + 6) % 7;
  const booked = new Set();

  tabsEl.innerHTML = days.map((d, i) =>
    `<button class="tab" role="tab" aria-selected="${i === todayIdx}" data-day="${d}">${d}${i === todayIdx ? ' · Today' : ''}</button>`).join('');

  function renderDay(day) {
    schedEl.innerHTML = schedule[day].map(([time, name, sub, coach, lvl], i) => {
      const [h, m] = time.split(':').map(Number);
      const end = new Date(0, 0, 0, h, m + parseInt(sub.match(/(\d+) min/)[1]));
      const endStr = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
      const spots = (name.length * 7 + i * 3) % 16;
      const key = day + time;
      const full = spots === 0;
      return `<div class="srow" style="animation-delay:${i * 0.05}s">
        <div class="srow__time">${time}<small>to ${endStr}</small></div>
        <div class="srow__name">${name}<small>${sub}</small></div>
        <div class="srow__coach">${coach}</div>
        <div class="intensity" aria-label="Intensity ${levels[lvl]}">${[1, 2, 3, 4, 5].map(n => `<i class="${n <= lvl ? 'on' : ''}"></i>`).join('')}<span>${levels[lvl]}</span></div>
        <button class="srow__book${booked.has(key) ? ' is-booked' : ''}" data-key="${key}" ${full ? 'disabled' : ''}>${full ? 'Waitlist' : booked.has(key) ? 'Booked ✓' : `Book · ${spots} left`}</button>
      </div>`;
    }).join('');
  }
  tabsEl.addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b) return;
    $$('.tab', tabsEl).forEach(t => t.setAttribute('aria-selected', t === b));
    renderDay(b.dataset.day);
  });
  schedEl.addEventListener('click', e => {
    const b = e.target.closest('.srow__book'); if (!b || b.disabled) return;
    const k = b.dataset.key;
    if (booked.has(k)) { booked.delete(k); } else { booked.add(k); }
    renderDay($('.tab[aria-selected="true"]', tabsEl).dataset.day);
  });
  renderDay(days[todayIdx]);
  const todayTab = $('.tab[aria-selected="true"]', tabsEl);
  tabsEl.scrollLeft = todayTab.offsetLeft - tabsEl.clientWidth / 2 + todayTab.offsetWidth / 2;

  /* ---------- Testimonials slider ---------- */
  const slides = $$('.review');
  const dotsEl = $('[data-dots]');
  let current = 0, timer;
  dotsEl.innerHTML = slides.map((_, i) => `<button aria-label="Story ${i + 1}"></button>`).join('');
  const dots = $$('button', dotsEl);
  function go(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === current));
    dots.forEach((d, j) => { d.classList.remove('is-active'); if (j === current) { void d.offsetWidth; d.classList.add('is-active'); } });
    clearTimeout(timer);
    timer = setTimeout(() => go(current + 1), 7000);
  }
  $('[data-prev]').addEventListener('click', () => go(current - 1));
  $('[data-next]').addEventListener('click', () => go(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  go(0);

  /* ---------- Pricing toggle ---------- */
  const billing = $('[data-billing]');
  const pill = $('.toggle__pill', billing);
  const periodBtns = $$('button', billing);
  function setPill(btn) { pill.style.width = btn.offsetWidth + 'px'; pill.style.transform = `translateX(${btn.offsetLeft - 4}px)`; }
  periodBtns.forEach(btn => btn.addEventListener('click', () => {
    if (btn.classList.contains('is-on')) return;
    periodBtns.forEach(b => b.classList.toggle('is-on', b === btn));
    setPill(btn);
    $$('[data-price]').forEach(p => {
      p.classList.add('is-flip');
      setTimeout(() => { p.textContent = p.dataset[btn.dataset.period]; p.classList.remove('is-flip'); }, 220);
    });
  }));
  setPill(periodBtns[0]);
  addEventListener('resize', () => setPill($('.is-on', billing)));
  document.fonts && document.fonts.ready.then(() => setPill($('.is-on', billing)));

  /* ---------- FAQ: one open at a time ---------- */
  const faqs = $$('[data-faq] details');
  faqs.forEach(d => d.addEventListener('toggle', () => { if (d.open) faqs.forEach(o => o !== d && (o.open = false)); }));

  /* ---------- Join form ---------- */
  const form = $('[data-form]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name, email = form.email;
    const okName = name.value.trim().length > 1;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    name.parentElement.classList.toggle('is-error', !okName);
    email.parentElement.classList.toggle('is-error', !okEmail);
    if (!okName) return name.focus();
    if (!okEmail) return email.focus();
    $('[data-name]', form).textContent = name.value.trim().split(' ')[0];
    form.classList.add('is-sent');
  });
  $$('input', form).forEach(i => i.addEventListener('input', () => i.parentElement.classList.remove('is-error')));

  /* ---------- Newsletter ---------- */
  const news = $('[data-news]');
  news.addEventListener('submit', e => {
    e.preventDefault();
    $('[data-news-msg]').textContent = "You're on the list. Welcome to the climb.";
    $('[data-news-msg]').style.color = 'var(--accent)';
    news.reset();
  });

  $('[data-year]').textContent = new Date().getFullYear();
})();
