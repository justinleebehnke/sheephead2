import { Component, ReactElement } from 'react'
import './PlayerLayout.css'
import PlayerTurnBox from './PlayerTurnBox'
import GameManager from '../UseCase/GameManager'
import Round from '../Entities/Round/Round'

class PlayerLayout extends Component {
  render() {
    const round: Round | null = GameManager.getPlayersCurrentGame().getCurrentRound()
    return (
      round && (
        <div id='player-layout'>
          <div></div>
          <div></div>
          {this.renderPlayerAtIndex(0)}
          <div></div>
          <div></div>
          <div></div>
          {this.renderPlayerAtIndex(3)}
          <div></div>
          {this.renderPlayerAtIndex(1)}
          <div></div>
          <div></div>
          <div></div>
          {this.renderPlayerAtIndex(2)}
          <div></div>
          <div></div>
        </div>
      )
    )
  }

  renderPlayerAtIndex = (index: number): ReactElement => {
    const round: Round | null = GameManager.getPlayersCurrentGame().getCurrentRound()
    if (round) {
      const players = round.getPlayers()
      const chosenCard = round
        .getCurrentTrick()
        .getTrickData()
        .cards.find((card) => card.playedByPlayerId === players[index].getId())?.cardId

      return (
        round && (
          <PlayerTurnBox
            isDealer={round.getIndexOfDealer() === index}
            isPicker={round.getPickerIndex() === index}
            chosenCard={
              chosenCard ? chosenCard : round.getIndexOfCurrentTurn() === index ? 'turn' : 'none'
            }
            playerName={players[index].getName()}
          />
        )
      )
    }
    return <div></div>
  }
}

export default PlayerLayout
