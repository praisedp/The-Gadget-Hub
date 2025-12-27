namespace GadgetHub.OrderService.Configuration;

public class DistributorClientOptions
{
    public string TechWorld { get; set; } = "http://localhost:5101";
    public string ElectroCom { get; set; } = "http://localhost:5102";
    public string GadgetCentral { get; set; } = "http://localhost:5103";
}
