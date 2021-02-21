import React, { Component, ReactElement } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import PassOrPickViewData from './PassOrPickViewData'
import SelectableCardHand from './SelectableCardHand'

interface PassOrPickPresenter {
  bury(cardIds: string[]): void
  pass(): void
  pick(): void
}

type Props = {
  presenter: PassOrPickPresenter
  data: PassOrPickViewData
}

class PassOrPick extends Component<Props> {
  render() {
    return (
      <Modal show={this.props.data.isShowingPassOrPickForm}>
        <Modal.Header>
          <Modal.Title className='center'>
            {this.props.data.isPicking ? 'Choose 2 Cards to Bury' : 'Pass or Pick'}
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
    if (!this.props.data.isPicking) {
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
    const { data, presenter } = this.props
    return <SelectableCardHand presenter={presenter} selectableCardHandData={data} />
  }
}

export default PassOrPick
