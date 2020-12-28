import { Component, Fragment, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Table from 'react-bootstrap/Table'
import BellePlaineRulesCardRanker from '../../Entities/BellePlaineRulesCardRanker'
import CPUPlayer from '../../UseCase/CPUPlayer'
import Game from '../../Entities/Game'
import GameBoard from './../GamePlayViews/GameBoard'
import GamePresenter from '../../InterfaceAdapters/GamePresenter/GamePresenter'
import LocalGameCommandInterface from '../../InterfaceAdapters/LocalGameCommandInterface'
import Player from '../../Entities/Player'
import RandomName from '../../UseCase/RandomName'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import './GameLobby.css'

function getRandomNumberBetweenZeroAndMax(max: number): number {
  return Math.floor(Math.random() * max)
}

localStorage.setItem('localPlayerId', new UniqueIdentifier().getId())

type State = {
  isHostingGame: boolean
  isInStartedGame: boolean
  localPlayerName: string
}

class GameLobby extends Component<{}, State> {
  state = {
    isHostingGame: false,
    isInStartedGame: false,
    localPlayerName: localStorage.getItem('localPlayerName') || '',
  }

  render() {
    const ranker = new BellePlaineRulesCardRanker()
    const game: Game = new Game([], getRandomNumberBetweenZeroAndMax(4), Date.now())
    const commandInterface = new LocalGameCommandInterface(game)

    const playerNames: string[] = [new RandomName().getName()]
    playerNames.push(new RandomName(playerNames).getName())
    playerNames.push(new RandomName(playerNames).getName())

    game.addPlayer(
      new Player(
        `${this.state.localPlayerName} (You)`,
        new UniqueIdentifier(localStorage.getItem('localPlayerId') || undefined)
      )
    )
    game.addPlayer(
      new CPUPlayer(
        playerNames[0],
        new UniqueIdentifier('4d2f43c3-224d-46ba-bb76-0e383d9ceb5c'),
        game,
        ranker,
        commandInterface
      )
    )
    game.addPlayer(
      new CPUPlayer(
        playerNames[1],
        new UniqueIdentifier('32b62508-4e72-4028-8794-fd075b0393b5'),
        game,
        ranker,
        commandInterface
      )
    )
    game.addPlayer(
      new CPUPlayer(
        playerNames[2],
        new UniqueIdentifier('81756fd4-3f61-4833-b012-43fbc407b688'),
        game,
        ranker,
        commandInterface
      )
    )

    const presenter = new GamePresenter(
      new LocalGameCommandInterface(game),
      new UniqueIdentifier(localStorage.getItem('localPlayerId') || undefined),
      game
    )

    return (
      <Fragment>
        {!this.state.isInStartedGame && !this.state.isHostingGame && this.renderLobby()}
        {!this.state.isInStartedGame &&
          this.state.isHostingGame &&
          this.renderHostScreen(playerNames)}
        {this.state.isInStartedGame && <GameBoard presenter={presenter} />}
      </Fragment>
    )
  }

  private renderLobby = (): ReactElement => {
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
                onBlur={this.updateNameInLocalStorage}
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
            this.state.localPlayerName === ''
              ? () => this.alertOfRequiredName()
              : () => this.setState({ isHostingGame: true })
          }
        >
          Host a new Game
        </Button>
      </div>
    )
  }

  private alertOfRequiredName = (): void => {
    window.alert('Please fill out "Your Displayed Name"')
  }

  private renderHostScreen = (playerNames: string[]): ReactElement => {
    return (
      <div className='lobby'>
        <h1>Host Game Screen</h1>
        <Table bordered hover variant='dark'>
          <thead>
            <tr>
              <th>Host</th>
              <th>Player 2</th>
              <th>Player 3</th>
              <th>Player 4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{`${this.state.localPlayerName} (You)`}</td>
              <td>{`${playerNames[0]} (CPU)`}</td>
              <td>{`${playerNames[1]} (CPU)`}</td>
              <td>{`${playerNames[2]} (CPU)`}</td>
            </tr>
          </tbody>
        </Table>
        <div className='split'>
          <div></div>
          <div>
            <Button
              variant='outline-primary'
              onClick={() => this.setState({ isHostingGame: false })}
            >
              Leave
            </Button>{' '}
            <Button onClick={() => this.setState({ isInStartedGame: true })}>Start Game</Button>
          </div>
        </div>
      </div>
    )
  }

  private updateNameInLocalStorage = (): void => {
    localStorage.setItem('localPlayerName', this.state.localPlayerName)
  }

  private updateName = (event: React.ChangeEvent): void => {
    const target = event.target as HTMLInputElement
    this.setState({ localPlayerName: target.value })
  }
}

export default GameLobby
