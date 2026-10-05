export const basePath = '/sample/UndercoverBedandSpas'
export const official = 'https://undercoverbedandspas.com'
const media = `${official}/wp-content/uploads/2026/04/`
export const imagery = {
  hero: `${media}1.-HotSpring-Limelight-2018-Flair-AlpineWhite-Espresso-Lifestyle-Group-001.jpg`,
  night: `${media}hot-spring-limelight-prism-couples-in-hot-tub-nighttime-1.jpg`,
  spa: `${media}3.-HotSpringLifestyle_CMYK-scaled.jpg`,
  sauna: `${media}1-10.jpg`,
  saunaInside: `${media}5-1.jpg`,
  bedroom: `${media}3-_4__1.png`,
  team: `${media}Team-Photo-1-scaled.jpg`,
  service: `${media}1M7A7873-scaled.jpg`,
  cold: `${media}HSS-2024-ColdPlunge-Vigor-Lifestyle-2994-blue-scaled.jpg`,
  tylo: `${media}TYLO-2025-Reflection-00293-PDP-Hero-1440x996-1.jpg`,
  sealy: `${media}ilr_2-4.png`,
  stearns: `${official}/wp-content/uploads/2026/05/Stearns_Foster-Estate-Soft-EPT-IC2_Hero_1200x1200.webp`,
}

export type Category = 'spas' | 'saunas' | 'mattresses'
export type Collection = {
  id: string; title: string; category: Category; eyebrow: string; description: string;
  source: string; image: keyof typeof imagery; options: string[];
}
export const categories: Record<Category, { title: string; phrase: string; description: string; image: keyof typeof imagery }> = {
  spas: { title: 'Spas & cold plunge', phrase: 'A little escape.\nRight at home.', description: 'Discover Hot Spring® spas, cold plunge, and the little things that make your daily soak your own.', image: 'hero' },
  saunas: { title: 'Saunas', phrase: 'Make room\nfor a slower pace.', description: 'Explore indoor and outdoor saunas from Tylo and Leisurecraft, with a style for your space.', image: 'sauna' },
  mattresses: { title: 'Mattresses & sleep', phrase: 'Good days start\nwith good nights.', description: 'Find your comfort with Tempur-Pedic®, Stearns & Foster®, Sealy®, adjustable bases, and pillows.', image: 'bedroom' },
}
export const collections: Collection[] = [
  { id: 'highlife', title: 'Highlife®', category: 'spas', eyebrow: 'Hot Spring® collection', description: 'Explore the Highlife collection and find a spa that fits the way you unwind.', source: '/highlife-spa-collection/', image: 'spa', options: ['Grandee®', 'Envoy®', 'Aria®', 'Vanguard®', 'Sovereign®'] },
  { id: 'limelight', title: 'Limelight®', category: 'spas', eyebrow: 'Hot Spring® collection', description: 'Bring your favorite people together. Discover the Limelight spa collection.', source: '/limelight-spa-collection/', image: 'hero', options: ['Prism®', 'Pulse®', 'Flash®', 'Flair®', 'Beam®'] },
  { id: 'hot-spot', title: 'Hot Spot®', category: 'spas', eyebrow: 'Hot Spring® collection', description: 'Make a soak part of your everyday routine with the Hot Spot collection.', source: '/hot-spot-spa-collection/', image: 'night', options: ['Rhythm®', 'Relay®', 'Pace®', 'Stride®', 'SX'] },
  { id: 'cold-plunge', title: 'Cold plunge', category: 'spas', eyebrow: 'A different kind of reset', description: 'Discover the Vigor cold plunge and explore a new addition to your home wellness space.', source: '/cold-plunge/', image: 'cold', options: ['Vigor cold plunge'] },
  { id: 'refurbished', title: 'Refurbished spas', category: 'spas', eyebrow: 'Ask the local team', description: 'Explore refurbished options and trade-in questions with the showroom team. Current inventory is confirmed by the business.', source: '/refurbished-spas/', image: 'service', options: ['Refurbished spa inquiry', 'Spa trade-in inquiry'] },
  { id: 'spa-accessories', title: 'Spa essentials', category: 'spas', eyebrow: 'Finish your space', description: 'Discover accessories that complement your spa, from easy access to connected controls.', source: '/spa-necessaries/', image: 'night', options: ['Cover lifters', 'Spa steps', 'Spa towels', 'Smart spa app', 'Music options'] },
  { id: 'tylo', title: 'Tylo', category: 'saunas', eyebrow: 'Your own warm retreat', description: 'Browse traditional, infrared, hybrid, and outdoor sauna styles, plus heaters and accessories.', source: '/tylo-saunas/', image: 'tylo', options: ['Traditional saunas', 'Infrared saunas', 'Hybrid saunas', 'Outdoor saunas', 'Tylo heaters', 'Tylo accessories'] },
  { id: 'leisurecraft', title: 'Leisurecraft', category: 'saunas', eyebrow: 'Natural warmth', description: 'Explore the Dundalk and Canadian Timber collections, with heaters and accessories to complete your sauna.', source: '/leisurecraft-saunas/', image: 'sauna', options: ['Dundalk collection', 'Canadian Timber collection', 'Leisurecraft heaters', 'Leisurecraft accessories'] },
  { id: 'tempur-pedic', title: 'Tempur-Pedic®', category: 'mattresses', eyebrow: 'Find your comfort', description: 'Explore the Tempur-Pedic mattress range with guidance from the local sleep team.', source: '/tempur-pedic-mattress/', image: 'bedroom', options: ['Tempur-Pedic mattresses'] },
  { id: 'stearns-foster', title: 'Stearns & Foster®', category: 'mattresses', eyebrow: 'A thoughtful night’s rest', description: 'Discover the Stearns & Foster collection and talk through comfort choices in the showroom.', source: '/stearns-and-foster-mattress/', image: 'stearns', options: ['Stearns & Foster mattresses'] },
  { id: 'sealy', title: 'Sealy®', category: 'mattresses', eyebrow: 'Comfort for every day', description: 'Explore Sealy mattresses and find a feel that suits your sleep routine.', source: '/sealy-mattress/', image: 'sealy', options: ['Sealy mattresses'] },
  { id: 'bases-pillows', title: 'Bases & pillows', category: 'mattresses', eyebrow: 'The finishing touches', description: 'Explore adjustable bases and pillows to complement your mattress.', source: '/adjustable-bases/', image: 'bedroom', options: ['Adjustable bases', 'Pillows'] },
]

export const services = [
  ['Repairs & diagnostics', 'In-shop and on-site support for spas, saunas, cold plunges, and mattresses.'],
  ['Spa Valet maintenance', 'Monthly professional spa maintenance from the local service team.'],
  ['Leak inspections', 'Troubleshooting and leak diagnostics to help identify the next step.'],
  ['Spa moves & removals', 'Help with spa relocation, removal, transport, and reinstallation.'],
  ['Out-of-town service', 'Service across Wyoming and Northern Colorado. Additional fees may apply.'],
  ['Warranty guidance', 'Get help understanding warranty coverage for your product.'],
]

export const samplePaths = ['', 'spas', 'saunas', 'mattresses', 'services', 'about', 'visit', 'contact', 'brochure', 'guides', 'warranties', 'not-found', ...collections.map(c => `collections/${c.id}`)]
export function sampleTitle(path: string) {
  const segment = path.slice(basePath.length).replace(/^\/|\/$/g, '')
  const collection = collections.find(c => segment === `collections/${c.id}`)
  const title = collection?.title ?? (segment in categories ? categories[segment as Category].title : ({ services: 'Services & repairs', about: 'Our story', visit: 'Visit the showroom', contact: 'Let’s talk', brochure: 'Explore brochures', guides: 'Blog & guides', warranties: 'Warranty guidance', 'not-found': 'Page not found' }[segment] ?? 'Your everyday escape'))
  return `${title} | Undercover Bed & Spas — Design Demo`
}
