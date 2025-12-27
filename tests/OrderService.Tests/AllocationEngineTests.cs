using GadgetHub.Contracts.Distributors;
using GadgetHub.Contracts.Orders;
using GadgetHub.OrderService.Services;

namespace OrderService.Tests;

public class AllocationEngineTests
{
    private readonly AllocationEngine _engine = new();

    [Fact]
    public void Chooses_cheapest_when_stock_sufficient()
    {
        var request = CreateRequest("P1001", 2);
        var quotes = new[]
        {
            new QuoteResponse
            {
                Distributor = "TechWorld",
                Quotes = new()
                {
                    new QuoteItemResponse { ProductId = "P1001", UnitPrice = 100m, AvailableQty = 5, EstimatedDeliveryDays = 3 }
                }
            },
            new QuoteResponse
            {
                Distributor = "ElectroCom",
                Quotes = new()
                {
                    new QuoteItemResponse { ProductId = "P1001", UnitPrice = 120m, AvailableQty = 5, EstimatedDeliveryDays = 2 }
                }
            }
        };

        var result = _engine.Allocate(request, quotes);

        Assert.True(result.Success);
        var allocation = Assert.Single(result.Allocations);
        Assert.Equal("TechWorld", allocation.Distributor);
        Assert.Equal(2, allocation.Quantity);
        Assert.Equal(100m, allocation.UnitPrice);
    }

    [Fact]
    public void Uses_fastest_delivery_when_prices_equal()
    {
        var request = CreateRequest("P1002", 1);
        var quotes = new[]
        {
            new QuoteResponse
            {
                Distributor = "GadgetCentral",
                Quotes = new()
                {
                    new QuoteItemResponse { ProductId = "P1002", UnitPrice = 90m, AvailableQty = 3, EstimatedDeliveryDays = 5 }
                }
            },
            new QuoteResponse
            {
                Distributor = "TechWorld",
                Quotes = new()
                {
                    new QuoteItemResponse { ProductId = "P1002", UnitPrice = 90m, AvailableQty = 3, EstimatedDeliveryDays = 2 }
                }
            }
        };

        var result = _engine.Allocate(request, quotes);

        var allocation = Assert.Single(result.Allocations);
        Assert.Equal("TechWorld", allocation.Distributor);
        Assert.Equal(2, allocation.DeliveryDays);
    }

    [Fact]
    public void Splits_across_distributors_when_needed()
    {
        var request = CreateRequest("P1003", 6);
        var quotes = new[]
        {
            new QuoteResponse
            {
                Distributor = "ElectroCom",
                Quotes = new()
                {
                    new QuoteItemResponse { ProductId = "P1003", UnitPrice = 80m, AvailableQty = 3, EstimatedDeliveryDays = 4 }
                }
            },
            new QuoteResponse
            {
                Distributor = "GadgetCentral",
                Quotes = new()
                {
                    new QuoteItemResponse { ProductId = "P1003", UnitPrice = 82m, AvailableQty = 5, EstimatedDeliveryDays = 3 }
                }
            }
        };

        var result = _engine.Allocate(request, quotes);

        Assert.True(result.Success);
        Assert.Equal(2, result.Allocations.Count);
        Assert.Equal(3, result.Allocations.First(a => a.Distributor == "ElectroCom").Quantity);
        Assert.Equal(3, result.Allocations.First(a => a.Distributor == "GadgetCentral").Quantity);
    }

    [Fact]
    public void Rejects_when_total_stock_insufficient()
    {
        var request = CreateRequest("P1004", 6);
        var quotes = new[]
        {
            new QuoteResponse
            {
                Distributor = "TechWorld",
                Quotes = new()
                {
                    new QuoteItemResponse { ProductId = "P1004", UnitPrice = 200m, AvailableQty = 2, EstimatedDeliveryDays = 6 }
                }
            },
            new QuoteResponse
            {
                Distributor = "ElectroCom",
                Quotes = new()
                {
                    new QuoteItemResponse { ProductId = "P1004", UnitPrice = 190m, AvailableQty = 2, EstimatedDeliveryDays = 5 }
                }
            }
        };

        var result = _engine.Allocate(request, quotes);

        Assert.False(result.Success);
        var shortfall = Assert.Single(result.Shortfalls);
        Assert.Equal("P1004", shortfall.ProductId);
        Assert.Equal(6, shortfall.Requested);
        Assert.Equal(4, shortfall.AvailableTotal);
        Assert.Equal(2, shortfall.Missing);
    }

    private static CreateOrderRequest CreateRequest(string productId, int quantity) =>
        new()
        {
            CustomerName = "Test Customer",
            Items = new List<OrderItemRequest>
            {
                new() { ProductId = productId, Quantity = quantity }
            }
        };
}
