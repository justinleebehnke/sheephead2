import { Component, Fragment, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Table from 'react-bootstrap/Table'
import BellePlaineRulesCardRanker from '../../Entities/BellePlaineRulesCardRanker'
import CommandExecutor from '../../InterfaceAdapters/CommandExecutor/CommandExecutor'
import CPUPlayer from '../../UseCase/CPUPlayer'
import Game from '../../Entities/Game'
import GameCommandFactory from '../../InterfaceAdapters/CommandExecutor/GameCommands/GameCommandFactory'
import GameBoard from './../GamePlayViews/GameBoard'
import GameBoardPresenter from '../../InterfaceAdapters/GameBoardPresenter/GameBoardPresenter'
import GameBoardModel from '../../InterfaceAdapters/GamePresenter/GameBoardModel'
import LocalGameCommandInterface from '../../InterfaceAdapters/LocalGameCommandInterface'
import Player from '../../Entities/Player'
import RandomName from '../../UseCase/RandomName'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import './GameLobby.css'
import LobbyEntranceView from './LobbyEntranceView/LobbyEntranceView'
import LobbyEntrancePresenter from './LobbyEntranceView/LobbyEntrancePresenter'
import LocalPlayerInfoManager from './LocalPlayerInfoManager'
import UserNotifier from './UserNotifier'
import LobbyCommandInterface from '../../InterfaceAdapters/LobbyCommandInterface/LobbyCommandInterface'
import Fetcher from '../../Drivers/Fetcher'
import LobbyCommandFactory from '../../InterfaceAdapters/CommandExecutor/LobbyCommands/LobbyCommandFactory'
import GameManager from '../../Entities/GameManager/GameManager'

const PAUSE_DURATION_FOR_GAME_EVENTS = 1300

function getRandomNumberBetweenZeroAndMax(max: number): number {
  return Math.floor(Math.random() * max)
}

type State = {
  firstDealerIndex: number
  isHostingGame: boolean
  isInStartedGame: boolean
  localPlayerName: string
}

// so there is someone that is monitoring changes to the GameManager
// the GameManager is massive... there can only be one
// I feel like the Game Manager should be created whenever the local player views the lobby...

// what should be showing...
// it seems like there should be a screen showing the hosted game?

// so there are 3 screens
// I have not joined a game screen // I use the GameManager
// I am in a preGame screen // I use the GameManager
// I am in a game screen // I DO NOT use the GameManager

// game lobby should create an subscribe to the game
// well...
// APP PRESENTER
// I feel like there is a parent element here that I am forgetting about

class GameLobby extends Component<{}, State> {
  state = {
    firstDealerIndex: -1,
    isHostingGame: false,
    isInStartedGame: false,
    localPlayerName: localStorage.getItem('localPlayerName') || '',
  }

  render() {
    return (
      <Fragment>
        {!this.state.isInStartedGame && !this.state.isHostingGame && this.renderLobby()}
        {!this.state.isInStartedGame && this.state.isHostingGame && this.renderHostScreen()}
        {this.state.isInStartedGame && this.renderStartedGame()}
      </Fragment>
    )
  }

  private renderStartedGame = (): ReactElement => {
    const { firstDealerIndex } = this.state
    const ranker = new BellePlaineRulesCardRanker()
    const game: Game = new Game(
      [],
      firstDealerIndex === -1 ? getRandomNumberBetweenZeroAndMax(4) : firstDealerIndex,
      Date.now()
    )
    const commandInterface = new LocalGameCommandInterface(
      new CommandExecutor(new GameCommandFactory(game))
    )

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

    const presenter = new GameBoardPresenter(
      commandInterface,
      new GameBoardModel(
        new UniqueIdentifier(localStorage.getItem('localPlayerId') || undefined),
        game
      ),
      PAUSE_DURATION_FOR_GAME_EVENTS
    )
    return <GameBoard presenter={presenter} />
  }

  private renderLobby = (): ReactElement => {
    const gameManager = new GameManager() // TODO someone needs to subscribe to this and detect that the player is now in an active game

    const presenter = new LobbyEntrancePresenter(
      new LocalPlayerInfoManager(),
      new UserNotifier(),
      new LobbyCommandInterface(
        1000,
        new Fetcher(),
        'http://localhost:2020/lobby',
        new CommandExecutor(new LobbyCommandFactory(gameManager))
      )
    )
    return <LobbyEntranceView presenter={presenter} />
    /*return (
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
              : () => this.setState({ isInStartedGame: true })
          }
        >
          Play Computer
        </Button>
      </div>
    )*/
  }

  private alertOfRequiredName = (): void => {
    window.alert('Please fill out "Your Displayed Name"')
  }

  private renderHostScreen = (): ReactElement => {
    return (
      <div className='lobby'>
        <h1>Host Game Screen</h1>
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
              <td className='light'>{'Computer by default'}</td>
              <td className='light'>{'Computer by default'}</td>
              <td className='light'>{'Computer by default'}</td>
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

  private updateFirstDealerIndex = (event: React.ChangeEvent): void => {
    const eventTarget = event.target as HTMLInputElement
    this.setState({ firstDealerIndex: parseInt(eventTarget.value, 10) })
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
