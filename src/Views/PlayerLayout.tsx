import React, { Component } from "react";
import "./PlayerLayout.css";
import PlayerTurnBox from "./PlayerTurnBox";

class PlayerLayout extends Component {
  render() {
    return (
      <div id="player-layout">
        <div></div>
        <div></div>
        <PlayerTurnBox
          isDealer
          isPicker={false}
          chosenCard={"2d"}
          playerName="Hoss"
        />
        <div></div>
        <div></div>
        <div></div>
        <PlayerTurnBox
          isDealer={false}
          isPicker={false}
          chosenCard={"2d"}
          playerName="Laurie"
        />
        <div></div>
        <PlayerTurnBox
          isDealer={false}
          isPicker
          chosenCard={"turn"}
          playerName="Larry"
        />
        <div></div>
        <div></div>
        <div></div>
        <PlayerTurnBox
          isDealer={false}
          isPicker={false}
          chosenCard={"none"}
          playerName="Me"
        />
        <div></div>
        <div></div>
      </div>
    );
  }
}

export default PlayerLayout;
