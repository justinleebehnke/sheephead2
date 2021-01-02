import { Component, Fragment, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Table from 'react-bootstrap/Table'
import GameBoard from '../GamePlayViews/GameBoard'
import IGameData from '../../UseCase/IGameData'
import ISubscriber from '../../Entities/ISubscriber'
import IGameLobbyPresenter from '../../InterfaceAdapters/IGameLobbyPresenter'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import './GameLobby.css'

type Props = {
  presenter: IGameLobbyPresenter
}

type State = {
  firstDealerIndex: number
  localPlayerName: string
}

class GameLobbyView extends Component<Props, State> implements ISubscriber {
  state = {
    firstDealerIndex: -1,
    localPlayerName: this.props.presenter.getLocalPlayerName(),
  }

  update(): void {
    this.setState({})
  }

  componentDidMount(): void {
    this.props.presenter.setView(this)
  }

  render() {
    const { presenter } = this.props

    return (
      <Fragment>
        {presenter.shouldRenderLobby() && this.renderLobby()}
        {(presenter.shouldRenderHostGameSetupView() ||
          presenter.shouldRenderPlayerGameSetupView()) &&
          this.renderGameSetupScreen()}
        {presenter.shouldRenderGameBoardView() && this.renderStartedGame()}
      </Fragment>
    )
  }

  private renderStartedGame = (): ReactElement => {
    const { presenter } = this.props
    const gamePresenter = presenter.getGamePresenter()

    return <GameBoard presenter={gamePresenter} />
  }

  private renderLobby = (): ReactElement => {
    const { presenter } = this.props
    return (
      <div className='lobby'>
        <div className='split'>
          <div>
            <h1>Game Lobby</h1>
          </div>
          <div>
            <InputGroup size='lg'>
              <InputGroup.Prepend>
                <InputGroup.Text id='inputGroup-sizing-lg'>Your Displayed Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                required
                onBlur={() => presenter.setLocalPlayerName(this.state.localPlayerName)}
                onChange={this.updateName}
                aria-label='Large'
                aria-describedby='inputGroup-sizing-sm'
                value={this.state.localPlayerName}
              />
            </InputGroup>
          </div>
        </div>

        <Button
          onClick={
            presenter.getLocalPlayerName() === ''
              ? () => this.alertOfRequiredName()
              : () => presenter.hostNewGame()
          }
        >
          Host a new Game
        </Button>
        {this.renderJoinableGames()}
      </div>
    )
  }

  private renderJoinableGames = (): ReactElement => {
    const { presenter } = this.props
    return (
      <div>
        <h4 className='joinable-games-header'>Here are the games you can join</h4>
        <div className='wrap'>
          <Table bordered hover variant='dark'>
            <thead>
              <tr>
                <th>#</th>
                <th>Host</th>
                <th>Player 2</th>
                <th>Player 3</th>
                <th>Player 4</th>
                <th>Join</th>
              </tr>
            </thead>
            <tbody>
              {presenter.getJoinableGames().map((game: IGameData) => {
                while (game.players.length < 4) {
                  game.players.push({ getName: () => '', getId: () => new UniqueIdentifier() })
                }

                return (
                  <tr key={game.gameNumber}>
                    <td>{game.gameNumber}</td>
                    {game.players.map((player: PlayerDTO) => {
                      return <td key={player.getId().getId()}>{`${player.getName()}`}</td>
                    })}
                    <td>
                      <Button
                        variant='primary'
                        onClick={
                          presenter.getLocalPlayerName() === ''
                            ? () => this.alertOfRequiredName()
                            : () => presenter.joinGame(game.players[0]?.getId())
                        }
                      >
                        Join
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }

  private alertOfRequiredName = (): void => {
    window.alert('Please fill out "Your Displayed Name"')
  }

  private renderGameSetupScreen = (): ReactElement => {
    const { presenter } = this.props

    const players = presenter.getJoinedGamePlayers()

    while (players.length < 4) {
      players.push({
        getName: () => '',
        getId: () => new UniqueIdentifier(),
      })
    }

    return (
      <div className='lobby'>
        <h1>Game Setup</h1>
        {presenter.shouldRenderHostGameSetupView() && (
          <Form.Group controlId='firstDealer'>
            <div className='split'>
              <div className='split'>
                <Form.Label>Who should deal first?</Form.Label>
                <Form.Control
                  as='select'
                  value={this.state.firstDealerIndex}
                  onChange={this.updateFirstDealerIndex}
                >
                  <option value={-1}>Random</option>
                  <option value={0}>Host (You)</option>
                  <option value={1}>Player 2</option>
                  <option value={2}>Player 3</option>
                  <option value={3}>Player 4</option>
                </Form.Control>
              </div>
              <div></div>
            </div>
          </Form.Group>
        )}

        <Table bordered hover variant='dark'>
          <thead>
            <tr>
              <th>#</th>
              <th>Host</th>
              <th>Player 2</th>
              <th>Player 3</th>
              <th>Player 4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{presenter.getJoinedGameNumber()}</td>
              {players.map((player) => {
                return (
                  <td
                    className={player.getName() === '' ? 'light' : ''}
                    key={player.getId().getId()}
                  >
                    {player.getName() === presenter.getLocalPlayerName()
                      ? `${presenter.getLocalPlayerName()} (You)`
                      : player.getName() === ''
                      ? 'Computer by default'
                      : player.getName()}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </Table>
        <div className='split'>
          <div></div>
          <div>
            <Button variant='outline-primary' onClick={() => presenter.leaveGame()}>
              Leave
            </Button>{' '}
            {presenter.shouldRenderHostGameSetupView() && (
              <Button onClick={() => presenter.startGame(this.state.firstDealerIndex)}>
                Start Game
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  private updateFirstDealerIndex = (event: React.ChangeEvent): void => {
    const eventTarget = event.target as HTMLInputElement
    this.setState({ firstDealerIndex: parseInt(eventTarget.value, 10) })
  }

  private updateName = (event: React.ChangeEvent): void => {
    const target = event.target as HTMLInputElement
    this.setState({ localPlayerName: target.value })
  }
}

export default GameLobbyView
