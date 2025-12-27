using System.Collections.Generic;

namespace GadgetHub.Contracts.Distributors;

public class QuoteRequest
{
    public List<QuoteItemRequest> Items { get; set; } = new();
}

public class QuoteItemRequest
{
    public string ProductId { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class QuoteItemResponse
{
    public string ProductId { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int AvailableQty { get; set; }
    public int EstimatedDeliveryDays { get; set; }
}

public class QuoteResponse
{
    public string Distributor { get; set; } = string.Empty;
    public List<QuoteItemResponse> Quotes { get; set; } = new();
}
