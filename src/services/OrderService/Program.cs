using GadgetHub.Contracts.Orders;
using GadgetHub.Contracts.Shared;
using GadgetHub.OrderService.Clients;
using GadgetHub.OrderService.Configuration;
using GadgetHub.OrderService.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();
builder.Services.Configure<DistributorClientOptions>(builder.Configuration.GetSection("DistributorClients"));
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddHttpClient<TechWorldClient>((sp, client) =>
{
    var options = sp.GetRequiredService<IOptions<DistributorClientOptions>>().Value;
    client.BaseAddress = new Uri(options.TechWorld);
});
builder.Services.AddHttpClient<ElectroComClient>((sp, client) =>
{
    var options = sp.GetRequiredService<IOptions<DistributorClientOptions>>().Value;
    client.BaseAddress = new Uri(options.ElectroCom);
});
builder.Services.AddHttpClient<GadgetCentralClient>((sp, client) =>
{
    var options = sp.GetRequiredService<IOptions<DistributorClientOptions>>().Value;
    client.BaseAddress = new Uri(options.GadgetCentral);
});

builder.Services.AddScoped<IDistributorClient>(sp => sp.GetRequiredService<TechWorldClient>());
builder.Services.AddScoped<IDistributorClient>(sp => sp.GetRequiredService<ElectroComClient>());
builder.Services.AddScoped<IDistributorClient>(sp => sp.GetRequiredService<GadgetCentralClient>());
builder.Services.AddSingleton<AllocationEngine>();
builder.Services.AddScoped<OrderProcessor>();

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

    var scopeLogger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("Correlation");
    using var _ = scopeLogger.BeginScope(new Dictionary<string, object>
    {
        { "CorrelationId", correlationId }
    });

    await next();
});

app.MapPost("/api/orders", async Task<Results<Ok<OrderSuccessResponse>, Conflict<OrderRejectedResponse>, ValidationProblem>> (
    CreateOrderRequest request,
    OrderProcessor orderProcessor,
    HttpContext context) =>
{
    var validationErrors = Validate(request);
    if (validationErrors.Count > 0)
    {
        return TypedResults.ValidationProblem(validationErrors);
    }

    var correlationId = GetCorrelationId(context);
    var result = await orderProcessor.ProcessAsync(request, correlationId, context.RequestAborted);

    return result.Success
        ? TypedResults.Ok(result.SuccessResponse!)
        : TypedResults.Conflict(result.Rejection!);
})
.WithName("CreateOrder")
.WithOpenApi();

app.Run();

static Dictionary<string, string[]> Validate(CreateOrderRequest request)
{
    var errors = new Dictionary<string, string[]>();

    if (string.IsNullOrWhiteSpace(request.CustomerName))
    {
        errors["customerName"] = new[] { "Customer name is required." };
    }

    if (request.Items is null || request.Items.Count == 0)
    {
        errors["items"] = new[] { "At least one item is required." };
        return errors;
    }

    var itemErrors = new List<string>();
    for (var i = 0; i < request.Items.Count; i++)
    {
        var item = request.Items[i];
        if (string.IsNullOrWhiteSpace(item.ProductId))
        {
            itemErrors.Add($"Item {i + 1}: productId is required.");
        }
        if (item.Quantity <= 0)
        {
            itemErrors.Add($"Item {i + 1}: quantity must be greater than zero.");
        }
    }

    if (itemErrors.Count > 0)
    {
        errors["items"] = itemErrors.ToArray();
    }

    return errors;
}

static string GetCorrelationId(HttpContext context) =>
    context.Items.TryGetValue(CorrelationHeaders.CorrelationId, out var value) && value is string id
        ? id
        : Guid.NewGuid().ToString();

public partial class Program;
