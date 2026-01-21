defmodule FulalaAdminWeb.SettingsLive do
  use FulalaAdminWeb, :live_view

  alias FulalaAdmin.ConvexClient

  @impl true
  def mount(_params, _session, socket) do
    {:ok, settings} = ConvexClient.get_settings()

    {:ok,
     assign(socket,
       page_title: "Site Settings",
       settings: settings || %{},
       loading: false,
       saved: false
     )}
  end

  @impl true
  def handle_event("save", %{"settings" => params}, socket) do
    socket = assign(socket, loading: true, saved: false)

    # Update each setting
    Enum.each(params, fn {key, value} ->
      ConvexClient.set_setting(key, value)
    end)

    {:ok, settings} = ConvexClient.get_settings()

    {:noreply,
     socket
     |> assign(settings: settings || %{}, loading: false, saved: true)
     |> put_flash(:info, "Settings saved!")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6">
      <h1 class="text-4xl font-heading text-fulala-red mb-8">Site Settings</h1>

      <div class="max-w-2xl bg-white rounded-xl shadow-sm border-2 border-tiger-orange p-6">
        <.form for={%{}} phx-submit="save" class="space-y-6">
          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Site Name</label>
            <input
              type="text"
              name="settings[siteName]"
              value={@settings["siteName"] || "Fulala"}
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Tagline</label>
            <input
              type="text"
              name="settings[tagline]"
              value={@settings["tagline"] || ""}
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Description</label>
            <textarea
              name="settings[description]"
              rows="3"
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            ><%= @settings["description"] || "" %></textarea>
          </div>

          <hr class="border-tiger-orange" />

          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Address</label>
            <input
              type="text"
              name="settings[address]"
              value={@settings["address"] || ""}
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Phone</label>
            <input
              type="text"
              name="settings[phone]"
              value={@settings["phone"] || ""}
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Email</label>
            <input
              type="email"
              name="settings[email]"
              value={@settings["email"] || ""}
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm text-soy-brown/70 mb-1">Opening Hours</label>
            <input
              type="text"
              name="settings[openingHours]"
              value={@settings["openingHours"] || ""}
              placeholder="e.g., Tue-Sun: 11:00 - 21:00"
              class="w-full px-4 py-2 border-2 border-tiger-orange rounded-lg focus:border-fulala-red focus:outline-none"
            />
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={@loading}
              class="btn-primary disabled:opacity-50"
            >
              <%= if @loading, do: "Saving...", else: "Save Settings" %>
            </button>
          </div>

          <%= if @saved do %>
            <p class="text-sm text-green-600">✓ Settings saved successfully!</p>
          <% end %>
        </.form>
      </div>
    </div>
    """
  end
end
