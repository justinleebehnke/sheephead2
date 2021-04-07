import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import AbbreviatedCard from './AbbreviatedCard'
import CardPlayedByData from '../../../Entities/DataStructures/CardPlayedByData'
import EndOfRoundPresenter from './EndOfRoundPresenter'
import EndOfRoundViewData from './EndOfRoundViewData'
import TrickData from '../../../Entities/DataStructures/TrickData'
import './EndOfRoundReport.css'

type Props = {
  endOfRoundData: EndOfRoundViewData
  endOfGamePresenter: EndOfRoundPresenter
}

type State = {
  hasClickedReadyToPlayAgain: boolean
}

class EndOfRoundReport extends Component<Props, State> {
  state = {
    hasClickedReadyToPlayAgain: false,
  }

  render() {
    const report = this.props.endOfRoundData.endOfRoundReport
    const players = this.props.endOfRoundData.players
    const indexOfPicker = this.props.endOfRoundData.pickerIndex
    if (report) {
      return (
        <Modal show={true} onHide={() => {}} backdrop='static'>
          <Modal.Header>
            <Modal.Title>End Of Round Report</Modal.Title>
          </Modal.Header>
          <Modal.Body className='report'>
            <Table bordered hover variant='dark'>
              <thead>
                <tr className='short'>
                  <th className='short'></th>
                  <th className='short'>Trick: 1</th>
                  <th className='short'>Trick: 2</th>
                  <th className='short'>Trick: 3</th>
                  <th className='short'>Trick: 4</th>
                  <th className='short'>Trick: 5</th>
                  <th className='short'>Trick: 6</th>
                  <th className='short'>Points Won</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => {
                  return (
                    <tr>
                      <td className='short'>
                        {player.name}
                        {indexOfPicker === index && (
                          <p>
                            (Picker)
                            {this.props.endOfRoundData.pickerWentAlone && <span>(Chopped)</span>}
                          </p>
                        )}
                      </td>
                      {report.tricks.map((trick) => {
                        const winningCardId = trick.cards[trick.winningCardIndex].cardId
                        const leadingCardId = trick.cards[0].cardId
                        const cardId = trick.cards.find(
                          (card: CardPlayedByData) => card.playedByPlayerId === player.id
                        )?.cardId
                        return (
                          <td
                            key={cardId}
                            className={`short ${winningCardId === cardId ? 'winner' : ''}`}
                          >
                            {winningCardId === cardId && <span>Won</span>}
                            <div>{cardId && <AbbreviatedCard card={cardId} />}</div>
                            {leadingCardId === cardId && <span>Lead</span>}
                          </td>
                        )
                      })}
                      <td className='short'>
                        {report.tricks.reduce((total: number, trick: TrickData) => {
                          const winningCardId = trick.cards[trick.winningCardIndex].cardId
                          const cardPlayedByPlayer: CardPlayedByData | undefined = trick.cards.find(
                            (card: CardPlayedByData) => card.playedByPlayerId === player.id
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
                  <td className='short'>Trick Value</td>
                  {report.tricks.map((trick: TrickData) => {
                    return (
                      <td className='short'>
                        {trick.cards.reduce((trickValue: number, card: CardPlayedByData) => {
                          return trickValue + card.pointValue
                        }, 0)}
                      </td>
                    )
                  })}
                  <td className='short'></td>
                </tr>
              </tbody>
            </Table>
            <Table bordered hover variant='dark'>
              <thead>
                <tr>
                  <th className='short'>Bury</th>
                  <th className='short'></th>
                  <th className='short'></th>
                  <th className='short'>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='short'></td>
                  <td className='short'>
                    <AbbreviatedCard card={report.bury.cards[0].cardId} />
                  </td>
                  <td className='short'>
                    <AbbreviatedCard card={report.bury.cards[1].cardId} />
                  </td>
                  <td className='short'>
                    {report.bury.cards[0].pointValue + report.bury.cards[1].pointValue}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            {!this.state.hasClickedReadyToPlayAgain && (
              <Button
                variant='primary'
                onClick={() => {
                  this.props.endOfGamePresenter.playAgain()
                  this.setState({ hasClickedReadyToPlayAgain: true })
                }}
              >
                Play Another Round
              </Button>
            )}
            {this.state.hasClickedReadyToPlayAgain && (
              <div className='ready'>
                Got it. <br />
                We'll start the next round as soon as everyone else is ready.
              </div>
            )}
          </Modal.Footer>
        </Modal>
      )
    }
    return null
  }
}

export default EndOfRoundReport
