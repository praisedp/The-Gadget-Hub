import type { Product } from '../types'

type Props = {
  products: Product[]
  onAddToCart: (productId: string) => void
}

export default function Catalog({ products, onAddToCart }: Props) {
  const formatPriceRange = (product: Product) => {
    const min = product.priceMin.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    const max = product.priceMax.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return min === max ? `$${min}` : `$${min}-$${max}`
  }

  return (
    <section className="section" id="catalog">
      <div className="section-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Popular picks, ready to ship</h2>
          <p className="lede small">Click any card to add it to your cart instantly.</p>
        </div>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image" style={{ backgroundImage: `url(${product.image})` }} />
            <div className="product-meta">
              <div className="meta-row">
                <span className="pill">{product.category}</span>
                <span className="pill subtle">{product.id}</span>
              </div>
              <h3>{product.name}</h3>
              <p className="tagline">{product.tagline}</p>
              <div className="price-row">
                <span className="price">{formatPriceRange(product)}</span>
                <button className="btn primary" type="button" onClick={() => onAddToCart(product.id)}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
