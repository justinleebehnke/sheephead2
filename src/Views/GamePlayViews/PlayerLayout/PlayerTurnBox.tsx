import React, { Component } from 'react'
import Badge from 'react-bootstrap/Badge'
import Card from '../Card'
import './PlayerTurnBox.css'

type Props = {
  playerName: string
  isDealer: boolean
  isGoingAlone: boolean
  isPicker: boolean
  chosenCard: string
}

class PlayerTurnBox extends Component<Props, {}> {
  render() {
    return (
      <div className='player-turn-box'>
        <h5>
          <Badge variant='primary'>{this.props.playerName}</Badge>
          {this.props.isDealer && <Badge variant='secondary'>Dealer</Badge>}
          {this.props.isPicker && <Badge variant='secondary'>Picker</Badge>}
          {this.props.isPicker && this.props.isGoingAlone && (
            <Badge variant='danger'>Chopped</Badge>
          )}
          {this.props.chosenCard === 'turn' && <Badge variant='warning'>Turn</Badge>}
          <Card isLoading={false} isPlayable={false} card={this.props.chosenCard} play={() => {}} />
        </h5>
      </div>
    )
  }
}

export default PlayerTurnBox
