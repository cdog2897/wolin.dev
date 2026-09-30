import { formatOfferPrice, socialOffers } from '../shared/social-offers'

export const monthlySocialPlans = socialOffers.filter(offer => offer.cadence === 'monthly')
  .map(offer => ({ ...offer, price: formatOfferPrice(offer.amount) }))

export const socialLaunch = socialOffers[0]
export const socialLaunchPrice = formatOfferPrice(socialLaunch.amount)

export const offerOptions = [
  { id: socialLaunch.id, label: socialLaunch.title },
  ...monthlySocialPlans.map(plan => ({ id: plan.id, label: `${plan.title} — ${plan.postsPerPlatform * 3} Posts / ${plan.price} per month` })),
  { id: 'website', label: 'Custom Website + Care' },
  { id: 'custom', label: 'Other services — custom quote' },
]
