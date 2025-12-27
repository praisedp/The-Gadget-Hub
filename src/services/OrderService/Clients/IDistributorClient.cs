using GadgetHub.Contracts.Distributors;

namespace GadgetHub.OrderService.Clients;

public interface IDistributorClient
{
    string DistributorName { get; }
    Task<QuoteResponse> GetQuoteAsync(QuoteRequest request, string correlationId, CancellationToken cancellationToken);
    Task<DistributorOrderResponse> PlaceOrderAsync(DistributorOrderRequest request, string correlationId, CancellationToken cancellationToken);
}
