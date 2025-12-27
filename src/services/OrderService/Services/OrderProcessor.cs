using GadgetHub.Contracts.Distributors;
using GadgetHub.Contracts.Orders;
using GadgetHub.OrderService.Clients;

namespace GadgetHub.OrderService.Services;

public class OrderProcessor
{
    private readonly IEnumerable<IDistributorClient> _distributorClients;
    private readonly AllocationEngine _allocationEngine;
    private readonly ILogger<OrderProcessor> _logger;

    public OrderProcessor(IEnumerable<IDistributorClient> distributorClients, AllocationEngine allocationEngine, ILogger<OrderProcessor> logger)
    {
        _distributorClients = distributorClients;
        _allocationEngine = allocationEngine;
        _logger = logger;
    }

    public async Task<OrderProcessingResult> ProcessAsync(CreateOrderRequest request, string correlationId, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing order for {Customer} with correlation {CorrelationId}", request.CustomerName, correlationId);

        var quoteRequest = new QuoteRequest
        {
            Items = request.Items.Select(i => new QuoteItemRequest
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity
            }).ToList()
        };

        var quoteResponses = await Task.WhenAll(_distributorClients.Select(client =>
            client.GetQuoteAsync(quoteRequest, correlationId, cancellationToken)));

        var allocationResult = _allocationEngine.Allocate(request, quoteResponses);
        if (!allocationResult.Success)
        {
            _logger.LogWarning("Insufficient stock for some items. CorrelationId {CorrelationId}", correlationId);
            return OrderProcessingResult.FromFailure(new OrderRejectedResponse
            {
                Message = "Insufficient stock for some items",
                Shortfalls = allocationResult.Shortfalls
            });
        }

        var orderId = $"GH-{Guid.NewGuid():N}".Substring(0, 12);
        var distributorOrders = new List<DistributorOrderInfo>();

        foreach (var group in allocationResult.Allocations.GroupBy(x => x.Distributor))
        {
            var client = _distributorClients.First(c =>
                string.Equals(c.DistributorName, group.Key, StringComparison.OrdinalIgnoreCase));

            var distributorRequest = new DistributorOrderRequest
            {
                CustomerOrderId = orderId,
                Allocations = group.Select(x => new DistributorOrderAllocation
                {
                    ProductId = x.ProductId,
                    Quantity = x.Quantity
                }).ToList()
            };

            var confirmation = await client.PlaceOrderAsync(distributorRequest, correlationId, cancellationToken);
            distributorOrders.Add(new DistributorOrderInfo
            {
                Distributor = confirmation.Distributor,
                DistributorOrderId = confirmation.DistributorOrderId,
                DeliveryDays = confirmation.ConfirmedDeliveryDays
            });
        }

        var finalEta = distributorOrders.Any()
            ? distributorOrders.Max(x => x.DeliveryDays)
            : 0;

        var successResponse = new OrderSuccessResponse
        {
            OrderId = orderId,
            Status = "Confirmed",
            FinalEstimatedDeliveryDays = finalEta,
            Allocations = allocationResult.Allocations,
            DistributorOrders = distributorOrders
        };

        _logger.LogInformation("Order {OrderId} processed successfully with correlation {CorrelationId}", orderId, correlationId);
        return OrderProcessingResult.FromSuccess(successResponse);
    }
}
