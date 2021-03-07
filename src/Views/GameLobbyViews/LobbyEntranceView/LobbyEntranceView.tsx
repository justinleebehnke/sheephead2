import { Component, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import ILobbyEntrancePresenter from './ILobbyEntrancePresenter'

type Props = {
  presenter: ILobbyEntrancePresenter
}

class LobbyEntranceView extends Component<Props> {
  componentDidMount(): void {
    this.props.presenter.setView(this)
  }

  render(): ReactElement {
    return (
      <div id='lobby-entrance'>
        <h1>Game Lobby</h1>
        <div>
          <InputGroup size='lg'>
            <InputGroup.Prepend>
              <InputGroup.Text id='inputGroup-sizing-lg'>Your Displayed Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              required
              onBlur={() => this.props.presenter.nameInputBlurred()}
              onChange={(event) => this.updateName(event)}
              aria-label='Large'
              aria-describedby='inputGroup-sizing-sm'
              value={this.props.presenter.getLocalPlayerName()}
            />
          </InputGroup>
        </div>
        <Button onClick={() => this.props.presenter.hostNewGame()} id='host-new-game-button'>
          Host a new Game
        </Button>
      </div>
    )
  }

  private updateName(event: React.ChangeEvent): void {
    const target = event.target as HTMLInputElement
    this.props.presenter.setLocalPlayerName(target.value)
  }

  public update(): void {
    this.setState({})
  }
}

export default LobbyEntranceView
