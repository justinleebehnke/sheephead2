import { Component } from 'react'
import Card from './Card'
import HandPresenter from './HandPresenter'
import LocalPlayerHandViewData from './LocalPlayerHandViewData'
import './Hand.css'

type Props = {
  data: LocalPlayerHandViewData
  presenter: HandPresenter
}

class Hand extends Component<Props> {
  render() {
    if (this.props.data.isTurn && !this.props.data.isLoading) {
      const playAbleCards: Set<string> = new Set(this.props.data.playableCardIds)
      return (
        <div id='hand'>
          {this.props.data.hand.map((cardName) => (
            <Card
              key={cardName}
              isPlayable={playAbleCards.has(cardName)}
              isLoading={false}
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
          <Card
            key={cardName}
            isPlayable={false}
            isLoading={this.props.data.isLoading}
            card={cardName}
            play={() => {}}
          />
        ))}
      </div>
    )
  }
}

export default Hand
