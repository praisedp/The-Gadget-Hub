namespace GadgetHub.OrderService.Clients;

public class GadgetCentralClient : DistributorClientBase
{
    public GadgetCentralClient(HttpClient httpClient) : base(httpClient)
    {
    }

    public override string DistributorName => "GadgetCentral";
}
