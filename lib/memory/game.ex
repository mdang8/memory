defmodule Memory.Game do
  @moduledoc false

  def new do
    letters = init_letters()
    keys = Enum.map(letters, fn(x) -> x.key end)

    %{
      letters: letters,
      keys: keys,
      allowClicks: true,
      numberClicks: 0
    }
  end

  def client_view(game) do
    letters = game.letters
    # finds the currently matching letter (as a list)
    matching = Enum.filter(letters, fn(x) -> x.currentlyMatching end)
    allow_clicks = if (Enum.count(matching) == 2), do: false, else: true

    matching_keys = Enum.map(matching, fn(x) -> x.key end)
    # gets the currently matching letter from the list if there is one, else return an empty set
    match_letter = if (Enum.count(matching) == 1), do: hd(matching),
                                                   else: %{ character: "", key: nil }

    # finds the keys that have been matched
    found_keys = Enum.filter(letters, fn(x) -> x.matched end) |> Enum.map(fn(x) -> x.key end)
    remaining_keys = game.keys -- found_keys
    display_keys = Enum.concat(matching_keys, found_keys)
    display_letters = Enum.map(display_keys, fn(x) -> {x, get_letter(game, x)} end)
    |> Map.new()

    %{
      keys: game.keys,
      foundKeys: found_keys,
      remainingKeys: remaining_keys,
      displayLetters: display_letters,
      currentMatchCharacter: match_letter.character,
      currentMatchKey: match_letter.key,
      allowClicks: allow_clicks,
      numberClicks: game.numberClicks,
    }
  end

  def clear(game) do
    new_letters = Enum.map(game.letters, fn(x) -> Map.put(x, :currentlyMatching, false) end)

    %{ game | letters: new_letters, allowClicks: true }
  end

  def get_letter(game, key) do
    Enum.filter(game.letters, fn(x) -> x.key == key end)
    |> hd()
    |> Map.get(:character)
  end

  def guess(game, guess_key) do
    letters = game.letters

    # the index of the guess letter
    guess_index = Enum.find_index(letters, fn(x) -> x.key == guess_key end)
    # the letter that was guessed
    guess_letter = Enum.at(letters, guess_index)
    # the index of the currently matching letter in the game letters list
    matching_index = Enum.find_index(letters, fn(x) -> x.currentlyMatching end)

    new_letters = []
    allow_clicks = true

    # nothing is being matched
    if (matching_index == nil) do
      # sets the guessed letter as the currently matching
      new_letters = List.update_at(letters, guess_index,
        fn(x) -> Map.put(x, :currentlyMatching, true) end)

    # something is being matched
    else
      # the currently matching letter
      matching = Enum.at(letters, matching_index, %{ character: "", key: "" })

      currently_matching_character = matching.character
      currently_matching_key = matching.key

      # the letter is currently being matched (found letter pair)
      if (guess_letter.character == currently_matching_character and
          guess_letter.key != currently_matching_key) do
        # sets the letters as being matched and removes currently matching status
        new_letters = Enum.map(letters, fn(x) ->
          # do for both letters of the same character
          if (x.character == currently_matching_character) do
            # sets the letter as matched and unsets currently matching
            %{ x | matched: true, currentlyMatching: false }
          else
            # keep the letter the same
            x
          end
        end)

      # the letter is not a match
      else
        new_letters = List.update_at(letters, guess_index,
          fn(x) -> Map.put(x, :currentlyMatching, true) end)
        allow_clicks = false
      end

    end

    # updates the game letters and increments the number of clicks
    %{ game | letters: new_letters, numberClicks: game.numberClicks + 1,
      allowClicks: allow_clicks }
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
