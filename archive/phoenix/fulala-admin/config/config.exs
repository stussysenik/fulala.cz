# General application configuration
import Config

config :fulala_admin,
  generators: [timestamp_type: :utc_datetime]

# Configures the endpoint
config :fulala_admin, FulalaAdminWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Phoenix.Endpoint.Cowboy2Adapter,
  render_errors: [
    formats: [html: FulalaAdminWeb.ErrorHTML, json: FulalaAdminWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: FulalaAdmin.PubSub,
  live_view: [signing_salt: "fulala_salt_here"]

# Convex configuration
config :fulala_admin, :convex,
  url: System.get_env("CONVEX_URL") || "https://your-project.convex.cloud",
  deploy_key: System.get_env("CONVEX_DEPLOY_KEY")

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.17.11",
  default: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.3.2",
  default: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
