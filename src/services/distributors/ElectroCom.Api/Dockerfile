FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5102
ENV ASPNETCORE_URLS=http://+:5102

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore GadgetHub.sln
RUN dotnet publish src/services/distributors/ElectroCom.Api/ElectroCom.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ElectroCom.Api.dll"]
