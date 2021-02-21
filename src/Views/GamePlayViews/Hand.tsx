import { Component } from 'react'
import Card from './Card'
import './Hand.css'

interface LocalPlayerHandViewData {
  isTurn: boolean
  playableCardIds: string[]
  hand: string[]
}

interface HandPresenter {
  play(cardId: string): void
}

type Props = {
  presenter: HandPresenter
  data: LocalPlayerHandViewData
}

class Hand extends Component<Props> {
  render() {
    if (this.props.data.isTurn) {
      const playAbleCards: Set<string> = new Set(this.props.data.playableCardIds)
      return (
        <div id='hand'>
          {this.props.data.hand.map((cardName) => (
            <Card
              key={cardName}
              isPlayable={playAbleCards.has(cardName)}
              card={cardName}
              play={
                playAbleCards.has(cardName)
                  ? (event) => {
                      if (event) {
                        if (event.target) {
                          const target = event.target as HTMLInputElement
                          if (target.getAttribute('data-id')) {
                            this.props.presenter.play(target.getAttribute('data-id') as string)
                          }
                        }
                      }
                    }
                  : () => {}
              }
            />
          ))}
        </div>
      )
    }
    return (
      <div id='hand'>
        {this.props.data.hand.map((cardName) => (
          <Card key={cardName} isPlayable={false} card={cardName} play={() => {}} />
        ))}
      </div>
    )
  }
}

export default Hand
