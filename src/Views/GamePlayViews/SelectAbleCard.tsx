import { Component } from 'react'
import cards from './CardResourceMap'

type Props = {
  cardId: string
  isSelected: boolean
  toggleSelected: (cardId: string) => void
}

class SelectAbleCard extends Component<Props> {
  render() {
    const { cardId, isSelected, toggleSelected } = this.props
    return (
      <div className='playing-card'>
        {
          <img
            onClick={() => toggleSelected(cardId)}
            data-id={cardId}
            // @ts-ignore
            src={cards[cardId]}
            alt={`playing-card-${cardId}`}
            className={`${isSelected ? 'selected' : ''}`}
          />
        }
      </div>
    )
  }
}

export default SelectAbleCard
