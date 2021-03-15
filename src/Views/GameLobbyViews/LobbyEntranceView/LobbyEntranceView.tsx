import { Component, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import ILobbyEntrancePresenter from './ILobbyEntrancePresenter'
import IJoinableGamesPresenter from '../JoinableGamesView/IJoinableGamesPresenter'
import JoinableGamesView from '../JoinableGamesView/JoinableGamesView'

type Props = {
  presenter: ILobbyEntrancePresenter
  joinableGames: IJoinableGamesPresenter
}

class LobbyEntranceView extends Component<Props> {
  componentDidMount(): void {
    this.props.presenter.setView(this)
  }

  render(): ReactElement {
    return (
      <div id='lobby-entrance' className='lobby'>
        <div className='split'>
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
        </div>
        <Button onClick={() => this.props.presenter.hostNewGame()} id='host-new-game-button'>
          Host a new Game
        </Button>
        <hr />
        <JoinableGamesView presenter={this.props.joinableGames} />
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
