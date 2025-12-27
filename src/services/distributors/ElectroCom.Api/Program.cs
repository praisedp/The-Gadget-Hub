using GadgetHub.Contracts.Distributors;
using GadgetHub.Contracts.Shared;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

builder.Services.AddSingleton(new InventoryService("ElectroCom", "EC", new List<InventoryItem>
{
    new("P1001", 125m, 7, 5),
    new("P1002", 85m, 10, 5),
    new("P1003", 80m, 4, 3),
    new("P1004", 190m, 6, 7),
    new("P1005", 160m, 5, 4),
    new("P1006", 760m, 5, 6),
    new("P1007", 345m, 5, 5),
    new("P1008", 115m, 10, 3)
}));

var app = builder.Build();

app.UseExceptionHandler();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();

app.Use(async (context, next) =>
{
    var correlationId = context.Request.Headers[CorrelationHeaders.CorrelationId].FirstOrDefault();
    if (string.IsNullOrWhiteSpace(correlationId))
    {
        correlationId = Guid.NewGuid().ToString();
    }

    context.Items[CorrelationHeaders.CorrelationId] = correlationId;
    context.Response.Headers[CorrelationHeaders.CorrelationId] = correlationId;
    await next();
});

app.MapPost("/api/quote", (QuoteRequest request, InventoryService inventory, HttpContext context) =>
    {
        var correlationId = GetCorrelationId(context);
        var quotes = inventory.BuildQuoteResponse();
        quotes.Quotes = inventory.BuildQuotesFor(request.Items);
        context.Response.Headers[CorrelationHeaders.CorrelationId] = correlationId;
        return Results.Ok(quotes);
    })
    .WithName("RequestQuote")
    .WithOpenApi();

app.MapPost("/api/orders", (DistributorOrderRequest request, InventoryService inventory, HttpContext context) =>
    {
        var correlationId = GetCorrelationId(context);
        try
        {
            var confirmation = inventory.PlaceOrder(request);
            context.Response.Headers[CorrelationHeaders.CorrelationId] = correlationId;
            return Results.Ok(confirmation);
        }
        catch (InvalidOperationException ex)
        {
            return Results.BadRequest(new { message = ex.Message });
        }
    })
    .WithName("PlaceDistributorOrder")
    .WithOpenApi();

app.Run();

static string GetCorrelationId(HttpContext context) =>
    context.Items.TryGetValue(CorrelationHeaders.CorrelationId, out var value) && value is string id
        ? id
        : Guid.NewGuid().ToString();

public partial class Program;

record InventoryItem(string ProductId, decimal UnitPrice, int Stock, int EstimatedDeliveryDays);

class InventoryService
{
    private readonly string _distributorName;
    private readonly string _orderPrefix;
    private readonly Dictionary<string, InventoryItem> _inventory;
    private int _orderCounter = 1000;
    private readonly object _syncRoot = new();

    public InventoryService(string distributorName, string orderPrefix, IEnumerable<InventoryItem> seed)
    {
        _distributorName = distributorName;
        _orderPrefix = orderPrefix;
        _inventory = seed.ToDictionary(x => x.ProductId, StringComparer.OrdinalIgnoreCase);
    }

    public QuoteResponse BuildQuoteResponse() => new()
    {
        Distributor = _distributorName,
        Quotes = new List<QuoteItemResponse>()
    };

    public List<QuoteItemResponse> BuildQuotesFor(IEnumerable<QuoteItemRequest> requests)
    {
        if (requests is null)
        {
            return new List<QuoteItemResponse>();
        }

        var quotes = new List<QuoteItemResponse>();

        foreach (var request in requests)
        {
            if (_inventory.TryGetValue(request.ProductId, out var item))
            {
                quotes.Add(new QuoteItemResponse
                {
                    ProductId = request.ProductId,
                    UnitPrice = item.UnitPrice,
                    AvailableQty = item.Stock,
                    EstimatedDeliveryDays = item.EstimatedDeliveryDays
                });
            }
            else
            {
                quotes.Add(new QuoteItemResponse
                {
                    ProductId = request.ProductId,
                    UnitPrice = 0,
                    AvailableQty = 0,
                    EstimatedDeliveryDays = 0
                });
            }
        }

        return quotes;
    }

    public DistributorOrderResponse PlaceOrder(DistributorOrderRequest request)
    {
        lock (_syncRoot)
        {
            foreach (var allocation in request.Allocations)
            {
                if (!_inventory.TryGetValue(allocation.ProductId, out var item))
                {
                    throw new InvalidOperationException($"Unknown product {allocation.ProductId}");
                }

                if (allocation.Quantity > item.Stock)
                {
                    throw new InvalidOperationException($"Insufficient stock for {allocation.ProductId}");
                }
            }

            foreach (var allocation in request.Allocations)
            {
                var item = _inventory[allocation.ProductId];
                _inventory[allocation.ProductId] = item with { Stock = item.Stock - allocation.Quantity };
            }

            var deliveryDays = request.Allocations
                .Select(a => _inventory.TryGetValue(a.ProductId, out var item)
                    ? item.EstimatedDeliveryDays
                    : 0)
                .DefaultIfEmpty(0)
                .Max();

            var orderId = $"{_orderPrefix}-{Interlocked.Increment(ref _orderCounter)}";

            return new DistributorOrderResponse
            {
                Distributor = _distributorName,
                DistributorOrderId = orderId,
                ConfirmedDeliveryDays = deliveryDays
            };
        }
    }
}
