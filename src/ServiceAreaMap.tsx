// City positions use the 2026 Census Gazetteer representative coordinates:
// Laramie 41.311810, -105.606472; Cheyenne 41.128275, -104.799155;
// Fort Collins 40.548405, -105.064988. North is up, with longitude scaled
// by roughly cos(41°). Terrain and connecting strokes are illustrative.
// https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html
export default function ServiceAreaMap() {
  return <figure className="service-area-map">
    <svg viewBox="0 0 640 660" fill="none" role="img" aria-labelledby="service-map-title service-map-description">
      <title id="service-map-title">Wolin Studio’s service areas: Laramie, Cheyenne, and Fort Collins</title>
      <desc id="service-map-description">A regional sketch with three equal city markers. Laramie is northwest of Cheyenne. Fort Collins is south of both cities, in Colorado. A horizontal line marks the Wyoming–Colorado border. The landscape and connecting line are decorative, not service boundaries or driving directions.</desc>

      <g aria-hidden="true">
        <path d="M30 156C87 122 141 149 161 195S130 266 109 308 117 397 153 437 174 537 128 610" stroke="currentColor" opacity=".09" strokeWidth="42" strokeLinecap="round" />
        <g className="service-map-contours" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <path d="M0 128C61 95 139 121 169 172S175 254 139 302 145 396 182 438 207 559 166 660" />
          <path d="M0 151C57 125 120 140 143 187S139 252 111 300 121 401 156 445 172 558 137 660" />
          <path d="M0 174C43 154 96 164 116 204S108 264 85 304 94 409 127 451 141 563 105 660" />
          <path d="M0 204C34 180 74 191 88 220S70 280 61 315 70 417 98 459 105 569 75 660" />
          <path d="M0 236C32 213 49 221 58 244S28 300 32 333 43 423 66 467 70 580 43 660" />
          <path d="M405 0C395 56 435 83 491 91S581 132 640 110M436 0C423 43 454 59 509 67S583 98 640 83M467 0C454 29 482 37 530 43S588 67 640 56" />
          <path d="M536 431C572 403 622 418 640 448M524 454C562 425 615 441 640 473M519 479C558 448 609 469 640 499" />
        </g>

        <text className="service-map-note" x="42" y="66">A little</text>
        <text className="service-map-note" x="42" y="108">local love.</text>
        <path d="M45 118C81 125 142 123 183 116" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />

        <g className="service-map-compass" transform="translate(561 53)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <text x="0" y="0" textAnchor="middle" stroke="none">N</text>
          <path d="M0 47V14m-8 13 8-13 8 13M-11 40h22" />
        </g>

        <g className="service-map-mountains" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="m56 327 36-58 35 58m-21-23 27-48 38 71M79 288l13 10 10-10m18-9 13 9 10-12M53 336c33 5 75-4 120 0" />
          <path d="m219 461 22-37 24 37m-35-22 11 7 7-11M218 470h50" />
          <path d="M202 532v38m-13-14 13-18 13 18m-25-3 12-18 12 18M179 548v25m-9-12 9-15 9 15" />
        </g>
        <g className="service-map-sun" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="497" cy="171" r="17" />
          <path d="M497 140v-7m0 69v7m31-38h7m-69 0h-7m16-22-5-5m49 49 5 5m-5-49 5-5m-49 49-5 5" />
        </g>

        <path className="service-map-border" d="M28 367H612" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 7" />
        <text className="service-map-state" x="600" y="351" textAnchor="end">WYOMING</text>
        <text className="service-map-state" x="600" y="393" textAnchor="end">COLORADO</text>

        <path className="service-map-connection" d="M240 242C298 220 389 313 482 315S455 448 402 547" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 8" />

        {[{ name: 'Laramie', x: 240, y: 242, labelY: 209 }, { name: 'Cheyenne', x: 482, y: 315, labelY: 282 }, { name: 'Fort Collins', x: 402, y: 547, labelY: 598 }].map(city => <g key={city.name}>
          <circle className="service-map-marker-halo" cx={city.x} cy={city.y} r="23" />
          <circle className="service-map-marker" cx={city.x} cy={city.y} r="12" />
          <circle className="service-map-marker-center" cx={city.x} cy={city.y} r="4" />
          <text className="service-map-city" x={city.x} y={city.labelY} textAnchor="middle">{city.name}</text>
        </g>)}
        <path d="M41 598v15m-7-8h14M582 563v15m-7-8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
    <figcaption>Three cities. The same creative care.</figcaption>
  </figure>
}
