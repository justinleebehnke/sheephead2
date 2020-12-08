import React, { Component } from 'react'
import cards from './CardResourceMap'
import './Card.css'

type Props = {
  card: string
}

class Card extends Component<Props, {}> {
  render() {
    const { card } = this.props
    return (
      <div className='playing-card'>
        {
          // @ts-ignore
          <img src={cards[card]} alt={`playing-card-${card}`} />
        }
      </div>
    )
  }
}

export default Card
