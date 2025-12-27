using System.Collections.Generic;

namespace GadgetHub.Contracts.Orders;

public class OrderAllocation
{
    public string ProductId { get; set; } = string.Empty;
    public string Distributor { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public int DeliveryDays { get; set; }
}

public class DistributorOrderInfo
{
    public string Distributor { get; set; } = string.Empty;
    public string DistributorOrderId { get; set; } = string.Empty;
    public int DeliveryDays { get; set; }
}

public class OrderSuccessResponse
{
    public string OrderId { get; set; } = string.Empty;
    public string Status { get; set; } = "Confirmed";
    public int FinalEstimatedDeliveryDays { get; set; }
    public List<OrderAllocation> Allocations { get; set; } = new();
    public List<DistributorOrderInfo> DistributorOrders { get; set; } = new();
}

public class Shortfall
{
    public string ProductId { get; set; } = string.Empty;
    public int Requested { get; set; }
    public int AvailableTotal { get; set; }
    public int Missing { get; set; }
}

public class OrderRejectedResponse
{
    public string Status { get; set; } = "Rejected";
    public string Message { get; set; } = string.Empty;
    public List<Shortfall> Shortfalls { get; set; } = new();
}
