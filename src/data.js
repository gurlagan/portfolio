// ─────────────────────────────────────────────────────────────
//  Edit everything about your portfolio here.
// ─────────────────────────────────────────────────────────────

export const profile = {
  firstName: 'Garry',
  lastName: 'Bhullar',
  role: 'Freelance Web Developer',
  location: 'Edmonton, Canada',
  timezone: 'America/Edmonton',
  email: 'gurlaganbhullar@gmail.com',
  available: true,
  tagline:
    'I design and build fast, modern websites that help businesses look professional and win more customers.',
  statement:
    'I help small businesses and growing brands stand out online. From the first sketch to launch day, I handle design, development and everything in between — so you get a site that loads fast, looks sharp on every screen and turns visitors into customers.',
  // Add links like { label: 'GitHub', url: 'https://github.com/you' } to show a Socials column
  socials: [],
};

export const stats = [
  { value: 3, suffix: '+', label: 'Years as a freelance web developer' },
  { value: 18, suffix: '', label: 'Happy clients' },
];

// Each project renders a mini browser mockup from `site` — no images required.
// Add `image: '/your-image.jpg'` (placed in /public) to show a real screenshot instead.
export const projects = [
  {
    title: 'Ente Plumbing',
    category: 'Business Website',
    year: '2026',
    description: 'A fast, mobile-friendly website for a local plumbing company, built to turn visitors into booked jobs.',
    tags: ['Design', 'Development', 'SEO'],
    colors: ['#3d6bff', '#0a1440'],
    site: { domain: 'enteplumbing.com', kicker: '24/7 Emergency Service', headline: 'Plumbing done right, the first time.', cta: 'Get a quote' },
    url: '#',
  },
  {
    title: 'Spark Clean',
    category: 'Business Website',
    year: '2026',
    description: 'A clean, modern website for a professional cleaning service with online booking.',
    tags: ['Design', 'Development', 'Booking'],
    colors: ['#ff4d1c', '#3a0d02'],
    site: { domain: 'sparkclean.ca', kicker: 'Homes & Offices', headline: 'A spotless space, without the stress.', cta: 'Book a clean' },
    url: '#',
  },
  {
    title: 'Maple Dental',
    category: 'Healthcare Website',
    year: '2025',
    description: 'A calm, trustworthy site for a family dental clinic, with appointment requests and service pages.',
    tags: ['Design', 'Development', 'Forms'],
    colors: ['#2fbf9b', '#06302a'],
    site: { domain: 'mapledental.ca', kicker: 'Family Dentistry', headline: 'Healthy smiles for the whole family.', cta: 'Book a visit' },
    url: '#',
  },
  {
    title: 'Iron Peak Fitness',
    category: 'Gym Website',
    year: '2025',
    description: 'A bold, high-energy website for a local gym featuring class schedules and membership plans.',
    tags: ['Branding', 'Development', 'CMS'],
    colors: ['#d4ff3f', '#1c2404'],
    site: { domain: 'ironpeakfit.com', kicker: 'Train Harder', headline: 'Stronger every single week.', cta: 'Join now' },
    url: '#',
  },
];

export const services = [
  {
    title: 'Business Websites',
    description: 'Custom, professional websites that build trust and make it easy for customers to contact or book you.',
    items: ['Custom design', 'Mobile-first', 'Contact & booking'],
  },
  {
    title: 'Landing Pages',
    description: 'Focused, high-converting pages for launches, ads and promotions — designed to get people to act.',
    items: ['Copy layout', 'Lead forms', 'A/B ready'],
  },
  {
    title: 'SEO & Speed',
    description: 'Lightning-fast load times and solid on-page SEO, so customers can actually find you on Google.',
    items: ['Core Web Vitals', 'Google Business', 'Analytics'],
  },
  {
    title: 'Care & Updates',
    description: 'Ongoing support after launch — content updates, fixes and improvements whenever you need them.',
    items: ['Hosting setup', 'Monthly updates', 'Priority support'],
  },
];

export const process = [
  { title: 'Discover', description: 'We talk about your business, your customers and what the website needs to achieve.' },
  { title: 'Design', description: 'I create a clean, on-brand design and refine it with your feedback.' },
  { title: 'Build', description: 'Your site is developed to be fast, responsive and easy to update.' },
  { title: 'Launch', description: 'We go live, set up analytics and make sure everything runs smoothly.' },
];
