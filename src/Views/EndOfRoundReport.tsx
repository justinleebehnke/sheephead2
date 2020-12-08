import React, { Component } from 'react'
import './Card.css'

import GameManager from '../UseCase/GameManager'

class EndOfRoundReport extends Component {
  render() {
    const game = GameManager.getPlayersCurrentGame()
    if (game) {
      const round = game.getCurrentRound()
      if (round) {
        const report = round.getEndOfRoundReport()
        return (
          <div>
            <h1>BURY</h1>
            <p>{report.bury.cards[0].cardId}</p>
            <p>{report.bury.cards[1].cardId}</p>
            <h1>TRICKS</h1>
            {report.tricks.map((trick) => {
              return (
                <div>
                  {trick.cards.map((card) => {
                    return (
                      <p>
                        {card.playedByPlayerId}: {card.cardId}
                      </p>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )
      }
    }
    return null
  }
}

export default EndOfRoundReport
