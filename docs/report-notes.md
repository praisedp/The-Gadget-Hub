# Report Notes

## Monolithic vs SOA
- Monolith: simpler deployment and debugging early on, but slower feature isolation and higher blast-radius for failures as services grow.
- SOA: clear bounded contexts (order orchestration vs distributor inventory) improve maintainability and enable independent deployments per distributor.
- SOA scales horizontally per service (e.g., scale OrderService heavier during sales) and allows technology diversity per service if needed.
- Integration costs rise in SOA (contracts, versioning, latency); contracts in `GadgetHub.Contracts` keep DTOs aligned to reduce drift.

## Testing & Debugging
- Unit tests exercise AllocationEngine rules (cheapest, tie-breaker on delivery, split, shortfall rejection).
- Integration test spins up all APIs via `WebApplicationFactory` to validate real HTTP calls and allocations.
- Correlation IDs flow through every hop (`X-Correlation-ID`) to trace requests across logs; Swagger available on every API for quick manual checks.
- Enable structured logging at host level to centralize traces when running multiple services.

## Deployment
- Server/VM: run each API with fixed ports (5000/5101/5102/5103) and host the Vite build on any static server.
- Docker Compose: `docker compose up --build` brings the full stack up with networked service discovery; good for dev/QA.
- Kubernetes: container images from the provided Dockerfiles can be pushed and deployed with services (ClusterIP per API) and an Ingress for OrderService/client; config maps can carry distributor base URLs per environment.
