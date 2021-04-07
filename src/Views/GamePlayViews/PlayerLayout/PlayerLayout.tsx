import { Component, ReactElement } from 'react'
import PlayerLayoutData from '../../../InterfaceAdapters/GamePresenter/PlayerLayoutData'
import PlayerLayoutDisplayData from './PlayerLayoutDisplayData'
import PlayerTurnBox from './PlayerTurnBox'
import './PlayerLayout.css'

type Props = {
  allPlayerData: PlayerLayoutDisplayData
}

class PlayerLayout extends Component<Props> {
  render() {
    const { allPlayerData } = this.props
    return (
      <div id='player-layout'>
        <div></div>
        <div></div>
        {this.renderPlayerTurnBox(allPlayerData.dataForPlayerAcross)}
        <div></div>
        <div></div>
        <div></div>
        {this.renderPlayerTurnBox(allPlayerData.dataForPlayerToLeft)}
        <div></div>
        {this.renderPlayerTurnBox(allPlayerData.dataForPlayerToRight)}
        <div></div>
        <div></div>
        <div></div>
        {this.renderPlayerTurnBox(allPlayerData.dataForLocalPlayer)}
        <div></div>
        <div></div>
      </div>
    )
  }

  private renderPlayerTurnBox = (playerData: PlayerLayoutData): ReactElement => {
    return (
      <PlayerTurnBox
        chosenCard={playerData.cardPlayed}
        isDealer={playerData.isDealer}
        isGoingAlone={playerData.isGoingAlone}
        isPicker={playerData.isPicker}
        playerName={playerData.name}
      />
    )
  }
}

export default PlayerLayout
