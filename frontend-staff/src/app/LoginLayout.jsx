export function LoginLayout({ children }) {
  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Aurelia Hotel">
        <div className="visual-glow visual-glow-one" />
        <div className="visual-glow visual-glow-two" />

      </section>

      <section className="login-panel">{children}</section>
    </main>
  );
}
