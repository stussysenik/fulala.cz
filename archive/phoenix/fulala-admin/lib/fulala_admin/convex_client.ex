defmodule FulalaAdmin.ConvexClient do
  @moduledoc """
  Client for interacting with the Convex backend API.
  """

  @doc """
  Makes a query to the Convex backend.
  """
  def query(function_name, args \\ %{}) do
    convex_url = Application.get_env(:fulala_admin, :convex)[:url]

    case Req.post("#{convex_url}/api/query",
           json: %{
             path: function_name,
             args: args,
             format: "json"
           }
         ) do
      {:ok, %{status: 200, body: body}} ->
        {:ok, body}

      {:ok, %{status: status, body: body}} ->
        {:error, %{status: status, body: body}}

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Makes a mutation to the Convex backend.
  """
  def mutation(function_name, args \\ %{}) do
    convex_url = Application.get_env(:fulala_admin, :convex)[:url]

    case Req.post("#{convex_url}/api/mutation",
           json: %{
             path: function_name,
             args: args,
             format: "json"
           }
         ) do
      {:ok, %{status: 200, body: body}} ->
        {:ok, body}

      {:ok, %{status: status, body: body}} ->
        {:error, %{status: status, body: body}}

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Lists all menu items.
  """
  def list_menu_items(category \\ nil) do
    args = if category, do: %{category: category}, else: %{}
    query("menu:list", args)
  end

  @doc """
  Creates a new menu item.
  """
  def create_menu_item(attrs) do
    mutation("menu:create", attrs)
  end

  @doc """
  Updates a menu item.
  """
  def update_menu_item(id, attrs) do
    mutation("menu:update", Map.put(attrs, :id, id))
  end

  @doc """
  Deletes a menu item.
  """
  def delete_menu_item(id) do
    mutation("menu:remove", %{id: id})
  end

  @doc """
  Lists all categories.
  """
  def list_categories do
    query("categories:list", %{})
  end

  @doc """
  Gets all site settings.
  """
  def get_settings do
    query("settings:list", %{})
  end

  @doc """
  Updates a site setting.
  """
  def set_setting(key, value) do
    mutation("settings:set", %{key: key, value: value})
  end

  @doc """
  Seeds the database with initial data.
  """
  def seed_database do
    mutation("seed:seedMenu", %{})
  end
end
