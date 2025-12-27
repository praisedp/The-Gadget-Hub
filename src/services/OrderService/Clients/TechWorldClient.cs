namespace GadgetHub.OrderService.Clients;

public class TechWorldClient : DistributorClientBase
{
    public TechWorldClient(HttpClient httpClient) : base(httpClient)
    {
    }

    public override string DistributorName => "TechWorld";
}
