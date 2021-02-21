import React, { Component, Fragment } from 'react'
import Button from 'react-bootstrap/esm/Button'
import SelectAbleCard from './SelectAbleCard'
import SelectableCardHandData from './SelectableCardHandData'
import './SelectableCardHand.css'

type Props = {
  selectableCardHandData: SelectableCardHandData
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
    const { hand, isPicking } = this.props.selectableCardHandData
    const isShowBury = isPicking

    return (
      <Fragment>
        <div className='selectableCardHand'>
          <div className={`selectableCardHand-hand ${isShowBury ? '' : 'short'}`}>
            {hand.map((cardId) => (
              <SelectAbleCard
                key={cardId}
                isSelected={setOfSelectedCardIds.has(cardId)}
                cardId={cardId}
                toggleSelected={!isShowBury ? () => {} : this.toggleSelected}
              />
            ))}
          </div>
        </div>
        {isShowBury && (
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
    const { selectedCardIds } = this.state
    this.props.selectableCardHandData.bury(selectedCardIds)
  }
}

export default SelectableCardHand
