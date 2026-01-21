defmodule FulalaAdminWeb.CategoriesLive do
  use FulalaAdminWeb, :live_view

  alias FulalaAdmin.ConvexClient

  @impl true
  def mount(_params, _session, socket) do
    {:ok, categories} = ConvexClient.list_categories()

    {:ok,
     assign(socket,
       page_title: "Categories",
       categories: categories || [],
       loading: false
     )}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-heading text-fulala-red">Categories</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <%= for category <- @categories do %>
          <div class="p-4 bg-white rounded-xl shadow-sm border-2 border-tiger-orange">
            <h3 class="text-xl font-heading text-ink-black"><%= category["name"] %></h3>
            <p class="text-sm text-soy-brown/50">Slug: <%= category["slug"] %></p>
            <%= if category["description"] do %>
              <p class="text-sm text-soy-brown/70 mt-2"><%= category["description"] %></p>
            <% end %>
            <p class="text-xs text-soy-brown/50 mt-2">Sort Order: <%= category["sortOrder"] %></p>
          </div>
        <% end %>

        <%= if @categories == [] do %>
          <div class="col-span-full text-center py-8 bg-tiger-orange/20 rounded-xl">
            <p class="text-soy-brown/70">No categories yet.</p>
            <p class="text-sm text-soy-brown/50">Categories are created when you add menu items.</p>
          </div>
        <% end %>
      </div>
    </div>
    """
  end
end
