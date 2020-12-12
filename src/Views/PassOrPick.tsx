import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import GameManager from '../UseCase/GameManager'
const localPlayerId = '79dbc191-2b0e-4dc3-83d7-7696c4abcb61'
type State = {
  isShow: boolean
}

class PassOrPick extends Component<{}, State> {
  state = {
    isShow: true,
  }

  pass = (): void => {
    const game = GameManager.getPlayersCurrentGame()
    if (game.getCurrentRound()?.getCurrentTurnPlayer().getId() === localPlayerId) {
      game.getCurrentRound()?.pass()
    }
    this.setState({ isShow: false })
  }

  componentDidUpdate() {
    const game = GameManager.getPlayersCurrentGame()
    if (game.getCurrentRound()?.getCurrentTurnPlayer().getId() === localPlayerId) {
      if (this.state.isShow !== game.getCurrentRound()?.isFindingPickerState() || false) {
        this.setState({ isShow: game.getCurrentRound()?.isFindingPickerState() || false })
      }
    }
  }

  render() {
    return (
      <Modal show={this.state.isShow}>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Pass or Pick</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Button onClick={this.pass}>Pass</Button>
              <Button onClick={this.pass}>Pick</Button>
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
    )
  }
}

export default PassOrPick
