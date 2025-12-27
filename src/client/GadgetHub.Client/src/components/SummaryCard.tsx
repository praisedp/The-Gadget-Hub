import type { OrderItem, OrderSuccessResponse, Product } from '../types'

type Props = {
  items: OrderItem[]
  products: Product[]
  response: OrderSuccessResponse | null
  totalCost: number
}

export default function SummaryCard({ items, products, response, totalCost }: Props) {
  const lookupProduct = (id: string) => products.find((p) => p.id === id)

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
