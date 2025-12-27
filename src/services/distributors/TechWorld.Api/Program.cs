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

builder.Services.AddSingleton(new InventoryService("TechWorld", "TW", new List<InventoryItem>
{
    new("P1001", 120m, 10, 3),
    new("P1002", 90m, 5, 4),
    new("P1003", 75m, 8, 2),
    new("P1004", 200m, 3, 6),
    new("P1005", 150m, 6, 5),
    new("P1006", 780m, 4, 5),
    new("P1007", 330m, 7, 4),
    new("P1008", 110m, 12, 2),
    new("P1009", 65m, 10, 2),
    new("P1010", 180m, 5, 3),
    new("P1011", 110m, 8, 3),
    new("P1012", 120m, 6, 3),
    new("P1013", 65m, 14, 2),
    new("P1014", 140m, 6, 4),
    new("P1015", 280m, 5, 4),
    new("P1016", 220m, 4, 5),
    new("P1017", 450m, 5, 3),
    new("P1018", 48m, 20, 2),
    new("P1019", 175m, 5, 3),
    new("P1020", 160m, 7, 3),
    new("P1021", 380m, 4, 4),
    new("P1022", 65m, 12, 2),
    new("P1023", 42m, 25, 2),
    new("P1024", 210m, 6, 3)
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
        context.Response.Headers[CorrelationHeaders.CorrelationId] = correlationId;
        quotes.Quotes = inventory.BuildQuotesFor(request.Items);
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
