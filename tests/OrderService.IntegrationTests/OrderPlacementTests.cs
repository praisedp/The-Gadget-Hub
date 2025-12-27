using System.Net.Http.Json;
using GadgetHub.Contracts.Orders;
using GadgetHub.OrderService.Clients;
using GadgetHub.OrderService;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace OrderService.IntegrationTests;

public class OrderPlacementTests
{
    [Fact]
    public async Task Places_order_and_returns_allocations()
    {
        await using var techFactory = new WebApplicationFactory<TechWorld.Api.AssemblyMarker>();
        await using var electroFactory = new WebApplicationFactory<ElectroCom.Api.AssemblyMarker>();
        await using var gadgetFactory = new WebApplicationFactory<GadgetCentral.Api.AssemblyMarker>();

        Console.WriteLine($"TechWorld base: {techFactory.Server.BaseAddress}");
        Console.WriteLine($"ElectroCom base: {electroFactory.Server.BaseAddress}");
        Console.WriteLine($"GadgetCentral base: {gadgetFactory.Server.BaseAddress}");

        var orderFactory = CreateOrderServiceFactory(techFactory, electroFactory, gadgetFactory);
        await using var factory = orderFactory;
        var client = factory.CreateClient();

        var request = new CreateOrderRequest
        {
            CustomerName = "Integration Tester",
            Items = new List<OrderItemRequest>
            {
                new() { ProductId = "P1001", Quantity = 2 },
                new() { ProductId = "P1002", Quantity = 1 }
            }
        };

        var response = await client.PostAsJsonAsync("/api/orders", request);
        var raw = await response.Content.ReadAsStringAsync();
        Assert.True(response.IsSuccessStatusCode, $"OrderService returned {(int)response.StatusCode}: {raw}");

        var payload = await response.Content.ReadFromJsonAsync<OrderSuccessResponse>();
        Assert.NotNull(payload);
        Assert.Equal("Confirmed", payload!.Status);
        Assert.Equal(request.Items.Count, payload.Allocations.Select(a => a.ProductId).Distinct().Count());
        Assert.True(payload.FinalEstimatedDeliveryDays > 0);
    }

    private static WebApplicationFactory<AssemblyMarker> CreateOrderServiceFactory(
        WebApplicationFactory<TechWorld.Api.AssemblyMarker> techWorld,
        WebApplicationFactory<ElectroCom.Api.AssemblyMarker> electroCom,
        WebApplicationFactory<GadgetCentral.Api.AssemblyMarker> gadgetCentral) =>
        new WebApplicationFactory<AssemblyMarker>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureAppConfiguration((_, config) =>
                {
                    var overrides = new Dictionary<string, string?>
                    {
                        ["DistributorClients:TechWorld"] = techWorld.Server.BaseAddress.ToString(),
                        ["DistributorClients:ElectroCom"] = electroCom.Server.BaseAddress.ToString(),
                        ["DistributorClients:GadgetCentral"] = gadgetCentral.Server.BaseAddress.ToString()
                    };
                    config.AddInMemoryCollection(overrides!);
                });
                builder.ConfigureTestServices(services =>
                {
                    services.RemoveAll<IDistributorClient>();
                    services.AddSingleton<IDistributorClient>(
                        new TechWorldClient(techWorld.CreateDefaultClient()));
                    services.AddSingleton<IDistributorClient>(
                        new ElectroComClient(electroCom.CreateDefaultClient()));
                    services.AddSingleton<IDistributorClient>(
                        new GadgetCentralClient(gadgetCentral.CreateDefaultClient()));
                });
            });
}
