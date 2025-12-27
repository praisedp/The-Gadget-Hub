using System.Collections.Generic;

namespace GadgetHub.Contracts.Distributors;

public class DistributorOrderAllocation
{
    public string ProductId { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class DistributorOrderRequest
{
    public string CustomerOrderId { get; set; } = string.Empty;
    public List<DistributorOrderAllocation> Allocations { get; set; } = new();
}

public class DistributorOrderResponse
{
    public string Distributor { get; set; } = string.Empty;
    public string DistributorOrderId { get; set; } = string.Empty;
    public int ConfirmedDeliveryDays { get; set; }
}
