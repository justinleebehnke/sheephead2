import React, { Component, ReactElement } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

import GameManager from '../UseCase/GameManager'
import SelectableCardHand from './SelectableCardHand'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
const localPlayerId = '79dbc191-2b0e-4dc3-83d7-7696c4abcb61'
type State = {
  isPicking: boolean
  isShow: boolean
}

class PassOrPick extends Component<{}, State> {
  state = {
    isPicking: false,
    isShow: false,
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
      if (this.state.isPicking) {
        if (!this.state.isShow) {
          this.setState({ isShow: true })
        }
        return
      }
      if (this.state.isShow !== game.getCurrentRound()?.isFindingPickerState()) {
        this.setState({
          isShow: game.getCurrentRound()?.isFindingPickerState() || this.state.isPicking,
        })
      }
    }
  }

  render() {
    return (
      <Modal show={this.state.isShow}>
        <Modal.Header>
          <Modal.Title className='center'>
            {this.state.isPicking ? 'Choose 2 Cards to Bury' : 'Pass or Pick'}
          </Modal.Title>
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
    if (!this.state.isPicking) {
      return (
        <div className='controls'>
          <span>
            <Button variant='primary' onClick={this.pick}>
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
    return <span></span>
  }

  pick = (): void => {
    const game = GameManager.getPlayersCurrentGame()
    const round = game.getCurrentRound()
    if (!round) return
    const currentTurnPlayer = round.getCurrentTurnPlayer()
    if (!currentTurnPlayer) return
    if (currentTurnPlayer.getId() === localPlayerId) {
      round.pick()
      this.setState({ isPicking: true })
    }
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

  renderHand = (): ReactElement => {
    const game = GameManager.getPlayersCurrentGame()
    const localPlayer = game.getPlayerById(new UniqueIdentifier(localPlayerId))
    return (
      <SelectableCardHand
        isShowBury={this.state.isPicking}
        cardIds={localPlayer.getPlayableCardIds()}
      />
    )
  }
}

export default PassOrPick
