function Logo() {
  return (
    <div className="brand" aria-label="NiveshLabs">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="brand-name">
        Nivesh<span>Labs</span>
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="page">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <header>
        <Logo />
      </header>

      <section className="hero">
        <div className="status">
          <span />
          Building something smarter
        </div>
        <h1>Hello Everyone,</h1>
        <p className="headline">we are coming soon.</p>
        <p className="message">
          Simple tools and clear guidance to help you understand, plan and grow
          your money.
        </p>
      </section>

      <footer>© {new Date().getFullYear()} NiveshLabs</footer>
    </main>
  );
}
