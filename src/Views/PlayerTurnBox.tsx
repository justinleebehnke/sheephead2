import React, { Component } from 'react'
import Badge from 'react-bootstrap/Badge'
import Card from './Card'
import './PlayerTurnBox.css'

type Props = {
  playerName: string
  isDealer: boolean
  isPicker: boolean
  chosenCard: string
}

class PlayerTurnBox extends Component<Props, {}> {
  render() {
    return (
      <div className='player-turn-box'>
        <h3>
          <Badge variant='primary'>{this.props.playerName}</Badge>
          {this.props.isDealer && <Badge variant='secondary'>Dealer</Badge>}
          {this.props.isPicker && <Badge variant='secondary'>Picker</Badge>}
          {this.props.chosenCard === 'turn' && <Badge variant='warning'>Turn</Badge>}
          <Card isPlayable={false} card={this.props.chosenCard} play={() => {}} />
        </h3>
      </div>
    )
  }
}

export default PlayerTurnBox
