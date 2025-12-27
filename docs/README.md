# The Gadget Hub - Service Oriented Computing Demo

## Prerequisites
- .NET 8 SDK
- Node 20+ and npm (for the React client)
- Docker + Docker Compose (optional for containerized run)

## Local Run (without Docker)
1) Start distributor APIs (each in a separate shell):
```
dotnet run --project src/services/distributors/TechWorld.Api/TechWorld.Api.csproj --urls http://localhost:5101
dotnet run --project src/services/distributors/ElectroCom.Api/ElectroCom.Api.csproj --urls http://localhost:5102
dotnet run --project src/services/distributors/GadgetCentral.Api/GadgetCentral.Api.csproj --urls http://localhost:5103
```
2) Start OrderService:
```
dotnet run --project src/services/OrderService/OrderService.csproj --urls http://localhost:5000
```
3) Start the client:
```
cd src/client/GadgetHub.Client
npm install
VITE_API_BASE_URL=http://localhost:5000 npm run dev -- --host --port 5173
```
4) Browse to http://localhost:5173 and place an order.

## Docker Compose
Build and run everything:
```
docker compose up --build
```
Services and ports:
- OrderService: http://localhost:5000
- TechWorld: http://localhost:5101
- ElectroCom: http://localhost:5102
- GadgetCentral: http://localhost:5103
- Client (static): http://localhost:5173

## Tests
Run the full test suite (unit + integration):
```
dotnet test GadgetHub.sln
```

## Sample Requests
Successful order:
```
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
        "customerName": "Acme Corp",
        "items": [
          { "productId": "P1001", "quantity": 2 },
          { "productId": "P1002", "quantity": 1 }
        ]
      }'
```

Insufficient stock (returns 409):
```
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
        "customerName": "Acme Corp",
        "items": [{ "productId": "P1001", "quantity": 999 }]
      }'
```

## Notes
- Correlation header: `X-Correlation-ID` is accepted and echoed by all services.
- Swagger is enabled on all APIs for quick exploration. Access via `/swagger`.
