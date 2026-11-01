export interface NavLink {
  label: string
  href: string
}

export interface Service {
  title: string
  description: string
  bullets: string[]
}

export interface Principle {
  title: string
  description: string
}

export interface ProcessStep {
  title: string
  description: string
  tint: string
}

export interface FaqItem {
  question: string
  answer: string
}

export const brand: { name: string; tagline: string; email: string; domain: string } = {
  name: 'anorwe',
  tagline: 'Clarity first. Then momentum.',
  email: 'hello@anorwe.com',
  domain: 'anorwe.com',
}

export const nav: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
]

export const navCta = "Let's talk"

export const hero: {
  eyebrow: string
  title: string
  titleAccent: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
  scrollHint: string
} = {
  eyebrow: 'Builders that code',
  title: 'Clarity first.',
  titleAccent: 'Then momentum.',
  subtitle:
    'Senior engineers with mission-critical experience. We design, build and run the software your business depends on.',
  primaryCta: 'Start a project',
  secondaryCta: 'How we work',
  scrollHint: 'Scroll',
}

export const servicesIntro: { eyebrow: string; heading: string; subheading: string } = {
  eyebrow: 'What we do',
  heading: 'Software that holds up when it matters.',
  subheading:
    'From the first version to years in production, built by people who have kept critical systems running.',
}

export const services: Service[] = [
  {
    title: 'Web & Product Development',
    description:
      'Web apps, customer portals and internal tools that are fast, accessible and easy to change.',
    bullets: [
      'React and TypeScript front ends',
      'Design systems and accessible UI',
      'Product discovery and prototyping',
    ],
  },
  {
    title: 'Backend & Integrations',
    description:
      'Services and APIs that keep data correct and flowing between the systems you already run.',
    bullets: [
      'API design and third-party integrations',
      'Payments, identity and data pipelines',
      'Transactional and event-driven systems',
    ],
  },
  {
    title: 'Cloud & DevOps',
    description:
      'Infrastructure that deploys safely, scales predictably and tells you when something is wrong.',
    bullets: [
      'CI/CD and infrastructure as code',
      'Observability, alerting and on-call readiness',
      'Cost and performance tuning',
    ],
  },
  {
    title: 'Modernization',
    description:
      'Move off legacy systems without stopping the business that runs on them.',
    bullets: [
      'Incremental migration plans',
      'Breaking up monoliths where it pays off',
      'Data migrations without downtime',
    ],
  },
  {
    title: 'AI & Automation',
    description:
      'AI features where they earn their place, held to the same standards as the rest of your stack.',
    bullets: [
      'Assistants, search and document workflows',
      'Automating manual processes',
      'Evaluation and monitoring in production',
    ],
  },
  {
    title: 'Technical Advisory',
    description:
      'An experienced second opinion on architecture, teams and roadmaps before you commit.',
    bullets: [
      'Architecture and code reviews',
      'Technical due diligence',
      'Fractional CTO and team setup',
    ],
  },
]

export const about: {
  eyebrow: string
  heading: string
  body: string
  principles: Principle[]
} = {
  eyebrow: 'Who we are',
  heading: 'Engineers from mission-critical systems.',
  body:
    "We've spent our careers on software where downtime costs money and mistakes reach real customers. We bring that discipline to every project, whatever its size.",
  principles: [
    {
      title: 'Senior only',
      description: 'The people you meet are the people who build. No hand-offs to junior teams.',
    },
    {
      title: 'Built to run',
      description: 'Testing, monitoring and documentation are part of the work, not an extra.',
    },
    {
      title: 'Straight talk',
      description: "We tell you what's worth building, what isn't, and what it will cost.",
    },
  ],
}

export const story: {
  eyebrow: string
  heading: string
  notes: { term: string; text: string }[]
  body: string
} = {
  eyebrow: 'The name',
  heading: 'One who carries the sun.',
  notes: [
    { term: 'Anor', text: 'is "sun" in Sindarin, the light that rises in the east.' },
    { term: '-wë', text: 'is an Elvish name-ending. It reads as a person, not a thing.' },
  ],
  body:
    'For us that means bringing clarity to complex projects first, then the momentum to ship them.',
}

export const processIntro: { eyebrow: string; heading: string; subheading: string } = {
  eyebrow: 'How we work',
  heading: 'From dawn to daylight.',
  subheading: 'The process is one sunrise, from first light to full day.',
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Dawn',
    description:
      'First light. We map the problem, the constraints and what success looks like.',
    tint: 'rgba(29,26,42,0.6)',
  },
  {
    title: 'Rise',
    description: 'A working first version in weeks, tested with real users and real data.',
    tint: 'rgba(122,58,42,0.55)',
  },
  {
    title: 'Zenith',
    description:
      'Full strength. Hardened, monitored and load-tested so it holds up in production.',
    tint: 'rgba(181,98,47,0.5)',
  },
  {
    title: 'Daylight',
    description: 'Your team runs it in the open. We hand off cleanly and stay close.',
    tint: 'rgba(74,117,147,0.5)',
  },
]

export const faqIntro: { eyebrow: string; heading: string } = {
  eyebrow: 'FAQ',
  heading: 'Questions, answered plainly.',
}

export const faqs: FaqItem[] = [
  {
    question: 'How do you typically engage?',
    answer:
      'Most clients start with a short, fixed-scope discovery phase, then move into a build engagement. We work as an embedded senior team alongside your people, not a black box.',
  },
  {
    question: 'How fast can we see something working?',
    answer:
      'A working first version usually lands within a few weeks. How long it takes to reach production depends on scope, integrations and how much existing software we build on.',
  },
  {
    question: 'How do you price projects?',
    answer:
      'We scope and price per engagement, not by the hour. You get a clear deliverable, timeline and budget upfront so there are no surprises.',
  },
  {
    question: 'Can you work with our existing systems and team?',
    answer:
      "Yes, that's most of our work. We take over or extend existing codebases, integrate with what you run today, and leave your team able to own it.",
  },
  {
    question: 'How do you handle security and compliance?',
    answer:
      'We work inside your cloud and security boundaries, follow your compliance requirements, and build in access control and audit logging from day one.',
  },
  {
    question: 'Do you build AI products?',
    answer:
      'When AI solves a real problem, yes. We build it into your product with the same testing, monitoring and cost control as everything else.',
  },
]

export const contact: {
  eyebrow: string
  heading: string
  headingAccent: string
  subheading: string
  buttonLabel: string
  sentLabel: string
} = {
  eyebrow: 'Contact',
  heading: "Let's build something",
  headingAccent: 'that lasts.',
  subheading:
    "Tell us what you're trying to build. We'll get back to you within one business day.",
  buttonLabel: 'Send message',
  sentLabel: "Sent. We'll be in touch.",
}
