import React, { Component } from 'react'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import Hand from './Hand'
import PlayerLayout from './PlayerLayout'
import GameManager from '../UseCase/GameManager'
import EndOfRoundReport from './EndOfRoundReport'

class GameBoard extends Component {
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
    const game = GameManager.getPlayersCurrentGame()
    const localPlayerId = '79dbc191-2b0e-4dc3-83d7-7696c4abcb61'
    const localPlayer = game.getPlayerById(new UniqueIdentifier(localPlayerId))
    const round = game.getCurrentRound()
    if (round && round.isOver()) {
      this.interval && clearInterval(this.interval)
    }
    return (
      <div>
        <PlayerLayout />
        {!!localPlayer && <Hand cardsInHand={localPlayer.getPlayableCardIds()} />}
        {round && round.isOver() && <EndOfRoundReport />}
      </div>
    )
  }
}

export default GameBoard
