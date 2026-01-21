defmodule FulalaAdminWeb.MediaLive do
  use FulalaAdminWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     assign(socket,
       page_title: "Media Library",
       media: [],
       loading: false,
       uploading: false
     )
     |> allow_upload(:image, accept: ~w(.jpg .jpeg .png .gif .webp), max_entries: 5)}
  end

  @impl true
  def handle_event("validate", _params, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_event("save", _params, socket) do
    # TODO: Implement file upload to Convex storage
    {:noreply,
     socket
     |> put_flash(:info, "Media upload will be connected to Convex storage")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6">
      <h1 class="text-4xl font-heading text-fulala-red mb-8">Media Library</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Upload Section -->
        <div class="bg-white rounded-xl shadow-sm border-2 border-tiger-orange p-6">
          <h2 class="text-xl font-heading text-ink-black mb-4">Upload Images</h2>

          <form phx-submit="save" phx-change="validate">
            <div
              class="border-2 border-dashed border-tiger-orange rounded-xl p-8 text-center hover:border-fulala-red transition-colors cursor-pointer"
              phx-drop-target={@uploads.image.ref}
            >
              <div class="text-4xl mb-2">📷</div>
              <p class="text-soy-brown/70">Drag & drop images here</p>
              <p class="text-sm text-soy-brown/50">or</p>
              <label class="inline-block mt-2 px-4 py-2 bg-tiger-orange rounded-lg cursor-pointer hover:bg-tiger-orange/80">
                Browse Files
                <.live_file_input upload={@uploads.image} class="sr-only" />
              </label>
            </div>

            <%= for entry <- @uploads.image.entries do %>
              <div class="mt-4 flex items-center gap-4">
                <div class="w-16 h-16 bg-tiger-orange/30 rounded-lg overflow-hidden">
                  <.live_img_preview entry={entry} class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-ink-black"><%= entry.client_name %></p>
                  <progress value={entry.progress} max="100" class="w-full h-2"><%= entry.progress %>%</progress>
                </div>
                <button
                  type="button"
                  phx-click="cancel-upload"
                  phx-value-ref={entry.ref}
                  class="text-fulala-red hover:text-fulala-red/80"
                >
                  ×
                </button>
              </div>
            <% end %>

            <%= if @uploads.image.entries != [] do %>
              <button type="submit" class="mt-4 btn-primary">
                Upload Images
              </button>
            <% end %>
          </form>
        </div>

        <!-- Library Section -->
        <div class="bg-white rounded-xl shadow-sm border-2 border-tiger-orange p-6">
          <h2 class="text-xl font-heading text-ink-black mb-4">Library</h2>

          <%= if @media == [] do %>
            <div class="text-center py-8 bg-tiger-orange/10 rounded-lg">
              <div class="text-4xl mb-2">🖼️</div>
              <p class="text-soy-brown/70">No images uploaded yet</p>
              <p class="text-sm text-soy-brown/50">Upload images to see them here</p>
            </div>
          <% else %>
            <div class="grid grid-cols-3 gap-2">
              <%= for item <- @media do %>
                <div class="aspect-square bg-tiger-orange/30 rounded-lg overflow-hidden relative group">
                  <img src={item.url} alt={item.alt || ""} class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-ink-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button class="text-white text-sm">Select</button>
                  </div>
                </div>
              <% end %>
            </div>
          <% end %>
        </div>
      </div>
    </div>
    """
  end
end
