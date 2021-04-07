import React, { Component, Fragment } from 'react'
import Button from 'react-bootstrap/Button'
import SelectAbleCard from './SelectAbleCard'
import SelectableCardHandData from './SelectableCardHandData'
import SelectableCardHandPresenter from './SelectableCardHandPresenter'
import Spinner from 'react-bootstrap/Spinner'
import './SelectableCardHand.css'

type Props = {
  selectableCardHandData: SelectableCardHandData
  presenter: SelectableCardHandPresenter
}

type State = {
  selectedCardIds: string[]
}

class SelectableCardHand extends Component<Props, State> {
  state = {
    selectedCardIds: [],
  }

  public render() {
    const setOfSelectedCardIds: Set<string> = new Set(this.state.selectedCardIds)
    const { hand, isPicking, isLoading } = this.props.selectableCardHandData
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
                toggleSelected={!isShowBury || isLoading ? () => {} : this.toggleSelected}
              />
            ))}
          </div>
        </div>
        {isShowBury && (
          <div className='footer-controls'>
            {!isLoading ? (
              <Fragment>
                <Button
                  className='bury-button'
                  variant='outline-primary'
                  disabled={this.state.selectedCardIds.length !== 2}
                  onClick={this.burySelectedCardsAndGoAlone}
                >
                  Bury &amp; Chop (Go Alone)
                </Button>
                <Button
                  id='bury-button'
                  disabled={this.state.selectedCardIds.length !== 2}
                  onClick={this.burySelectedCards}
                >
                  Bury Cards
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <div></div>
                <Spinner animation='border' />
              </Fragment>
            )}
          </div>
        )}
      </Fragment>
    )
  }

  private toggleSelected = (cardId: string): void => {
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

  private burySelectedCards = (): void => {
    const { selectedCardIds } = this.state
    this.props.presenter.bury(selectedCardIds, false)
  }

  private burySelectedCardsAndGoAlone = (): void => {
    const { selectedCardIds } = this.state
    this.props.presenter.bury(selectedCardIds, true)
  }
}

export default SelectableCardHand
