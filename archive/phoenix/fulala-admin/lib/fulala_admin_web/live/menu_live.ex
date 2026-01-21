defmodule FulalaAdminWeb.MenuLive do
  use FulalaAdminWeb, :live_view

  alias FulalaAdmin.ConvexClient

  @impl true
  def mount(_params, _session, socket) do
    {:ok, menu_items} = ConvexClient.list_menu_items()
    {:ok, categories} = ConvexClient.list_categories()

    {:ok,
     assign(socket,
       page_title: "Menu Management",
       menu_items: menu_items || [],
       categories: categories || [],
       form: nil,
       editing_item: nil,
       loading: false
     )}
  end

  @impl true
  def handle_params(params, _uri, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :index, _params) do
    assign(socket, form: nil, editing_item: nil)
  end

  defp apply_action(socket, :new, _params) do
    form = to_form(%{
      "title" => "",
      "description" => "",
      "price" => "",
      "priceDisplay" => "",
      "category" => "",
      "isAvailable" => true,
      "sortOrder" => 0
    })
    assign(socket, form: form, editing_item: nil)
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    item = Enum.find(socket.assigns.menu_items, &(&1["_id"] == id))
    if item do
      form = to_form(item)
      assign(socket, form: form, editing_item: item)
    else
      socket
      |> put_flash(:error, "Menu item not found")
      |> push_navigate(to: ~p"/menu")
    end
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    socket = assign(socket, loading: true)

    case ConvexClient.delete_menu_item(id) do
      {:ok, _} ->
        {:ok, menu_items} = ConvexClient.list_menu_items()
        {:noreply,
         socket
         |> assign(menu_items: menu_items || [], loading: false)
         |> put_flash(:info, "Menu item deleted!")}

      {:error, _} ->
        {:noreply,
         socket
         |> assign(loading: false)
         |> put_flash(:error, "Failed to delete menu item")}
    end
  end

  @impl true
  def handle_event("save", %{"menu_item" => params}, socket) do
    socket = assign(socket, loading: true)

    attrs = %{
      title: params["title"],
      description: params["description"],
      price: String.to_integer(params["price"] || "0"),
      priceDisplay: params["priceDisplay"],
      category: params["category"],
      isAvailable: params["isAvailable"] == "true",
      sortOrder: String.to_integer(params["sortOrder"] || "0")
    }

    result = if socket.assigns.editing_item do
      ConvexClient.update_menu_item(socket.assigns.editing_item["_id"], attrs)
    else
      ConvexClient.create_menu_item(attrs)
    end

    case result do
      {:ok, _} ->
        {:ok, menu_items} = ConvexClient.list_menu_items()
        {:noreply,
         socket
         |> assign(menu_items: menu_items || [], loading: false)
         |> put_flash(:info, "Menu item saved!")
         |> push_navigate(to: ~p"/menu")}

      {:error, _} ->
        {:noreply,
         socket
         |> assign(loading: false)
         |> put_flash(:error, "Failed to save menu item")}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-heading text-fulala-red">Menu Items</h1>
        <.link navigate={~p"/menu/new"} class="btn-primary">
          + Add Item
        </.link>
      </div>

      <%= if @form do %>
        <.menu_form form={@form} categories={@categories} editing={@editing_item != nil} loading={@loading} />
      <% else %>
        <.menu_list items={@menu_items} loading={@loading} />
      <% end %>
    </div>
    """
  end

  defp menu_list(assigns) do
    ~H"""
    <div class="space-y-4">
      <%= if @loading do %>
        <div class="text-center py-8">
          <span class="animate-spin text-4xl">🥟</span>
          <p class="text-soy-brown/70 mt-2">Loading...</p>
        </div>
      <% else %>
        <%= for item <- @items do %>
          <.menu_item item={item} />
        <% end %>

        <%= if @items == [] do %>
          <div class="text-center py-8 bg-tiger-orange/20 rounded-xl">
            <p class="text-soy-brown/70">No menu items yet.</p>
            <.link navigate={~p"/menu/new"} class="text-fulala-red hover:underline">
              Add your first item →
            </.link>
          </div>
        <% end %>
      <% end %>
    </div>
    """
  end

  defp menu_item(assigns) do
    ~H"""
    <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-2 border-tiger-orange">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h3 class="text-xl font-heading text-ink-black"><%= @item["title"] %></h3>
          <%= unless @item["isAvailable"] do %>
            <span class="text-xs px-2 py-1 bg-soy-brown/10 text-soy-brown rounded">Unavailable</span>
          <% end %>
        </div>
        <p class="text-sm text-soy-brown/70"><%= @item["description"] %></p>
        <p class="text-sm text-soy-brown/50 mt-1">Category: <%= @item["category"] %></p>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-xl font-heading text-fulala-red"><%= @item["priceDisplay"] %></span>
        <div class="flex gap-2">
          <.link navigate={~p"/menu/#{@item["_id"]}/edit"} class="px-3 py-1 bg-tiger-orange rounded hover:bg-tiger-orange/80">
            Edit
          </.link>
          <button
            phx-click="delete"
            phx-value-id={@item["_id"]}
            data-confirm="Are you sure you want to delete this item?"
            class="px-3 py-1 bg-fulala-red/10 text-fulala-red rounded hover:bg-fulala-red/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    """
  end

  defp menu_form(assigns) do
    ~H"""
    <div class="max-w-2xl bg-white rounded-xl shadow-sm border-2 border-tiger-orange p-6">
      <h2 class="text-2xl font-heading text-ink-black mb-6">
        <%= if @editing, do: "Edit Menu Item", else: "New Menu Item" %>
      </h2>

      <.form for={@form} phx-submit="save" class="space-y-4">
        <div>
          <label class="block text-sm text-soy-brown/70 mb-1">Title</label>
          <input
            type="text"
            name="menu_item[title]"
            value={@form[:title].value}
            required
            class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm text-soy-brown/70 mb-1">Description</label>
          <textarea
            name="menu_item[description]"
            rows="3"
            class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
          ><%= @form[:description].value %></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Price (number)</label>
            <input
              type="number"
              name="menu_item[price]"
              value={@form[:price].value}
              required
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Price Display</label>
            <input
              type="text"
              name="menu_item[priceDisplay]"
              value={@form[:priceDisplay].value}
              placeholder="e.g., 185 Kč"
              required
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Category</label>
            <select
              name="menu_item[category]"
              required
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            >
              <option value="">Select category...</option>
              <%= for cat <- @categories do %>
                <option value={cat["slug"]} selected={@form[:category].value == cat["slug"]}>
                  <%= cat["name"] %>
                </option>
              <% end %>
            </select>
          </div>
          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Sort Order</label>
            <input
              type="number"
              name="menu_item[sortOrder]"
              value={@form[:sortOrder].value || 0}
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              name="menu_item[isAvailable]"
              value="true"
              checked={@form[:isAvailable].value}
              class="w-4 h-4"
            />
            <span class="text-sm text-soy-brown/70">Available</span>
          </label>
        </div>

        <div class="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={@loading}
            class="btn-primary disabled:opacity-50"
          >
            <%= if @loading, do: "Saving...", else: "Save" %>
          </button>
          <.link navigate={~p"/menu"} class="btn-secondary">
            Cancel
          </.link>
        </div>
      </.form>
    </div>
    """
  end
end
