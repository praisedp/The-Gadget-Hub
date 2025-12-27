using System.Net.Http.Json;
using System.Text.Json;
using GadgetHub.Contracts.Distributors;
using GadgetHub.Contracts.Shared;

namespace GadgetHub.OrderService.Clients;

public abstract class DistributorClientBase : IDistributorClient
{
    private readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true
    };

    protected DistributorClientBase(HttpClient httpClient)
    {
        HttpClient = httpClient;
    }

    protected HttpClient HttpClient { get; }

    public abstract string DistributorName { get; }

    public async Task<QuoteResponse> GetQuoteAsync(QuoteRequest request, string correlationId, CancellationToken cancellationToken)
    {
        using var message = new HttpRequestMessage(HttpMethod.Post, "/api/quote");
        message.Content = JsonContent.Create(request, options: _serializerOptions);
        message.Headers.Add(CorrelationHeaders.CorrelationId, correlationId);

        var response = await HttpClient.SendAsync(message, cancellationToken);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<QuoteResponse>(_serializerOptions, cancellationToken);
        return result ?? throw new InvalidOperationException($"Failed to deserialize quote response from {DistributorName}");
    }

    public async Task<DistributorOrderResponse> PlaceOrderAsync(DistributorOrderRequest request, string correlationId, CancellationToken cancellationToken)
    {
        using var message = new HttpRequestMessage(HttpMethod.Post, "/api/orders");
        message.Content = JsonContent.Create(request, options: _serializerOptions);
        message.Headers.Add(CorrelationHeaders.CorrelationId, correlationId);

        var response = await HttpClient.SendAsync(message, cancellationToken);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<DistributorOrderResponse>(_serializerOptions, cancellationToken);
        return result ?? throw new InvalidOperationException($"Failed to deserialize order confirmation from {DistributorName}");
    }
}
