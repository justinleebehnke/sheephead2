import React, { Component } from 'react'
import './EndOfRoundReport.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import cards from './CardResourceMap'
import GameManager from '../UseCase/GameManager'
import CardPlayedByData from '../Entities/DataStructures/CardPlayedByData'

class EndOfRoundReport extends Component {
  render() {
    const game = GameManager.getPlayersCurrentGame()
    if (game) {
      const round = game.getCurrentRound()
      if (round) {
        const report = round.getEndOfRoundReport()
        const players = round.getPlayers()
        const indexOfPicker = round.getPickerIndex()

        return (
          <Modal size='xl' show={true} onHide={() => {}}>
            <Modal.Dialog>
              <Modal.Header closeButton>
                <Modal.Title>End Of Game Report</Modal.Title>
              </Modal.Header>
              <Modal.Body className='report'>
                <Card>
                  <Card.Title>
                    {report.bury.cards[0].pointValue + report.bury.cards[1].pointValue} points in
                    the bury
                  </Card.Title>
                  <Card.Body>
                    <div className='bury-box flex'>
                      <img
                        // @ts-ignore
                        src={cards[report.bury.cards[0].cardId]}
                        alt={`playing-card-${report.bury.cards[0].cardId}`}
                      />
                      <img
                        // @ts-ignore
                        src={cards[report.bury.cards[1].cardId]}
                        alt={`playing-card-${report.bury.cards[1].cardId}`}
                      />
                    </div>
                  </Card.Body>
                </Card>
                <Table striped bordered hover variant='dark'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>
                        {players[0].getName()}
                        {indexOfPicker === 0 && <p>(Picker)</p>}
                      </th>
                      <th>
                        {players[1].getName()}
                        {indexOfPicker === 1 && <p>(Picker)</p>}
                      </th>
                      <th>
                        {players[2].getName()}
                        {indexOfPicker === 2 && <p>(Picker)</p>}
                      </th>
                      <th>
                        {players[3].getName()}
                        {indexOfPicker === 3 && <p>(Picker)</p>}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.tricks.map((trick, index) => {
                      const winningCardId = trick.cards[trick.winningCardIndex].cardId
                      const leadingCardId = trick.cards[0].cardId
                      const playerIdToCard: Map<string, string> = trick.cards.reduce(
                        (map: Map<string, string>, card: CardPlayedByData) => {
                          return map.set(card.playedByPlayerId, card.cardId)
                        },
                        new Map()
                      )
                      const cardsToDisplay = [
                        playerIdToCard.get(players[0].getId()),
                        playerIdToCard.get(players[1].getId()),
                        playerIdToCard.get(players[2].getId()),
                        playerIdToCard.get(players[3].getId()),
                      ]
                      return (
                        <tr key={index + 1}>
                          <td>{index + 1}</td>
                          {cardsToDisplay.map((cardId) => {
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
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary'>Close</Button>
                <Button variant='primary'>Save changes</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal>
        )
      }
    }
    return null
  }
}

export default EndOfRoundReport
