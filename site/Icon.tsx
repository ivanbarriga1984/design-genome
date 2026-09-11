// Tabler Icons, MIT. License retained in src/tabler-icons.LICENSE.
const paths = {
  arrow: "M5 12l14 0 M12 5l7 7l-7 7",
  external: "M7 17l10 -10 M7 7l10 0l0 10",
  menu: "M4 6l16 0 M4 12l16 0 M4 18l16 0",
  close: "M18 6l-12 12 M6 6l12 12",
  check: "M5 12l4 4l10 -10",
};
export function Icon({ name = "arrow" }: { name?: keyof typeof paths }) {
  return (
    <svg
      className="dg-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
