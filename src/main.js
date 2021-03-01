"use strict";

import PopUp from "./popup.js";
import { GameBuilder, Resaon } from "./game.js";

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
      break;
    case Resaon.win:
      message = "YOU WON";
      break;
    case Resaon.lose:
      message = "YOU LOSE";
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});
