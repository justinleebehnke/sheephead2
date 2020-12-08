import React, { Component } from 'react'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import Hand from './Hand'
import PlayerLayout from './PlayerLayout'
import GameManager from '../UseCase/GameManager'

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
    const localPlayerId = '4d2f43c3-224d-46ba-bb76-0e383d9ceb5c'
    const localPlayer = game.getPlayerById(new UniqueIdentifier(localPlayerId))
    return (
      <div>
        <PlayerLayout />
        {!!localPlayer && <Hand cardsInHand={localPlayer.getPlayableCardIds()} />}
      </div>
    )
  }
}

export default GameBoard
