defmodule Memory.Game do
  @moduledoc false

  def new do
    %{
      letters: init_letters(),
      currentMatchCharacter: "",
      currentMatchKey: "",
      numberClicks: 0
    }
  end

  def client_view(game) do
    letters = game.letters
    matching = Enum.filter(letters, fn(x) -> x.currentlyMatching end)
    match_letter = if (!Enum.empty?(matching)), do: hd(matching),
                                                else: %{ character: "", key: "" }
    number_found = Enum.filter(letters, fn(x) -> x.matched end)
    |> Enum.count()

    %{
      letters: letters,
      currentMatchCharacter: match_letter.character,
      currentMatchKey: match_letter.key,
      allowClicks: true,
      numberFound: number_found,
      numberClicks: game.numberClicks
    }
  end

  def guess(game, guess_key) do
    letters = game.letters
    matching = Enum.filter(letters, fn(x) -> x.key == guess_key end) |> hd()

    # nothing is being matched
    if (game.currentMatchCharacter == "" and game.currentMatchKey == "") do
      Map.put(game, :currentMatchCharacter, matching.character)
      Map.put(game, :currentMatchKey, matching.key)
    # something is being matched
    else
      # the letter is currently being matched (found letter pair)
      if (matching.character == game.currentMatchCharacter and matching.key != game
      .currentMatchingKey) do
        # sets the letters to matched property
        newLetters = Enum.map(letters, fn(x) ->
            # sets matched property for found pair
            if (x.character == matching.character), do: Map.put(x, :matched, true), else: x
        end)
      # the letter is not a match
      else
      end
    end
  end

  def init_letters() do
    # list of the letters
    letters = "ABCDEFGH"
    |> String.duplicate(2)
    |> String.split("", trim: true)
    |> Enum.with_index()
    |> Enum.map(fn({char, i}) -> %{ character: char,
                                    key: i,
                                    matched: false,
                                    currentlyMatching: false
                                 } end)
    |> Enum.shuffle()
  end
end
