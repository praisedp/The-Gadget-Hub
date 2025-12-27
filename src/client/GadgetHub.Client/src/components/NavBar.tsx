type Props = {
  onHomeClick: () => void
  onCatalogClick: () => void
  onCartClick: () => void
  cartCount: number
}

export default function NavBar({ onHomeClick, onCatalogClick, onCartClick, cartCount }: Props) {
  return (
    <div className="top-nav">
      <button className="btn ghost" onClick={onHomeClick} aria-label="Home">
        <span className="spark">⚡</span> The Gadget Hub
      </button>
      <div className="nav-links">
        <button className="btn link" onClick={onHomeClick} aria-label="Home">
          Home
        </button>
        <button className="btn link" onClick={onCatalogClick} aria-label="Browse catalog">
          Catalog
        </button>
        <button className="btn link" onClick={onCartClick} aria-label="Cart">
          Cart
          {cartCount > 0 && <span className="pill badge">{cartCount}</span>}
        </button>
      </div>
    </div>
  )
}
