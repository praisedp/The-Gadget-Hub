namespace GadgetHub.OrderService.Clients;

public class ElectroComClient : DistributorClientBase
{
    public ElectroComClient(HttpClient httpClient) : base(httpClient)
    {
    }

    public override string DistributorName => "ElectroCom";
}
