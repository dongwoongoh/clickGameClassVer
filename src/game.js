"use strict";

import { Field, ItemType } from "./field.js";
import * as sound from "./sound.js";

export const Resaon = Object.freeze({
  win: "win",
  lose: "lose",
  cancel: "cancel",
});

export class GameBuilder {
  gameDuraion(duration) {
    this.gameDuraion = duration;
    return this;
  }

  carrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  bugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    return new Game(this.gameDuraion, this.carrotCount, this.bugCount);
  }
}

class Game {
  constructor(gameDuraion, carrotCount, bugCount) {
    this.gameDuraion = gameDuraion;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameTimer = document.querySelector(".game__timer");
    this.gameScore = document.querySelector(".game__score");
    this.gameBtn = document.querySelector(".game__button");

    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.stop(Resaon.cancel);
      } else {
        this.start();
      }
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimeAndScore();
    this.startGameTimer();
    sound.playBg();
  }

  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBg();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  };

  showStopButton() {
    const icon = this.gameBtn.querySelector(".fas");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    this.gameBtn.style.visibility = "visible";
  }

  hideGameButton() {
    this.gameBtn.style.visibility = "hidden";
  }

  showTimeAndScore() {
    this.gameTimer.style.visibility = "visible";
    this.gameScore.style.visibility = "visible";
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuraion;

    this.timer = setInterval(() => {
      this.updateTimerText(--remainingTimeSec);

      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    this.gameTimer.innerText = `${min}:${sec}`;
  }

  initGame() {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
}
