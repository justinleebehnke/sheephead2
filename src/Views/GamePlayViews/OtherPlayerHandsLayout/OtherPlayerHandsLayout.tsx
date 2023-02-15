import { Component, Fragment, ReactElement } from 'react'
import AbbreviatedCard from '../EndOfRoundReport/AbbreviatedCard'
import PlayerLayoutDisplayData from '../PlayerLayout/PlayerLayoutDisplayData'
import './OtherPlayerHandsLayout.css'

type Props = {
  allPlayerData: PlayerLayoutDisplayData
  buryCards: string[]
}

class OtherPlayerHandsLayout extends Component<Props> {
  render() {
    const { dataForPlayerAcross, dataForPlayerToLeft, dataForPlayerToRight } =
      this.props.allPlayerData
    return (
      <Fragment>
        {this.renderLayoutById(dataForPlayerAcross.cardsInHand, 'across-player-hand')}
        {this.renderLayoutById(dataForPlayerToLeft.cardsInHand, 'left-player-hand')}
        {this.renderLayoutById(dataForPlayerToRight.cardsInHand, 'right-player-hand')}
        {this.renderLayoutById(this.props.buryCards, 'bury')}
      </Fragment>
    )
  }

  private renderLayoutById(cards: string[], id: string): ReactElement | null {
    if (cards.length === 0) {
      return null
    }
    return (
      <div id={`${id}-layout`}>
        {cards.map((card) => (
          <AbbreviatedCard card={card}></AbbreviatedCard>
        ))}
      </div>
    )
  }
}

export default OtherPlayerHandsLayout
