defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)

      {:ok, %{ "join" => name, "game" => Game.client_view(game), "letters" => game.letters },
        socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  def handle_in("guess", payload, socket) do
    guess_key = payload.key

  end

  def handle_in("clicked", payload, socket) do
    res = %{ "text" => "button clicked" }
    {:reply, {:clicked, res}, socket}
  end

  def handle_in("init", payload, socket) do
    res = %{ "letters" => Game.init_letters() }
    {:reply, {:init, res}, socket}
  end

  def handle_in("reset", payload, socket) do
    game = Game.new()
    res = %{ "game" => Game.client_view(game) }
    {:reply, {:reset, res }, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
