import { Component, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import IHostOrJoinPresenter from './IHostOrJoinPresenter'

type Props = {
  presenter: IHostOrJoinPresenter
}

class HostOrJoinView extends Component<Props> {
  render(): ReactElement {
    return (
      <Button onClick={() => this.props.presenter.hostNewGame()} id='host-new-game-button'>
        Host a new Game
      </Button>
    )
  }
}

export default HostOrJoinView
