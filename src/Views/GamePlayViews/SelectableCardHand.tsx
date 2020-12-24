import React, { Component, Fragment } from 'react'
import Button from 'react-bootstrap/esm/Button'
import GameManager from '../../UseCase/GameManager'
import Player from '../../Entities/Player'
import SelectAbleCard from './SelectAbleCard'
import './SelectableCardHand.css'

type Props = {
  cardIds: string[]
  isShowBury: boolean
}

type State = {
  selectedCardIds: string[]
}
class SelectableCardHand extends Component<Props, State> {
  state = {
    selectedCardIds: [],
  }

  render() {
    const setOfSelectedCardIds: Set<string> = new Set(this.state.selectedCardIds)

    return (
      <Fragment>
        <div className='selectableCardHand'>
          <div className={`selectableCardHand-hand ${this.props.isShowBury ? '' : 'short'}`}>
            {this.props.cardIds.map((cardId) => (
              <SelectAbleCard
                key={cardId}
                isSelected={setOfSelectedCardIds.has(cardId)}
                cardId={cardId}
                toggleSelected={!this.props.isShowBury ? () => {} : this.toggleSelected}
              />
            ))}
          </div>
        </div>
        {this.props.isShowBury && (
          <div className='footer-controls'>
            <div></div>
            <Button
              className='bury-button'
              disabled={this.state.selectedCardIds.length !== 2}
              onClick={this.burySelectedCards}
            >
              Bury Selected Cards
            </Button>
          </div>
        )}
      </Fragment>
    )
  }

  toggleSelected = (cardId: string): void => {
    if (this.state.selectedCardIds.some((selectedCardId) => selectedCardId === cardId)) {
      this.setState({
        selectedCardIds: this.state.selectedCardIds.filter(
          (selectedCardId) => selectedCardId !== cardId
        ),
      })
    } else {
      this.setState({
        selectedCardIds: [...this.state.selectedCardIds, cardId],
      })
    }
  }

  burySelectedCards = (): void => {
    const round = GameManager.getPlayersCurrentGame().getCurrentRound()
    if (round) {
      const player: Player = round.getCurrentTurnPlayer()
      const card1 = player.removeCardFromHand(this.state.selectedCardIds[0])
      const card2 = player.removeCardFromHand(this.state.selectedCardIds[1])
      round.bury(card1, card2)
    }
  }
}

export default SelectableCardHand
