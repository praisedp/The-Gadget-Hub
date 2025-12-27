using GadgetHub.Contracts.Distributors;
using GadgetHub.Contracts.Orders;

namespace GadgetHub.OrderService.Services;

public class AllocationEngine
{
    public AllocationResult Allocate(CreateOrderRequest request, IEnumerable<QuoteResponse> distributorQuotes)
    {
        var allocations = new List<OrderAllocation>();
        var shortfalls = new List<Shortfall>();
        var quotesByDistributor = distributorQuotes.ToList();

        foreach (var item in request.Items)
        {
            var availableQuotes = quotesByDistributor
                .Select(q => new
                {
                    q.Distributor,
                    Quote = q.Quotes.FirstOrDefault(x => string.Equals(x.ProductId, item.ProductId, StringComparison.OrdinalIgnoreCase))
                })
                .Where(x => x.Quote is not null && x.Quote.AvailableQty > 0)
                .Select(x => new
                {
                    x.Distributor,
                    x.Quote!.UnitPrice,
                    x.Quote.AvailableQty,
                    x.Quote.EstimatedDeliveryDays
                })
                .ToList();

            var totalAvailable = availableQuotes.Sum(x => x.AvailableQty);
            if (totalAvailable < item.Quantity)
            {
                shortfalls.Add(new Shortfall
                {
                    ProductId = item.ProductId,
                    Requested = item.Quantity,
                    AvailableTotal = totalAvailable,
                    Missing = item.Quantity - totalAvailable
                });
                continue;
            }

            var remaining = item.Quantity;
            foreach (var quote in availableQuotes
                         .OrderBy(x => x.UnitPrice)
                         .ThenBy(x => x.EstimatedDeliveryDays))
            {
                if (remaining <= 0)
                {
                    break;
                }

                var quantityToAllocate = Math.Min(remaining, quote.AvailableQty);
                allocations.Add(new OrderAllocation
                {
                    ProductId = item.ProductId,
                    Distributor = quote.Distributor,
                    Quantity = quantityToAllocate,
                    UnitPrice = quote.UnitPrice,
                    DeliveryDays = quote.EstimatedDeliveryDays
                });

                remaining -= quantityToAllocate;
            }
        }

        return new AllocationResult(allocations, shortfalls);
    }
}
