import { Component } from 'react'
import Button from 'react-bootstrap/Button'
import EndOfRoundReport from './EndOfRoundReport'
import GamePresenter from '../../InterfaceAdapters/GamePresenter/GamePresenter'
import Hand from './Hand'
import ISubscriber from '../../Entities/ISubscriber'
import PassOrPick from './PassOrPick'
import PlayerLayout from './PlayerLayout'
import './GameBoard.css'

type Props = {
  presenter: GamePresenter
}

class GameBoard extends Component<Props> implements ISubscriber {
  componentWillMount(): void {
    this.props.presenter.setView(this)
  }

  componentWillUnmount(): void {
    this.props.presenter.unsetView()
  }

  render() {
    return (
      this.props.presenter && (
        <div>
          <Button
            id='leaveGameButton'
            variant='outline-primary'
            onClick={() => this.props.presenter.leaveGame()}
          >
            Leave Game
          </Button>
          {this.props.presenter.isShowingPassOrPickForm() && (
            <PassOrPick presenter={this.props.presenter} />
          )}
          <PlayerLayout presenter={this.props.presenter} />
          <Hand presenter={this.props.presenter} />
          {this.props.presenter.isShowEndOfRoundReport() && (
            <EndOfRoundReport presenter={this.props.presenter} />
          )}
        </div>
      )
    )
  }

  update = (): void => {
    this.setState({})
  }
}

export default GameBoard
