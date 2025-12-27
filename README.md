# The Gadget Hub

Service-oriented demo that routes customer orders across multiple distributor APIs, aggregates availability, and serves a small React client.

## Stack

- .NET 8 APIs: order coordinator + three distributor stubs
- React + Vite client (TypeScript)
- Docker Compose for local orchestration

## Prerequisites

- Docker Desktop (for the easiest path)
- Optional for local (non-Docker) dev: .NET 8 SDK, Node 20+ with npm

## Quick Start (Docker Compose)

1. Build and run everything:

```
docker compose up --build
```

2. Open the client: http://localhost:5173
3. Place an order. The client talks to OrderService at http://localhost:5005.

### What gets exposed

- OrderService: http://localhost:5005
- TechWorld distributor: http://localhost:5101
- ElectroCom distributor: http://localhost:5102
- GadgetCentral distributor: http://localhost:5103
- Client (static): http://localhost:5173

### Compose details

- Compose builds all services from the local sources.
- `VITE_API_BASE_URL` build arg for the client defaults to `http://localhost:5005` (set in docker-compose.yml).
- If you change service ports, also adjust the client build arg.

### Useful Docker commands

- Stop and remove containers: `docker compose down`
- Rebuild after code changes: `docker compose build`
- Tail logs for one service: `docker compose logs -f orderservice`

## Local Run Without Docker

Run each service in its own shell.

1. Start distributors

```
dotnet run --project src/services/distributors/TechWorld.Api/TechWorld.Api.csproj --urls http://localhost:5101
dotnet run --project src/services/distributors/ElectroCom.Api/ElectroCom.Api.csproj --urls http://localhost:5102
dotnet run --project src/services/distributors/GadgetCentral.Api/GadgetCentral.Api.csproj --urls http://localhost:5103
```

2. Start OrderService

```
dotnet run --project src/services/OrderService/OrderService.csproj --urls http://localhost:5005
```

3. Start the client

```
cd src/client/GadgetHub.Client
npm install
VITE_API_BASE_URL=http://localhost:5005 npm run dev -- --host --port 5173
```

4. Browse to http://localhost:5173

## API Exploration

- Swagger UI is enabled on every API at `/swagger` (e.g., http://localhost:5005/swagger).
- Correlation: send `X-Correlation-ID` to have it echoed by services.

### Sample requests

Create order (happy path):

```
curl -X POST http://localhost:5005/api/orders \
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
curl -X POST http://localhost:5005/api/orders \
  -H "Content-Type: application/json" \
  -d '{
        "customerName": "Acme Corp",
        "items": [{ "productId": "P1001", "quantity": 999 }]
      }'
```

## Tests

Run all unit + integration tests:

```
dotnet test GadgetHub.sln
```

## Project Layout

- src/services/OrderService: order orchestration + allocation
- src/services/distributors/\*: distributor stubs
- src/client/GadgetHub.Client: React frontend
- docs/: architecture notes and reports
