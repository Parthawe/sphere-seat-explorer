export function BrandMark() {
  return (
    <svg className="brand-icon" viewBox="0 0 50 36" fill="none" aria-hidden="true">
      <path d="M3 5h44v8a5 5 0 0 0 0 10v8H3v-8a5 5 0 0 0 0-10V5Z" stroke="currentColor" strokeWidth="3" />
      <path d="M33 7v22" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M12 13h14M12 19h10M12 25h6" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export function BrandIdentity(_props: { subtitle: string }) {
  return <>
    <BrandMark />
    <span className="brand-copy">
      <span className="brand-name">F1TICKETS.ONLINE</span>
    </span>
  </>;
}
