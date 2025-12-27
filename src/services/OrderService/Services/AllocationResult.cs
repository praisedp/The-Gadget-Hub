using GadgetHub.Contracts.Orders;

namespace GadgetHub.OrderService.Services;

public class AllocationResult
{
    public AllocationResult(List<OrderAllocation> allocations, List<Shortfall> shortfalls)
    {
        Allocations = allocations;
        Shortfalls = shortfalls;
    }

    public bool Success => Shortfalls.Count == 0;
    public List<OrderAllocation> Allocations { get; }
    public List<Shortfall> Shortfalls { get; }
}
