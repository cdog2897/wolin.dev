import './HeroArtwork.css'

function Heart() {
  return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21S3 15.6 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.6-9 12-9 12Z" /></svg>
}

function Comment() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M4 4h16v12H10l-6 5V4Z" /><path d="M8 8h8M8 12h5" /></svg>
}

export default function HeroArtwork() {
  return <div className="hero-artwork" aria-hidden="true">
    <svg className="hero-connection" viewBox="0 0 1100 600" fill="none">
      <path d="M115 375C105 505 285 408 320 510S520 465 550 515 735 445 795 500 1000 445 988 358" stroke="currentColor" strokeWidth="1.3" strokeDasharray="5 7" />
    </svg>

    <div className="hero-scribble">
      <span>A little local love.</span>
      <svg viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 63C3 21 49 9 55 34s-34 37-21 9C48 10 75 20 89 7M74 7h16v17" /></svg>
    </div>

    <div className="hero-business-post">
      <div className="hero-post-art">
        <span>Local favorite.</span>
        <svg viewBox="0 0 210 155" fill="none" stroke="#254e42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="105" cy="143" rx="75" ry="6" fill="#254e4210" stroke="none" />
          <path d="M45 66h120v73H45Z" fill="#f8f1e3" />
          <path d="M54 31h102l18 35H36Z" fill="#ff6938" />
          <path d="M36 66v7c0 12 23 12 23 0V66m0 0v7c0 12 23 12 23 0V66m0 0v7c0 12 23 12 23 0V66m0 0v7c0 12 23 12 23 0V66m0 0v7c0 12 23 12 23 0V66m0 0v7c0 12 23 12 23 0V66" fill="#f8f1e3" />
          <path d="M87 139V96h36v43M55 97h22v24H55Zm78 0h22v24h-22Z" />
          <path d="m65 38-6 26m27-26-3 26m23-26v26m20-26 3 26m18-26 6 26" stroke="#f8f1e3" strokeWidth="9" />
          <circle cx="115" cy="119" r="1.5" fill="#254e42" />
          <path d="M176 112v27m-9-18c-6-14 14-24 10-7 5-17 20-1 3 7" />
          <path d="M29 14v10m-5-5h10m139 2 4 4m-4 0 4-4" />
        </svg>
      </div>
      <div className="hero-post-actions"><Heart /><Comment /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="m3 3 18 6-9 5-3 7-6-18Zm0 0 9 11" /></svg></div>
      <span className="hero-heart-sticker"><Heart /></span>
    </div>

    <div className="hero-conversation">
      <div className="hero-comment-bubble"><Comment /><span className="hero-comment-dots"><i /><i /><i /></span><Heart /></div>
      <div className="hero-reach-card"><p>Small business.<br /><em>Big conversation.</em></p><div className="hero-reach-bars"><i /><i /><i /><i /><i /><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m8 37 30-26M20 11h18v18" /></svg></div></div>
    </div>

    <div className="hero-city-route">{['Laramie', 'Cheyenne', 'Fort Collins'].map(city => <span className="hero-city" key={city}><svg viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 9c0 6-7 12-7 12S3 15 3 9a7 7 0 0 1 14 0Z" /><circle cx="10" cy="9" r="2.5" /></svg>{city}</span>)}</div>
  </div>
}
