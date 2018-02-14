// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from './socket'

import run_memory from './memory';

function init() {
  let indexRoot = document.getElementById('join');
  let gameRoot = document.getElementById('game');

  if (indexRoot) {
    // gets a game name and redirects to it
    $('#game-button').click(() => {
      let gameName = $('#game-input').val();
      window.location.href = '/game/' + gameName;
    });
  }

  if (gameRoot) {
    let channel = socket.channel('games:' + window.gameName, {});
    run_memory(gameRoot, channel);
  }
}

// Use jQuery to delay until page loaded.
$(init);
