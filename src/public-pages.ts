export const publicPages = {
  '/marketing': {
    page: 'marketing',
    title: 'Small Business Marketing in Laramie | Wolin Studio',
    description: 'Explore small-business marketing with Wolin Studio: social content, websites, and custom-quoted SEO. Based in Laramie, serving Cheyenne and Fort Collins.',
  },
  '/': {
    page: 'home',
    title: 'Wolin Studio | Social Media & Web Design in Laramie',
    description: 'Wolin Studio is based in Laramie, providing social media management and web design for businesses in Laramie, Cheyenne, and Fort Collins.',
  },
  '/offers': {
    page: 'offers',
    title: 'Social Media & Website Packages | Wolin Studio',
    description: 'Compare Wolin Studio’s social media programs, monthly plans, and one-page website with ongoing care. View current pricing, scope, and custom quote options.',
  },
  '/social-media-management': {
    page: 'social-media-management',
    title: 'Social Media Management in Laramie | Wolin Studio',
    description: 'Content planning, photo and video production, editing, and publishing for Instagram, Facebook, and TikTok. Based in Laramie, with travel to nearby businesses.',
  },
  '/web-design': {
    page: 'web-design',
    title: 'Web Design in Laramie | Wolin Studio',
    description: 'Custom, mobile-friendly web design for Laramie businesses, with clear contact options and ongoing care. Learn about one-page websites and custom project scope.',
  },
  '/service-areas': {
    page: 'service-areas',
    title: 'Laramie, Cheyenne & Fort Collins | Wolin Studio',
    description: 'Wolin Studio is based in Laramie and travels to customers in Cheyenne and Fort Collins. Learn how on-site content production and remote website work fit together.',
  },
} as const

export type PublicPath = keyof typeof publicPages
export type PublicPage = typeof publicPages[PublicPath]['page']
export type ServicePage = Exclude<PublicPage, 'home' | 'offers'>

export function isPublicPath(path: string): path is PublicPath {
  return Object.hasOwn(publicPages, path)
}

const areaServed = ['Laramie, Wyoming', 'Cheyenne, Wyoming', 'Fort Collins, Colorado']
  .map(name => ({ '@type': 'City', name }))

export function structuredData(path: PublicPath) {
  const organization = {
    '@type': 'Organization',
    '@id': 'https://wolin.dev/#organization',
    name: 'Wolin Studio',
    url: 'https://wolin.dev/',
    description: 'Laramie-based studio providing social media management and web design, with travel to customers in Cheyenne and Fort Collins.',
    areaServed,
  }
  const services = [
    { path: '/marketing', name: 'Small business marketing', description: 'Social content production and publishing, website design, and separately quoted SEO, Google Business Profile, video, and photography services for small businesses.' },
    { path: '/social-media-management', name: 'Social media management', description: 'Content strategy, photo and video production, editing, captions, scheduling, and publishing for Instagram, Facebook, and TikTok.' },
    { path: '/web-design', name: 'Web design', description: 'Custom mobile-friendly websites with contact options, basic search titles and descriptions, and ongoing website care. Additional pages and SEO work are custom quoted.' },
  ].filter(service => path === '/' || path === '/offers' || path === '/service-areas' || path === service.path)
    .map(service => ({
      '@type': 'Service',
      '@id': `https://wolin.dev${service.path}#service`,
      name: service.name,
      serviceType: service.name,
      description: service.description,
      url: `https://wolin.dev${service.path}`,
      provider: { '@id': organization['@id'] },
      areaServed,
    }))
  return { '@context': 'https://schema.org', '@graph': [organization, ...services] }
}
