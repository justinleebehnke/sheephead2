import React, { Component, ReactElement } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import PassOrPickPresenter from './PassOrPickPresenter'
import PassOrPickViewData from './PassOrPickViewData'
import SelectableCardHand from './SelectableCardHand'
import './PassOrPick.css'

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
    if (this.props.data.isLoading && !this.props.data.isPicking) {
      return (
        <div className='controls'>
          <div></div>
          <Spinner animation='border' className='center' />
          <div></div>
        </div>
      )
    }
    if (!this.props.data.isPicking) {
      return (
        <div className='controls'>
          <span>
            <Button
              variant='outline-primary'
              onClick={() => {
                presenter.pick()
              }}
            >
              Pick
            </Button>
          </span>{' '}
          <span className='right'>
            <Button
              variant='primary'
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
