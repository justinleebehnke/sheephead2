import { Component } from 'react'
import Card from './Card'
import './Hand.css'
import GamePresenter from '../../InterfaceAdapters/GamePresenter/GamePresenter'

type Props = {
  presenter: GamePresenter
}

class Hand extends Component<Props> {
  render() {
    if (this.props.presenter.getDataForLocalPlayer().isTurn) {
      const playAbleCards: Set<string> = this.props.presenter.getPlayableCardIds()
      return (
        <div id='hand'>
          {this.props.presenter.getHand().map((cardName) => (
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
        {this.props.presenter.getHand().map((cardName) => (
          <Card key={cardName} isPlayable={false} card={cardName} play={() => {}} />
        ))}
      </div>
    )
  }
}

export default Hand
