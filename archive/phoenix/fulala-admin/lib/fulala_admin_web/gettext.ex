defmodule FulalaAdminWeb.Gettext do
  @moduledoc """
  A module providing Internationalization with a gettext-based API.
  """
  use Gettext.Backend, otp_app: :fulala_admin
end
