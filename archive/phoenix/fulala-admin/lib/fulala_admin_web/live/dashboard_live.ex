defmodule FulalaAdminWeb.DashboardLive do
  use FulalaAdminWeb, :live_view

  alias FulalaAdmin.ConvexClient

  @impl true
  def mount(_params, _session, socket) do
    # Fetch dashboard stats
    {:ok, menu_items} = ConvexClient.list_menu_items()
    {:ok, categories} = ConvexClient.list_categories()

    {:ok,
     assign(socket,
       page_title: "Dashboard",
       menu_count: length(menu_items || []),
       category_count: length(categories || [])
     )}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6">
      <h1 class="text-4xl font-heading text-fulala-red mb-8">Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <.stat_card title="Menu Items" value={@menu_count} icon="🥟" link="/menu" />
        <.stat_card title="Categories" value={@category_count} icon="📂" link="/categories" />
        <.stat_card title="Settings" value="→" icon="⚙️" link="/settings" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <.quick_action title="Add Menu Item" description="Create a new menu item" link="/menu/new" />
        <.quick_action title="View Site" description="Preview the public site" link="/preview" />
        <.quick_action title="Media Library" description="Manage images and files" link="/media" />
        <.quick_action title="Site Settings" description="Update restaurant info" link="/settings" />
      </div>
    </div>
    """
  end

  defp stat_card(assigns) do
    ~H"""
    <.link navigate={@link} class="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-2 border-tiger-orange">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-soy-brown/70"><%= @title %></p>
          <p class="text-3xl font-heading text-ink-black"><%= @value %></p>
        </div>
        <span class="text-4xl"><%= @icon %></span>
      </div>
    </.link>
    """
  end

  defp quick_action(assigns) do
    ~H"""
    <.link navigate={@link} class="block p-4 bg-tiger-orange/30 rounded-xl hover:bg-tiger-orange/50 transition-colors">
      <h3 class="text-lg font-medium text-ink-black"><%= @title %></h3>
      <p class="text-sm text-soy-brown/70"><%= @description %></p>
    </.link>
    """
  end
end
