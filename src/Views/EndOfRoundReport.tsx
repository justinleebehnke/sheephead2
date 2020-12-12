import React, { Component } from 'react'
import './EndOfRoundReport.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import cards from './CardResourceMap'
import GameManager from '../UseCase/GameManager'
import CardPlayedByData from '../Entities/DataStructures/CardPlayedByData'
import TrickData from '../Entities/DataStructures/TrickData'

class EndOfRoundReport extends Component {
  private playAgain(): void {
    const game = GameManager.getPlayersCurrentGame()
    if (game) {
      game.playAnotherRound()
    }
  }

  render() {
    const game = GameManager.getPlayersCurrentGame()
    if (game) {
      const round = game.getCurrentRound()
      if (round) {
        const report = round.getEndOfRoundReport()
        const players = round.getPlayers()
        const indexOfPicker = round.getPickerIndex()

        return (
          <Modal size='lg' show={true} onHide={() => {}} backdrop='static'>
            <Modal.Header closeButton>
              <Modal.Title>End Of Round Report</Modal.Title>
            </Modal.Header>
            <Modal.Body className='report'>
              <Table bordered hover variant='dark'>
                <thead>
                  <tr>
                    <th></th>
                    <th>Trick: 1</th>
                    <th>Trick: 2</th>
                    <th>Trick: 3</th>
                    <th>Trick: 4</th>
                    <th>Trick: 5</th>
                    <th>Trick: 6</th>
                    <th>Points Won</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => {
                    return (
                      <tr>
                        <td>
                          {player.getName()}
                          {indexOfPicker === index && <p>(Picker)</p>}
                        </td>
                        {report.tricks.map((trick) => {
                          const winningCardId = trick.cards[trick.winningCardIndex].cardId
                          const leadingCardId = trick.cards[0].cardId
                          const cardId = trick.cards.find(
                            (card: CardPlayedByData) => card.playedByPlayerId === player.getId()
                          )?.cardId
                          return (
                            <td key={cardId} className={winningCardId === cardId ? 'winner' : ''}>
                              {winningCardId === cardId && <span>Won</span>}
                              <div>
                                <img
                                  // @ts-ignore
                                  src={cards[cardId]}
                                  alt={`playing-card-${cardId}`}
                                />
                              </div>
                              {leadingCardId === cardId && <span>Lead</span>}
                            </td>
                          )
                        })}
                        <td>
                          {report.tricks.reduce((total: number, trick: TrickData) => {
                            const winningCardId = trick.cards[trick.winningCardIndex].cardId
                            const cardPlayedByPlayer:
                              | CardPlayedByData
                              | undefined = trick.cards.find(
                              (card: CardPlayedByData) => card.playedByPlayerId === player.getId()
                            )
                            if (cardPlayedByPlayer && cardPlayedByPlayer.cardId === winningCardId) {
                              return (
                                total +
                                trick.cards.reduce((trickValue: number, card: CardPlayedByData) => {
                                  return trickValue + card.pointValue
                                }, 0)
                              )
                            }
                            return total
                          }, 0)}
                        </td>
                      </tr>
                    )
                  })}
                  <tr>
                    <td>Trick Value</td>
                    {report.tricks.map((trick: TrickData) => {
                      return (
                        <td>
                          {trick.cards.reduce((trickValue: number, card: CardPlayedByData) => {
                            return trickValue + card.pointValue
                          }, 0)}
                        </td>
                      )
                    })}
                    <td></td>
                  </tr>
                </tbody>
              </Table>
              <Table bordered hover variant='dark'>
                <thead>
                  <tr>
                    <th>Bury</th>
                    <th></th>
                    <th></th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td>
                      <img
                        // @ts-ignore
                        src={cards[report.bury.cards[0].cardId]}
                        alt={`playing-card-${report.bury.cards[0].cardId}`}
                      />
                    </td>
                    <td>
                      <img
                        // @ts-ignore
                        src={cards[report.bury.cards[1].cardId]}
                        alt={`playing-card-${report.bury.cards[1].cardId}`}
                      />
                    </td>
                    <td>{report.bury.cards[0].pointValue + report.bury.cards[1].pointValue}</td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='primary' onClick={this.playAgain}>
                Play Another Round
              </Button>
            </Modal.Footer>
          </Modal>
        )
      }
    }
    return null
  }
}

export default EndOfRoundReport
