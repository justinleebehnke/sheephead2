import { Component, ReactElement } from 'react'
import GamePresenter from '../../InterfaceAdapters/GamePresenter/GamePresenter'
import PlayerLayoutData from '../../InterfaceAdapters/GamePresenter/PlayerLayoutData'
import PlayerTurnBox from './PlayerTurnBox'
import './PlayerLayout.css'

type Props = {
  presenter: GamePresenter
}

class PlayerLayout extends Component<Props> {
  render() {
    const { presenter } = this.props
    return (
      presenter.getHand().length && (
        <div id='player-layout'>
          <div></div>
          <div></div>
          {this.renderPlayerTurnBox(presenter.getDataForPlayerAcross())}
          <div></div>
          <div></div>
          <div></div>
          {this.renderPlayerTurnBox(presenter.getDataForPlayerToLeft())}
          <div></div>
          {this.renderPlayerTurnBox(presenter.getDataForPlayerToRight())}
          <div></div>
          <div></div>
          <div></div>
          {this.renderPlayerTurnBox(presenter.getDataForLocalPlayer())}
          <div></div>
          <div></div>
        </div>
      )
    )
  }

  private renderPlayerTurnBox = (playerData: PlayerLayoutData): ReactElement => {
    return (
      <PlayerTurnBox
        isDealer={playerData.isDealer}
        isPicker={playerData.isPicker}
        chosenCard={playerData.cardPlayed}
        playerName={playerData.name}
      />
    )
  }
}

export default PlayerLayout
