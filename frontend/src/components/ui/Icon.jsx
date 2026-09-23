// Small local SVG icons: no external icon/font download is needed.
const paths = {
  grid: <>
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1" />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1" />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1" />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1" />
  </>,
  layers: <>
    <path d="m12 3 10 5-10 5L2 8l10-5Z" />
    <path d="m2 12 10 5 10-5M2 16l10 5 10-5" />
  </>,
  user: <>
    <circle
      cx="12"
      cy="8"
      r="4" />
    <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
  </>,
  settings: <>
    <path d="M4 7h16M4 17h16" />
    <circle
      cx="9"
      cy="7"
      r="3" />
    <circle
      cx="15"
      cy="17"
      r="3" />
  </>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  logout: <>
    <path d="M10 4H5v16h5M10 12h11m-5-5 5 5-5 5" />
  </>,
  lock: <>
    <rect
      x="5"
      y="10"
      width="14"
      height="11"
      rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <path d="M12 14v3" />
  </>,
  sun: <>
    <circle
      cx="12"
      cy="12"
      r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2m-3-9-1.5 1.5m-11 11L3 21m0-18 1.5 1.5m15 15L21 21" />
  </>,
  check: <path d="m5 12 4 4L19 6" />,
  refresh: <>
    <path d="M20 7v5h-5M4 17v-5h5" />
    <path d="M6 7a7 7 0 0 1 12-1l2 3M4 15l2 3a7 7 0 0 0 12-1" />
  </>,
  edit: <>
    <path d="m15 4 5 5M4 20l5-1L20 8a3.5 3.5 0 0 0-5-5L4 14v6Z" />
  </>,
  trash: <>
    <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
  </>,
  plus: <path d="M12 5v14M5 12h14" />,
};
export function Icon({ name, size = 20, ...props }) {
  return <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}>
    {paths[name] || paths.grid}
  </svg>;
}
