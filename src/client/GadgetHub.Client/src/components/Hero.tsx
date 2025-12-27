type Props = {
  onCatalogClick: () => void
  onCartClick: () => void
}

export default function Hero({ onCatalogClick, onCartClick }: Props) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">⚡</span>
            <span>Service Oriented • Real-time Sourcing</span>
          </div>
          
          <h1 className="hero-title">
            One cart, three distributors.
            <span className="hero-highlight"> We auto-route to the best mix.</span>
          </h1>
          
          <p className="hero-description">
            The Gadget Hub aggregates TechWorld, ElectroCom, and Gadget Central to find the best price and
            delivery for every line item. Add what you need—we split, compare, and place the orders for you.
          </p>
          
          <div className="hero-actions">
            <button className="btn primary" onClick={onCartClick} aria-label="View cart">
              <span>🛒</span> Start Shopping
            </button>
            <button className="btn ghost" onClick={onCatalogClick} aria-label="Browse catalog">
              Browse Catalog
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="distributor-card techworld">
              <div className="card-logo">🌐</div>
              <div className="card-info">
                <strong>TechWorld</strong>
                <span>Live pricing</span>
              </div>
              <div className="card-status online">●</div>
            </div>
            <div className="distributor-card electrocom">
              <div className="card-logo">⚡</div>
              <div className="card-info">
                <strong>ElectroCom</strong>
                <span>Fast shipping</span>
              </div>
              <div className="card-status online">●</div>
            </div>
            <div className="distributor-card gadgetcentral">
              <div className="card-logo">🔧</div>
              <div className="card-info">
                <strong>Gadget Central</strong>
                <span>Best prices</span>
              </div>
              <div className="card-status online">●</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <strong>3</strong>
            <span>Distributors Auto-quoted</span>
          </div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <strong>8</strong>
            <span>Curated Gadgets</span>
          </div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <strong>5 min</strong>
            <span>Average Confirmation</span>
          </div>
        </div>
      </div>
    </section>
  )
}
