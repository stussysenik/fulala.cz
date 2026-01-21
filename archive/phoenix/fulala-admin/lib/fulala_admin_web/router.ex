defmodule FulalaAdminWeb.Router do
  use FulalaAdminWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {FulalaAdminWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  # Admin Dashboard (LiveView)
  scope "/", FulalaAdminWeb do
    pipe_through :browser

    live "/", DashboardLive, :index
    live "/menu", MenuLive, :index
    live "/menu/new", MenuLive, :new
    live "/menu/:id/edit", MenuLive, :edit
    live "/categories", CategoriesLive, :index
    live "/settings", SettingsLive, :index
    live "/media", MediaLive, :index
    live "/preview", PreviewLive, :index
  end

  # API routes for real-time sync with public site
  scope "/api", FulalaAdminWeb do
    pipe_through :api

    get "/menu", ApiController, :list_menu
    post "/menu", ApiController, :create_menu_item
    put "/menu/:id", ApiController, :update_menu_item
    delete "/menu/:id", ApiController, :delete_menu_item
  end

  # Enable LiveDashboard in development
  if Application.compile_env(:fulala_admin, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: FulalaAdminWeb.Telemetry
    end
  end
end
