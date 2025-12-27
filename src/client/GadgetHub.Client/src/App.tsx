import { useEffect, useMemo, useState } from 'react'
import Catalog from './components/Catalog'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import NavBar from './components/NavBar'
import OrderForm from './components/OrderForm'
import SummaryCard from './components/SummaryCard'
import type { OrderItem, OrderSuccessResponse, Shortfall } from './types'
import { productCatalog } from './types'

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5005'
const CART_KEY = 'gadget-hub-cart'

function App() {
  const [view, setView] = useState<'home' | 'catalog' | 'cart'>('home')
  const [customerName, setCustomerName] = useState('Acme Corp')
  const [items, setItems] = useState<OrderItem[]>(() => {
    if (typeof window === 'undefined') return [{ productId: 'P1001', quantity: 1 }]
    try {
      const raw = window.localStorage.getItem(CART_KEY)
      if (!raw) return [{ productId: 'P1001', quantity: 1 }]
      const parsed = JSON.parse(raw) as OrderItem[]
      if (
        Array.isArray(parsed) &&
        parsed.every((p) => typeof p.productId === 'string' && typeof p.quantity === 'number')
      ) {
        const filtered = parsed
          .map((p) => ({ ...p, quantity: Math.max(p.quantity, 1) }))
          .filter((p) => productCatalog.some((c) => c.id === p.productId))
        if (filtered.length > 0) return filtered
      }
    } catch (err) {
      console.error('Failed to read cart', err)
    }
    return [{ productId: 'P1001', quantity: 1 }]
  })
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<OrderSuccessResponse | null>(null)
  const [shortfalls, setShortfalls] = useState<Shortfall[]>([])
  const [error, setError] = useState<string | null>(null)
  const [correlationId, setCorrelationId] = useState<string | null>(null)

  const cartCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addProductToCart = (productId: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((p) => p.productId === productId)
      if (existingIndex >= 0) {
        return prev.map((p, idx) => (idx === existingIndex ? { ...p, quantity: p.quantity + 1 } : p))
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== index))

  const updateItem = (index: number, field: keyof OrderItem, value: string) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]: field === 'quantity' ? Math.max(Number(value) || 0, 1) : value,
            }
          : item,
      ),
    )
  }

  const submitOrder = async () => {
    setLoading(true)
    setError(null)
    setShortfalls([])
    setResponse(null)

    const filteredItems = items.filter(
      (i) => i.productId && i.quantity > 0 && productCatalog.some((p) => p.id === i.productId),
    )
    if (!customerName.trim()) {
      setError('Please enter a customer name.')
      setLoading(false)
      return
    }
    if (filteredItems.length === 0) {
      setError('Add at least one item with a quantity.')
      setLoading(false)
      return
    }

    const payload = {
      customerName,
      items: filteredItems,
    }

    const corr = crypto.randomUUID()
    try {
      const res = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': corr,
        },
        body: JSON.stringify(payload),
      })

      setCorrelationId(res.headers.get('X-Correlation-ID'))

      if (res.ok) {
        const data: OrderSuccessResponse = await res.json()
        setResponse(data)
      } else {
        const data = await res.json()
        if (res.status === 409) {
          setShortfalls(data.shortfalls ?? [])
          setError(data.message ?? 'Insufficient stock')
        } else {
          setError(data.title ?? data.message ?? 'Request failed')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const totalCost = useMemo(() => {
    if (!response) return 0
    return response.allocations.reduce((sum, a) => sum + a.unitPrice * a.quantity, 0)
  }, [response])

  return (
    <div className="page">
      <NavBar
        onHomeClick={() => setView('home')}
        onCatalogClick={() => setView('catalog')}
        onCartClick={() => setView('cart')}
        cartCount={cartCount}
      />

      {view === 'home' && (
        <>
          <Hero onCatalogClick={() => setView('catalog')} onCartClick={() => setView('cart')} />
          <HowItWorks />
        </>
      )}

      {view === 'catalog' && (
        <>
          <Catalog products={productCatalog} onAddToCart={addProductToCart} />
          <div className="section">
            <button className="btn primary" onClick={() => setView('cart')}>
              View cart & place order
            </button>
          </div>
        </>
      )}

      {view === 'cart' && (
        <section className="section order">
          <div className="section-header">
            <div>
              <p className="eyebrow">Cart</p>
              <h2>Review cart and place order</h2>
              <p className="lede small">We will return allocations, distributor order IDs, and the final ETA.</p>
            </div>
          </div>
          <div className="order-grid">
            <OrderForm
              customerName={customerName}
              items={items}
              products={productCatalog}
              loading={loading}
              correlationId={correlationId}
              error={error}
              shortfalls={shortfalls}
              onCustomerNameChange={setCustomerName}
              onRemoveItem={removeItem}
              onUpdateItem={updateItem}
              onSubmit={submitOrder}
            />

            <SummaryCard items={items} products={productCatalog} response={response} totalCost={totalCost} />
          </div>
        </section>
      )}

      <footer className="footer">
        <div>
          <strong>The Gadget Hub</strong>
          <p className="tagline">Sourcing the best mix from TechWorld, ElectroCom, and Gadget Central.</p>
        </div>
        <div className="footer-links">
          <button className="btn link" onClick={() => setView('home')} aria-label="Home">
            Home
          </button>
          <button className="btn link" onClick={() => setView('catalog')} aria-label="Catalog">
            Catalog
          </button>
          <button className="btn link" onClick={() => setView('cart')} aria-label="Cart">
            Cart
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App
