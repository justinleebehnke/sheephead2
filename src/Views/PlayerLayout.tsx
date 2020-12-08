import React, { Component } from 'react'
import './PlayerLayout.css'
import PlayerTurnBox from './PlayerTurnBox'
import GameManager from '../UseCase/GameManager'
import Round from '../Entities/Round/Round'
import Player from '../Entities/Player'

class PlayerLayout extends Component {
  private interval: NodeJS.Timeout | undefined
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000)
  }
  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
  render() {
    const round: Round | null = GameManager.getPlayersCurrentGame().getCurrentRound()
    let players: Player[] = []
    if (round) {
      players = round.getPlayers()
    }
    return (
      round && (
        <div id='player-layout'>
          <div></div>
          <div></div>
          <PlayerTurnBox
            isDealer={round.getIndexOfDealer() === 0}
            isPicker={round.getPickerIndex() === 0}
            chosenCard={
              round.getIndexOfCurrentTurn() === 0
                ? 'turn'
                : round
                    .getCurrentTrick()
                    .getTrickData()
                    .cards.find((card) => card.playedByPlayerId === players[0].getId())?.cardId ||
                  'none'
            }
            playerName={players[0].getName()}
          />
          <div></div>
          <div></div>
          <div></div>
          <PlayerTurnBox
            isDealer={round.getIndexOfDealer() === 3}
            isPicker={round.getPickerIndex() === 3}
            chosenCard={
              round.getIndexOfCurrentTurn() === 3
                ? 'turn'
                : round
                    .getCurrentTrick()
                    .getTrickData()
                    .cards.find((card) => card.playedByPlayerId === players[3].getId())?.cardId ||
                  'none'
            }
            playerName={players[3].getName()}
          />

          <div></div>
          <PlayerTurnBox
            isDealer={round.getIndexOfDealer() === 1}
            isPicker={round.getPickerIndex() === 1}
            chosenCard={
              round.getIndexOfCurrentTurn() === 1
                ? 'turn'
                : round
                    .getCurrentTrick()
                    .getTrickData()
                    .cards.find((card) => card.playedByPlayerId === players[1].getId())?.cardId ||
                  'none'
            }
            playerName={players[1].getName()}
          />
          <div></div>
          <div></div>
          <div></div>
          <PlayerTurnBox
            isDealer={round.getIndexOfDealer() === 2}
            isPicker={round.getPickerIndex() === 2}
            chosenCard={
              round.getIndexOfCurrentTurn() === 2
                ? 'turn'
                : round
                    .getCurrentTrick()
                    .getTrickData()
                    .cards.find((card) => card.playedByPlayerId === players[2].getId())?.cardId ||
                  'none'
            }
            playerName={players[2].getName()}
          />
          <div></div>
          <div></div>
        </div>
      )
    )
  }
}

export default PlayerLayout
