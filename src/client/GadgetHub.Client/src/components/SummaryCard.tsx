import type { OrderItem, OrderSuccessResponse, Product } from '../types'

type Props = {
  items: OrderItem[]
  products: Product[]
  response: OrderSuccessResponse | null
  totalCost: number
}

export default function SummaryCard({ items, products, response, totalCost }: Props) {
  const lookupProduct = (id: string) => products.find((p) => p.id === id)
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`

  const handleDownloadReceipt = () => {
    if (!response || typeof window === 'undefined') return

    const now = new Date().toLocaleString()

    const lineItemsHtml = items
      .map((item) => {
        const product = lookupProduct(item.productId)
        return `<tr><td>${product?.name ?? item.productId}</td><td>${item.productId}</td><td>${item.quantity}</td></tr>`
      })
      .join('')

    const allocationsHtml = response.allocations
      .map(
        (a) =>
          `<tr><td>${a.productId}</td><td>${a.distributor}</td><td>${a.quantity}</td><td>${formatCurrency(
            a.unitPrice,
          )}</td><td>${a.deliveryDays} days</td></tr>`,
      )
      .join('')

    const distributorOrdersHtml = response.distributorOrders
      .map(
        (o) => `<tr><td>${o.distributor}</td><td>${o.distributorOrderId}</td><td>${o.deliveryDays} days</td></tr>`,
      )
      .join('')

    const receiptHtml = `
      <html>
        <head>
          <title>Receipt - ${response.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0b1021; }
            h1 { margin: 0 0 8px 0; }
            h2 { margin: 18px 0 8px 0; }
            p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 14px; }
            th { background: #f8fafc; }
            .muted { color: #64748b; font-size: 13px; }
            .pill { display: inline-block; background: #eef2ff; color: #4f46e5; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 12px; }
            .total { font-size: 16px; font-weight: 700; }
          </style>
        </head>
        <body>
          <h1>Order Receipt</h1>
          <p class="muted">Generated ${now}</p>
          <p><strong>Order ID:</strong> ${response.orderId}</p>
          <p><strong>Status:</strong> <span class="pill">${response.status}</span></p>
          <p><strong>Final ETA:</strong> ${response.finalEstimatedDeliveryDays} days</p>
          <p class="total">Total (est.): ${formatCurrency(totalCost)}</p>

          <h2>Items</h2>
          <table>
            <thead><tr><th>Product</th><th>SKU</th><th>Qty</th></tr></thead>
            <tbody>${lineItemsHtml}</tbody>
          </table>

          <h2>Allocations</h2>
          <table>
            <thead><tr><th>Product</th><th>Distributor</th><th>Qty</th><th>Unit Price</th><th>Delivery</th></tr></thead>
            <tbody>${allocationsHtml}</tbody>
          </table>

          <h2>Distributor Orders</h2>
          <table>
            <thead><tr><th>Distributor</th><th>Order ID</th><th>Delivery</th></tr></thead>
            <tbody>${distributorOrdersHtml}</tbody>
          </table>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to download the receipt.')
      return
    }
    printWindow.document.write(receiptHtml)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className="card summary">
      <div className="summary-header">
        <div>
          <p className="eyebrow">Cart preview</p>
          <h3>Items you will send</h3>
        </div>
        <span className="pill subtle">Live</span>
      </div>
      {items.map((item, idx) => {
        const product = lookupProduct(item.productId)
        return (
          <div className="summary-row" key={idx}>
            <div>
              <strong>{product?.name ?? item.productId}</strong>
              <p className="tagline">SKU {item.productId}</p>
            </div>
            <span className="pill">Qty {item.quantity}</span>
          </div>
        )
      })}
      <p className="hint">Pricing is sourced in real time from distributors once you submit.</p>

      {response && (
        <div className="result-block">
          <div className="result-head">
            <h3>Order {response.orderId}</h3>
            <p className="status success">{response.status}</p>
          </div>
          <p>Final ETA: {response.finalEstimatedDeliveryDays} days</p>
          <p>Total cost: ${totalCost.toFixed(2)}</p>

          <div className="result-actions">
            <button className="btn ghost" type="button" onClick={handleDownloadReceipt}>
              Download receipt (PDF)
            </button>
          </div>

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
        </div>
      )}
    </div>
  )
}
