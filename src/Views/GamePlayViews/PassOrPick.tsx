import React, { Component, ReactElement } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import GamePresenter from '../../InterfaceAdapters/GamePresenter/GamePresenter'
import SelectableCardHand from './SelectableCardHand'
import SelectableCardHandData from './SelectableCardHandData'

type Props = {
  presenter: GamePresenter
}

class PassOrPick extends Component<Props> {
  render() {
    return (
      <Modal show={this.props.presenter.isShowingPassOrPickForm()}>
        <Modal.Header>
          <Modal.Title className='center'>
            {this.props.presenter.isPicking() ? 'Choose 2 Cards to Bury' : 'Pass or Pick'}
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
    const { presenter } = this.props
    if (!this.props.presenter.isPicking()) {
      return (
        <div className='controls'>
          <span>
            <Button
              variant='primary'
              onClick={() => {
                presenter.pick()
              }}
            >
              Pick
            </Button>
          </span>{' '}
          <span className='right'>
            <Button
              variant='outline-primary'
              onClick={() => {
                presenter.pass()
              }}
            >
              Pass
            </Button>
          </span>
        </div>
      )
    }
    return <span></span>
  }

  renderHand = (): ReactElement => {
    const { presenter } = this.props
    const selectableCardHandData: SelectableCardHandData = {
      hand: presenter.getHand(),
      isPicking: presenter.isPicking(),
    }
    return (
      <SelectableCardHand presenter={presenter} selectableCardHandData={selectableCardHandData} />
    )
  }
}

export default PassOrPick
