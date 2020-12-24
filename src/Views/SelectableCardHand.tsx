import React, { Component } from 'react'
import Card from './Card'
import './SelectableCardHand.css'

type Props = {
  cardIds: string[]
}

class SelectableCardHand extends Component<Props> {
  render() {
    return (
      <div className='selectableCardHand'>
        {this.props.cardIds.map((cardId) => (
          <Card key={cardId} isPlayable={false} card={cardId} play={() => {}} />
        ))}
      </div>
    )
  }
}

export default SelectableCardHand
