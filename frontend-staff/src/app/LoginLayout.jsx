export function LoginLayout({ children }) {
  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Aurelia Hotel">
        <div className="visual-glow visual-glow-one" />
        <div className="visual-glow visual-glow-two" />

        <header className="brand brand-light">
          <span className="brand-mark">A</span>
          <span>
            <strong>AURELIA</strong>
            <small>HOTEL &amp; RESORT</small>
          </span>
        </header>
      </section>

      <section className="login-panel">{children}</section>
    </main>
  );
}
