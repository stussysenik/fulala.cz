defmodule FulalaAdmin.Application do
  @moduledoc false
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      FulalaAdminWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:fulala_admin, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: FulalaAdmin.PubSub},
      FulalaAdminWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: FulalaAdmin.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    FulalaAdminWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
