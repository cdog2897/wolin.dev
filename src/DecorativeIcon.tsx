type IconName = 'arrow' | 'asterisk' | 'sparkle' | 'search' | 'directions' | 'phone'

// Draw decorative symbols instead of relying on platform emoji fonts.
export default function DecorativeIcon({ name }: { name: IconName }) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-hidden="true"
    focusable="false"
    style={{ display: 'inline-block', verticalAlign: '-0.125em', flexShrink: 0 }}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {name === 'arrow' && <path d="M5 19 19 5M5 5h14v14" />}
    {name === 'asterisk' && <path strokeWidth="3" d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6" />}
    {name === 'sparkle' && <path fill="currentColor" stroke="none" d="M12 1 15 9 23 12 15 15 12 23 9 15 1 12 9 9Z" />}
    {name === 'search' && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>}
    {name === 'directions' && <><path d="m12 2 10 10-10 10L2 12Z" /><path d="M8 15v-4h8m-3-3 3 3-3 3" /></>}
    {name === 'phone' && <path d="m8 3 3 5-3 3a15 15 0 0 0 5 5l3-3 5 3c-1 4-3 6-7 4A22 22 0 0 1 4 10C2 6 4 4 8 3Z" />}
  </svg>
}

export function ArrowIcon() {
  return <span aria-hidden="true"><DecorativeIcon name="arrow" /></span>
}
