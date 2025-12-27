import { useMemo, useState } from 'react'

type OrderItem = {
  productId: string
  quantity: number
}

type Allocation = {
  productId: string
  distributor: string
  quantity: number
  unitPrice: number
  deliveryDays: number
}

type DistributorOrder = {
  distributor: string
  distributorOrderId: string
  deliveryDays: number
}

type Shortfall = {
  productId: string
  requested: number
  availableTotal: number
  missing: number
}

type OrderSuccessResponse = {
  orderId: string
  status: string
  finalEstimatedDeliveryDays: number
  allocations: Allocation[]
  distributorOrders: DistributorOrder[]
}

const productCatalog = [
  { id: 'P1001', name: 'Smart Watch' },
  { id: 'P1002', name: 'Noise Cancelling Headphones' },
  { id: 'P1003', name: 'Bluetooth Speaker' },
  { id: 'P1004', name: 'Drone Camera' },
  { id: 'P1005', name: 'E-Reader' },
]

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

function App() {
  const [customerName, setCustomerName] = useState('Acme Corp')
  const [items, setItems] = useState<OrderItem[]>([{ productId: 'P1001', quantity: 1 }])
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<OrderSuccessResponse | null>(null)
  const [shortfalls, setShortfalls] = useState<Shortfall[]>([])
  const [error, setError] = useState<string | null>(null)
  const [correlationId, setCorrelationId] = useState<string | null>(null)

  const addItem = () => setItems((prev) => [...prev, { productId: 'P1002', quantity: 1 }])

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== index))

  const updateItem = (index: number, field: keyof OrderItem, value: string) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]: field === 'quantity' ? Number(value) || 0 : value,
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

    const payload = {
      customerName,
      items: items.filter((i) => i.productId && i.quantity > 0),
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
      <header>
        <h1>The Gadget Hub</h1>
        <p>Place an order and we will route it to the best distributor mix.</p>
      </header>

      <section className="card">
        <div className="field">
          <label>Customer name</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name"
          />
        </div>

        <div className="items-header">
          <h2>Items</h2>
          <button className="ghost" onClick={addItem} type="button">
            + Add item
          </button>
        </div>

        <div className="items-grid">
          {items.map((item, index) => (
            <div className="item-row" key={index}>
              <select
                value={item.productId}
                onChange={(e) => updateItem(index, 'productId', e.target.value)}
              >
                {productCatalog.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
              />
              <button
                className="ghost"
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button className="primary" onClick={submitOrder} disabled={loading}>
          {loading ? 'Placing order...' : 'Place order'}
        </button>
      </section>

      {correlationId && (
        <div className="info">Correlation ID: {correlationId}</div>
      )}

      {error && (
        <div className="error">
          <strong>Request failed:</strong> {error}
          {shortfalls.length > 0 && (
            <ul>
              {shortfalls.map((s) => (
                <li key={s.productId}>
                  {s.productId}: requested {s.requested}, available {s.availableTotal}, missing{' '}
                  {s.missing}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {response && (
        <section className="card result">
          <h2>Order {response.orderId}</h2>
          <p className="status success">{response.status}</p>
          <p>Final ETA: {response.finalEstimatedDeliveryDays} days</p>
          <p>Total cost: ${totalCost.toFixed(2)}</p>

          <div className="table">
            <div className="table-title">Allocations</div>
            <div className="table-header">
              <span>Product</span>
              <span>Distributor</span>
              <span>Qty</span>
              <span>Unit Price</span>
              <span>Delivery</span>
            </div>
            {response.allocations.map((a, idx) => (
              <div className="table-row" key={idx}>
                <span>{a.productId}</span>
                <span>{a.distributor}</span>
                <span>{a.quantity}</span>
                <span>${a.unitPrice.toFixed(2)}</span>
                <span>{a.deliveryDays} days</span>
              </div>
            ))}
          </div>

          <div className="table">
            <div className="table-title">Distributor Orders</div>
            <div className="table-header">
              <span>Distributor</span>
              <span>Order Id</span>
              <span>Delivery</span>
            </div>
            {response.distributorOrders.map((o, idx) => (
              <div className="table-row" key={idx}>
                <span>{o.distributor}</span>
                <span>{o.distributorOrderId}</span>
                <span>{o.deliveryDays} days</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default App
