import type { OrderItem, Product, Shortfall } from '../types'

type Props = {
  customerName: string
  items: OrderItem[]
  products: Product[]
  loading: boolean
  correlationId: string | null
  error: string | null
  shortfalls: Shortfall[]
  onCustomerNameChange: (value: string) => void
  onRemoveItem: (index: number) => void
  onUpdateItem: (index: number, field: keyof OrderItem, value: string) => void
  onSubmit: () => void
}

export default function OrderForm({
  customerName,
  items,
  products,
  loading,
  correlationId,
  error,
  shortfalls,
  onCustomerNameChange,
  onRemoveItem,
  onUpdateItem,
  onSubmit,
}: Props) {
  const formatPriceRange = (product: Product | undefined) => {
    if (!product) return '$0'
    const min = product.priceMin.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    const max = product.priceMax.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    return min === max ? `$${min}` : `$${min}-$${max}`
  }

  const getProduct = (productId: string) => products.find((p) => p.id === productId)

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const product = getProduct(item.productId)
      return sum + (product ? product.priceMin * item.quantity : 0)
    }, 0)
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>🛒 Your Cart</h2>
        <p className="cart-count">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="field">
        <label>Customer name</label>
        <input
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          placeholder="Enter your name or company"
        />
      </div>

      <div className="cart-items">
        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="empty-icon">🛍️</span>
            <p>Your cart is empty</p>
            <span className="empty-hint">Add products from the catalog to get started</span>
          </div>
        ) : (
          items.map((item, index) => {
            const product = getProduct(item.productId)
            return (
              <div className="cart-item" key={index}>
                <div 
                  className="cart-item-image" 
                  style={{ backgroundImage: product ? `url(${product.image})` : 'none' }}
                />
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <div>
                      <span className="cart-item-sku">{item.productId}</span>
                      <h4 className="cart-item-name">{product?.name ?? 'Unknown product'}</h4>
                      {product && <span className="cart-item-category">{product.category}</span>}
                    </div>
                    <button 
                      className="cart-item-remove" 
                      type="button" 
                      onClick={() => onRemoveItem(index)}
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="cart-item-footer">
                    <div className="cart-item-price">{formatPriceRange(product)}</div>
                    <div className="cart-item-qty">
                      <button 
                        className="qty-btn" 
                        type="button"
                        onClick={() => onUpdateItem(index, 'quantity', String(Math.max(1, item.quantity - 1)))}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => onUpdateItem(index, 'quantity', e.target.value)}
                        className="qty-input"
                      />
                      <button 
                        className="qty-btn" 
                        type="button"
                        onClick={() => onUpdateItem(index, 'quantity', String(item.quantity + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {items.length > 0 && (
        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Subtotal (est.)</span>
            <span className="cart-subtotal">${calculateSubtotal().toLocaleString()}</span>
          </div>
          <p className="cart-note">Final price determined after distributor allocation</p>
        </div>
      )}

      <button className="btn primary cart-submit" onClick={onSubmit} disabled={loading || items.length === 0}>
        {loading ? 'Placing order...' : 'Place Order'}
      </button>

      {correlationId && <div className="info compact">Correlation ID: {correlationId}</div>}

      {error && (
        <div className="error">
          <strong>Request failed:</strong> {error}
          {shortfalls.length > 0 && (
            <ul>
              {shortfalls.map((s) => (
                <li key={s.productId}>
                  {s.productId}: requested {s.requested}, available {s.availableTotal}, missing {s.missing}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
