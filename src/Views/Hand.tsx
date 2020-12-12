import React, { Component } from 'react'
import Card from './Card'
import './Hand.css'
import GameManager from '../UseCase/GameManager'

type Props = {
  cardsInHand: string[]
}

class Hand extends Component<Props, {}> {
  private interval: NodeJS.Timeout | undefined
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000)
  }
  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
  render() {
    const game = GameManager.getPlayersCurrentGame()
    if (game) {
      const round = game.getCurrentRound()
      if (round) {
        if (round.getCurrentTurnPlayer()?.getId() === '79dbc191-2b0e-4dc3-83d7-7696c4abcb61') {
          const playAbleCards = new Set(
            round.getCurrentTurnPlayer().getPlayableCardIds(round.getCurrentTrick().getLeadCard())
          )
          return (
            <div id='hand'>
              {this.props.cardsInHand.map((cardName) => (
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
                                round.play(
                                  round
                                    .getCurrentTurnPlayer()
                                    .removeCardFromHand(target.getAttribute('data-id') as string)
                                )
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
      }
    }
    return (
      <div id='hand'>
        {this.props.cardsInHand.map((cardName) => (
          <Card key={cardName} isPlayable={false} card={cardName} play={() => {}} />
        ))}
      </div>
    )
  }
}

export default Hand
