"use strict";

import PopUp from "./popup.js";
import { GameBuilder, Resaon } from "./game.js";
import * as sound from "./sound.js";

const gameFinishBanner = new PopUp();
const game = new GameBuilder()
  .gameDuraion(5)
  .carrotCount(3)
  .bugCount(3)
  .build();

game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Resaon.cancel:
      message = "REPLAY?";
      sound.playAlert();
      break;
    case Resaon.win:
      message = "YOU WON";
      sound.playWin();
      break;
    case Resaon.lose:
      message = "YOU LOSE";
      sound.playBug();
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});
