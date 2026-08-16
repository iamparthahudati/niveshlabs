import Link from "next/link";

const marketItems = [
  { name: "NIFTY 50", value: "22,957.25", change: "+0.76%", trend: "up" },
  { name: "SENSEX", value: "75,399.86", change: "+0.71%", trend: "up" },
  { name: "BANK NIFTY", value: "49,585.65", change: "−0.28%", trend: "down" },
  { name: "GOLD", value: "₹72,354 / 10g", change: "+0.32%", trend: "up" },
  { name: "USD/INR", value: "83.24", change: "−0.12%", trend: "down" },
] as const;

const navigationItems = [
  "Markets",
  "Stocks",
  "Mutual Funds",
  "Calculators",
  "Credit Cards",
  "Learn",
  "News",
];

function Brand() {
  return (
    <Link className="brand" href="/" aria-label="NiveshLabs home">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="brand-name">
        Nivesh<span>Labs</span>
      </span>
    </Link>
  );
}

function Navigation({ className }: { className: string }) {
  return (
    <nav className={className} aria-label="Primary navigation">
      {navigationItems.map((item) => (
        <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>
          {item}
        </a>
      ))}
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="market-strip" aria-label="Sample market snapshot">
        <div className="market-strip-track">
          {marketItems.map((item) => (
            <div className="market-item" key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.value}</span>
              <span className={item.trend === "up" ? "market-up" : "market-down"}>
                <i aria-hidden="true" />
                {item.change}
              </span>
            </div>
          ))}
          <span className="market-note">Sample data</span>
        </div>
      </div>

      <div className="navbar">
        <Brand />
        <Navigation className="desktop-nav" />

        <div className="header-actions">
          <form className="search-form" role="search">
            <label className="sr-only" htmlFor="site-search">
              Search NiveshLabs
            </label>
            <input
              id="site-search"
              name="query"
              type="search"
              placeholder="Search stocks, funds, news..."
            />
            <button type="submit" aria-label="Search">
              <span aria-hidden="true" />
            </button>
          </form>

          <button className="account-button" type="button" aria-label="Open account">
            <span aria-hidden="true">P</span>
          </button>

          <details className="mobile-menu">
            <summary aria-label="Open navigation menu">
              <span />
              <span />
              <span />
            </summary>
            <div className="mobile-menu-panel">
              <Navigation className="mobile-nav" />
              <form className="mobile-search" role="search">
                <label className="sr-only" htmlFor="mobile-site-search">
                  Search NiveshLabs
                </label>
                <input
                  id="mobile-site-search"
                  name="query"
                  type="search"
                  placeholder="Search NiveshLabs"
                />
                <button type="submit">Search</button>
              </form>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
