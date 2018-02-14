defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  # Attribution to lecture code notes

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, params) do
    render conn, "game.html", game: params["game"]
  end
end
