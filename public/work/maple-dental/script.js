/* Maple Dental — interactions */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Clinic hours (Edmonton time). [open, close] in hours; null = closed ──
  const HOURS = { 0: null, 1: [8, 19], 2: [8, 19], 3: [8, 19], 4: [8, 19], 5: [8, 16], 6: [9, 15] };
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Current wall-clock time in Edmonton, regardless of the visitor's timezone
  function edmontonNow() {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Edmonton', year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
      }).formatToParts(new Date()).map((p) => [p.type, p.value])
    );
    // A UTC date standing in for the Edmonton calendar date — safe for day arithmetic
    const date = new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day));
    return { date, day: date.getUTCDay(), minutes: +parts.hour * 60 + +parts.minute };
  }

  const fmtTime = (mins) => {
    const h = Math.floor(mins / 60), m = mins % 60;
    const suffix = h >= 12 ? 'pm' : 'am';
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
  };
  const fmtHour = (h) => fmtTime(h * 60).replace(':00', '');

  // ── Open / closed status ──
  function updateStatus() {
    const { day, minutes } = edmontonNow();
    const today = HOURS[day];
    let open = false, label;

    if (today && minutes >= today[0] * 60 && minutes < today[1] * 60) {
      open = true;
      label = `Open now · until ${fmtHour(today[1])}`;
    } else if (today && minutes < today[0] * 60) {
      label = `Closed · opens ${fmtHour(today[0])}`;
    } else {
      let d = (day + 1) % 7;
      while (!HOURS[d]) d = (d + 1) % 7;
      const when = d === (day + 1) % 7 ? 'tomorrow' : DAY_NAMES[d];
      label = `Closed · opens ${when} ${fmtHour(HOURS[d][0])}`;
    }

    $$('[data-open-status]').forEach((el) => (el.textContent = label));
    const badge = $('[data-open-badge]');
    if (badge) {
      badge.textContent = open ? 'Open now' : 'Closed now';
      badge.classList.toggle('is-open', open);
      badge.classList.toggle('is-closed', !open);
    }
    $$('[data-hours] tr').forEach((tr) => tr.classList.toggle('is-today', +tr.dataset.day === day));
  }

  // ── Nav ──
  const nav = $('[data-nav]');
  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  const stickyCta = $('[data-sticky-cta]');
  const bookSection = $('#book');

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });

  function onScroll() {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 8);
    if (stickyCta && bookSection) {
      const bookTop = bookSection.getBoundingClientRect().top;
      stickyCta.classList.toggle('is-visible', y > 600 && bookTop > innerHeight * 0.6);
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the nav link for the section in view
  const navLinks = $$('.nav__links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => { const s = $(a.getAttribute('href')); if (s) sectionObserver.observe(s); });

  // ── Reveal on scroll + counters ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  // Stagger siblings so grids cascade in
  $$('.reveal').forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
    revealObserver.observe(el);
  });

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimals = +(el.dataset.decimals || 0);
      const format = (v) => v.toLocaleString('en-CA', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      if (reduceMotion) { el.textContent = format(target); return; }
      const start = performance.now(), dur = 1600;
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        el.textContent = format(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countObserver.observe(el));

  // ── Service filter tabs ──
  const tabs = $$('[role="tab"][data-filter]');
  const services = $$('[data-services] .service');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      const f = tab.dataset.filter;
      services.forEach((s) => {
        const show = f === 'all' || s.dataset.cat.split(' ').includes(f);
        s.classList.toggle('is-hidden', !show);
        if (show) s.classList.add('is-in');
      });
    });
  });

  // ── Reviews slider ──
  const reviews = $('[data-reviews]');
  $$('[data-slide]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = reviews.firstElementChild;
      const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(reviews).columnGap || 24);
      const dir = btn.dataset.slide === 'next' ? 1 : -1;
      const atEnd = reviews.scrollLeft + reviews.clientWidth >= reviews.scrollWidth - 4;
      const atStart = reviews.scrollLeft <= 4;
      if (dir === 1 && atEnd) reviews.scrollTo({ left: 0, behavior: 'smooth' });
      else if (dir === -1 && atStart) reviews.scrollTo({ left: reviews.scrollWidth, behavior: 'smooth' });
      else reviews.scrollBy({ left: dir * step, behavior: 'smooth' });
    });
  });

  // ── Booking ──
  const form = $('[data-booking]');
  const steps = $$('[data-step]', form);
  const progress = $$('[data-progress]');
  const daysEl = $('[data-days]');
  const slotsEl = $('[data-slots]');
  const state = { step: 1, date: null, slot: null };

  const REASONS = {
    new: 'New patient visit', cleaning: 'Cleaning & check-up', kids: "Child's visit",
    emergency: 'Emergency visit', cosmetic: 'Invisalign / whitening consult', consult: 'Consultation',
  };

  // Deterministic "already booked" slots so the calendar looks lived-in but stable
  const isBooked = (date, mins) => {
    const n = (date.getUTCDate() * 37 + date.getUTCMonth() * 11 + mins * 7) % 100;
    return n < 38;
  };

  function slotsFor(date) {
    const hours = HOURS[date.getUTCDay()];
    if (!hours) return [];
    const now = edmontonNow();
    const isToday = date.getTime() === now.date.getTime();
    const list = [];
    for (let m = hours[0] * 60; m <= hours[1] * 60 - 60; m += 30) {
      const past = isToday && m < now.minutes + 60;
      list.push({ mins: m, available: !past && !isBooked(date, m) });
    }
    return list;
  }

  const upcomingDays = (() => {
    const { date } = edmontonNow();
    return Array.from({ length: 14 }, (_, i) => new Date(date.getTime() + i * 864e5));
  })();

  const fmtDate = (d, opts) => d.toLocaleDateString('en-CA', { timeZone: 'UTC', ...opts });

  function dayLabel(d, i) {
    if (i === 0) return 'Today';
    if (i === 1) return 'Tomorrow';
    return fmtDate(d, { weekday: 'long' });
  }

  // Hero "next available" card
  (function nextAvailable() {
    const el = $('[data-next-slot]');
    if (!el) return;
    for (let i = 0; i < upcomingDays.length; i++) {
      const s = slotsFor(upcomingDays[i]).find((x) => x.available);
      if (s) { el.textContent = `${dayLabel(upcomingDays[i], i)}, ${fmtTime(s.mins)}`; return; }
    }
  })();

  function renderDays() {
    daysEl.innerHTML = '';
    upcomingDays.forEach((d, i) => {
      const open = slotsFor(d).filter((s) => s.available).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'day';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(state.date?.getTime() === d.getTime()));
      btn.disabled = open === 0;
      btn.setAttribute('aria-label', `${fmtDate(d, { weekday: 'long', month: 'long', day: 'numeric' })}, ${open ? `${open} times available` : 'unavailable'}`);
      btn.innerHTML = `<small>${i === 0 ? 'Today' : fmtDate(d, { weekday: 'short' })}</small><strong>${d.getUTCDate()}</strong><em>${open ? `${open} open` : HOURS[d.getUTCDay()] ? 'Full' : 'Closed'}</em>`;
      btn.addEventListener('click', () => { state.date = d; state.slot = null; renderDays(); renderSlots(); clearError('slot'); });
      daysEl.appendChild(btn);
    });
  }

  function renderSlots() {
    slotsEl.innerHTML = '';
    if (!state.date) {
      slotsEl.innerHTML = '<p class="slots__empty">Choose a day to see available times.</p>';
      return;
    }
    slotsFor(state.date).forEach((s) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(state.slot === s.mins));
      btn.disabled = !s.available;
      btn.textContent = fmtTime(s.mins);
      btn.addEventListener('click', () => { state.slot = s.mins; renderSlots(); clearError('slot'); });
      slotsEl.appendChild(btn);
    });
  }

  function pickFirstOpenDay() {
    const d = upcomingDays.find((day) => slotsFor(day).some((s) => s.available));
    if (d && !state.date) state.date = d;
  }

  const setError = (key, msg) => {
    const el = $(`[data-error="${key}"]`, form);
    if (el) el.textContent = msg;
    el?.closest('.field')?.classList.add('has-error');
  };
  const clearError = (key) => {
    const el = $(`[data-error="${key}"]`, form);
    if (el) el.textContent = '';
    el?.closest('.field')?.classList.remove('has-error');
  };

  function validate(step) {
    if (step === 1) {
      if (!form.reason.value) { setError('reason', 'Please choose a reason for your visit.'); return false; }
      return true;
    }
    if (step === 2) {
      if (state.slot == null) { setError('slot', 'Please pick a day and time.'); return false; }
      return true;
    }
    let ok = true;
    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/\D/g, '');
    const email = form.email.value.trim();
    if (name.length < 2) { setError('name', 'Please enter your name.'); ok = false; } else clearError('name');
    if (phone.length < 10) { setError('phone', 'Please enter a 10-digit phone number.'); ok = false; } else clearError('phone');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Please enter a valid email.'); ok = false; } else clearError('email');
    if (!ok) $('.has-error input', form)?.focus();
    return ok;
  }

  function summary() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4m8-4v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <span><strong>${REASONS[form.reason.value]}</strong> · ${fmtDate(state.date, { weekday: 'long', month: 'long', day: 'numeric' })} at ${fmtTime(state.slot)}</span>`;
  }

  function goTo(step) {
    state.step = step;
    steps.forEach((s) => s.classList.toggle('is-active', +s.dataset.step === step));
    progress.forEach((p) => {
      const n = +p.dataset.progress;
      p.classList.toggle('is-active', n === step);
      p.classList.toggle('is-done', n < step);
    });
    if (step === 2) {
      if (form.reason.value === 'emergency') state.date = upcomingDays.find((d) => slotsFor(d).some((s) => s.available));
      pickFirstOpenDay();
      renderDays();
      renderSlots();
      $('.day[aria-checked="true"]', daysEl)?.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
    if (step === 3) $('[data-summary]').innerHTML = summary();
    const panel = $('.book__panel');
    if (panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  form.addEventListener('change', (e) => { if (e.target.name === 'reason') clearError('reason'); });
  form.addEventListener('input', (e) => { if (['name', 'phone', 'email'].includes(e.target.name)) clearError(e.target.name); });
  $$('[data-next]', form).forEach((b) => b.addEventListener('click', () => { if (validate(state.step)) goTo(state.step + 1); }));
  $$('[data-back]', form).forEach((b) => b.addEventListener('click', () => goTo(state.step - 1)));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(3)) return;
    const first = form.name.value.trim().split(' ')[0];
    steps.forEach((s) => s.classList.remove('is-active'));
    progress.forEach((p) => { p.classList.remove('is-active'); p.classList.add('is-done'); });
    const done = $('[data-done]');
    $('[data-done-text]').textContent =
      `Thanks, ${first}! We've pencilled you in for ${fmtDate(state.date, { weekday: 'long', month: 'long', day: 'numeric' })} at ${fmtTime(state.slot)}. ` +
      `We'll text ${form.phone.value.trim()} within one business hour to confirm.`;
    done.hidden = false;
    done.focus();
  });

  $('[data-reset]').addEventListener('click', () => {
    form.reset();
    Object.assign(state, { date: null, slot: null });
    $('[data-done]').hidden = true;
    goTo(1);
  });

  // Service "Book" links preselect the reason
  $$('[data-reason]').forEach((link) => {
    link.addEventListener('click', () => {
      const input = $(`input[name="reason"][value="${link.dataset.reason}"]`, form);
      if (input && $('[data-done]').hidden) { input.checked = true; clearError('reason'); goTo(1); }
    });
  });

  // ── Init ──
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
  updateStatus();
  setInterval(updateStatus, 60_000);
})();
