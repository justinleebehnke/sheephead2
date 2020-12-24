import React, { Component, ReactElement } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

import GameManager from '../UseCase/GameManager'
import SelectableCardHand from './SelectableCardHand'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
const localPlayerId = '79dbc191-2b0e-4dc3-83d7-7696c4abcb61'
type State = {
  isShow: boolean
}

/*

The players hand should be displayed
The hand is not interactive

If they decide to pick
The cards from the blind are added to their hand

then the player must select two cards
and then click bury in order to 

a player may select or deselect any card

But the button to bury will not be enabled unless two cards are selected

and the 

*/

class PassOrPick extends Component<{}, State> {
  state = {
    isShow: false,
  }

  pass = (): void => {
    const game = GameManager.getPlayersCurrentGame()
    const round = game.getCurrentRound()
    if (!round) return
    const currentTurnPlayer = round.getCurrentTurnPlayer()
    if (!currentTurnPlayer) return
    if (currentTurnPlayer.getId() === localPlayerId) {
      round.pass()
      this.setState({ isShow: false })
    }
  }

  componentDidMount() {
    this.checkIfTurnAndUpdate()
  }

  componentDidUpdate() {
    this.checkIfTurnAndUpdate()
  }

  checkIfTurnAndUpdate() {
    const game = GameManager.getPlayersCurrentGame()
    if (game.getCurrentRound()?.getCurrentTurnPlayer()?.getId() === localPlayerId) {
      if (this.state.isShow !== game.getCurrentRound()?.isFindingPickerState() || false) {
        this.setState({ isShow: game.getCurrentRound()?.isFindingPickerState() || false })
      }
    }
  }

  render() {
    return (
      <Modal show={this.state.isShow}>
        <Modal.Header>
          <Modal.Title className='center'>Pass or Pick</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className='center'>
            {this.renderActions()}
            {this.renderHand()}
          </Container>
        </Modal.Body>
      </Modal>
    )
  }

  renderActions = (): ReactElement => {
    return (
      <div className='controls'>
        <span>
          <Button variant='primary' onClick={this.pass}>
            Pick
          </Button>
        </span>{' '}
        <span className='right'>
          <Button variant='outline-primary' onClick={this.pass}>
            Pass
          </Button>
        </span>
      </div>
    )
  }

  renderHand = (): ReactElement => {
    const game = GameManager.getPlayersCurrentGame()
    const localPlayer = game.getPlayerById(new UniqueIdentifier(localPlayerId))
    return <SelectableCardHand cardIds={localPlayer.getPlayableCardIds().concat(['2c', '2c'])} />
  }
}

export default PassOrPick
