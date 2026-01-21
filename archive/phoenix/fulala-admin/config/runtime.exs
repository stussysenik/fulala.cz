import Config

# config/runtime.exs is executed for all environments, including
# during releases. It is executed after compilation and before the
# temporary compilation database is purged.

if config_env() == :prod do
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  host = System.get_env("PHX_HOST") || "example.com"
  port = String.to_integer(System.get_env("PORT") || "4000")

  config :fulala_admin, FulalaAdminWeb.Endpoint,
    url: [host: host, port: 443, scheme: "https"],
    http: [
      ip: {0, 0, 0, 0, 0, 0, 0, 0},
      port: port
    ],
    secret_key_base: secret_key_base

  # Convex configuration for production
  config :fulala_admin, :convex,
    url: System.get_env("CONVEX_URL") ||
      raise("environment variable CONVEX_URL is missing."),
    deploy_key: System.get_env("CONVEX_DEPLOY_KEY") ||
      raise("environment variable CONVEX_DEPLOY_KEY is missing.")
end
