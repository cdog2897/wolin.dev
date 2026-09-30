export const socialOffers = [
  { id: 'social-90', templateId: 'local-virality-90-day', title: '90-Day Hands-Free Local Virality', amount: 349_900, cadence: 'one_time', postsPerPlatform: 20 },
  { id: 'social-20', templateId: 'social-momentum-monthly', title: 'Social Momentum', amount: 150_000, cadence: 'monthly', postsPerPlatform: 20 },
  { id: 'social-16', templateId: 'social-growth-monthly', title: 'Social Growth', amount: 120_000, cadence: 'monthly', postsPerPlatform: 16 },
  { id: 'social-12', templateId: 'social-presence-monthly', title: 'Social Presence', amount: 80_000, cadence: 'monthly', postsPerPlatform: 12 },
] as const

export const formatOfferPrice = (amount: number) => `$${(amount / 100).toLocaleString('en-US')}`
