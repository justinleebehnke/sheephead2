import React, { Component } from 'react'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import Hand from './Hand'
import PlayerLayout from './PlayerLayout'
import GameManagerOld from '../../UseCase/GameManagerOld'
import EndOfRoundReport from './EndOfRoundReport'
import PassOrPick from './PassOrPick'

class GameBoard extends Component {
  componentDidMount() {
    const game = GameManagerOld.getPlayersCurrentGame()
    game.addSubscriber(this)
  }

  componentWillUnmount() {
    const game = GameManagerOld.getPlayersCurrentGame()
    game.removeSubscriber(this)
  }

  render() {
    const game = GameManagerOld.getPlayersCurrentGame()
    const localPlayerId = '79dbc191-2b0e-4dc3-83d7-7696c4abcb61'
    const localPlayer = game.getPlayerById(new UniqueIdentifier(localPlayerId))
    const round = game.getCurrentRound()
    return (
      <div>
        {round && round.isFindingPickerState() && <PassOrPick />}
        <PlayerLayout />
        {!!localPlayer && <Hand cardsInHand={localPlayer.getPlayableCardIds()} />}
        {round && round.isOver() && <EndOfRoundReport />}
      </div>
    )
  }

  update = (): void => {
    this.setState({})
  }
}

export default GameBoard
