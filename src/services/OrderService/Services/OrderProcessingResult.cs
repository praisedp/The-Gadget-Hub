using GadgetHub.Contracts.Orders;

namespace GadgetHub.OrderService.Services;

public class OrderProcessingResult
{
    private OrderProcessingResult(OrderSuccessResponse? success, OrderRejectedResponse? rejection)
    {
        SuccessResponse = success;
        Rejection = rejection;
    }

    public bool Success => SuccessResponse is not null;
    public OrderSuccessResponse? SuccessResponse { get; }
    public OrderRejectedResponse? Rejection { get; }

    public static OrderProcessingResult FromSuccess(OrderSuccessResponse response) => new(response, null);
    public static OrderProcessingResult FromFailure(OrderRejectedResponse response) => new(null, response);
}
