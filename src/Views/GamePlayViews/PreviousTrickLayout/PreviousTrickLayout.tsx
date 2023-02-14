import { Component } from 'react'
import AbbreviatedCard from '../EndOfRoundReport/AbbreviatedCard'
import PlayerLayoutDisplayData from '../PlayerLayout/PlayerLayoutDisplayData'
import './PreviousTrickLayout.css'

type Props = {
  allPlayerData: PlayerLayoutDisplayData
}

class PreviousTrickLayout extends Component<Props> {
  render() {
    const { dataForPlayerAcross, dataForPlayerToLeft, dataForPlayerToRight, dataForLocalPlayer } =
      this.props.allPlayerData
    if (
      dataForPlayerAcross.lastCardPlayed === null ||
      dataForPlayerToLeft.lastCardPlayed === null ||
      dataForPlayerToRight.lastCardPlayed === null ||
      dataForLocalPlayer.lastCardPlayed === null
    ) {
      return null
    }

    return (
      <div id='previous-trick-layout'>
        <div></div>
        <div></div>
        <AbbreviatedCard card={dataForPlayerAcross.lastCardPlayed}></AbbreviatedCard>
        <div></div>
        <div></div>
        <div></div>
        <AbbreviatedCard card={dataForPlayerToLeft.lastCardPlayed}></AbbreviatedCard>
        <div></div>
        <AbbreviatedCard card={dataForPlayerToRight.lastCardPlayed}></AbbreviatedCard>
        <div></div>
        <div></div>
        <div></div>
        <AbbreviatedCard card={dataForLocalPlayer.lastCardPlayed}></AbbreviatedCard>
        <div></div>
        <div></div>
      </div>
    )
  }
}

export default PreviousTrickLayout
