export default function HowItWorks() {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="section-intro">
        <span className="section-badge">✨ How It Works</span>
        <h2 className="section-title">Quote, compare, and place automatically</h2>
        <p className="section-description">
          Your cart fans out to TechWorld, ElectroCom, and Gadget Central. We compare price and delivery time per
          SKU and can split lines if needed to get everything delivered sooner.
        </p>
      </div>

      <div className="how-it-works-grid">
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-content">
              <h3>Add items</h3>
              <p>Select products from the catalog or the order form dropdowns. Build your cart with any quantity.</p>
            </div>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-content">
              <h3>We quote all distributors</h3>
              <p>Parallel quote requests pull live price and stock from all three distributors simultaneously.</p>
            </div>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-content">
              <h3>We place the best mix</h3>
              <p>Cheapest wins, ties break on fastest ETA. You get a combined confirmation instantly.</p>
            </div>
          </div>
        </div>

        <div className="video-container">
          <div className="video-wrapper">
            <video className="promo-video" src="/ICBT.mp4" controls playsInline>
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="video-caption">Watch how GadgetHub routes your order across distributors</p>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📡</div>
          <h4>Live Availability</h4>
          <p>We fan out quote requests to each distributor and reconcile price + ETA instantly.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h4>Smart Allocation</h4>
          <p>Cheapest wins; ties break on fastest delivery. Orders can split per line item.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h4>Traceability</h4>
          <p>Every request carries an X-Correlation-ID so you can follow it across services.</p>
        </div>
      </div>
    </section>
  )
}
