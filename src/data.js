// ─────────────────────────────────────────────────────────────
//  Edit everything about your portfolio here.
// ─────────────────────────────────────────────────────────────

export const profile = {
  firstName: 'Gurlagan',
  lastName: 'Bhullar',
  role: 'Creative Developer & Designer',
  location: 'Toronto, Canada',
  timezone: 'America/Toronto',
  email: 'hello@gurlagan.dev',
  available: true,
  tagline:
    'I design and engineer digital experiences that feel effortless — fast, precise, and quietly unforgettable.',
  statement:
    'I partner with founders and ambitious teams to turn complex ideas into products people love to use. Strategy, interface, motion and code — handled end to end, with an obsessive eye for the details most people never notice.',
  socials: [
    { label: 'GitHub', url: 'https://github.com/' },
    { label: 'LinkedIn', url: 'https://linkedin.com/' },
    { label: 'X / Twitter', url: 'https://x.com/' },
    { label: 'Dribbble', url: 'https://dribbble.com/' },
  ],
};

export const stats = [
  { value: 6, suffix: '+', label: 'Years of experience' },
  { value: 18, suffix: '', label: 'Happy clients' },
  { value: 99, suffix: '', label: 'Lighthouse score' },
];

// `colors` drive the generated preview artwork — no images required.
// Add `image: '/your-image.jpg'` (placed in /public) to use a real screenshot instead.
export const projects = [
  {
    title: 'Ente Plumbing',
    category: 'Business Website',
    year: '2026',
    description: 'A fast, mobile-friendly website for a local plumbing company.',
    colors: ['#3d6bff', '#060b24'],
    url: '#',
  },
  {
    title: 'Spark Clean',
    category: 'Business Website',
    year: '2026',
    description: 'A clean, modern website for a professional cleaning service.',
    colors: ['#ff4d1c', '#2a0a02'],
    url: '#',
  },
];

export const services = [
  {
    title: 'Web Development',
    description:
      'Blazing-fast, accessible websites and web apps built with modern frameworks and meticulous attention to performance.',
    items: ['JavaScript / TypeScript', 'React & Next.js', 'Node.js APIs', 'Headless CMS'],
  },
  {
    title: 'Interface Design',
    description:
      'Interfaces that are clear, considered and distinctive — from first wireframe to a production-ready design system.',
    items: ['Product design', 'Design systems', 'Prototyping', 'UX audits'],
  },
  {
    title: 'Motion & WebGL',
    description:
      'Purposeful animation and real-time 3D that give a brand presence and make every interaction feel alive.',
    items: ['GSAP', 'Three.js / WebGL', 'Shaders', 'Micro-interactions'],
  },
  {
    title: 'Strategy',
    description:
      'Clarity before pixels. Positioning, information architecture and roadmaps that align the product with the business.',
    items: ['Discovery workshops', 'Content strategy', 'Analytics', 'Technical consulting'],
  },
];

export const experience = [
  { role: 'Independent Creative Developer', company: 'Self-employed', period: '2023 — Now' },
  { role: 'Senior Frontend Engineer', company: 'Northwind Labs', period: '2021 — 2023' },
  { role: 'Frontend Developer', company: 'Studio Parallel', period: '2019 — 2021' },
  { role: 'Web Design Intern', company: 'Brightline Agency', period: '2018 — 2019' },
];
