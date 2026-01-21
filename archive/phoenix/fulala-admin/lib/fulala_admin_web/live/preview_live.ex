defmodule FulalaAdminWeb.PreviewLive do
  use FulalaAdminWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    # Public site URL - can be configured
    public_url = System.get_env("PUBLIC_SITE_URL") || "http://localhost:5173"

    {:ok,
     assign(socket,
       page_title: "Preview",
       public_url: public_url,
       current_path: "/",
       device: "desktop"
     )}
  end

  @impl true
  def handle_event("navigate", %{"path" => path}, socket) do
    {:noreply, assign(socket, current_path: path)}
  end

  @impl true
  def handle_event("set-device", %{"device" => device}, socket) do
    {:noreply, assign(socket, device: device)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-4xl font-heading text-fulala-red">Live Preview</h1>

        <div class="flex items-center gap-4">
          <!-- Device Toggle -->
          <div class="flex gap-2 bg-tiger-orange/30 rounded-lg p-1">
            <button
              phx-click="set-device"
              phx-value-device="desktop"
              class={"px-3 py-1 rounded #{if @device == "desktop", do: "bg-white shadow", else: ""}"}
            >
              🖥️ Desktop
            </button>
            <button
              phx-click="set-device"
              phx-value-device="tablet"
              class={"px-3 py-1 rounded #{if @device == "tablet", do: "bg-white shadow", else: ""}"}
            >
              📱 Tablet
            </button>
            <button
              phx-click="set-device"
              phx-value-device="mobile"
              class={"px-3 py-1 rounded #{if @device == "mobile", do: "bg-white shadow", else: ""}"}
            >
              📲 Mobile
            </button>
          </div>

          <!-- Open in new tab -->
          <a
            href={@public_url <> @current_path}
            target="_blank"
            class="px-4 py-2 bg-tiger-orange rounded-lg hover:bg-tiger-orange/80"
          >
            Open in New Tab ↗
          </a>
        </div>
      </div>

      <!-- Page Navigation -->
      <div class="flex gap-2 mb-6">
        <button
          phx-click="navigate"
          phx-value-path="/"
          class={"px-4 py-2 rounded-lg #{if @current_path == "/", do: "bg-fulala-red text-white", else: "bg-tiger-orange"}"}
        >
          Home
        </button>
        <button
          phx-click="navigate"
          phx-value-path="/menu"
          class={"px-4 py-2 rounded-lg #{if @current_path == "/menu", do: "bg-fulala-red text-white", else: "bg-tiger-orange"}"}
        >
          Menu
        </button>
        <button
          phx-click="navigate"
          phx-value-path="/story"
          class={"px-4 py-2 rounded-lg #{if @current_path == "/story", do: "bg-fulala-red text-white", else: "bg-tiger-orange"}"}
        >
          Story
        </button>
        <button
          phx-click="navigate"
          phx-value-path="/contact"
          class={"px-4 py-2 rounded-lg #{if @current_path == "/contact", do: "bg-fulala-red text-white", else: "bg-tiger-orange"}"}
        >
          Contact
        </button>
      </div>

      <!-- Preview Frame -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border-4 border-tiger-orange">
        <div class={"mx-auto transition-all duration-300 #{device_class(@device)}"}>
          <iframe
            src={@public_url <> @current_path}
            class="w-full h-[600px] border-0"
            title="Site Preview"
          />
        </div>
      </div>

      <p class="text-sm text-soy-brown/50 mt-4 text-center">
        Changes you make in the admin will appear here in real-time!
      </p>
    </div>
    """
  end

  defp device_class("desktop"), do: "w-full"
  defp device_class("tablet"), do: "w-[768px]"
  defp device_class("mobile"), do: "w-[375px]"
end
