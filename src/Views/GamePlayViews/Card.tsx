import { Component, MouseEvent } from 'react'
import cards from './CardResourceMap'
import './Card.css'

type Props = {
  card: string
  isLoading: boolean
  isPlayable: boolean
  play(event: MouseEvent): void
}

class Card extends Component<Props, {}> {
  render() {
    const { card, isLoading, isPlayable, play } = this.props
    return (
      <div className='playing-card'>
        {
          <img
            onClick={play}
            data-id={card}
            // @ts-ignore
            src={cards[card]}
            alt={`playing-card-${card}`}
            className={`${isPlayable ? 'playable' : ' '}${isLoading ? ' loading' : ''}`}
          />
        }
      </div>
    )
  }
}

export default Card
