import './style.css';
import { profile, stats, projects, services, process } from './data.js';

const pad = (n) => String(n).padStart(2, '0');
const arrow = `<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const fullName = `${profile.firstName} ${profile.lastName}`;
const year = new Date().getFullYear();

const visual = (p) => `
  <div class="visual" style="--c1:${p.colors[0]};--c2:${p.colors[1]}">
    ${p.screenshot ? `
      <div class="mock mock-shot" aria-hidden="true">
        <div class="mock-bar"><i></i><i></i><i></i><span>${p.site.domain}</span></div>
        <img src="${p.screenshot}" alt="" loading="lazy" />
      </div>` : p.image ? `<img src="${p.image}" alt="${p.title} website" loading="lazy" />` : `
      <div class="mock" aria-hidden="true">
        <div class="mock-bar"><i></i><i></i><i></i><span>${p.site.domain}</span></div>
        <div class="mock-page">
          <div class="mock-nav"><b>${p.title}</b><span></span><span></span><span></span><em>${p.site.cta}</em></div>
          <div class="mock-hero">
            <small>${p.site.kicker}</small>
            <strong>${p.site.headline}</strong>
            <div class="mock-btns"><em>${p.site.cta}</em><u>Learn more</u></div>
          </div>
          <div class="mock-cards"><span></span><span></span><span></span></div>
        </div>
      </div>`}
  </div>`;

document.querySelector('#app').innerHTML = `
  <header class="nav">
    <a href="#top" class="nav-logo">${profile.firstName[0]}${profile.lastName[0]}<sup>©</sup></a>
    <nav class="nav-links" aria-label="Primary">
      <a href="#work">Work</a>
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
    <a href="mailto:${profile.email}" class="nav-cta">Let's talk</a>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
  </header>

  <div class="mobile-menu" aria-hidden="true">
    <a href="#work">Work</a>
    <a href="#services">Services</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </div>

  <main id="top">
    <section class="hero">
      <div class="hero-meta container">
        <span>Portfolio ©${year}</span>
        <span>Based in ${profile.location}</span>
        ${profile.available ? `<span class="status"><i></i>Available for new projects</span>` : ''}
      </div>
      <h1 class="hero-title container">
        <span class="line"><span class="line-inner">${profile.firstName}</span></span>
        <span class="line line--serif"><span class="line-inner">${profile.lastName}</span></span>
      </h1>
      <div class="hero-bottom container">
        <p class="hero-role"><span class="eyebrow">${profile.role}</span>${profile.tagline}</p>
        <a href="#work" class="hero-scroll" aria-label="Scroll to work">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m0 0-6-6m6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        </a>
      </div>
    </section>

    <section class="about container" id="about">
      <div class="section-label reveal"><span>(01)</span> About</div>
      <p class="statement reveal">${profile.statement}</p>
      <div class="stats">
        ${stats.map((s) => `
          <div class="stat reveal">
            <div class="stat-value">${s.value}${s.suffix}</div>
            <div class="stat-label">${s.label}</div>
          </div>`).join('')}
      </div>
    </section>

    <section class="work container" id="work">
      <div class="section-head">
        <div class="section-label reveal"><span>(02)</span> Selected Work</div>
        <h2 class="section-title reveal">Recent <em>projects</em><sup>${pad(projects.length)}</sup></h2>
      </div>
      <div class="work-grid">
        ${projects.map((p, i) => `
          <a href="${p.url}" class="work-card reveal"${p.url.startsWith('/') ? ' target="_blank" rel="noopener"' : ''} style="transition-delay:${(i % 2) * 100}ms">
            ${visual(p)}
            <div class="work-info">
              <h3 class="work-title">${p.title} ${arrow}</h3>
              <span class="work-year">${p.category} · ${p.year}</span>
            </div>
            <p class="work-desc">${p.description}</p>
            <ul class="work-tags">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
          </a>`).join('')}
      </div>
    </section>

    <section class="services" id="services">
      <div class="container">
        <div class="section-label reveal"><span>(03)</span> Services</div>
        <h2 class="section-title reveal">What I can <em>do</em> for you</h2>
        <div class="services-grid">
          ${services.map((s, i) => `
            <article class="service-card reveal">
              <span class="service-num">${pad(i + 1)}</span>
              <h3>${s.title}</h3>
              <p>${s.description}</p>
              <ul>${s.items.map((it) => `<li>${it}</li>`).join('')}</ul>
            </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="process container">
      <div class="section-head">
        <div class="section-label reveal"><span>(04)</span> Process</div>
        <h2 class="section-title reveal">How we'll <em>work</em> together</h2>
      </div>
      <ol class="process-grid">
        ${process.map((step, i) => `
          <li class="process-step reveal" style="transition-delay:${i * 80}ms">
            <span class="process-num">${pad(i + 1)}</span>
            <h3>${step.title}</h3>
            <p>${step.description}</p>
          </li>`).join('')}
      </ol>
    </section>
  </main>

  <footer class="contact container" id="contact">
    <div class="section-label reveal"><span>(05)</span> Contact</div>
    <h2 class="contact-title reveal">Have a project<br />in <em>mind?</em></h2>
    <div class="contact-actions reveal">
      <a href="mailto:${profile.email}" class="contact-cta">Get in touch ${arrow}</a>
      <button class="contact-email" title="Click to copy">${profile.email}</button>
    </div>
    <p class="contact-note reveal">Usually replies within 24 hours.</p>
    <div class="footer-bottom">
      <div class="footer-col">
        <span class="footer-label">Local time</span>
        <span class="clock">--:--</span>
      </div>
      ${profile.socials.length ? `
      <div class="footer-col">
        <span class="footer-label">Socials</span>
        <div class="socials">
          ${profile.socials.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('')}
        </div>
      </div>` : ''}
      <div class="footer-col">
        <span class="footer-label">© ${year}</span>
        <span>${fullName}</span>
      </div>
      <a href="#top" class="back-top" aria-label="Back to top">↑</a>
    </div>
  </footer>
`;

// ── Mobile menu ───────────────────────────────────────────────

const mobileMenu = document.querySelector('.mobile-menu');
const toggle = document.querySelector('.nav-toggle');
const setMenu = (open) => {
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
};
toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

// ── Nav background once scrolled ──────────────────────────────

const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Fade-in on scroll ─────────────────────────────────────────

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }),
  { rootMargin: '0px 0px -10% 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// ── Footer: clock + copy email ────────────────────────────────

const clock = document.querySelector('.clock');
const tick = () => {
  clock.textContent = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: profile.timezone,
    timeZoneName: 'short',
  }).format(new Date());
};
tick();
setInterval(tick, 30000);

const emailBtn = document.querySelector('.contact-email');
emailBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(profile.email);
    emailBtn.textContent = 'Copied to clipboard ✓';
  } catch {
    window.location.href = `mailto:${profile.email}`;
  }
  setTimeout(() => (emailBtn.textContent = profile.email), 2000);
});
