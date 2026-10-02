import { ArrowIcon } from './DecorativeIcon'
import type { ServicePage } from './public-pages'
import './ServicePages.css'

const content = {
  marketing: {
    eyebrow: 'Practical work for your next step',
    title: 'Small-business marketing in Laramie.',
    intro: 'Wolin Studio helps small businesses explain what they do through social content, websites, and separately scoped local search work. Based in Laramie, we also serve Cheyenne and Fort Collins, travelling to customers for agreed on-site production. Start with the part of your marketing that needs attention, then choose work that fits your business.',
    sections: [
      { title: 'Start with the customer’s question', text: 'Before choosing a package, consider what someone needs to know before contacting you. Can they see what you offer, understand who it is for, and find a clear next step? If those answers are missing, more content alone may not solve the problem. Bring your current website and social links, the services you want to explain, and the questions you hear most often. That gives us a practical starting point for discussing scope.' },
      { title: 'Show your work through social content', text: 'If people need to see your products, process, or team to understand your business, social content can help explain them. The social packages cover planning, scripting, a professional photo/video shoot, editing, captions, hashtags, scheduling, and posting across Instagram, Facebook, and TikTok. Monthly analytics reports are included. Choose a 90-day program or a monthly plan using the current offers page; the package determines the publishing volume and production schedule. DMs and community management require a separate scope and quote.' },
      { title: 'Give interested visitors a useful website', text: 'If a visitor finds you through a post or recommendation, your website should make it easy to understand your services and contact you. Custom Website + Care starts with one mobile-friendly page, your business details, a contact form, existing booking links, and basic search titles and descriptions. You supply copy and photos for light polishing. Additional pages, features, ecommerce, and redesigns are quoted separately. Compare the full scope and checkout-based care billing terms on the offers page before choosing the package.' },
      { title: 'Scope local search work around real gaps', text: 'If your business information is incomplete or inconsistent, or your website does not clearly describe your services, ask about a custom quote for SEO or Google Business Profile work. Available services include profile optimization and management, listing cleanup, website and technical SEO, and service or location content. These are separately scoped services, not automatic inclusions in a social or website package. Share the profiles and pages you already have so we can discuss which work is relevant before setting a scope.' },
      { title: 'Need a specific video or photo project?', text: 'You may need footage for a service demonstration, an edited video from material you already have, or photos for your website rather than an ongoing social plan. Videography, video editing, photography, and additional shoots are available by custom quote. Tell us how the material will be used, what already exists, the location, and the deadline. Deliverables and production arrangements are agreed before work begins.' },
      { title: 'Choose a focused first project', text: 'You do not need to start with every service. A business with useful photos but an unclear website may begin with web design. A business with a clear website but little material showing its work may focus on social production. If the immediate issue is inaccurate business information, a profile or listing project may be more relevant. Discuss your priorities, available materials, and budget so the proposed work has a clear purpose and defined boundaries.' },
    ],
    asideTitle: 'Bring these to the conversation',
    checklist: ['Your website, social account links, and business profile if you have one.', 'The service or product you want people to understand, and the action you want them to take.', 'Your location, timing, available photos or footage, and a budget range for the work.'],
    closing: 'Marketing support is coordinated from Laramie, with travel to customers in Cheyenne and Fort Collins for agreed on-site work. Planning, editing, and website feedback can happen remotely. We do not operate separate offices in Cheyenne or Fort Collins. Share your location and project needs so logistics and scope can be confirmed before you commit.',
    offerLink: '/offers',
    offerLabel: 'Compare packages and custom services',
  },
  'social-media-management': {
    eyebrow: 'Content with a purpose',
    title: 'Social media management in Laramie.',
    intro: 'Show people what your business does before they walk through the door. Wolin Studio helps turn your everyday work into content for Instagram, Facebook, and TikTok, with planning, production, and publishing handled together.',
    sections: [
      { title: 'Start with what customers need to know', text: 'A useful content plan answers real questions: what you offer, how it works, who it is for, and how to take the next step. Demonstrations, introductions, common questions, and a look behind the scenes give people a clearer picture of your business than a stream of promotions alone.' },
      { title: 'From a shoot to a publishing plan', text: 'The social packages include content strategy, a professional photo/video shoot, scripting, editing, captions, hashtags, scheduling, and posting. We discuss what needs to be captured and how the material will be used. The shoot schedule and any additional production are confirmed with your package before work begins.' },
      { title: 'Choose a pace you can support', text: 'A 90-day program and monthly social plans are available. Compare the current post counts and platform breakdown on the offers page. Before starting, share your existing accounts, upcoming promotions, brand materials, and any topics or customer images that need approval. Account access and onboarding need to be in place before production and publishing can begin.' },
      { title: 'Review the content, then keep learning', text: 'Monthly analytics reports are included in the social packages. Use them to discuss which topics people respond to and what should come next. DMs, community management, social lead pipelines, and extra photography require a separate scope and quote.' },
    ],
    asideTitle: 'Make the first conversation useful',
    checklist: ['Tell us what you sell and where you serve customers.', 'Share your current social account links and your preferred contact method.', 'Flag seasonal dates, filming constraints, and people or spaces available for a shoot.'],
    closing: 'Based in Laramie, Wolin Studio travels to customers in Cheyenne and Fort Collins for agreed on-site work. Production timing, location, and scope are planned together before work begins.',
    offerLink: '/offers#social-90',
    offerLabel: 'Compare social media packages',
  },
  'web-design': {
    eyebrow: 'A clear home for your business',
    title: 'Web design in Laramie.',
    intro: 'Give visitors a straightforward way to understand your services and contact you. Wolin Studio builds custom, mobile-friendly websites for small businesses, with a focused one-page package and custom quotes for larger projects.',
    sections: [
      { title: 'Build around the next step', text: 'A business website should make the essentials easy to find: what you do, where you work, and how someone can reach you. The one-page package brings your services, business details, contact form, and existing booking links together in a layout designed for phones as well as larger screens.' },
      { title: 'Know what the starting package covers', text: 'Custom Website + Care covers one page, basic search titles and descriptions, light polishing of your supplied copy and photos, and two consolidated design feedback rounds. New pages, redesigns, features, ecommerce, and original photography are quoted separately. Use the offers page for current pricing and the full package details.' },
      { title: 'Prepare your materials before design', text: 'Bring your service descriptions, business details, logo, usable photos, and existing booking links. Identify one main action you want visitors to take. Gathering feedback into the included review rounds helps keep decisions clear. The first-draft target is measured from receipt of complete materials, rather than from an assumed launch date.' },
      { title: 'Plan for care and additional search work', text: 'The care package includes hosting, availability checks, routine maintenance, domain registration and renewal, operating tools, and minor edits while care is active. The paid monthly care period starts after 30 free days measured from checkout, even if the website launches later. Additional SEO, service or location pages, and ongoing local search work need a separate scope and quote.' },
    ],
    asideTitle: 'One page or a custom project?',
    checklist: ['A focused page can introduce a small set of services and one clear contact action.', 'Distinct services with detailed questions may need separate pages, quoted to fit the scope.', 'Bring any booking, selling, or integration requirements to the first conversation.'],
    closing: 'Website planning and feedback can happen remotely. Wolin Studio is based in Laramie and also serves Cheyenne and Fort Collins, travelling to customers when on-site work is agreed as part of the project.',
    offerLink: '/offers#website',
    offerLabel: 'See website scope and pricing',
  },
  'service-areas': {
    eyebrow: 'Based in Laramie. Working with you.',
    title: 'Laramie, Cheyenne & Fort Collins.',
    intro: 'Wolin Studio provides social media management and web design from a Laramie base. For businesses in Cheyenne and Fort Collins, we travel to the customer for agreed on-site work and handle planning, editing, and website feedback remotely.',
    sections: [
      { title: 'Laramie: the home base', text: 'If your business is in Laramie, start by sharing your location, services, and what you want customers to do online. For content production, we can discuss capturing your team, workspace, products, or services where you actually work. Meetings and shoots are arranged in advance.' },
      { title: 'Cheyenne: plan the visit around the work', text: 'Wolin Studio serves Cheyenne by travelling from Laramie to customers, rather than operating a Cheyenne office. Tell us where filming would take place, when the people or products involved are available, and whether access or customer permission needs to be arranged. We confirm the visit and production scope together.' },
      { title: 'Fort Collins: on-site content, remote follow-through', text: 'Fort Collins businesses can arrange customer-site production with Wolin Studio. There is no Fort Collins office. Share the proposed location and the material you want to capture so travel and shoot timing can be discussed before booking. Editing, publishing preparation, and website reviews can continue remotely after the visit.' },
      { title: 'Match the working arrangement to the service', text: 'Social content may need a visit to capture your business in action. A website project can usually move forward with your supplied copy, photos, and remote feedback. Additional photography, extra pages, and other custom work are scoped separately. Include your location in the initial inquiry so we can confirm logistics and any travel-related scope or costs before you commit.' },
    ],
    asideTitle: 'Before we arrange a visit',
    checklist: ['Share the customer-site location and suitable dates.', 'Explain what needs to be photographed or filmed and who can approve it.', 'Confirm the agreed scope, access, and schedule before setting aside production time.'],
    closing: 'Outside these areas? Send your location and project details so we can discuss whether remote work or a separately scoped visit is a fit. Availability and working arrangements are confirmed individually.',
    offerLink: '/offers',
    offerLabel: 'Explore packages and custom work',
  },
}

export default function ServicePages({ page }: { page: ServicePage }) {
  const details = content[page]
  return <article className="service-page">
    <header className="service-page-intro">
      <span className="business-eyebrow"><i />{details.eyebrow}</span>
      <h1>{details.title}</h1>
      <p>{details.intro}</p>
      <a className="business-pill-button" href="#contact">Let’s talk about your business <ArrowIcon /></a>
    </header>
    <div className="service-page-grid">
      <div>{details.sections.map((section, index) => <section className="service-page-section" key={section.title} aria-labelledby={`detail-${index}`}>
        <span className="business-eyebrow">0{index + 1}</span><h2 id={`detail-${index}`}>{section.title}</h2><p>{section.text}</p>
      </section>)}</div>
      <aside className="service-page-aside"><h2>{details.asideTitle}</h2><ul>{details.checklist.map(item => <li key={item}>{item}</li>)}</ul><a className="business-text-link" href={details.offerLink}>{details.offerLabel} <ArrowIcon /></a></aside>
    </div>
    <section className="service-page-next" aria-label="Working together"><p>{details.closing}</p><nav aria-label="Explore our services">
      {page !== 'social-media-management' && <a href="/social-media-management">Social media management <ArrowIcon /></a>}
      {page !== 'web-design' && <a href="/web-design">Web design <ArrowIcon /></a>}
      {page !== 'service-areas' && <a href="/service-areas">Where and how we work <ArrowIcon /></a>}
      <a href="#contact">Contact Wolin Studio <ArrowIcon /></a>
    </nav></section>
  </article>
}
