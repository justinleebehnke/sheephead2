import { Component, Fragment, ReactElement } from 'react'
import Button from 'react-bootstrap/esm/Button'
import AppPresenter from './AppPresenter/AppPresenter'
import CommandExecutor from '../InterfaceAdapters/CommandExecutor/CommandExecutor'
import Fetcher from '../Drivers/Fetcher'
import GameManager from '../Entities/GameManager/GameManager'
import GameView from './GamePlayViews/GameBoard'
import HostPreGameView from './GameLobbyViews/PreGameView/HostPreGameView'
import IAppPresenter from './AppPresenter/IAppPresenter'
import ICommandInterface from '../InterfaceAdapters/ICommandInterface'
import JoinableGamesPresenter from './GameLobbyViews/JoinableGamesView/JoinableGamesPresenter'
import LobbyCommandFactory from '../InterfaceAdapters/CommandExecutor/LobbyCommands/LobbyCommandFactory'
import LobbyCommandInterface from '../InterfaceAdapters/LobbyCommandInterface/LobbyCommandInterface'
import LobbyEntrancePresenter from './GameLobbyViews/LobbyEntranceView/LobbyEntrancePresenter'
import LobbyEntranceView from './GameLobbyViews/LobbyEntranceView/LobbyEntranceView'
import LocalPlayerInfoManager from './GameLobbyViews/LocalPlayerInfoManager'
import PlayerPreGameView from './GameLobbyViews/PreGameView/PlayerPreGameView'
import PreGamePresenter from './GameLobbyViews/PreGameView/PreGamePresenter'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import UserNotifier from './GameLobbyViews/UserNotifier'
import './App.css'

class App extends Component {
  private readonly gameManager: GameManager
  private readonly playerInfoManager: LocalPlayerInfoManager
  private readonly presenter: IAppPresenter

  private readonly lobbyPresenter: LobbyEntrancePresenter
  private readonly lobbyCommandInterface: ICommandInterface

  constructor(props: any) {
    super(props)
    this.gameManager = new GameManager()
    this.playerInfoManager = new LocalPlayerInfoManager()
    this.presenter = new AppPresenter(this.gameManager, this.playerInfoManager)
    this.lobbyCommandInterface = new LobbyCommandInterface(
      1000,
      new Fetcher(),
      'http://68.183.105.73:2020/lobby',
      new CommandExecutor(new LobbyCommandFactory(this.gameManager))
    )
    this.lobbyPresenter = new LobbyEntrancePresenter(
      this.playerInfoManager,
      new UserNotifier(),
      this.lobbyCommandInterface
    )
    this.presenter.setView(this)
  }

  update(): void {
    this.setState({})
  }

  render(): ReactElement {
    return (
      <Fragment>
        <section>
          {this.presenter.isShowingLobby && (
            <LobbyEntranceView
              presenter={this.lobbyPresenter}
              joinableGames={
                new JoinableGamesPresenter(
                  this.lobbyCommandInterface,
                  this.gameManager,
                  this.playerInfoManager,
                  new UserNotifier()
                )
              }
            />
          )}
          {this.presenter.isShowingPreGameAsHost && (
            <HostPreGameView
              presenter={
                new PreGamePresenter(
                  this.gameManager,
                  new UniqueIdentifier(this.playerInfoManager.getPlayerId()),
                  this.playerInfoManager,
                  this.lobbyCommandInterface
                )
              }
            />
          )}
          {this.presenter.isShowingPreGameAsNonHost && (
            <PlayerPreGameView
              presenter={
                new PreGamePresenter(
                  this.gameManager,
                  this.gameManager.getGameByPlayerId(
                    new UniqueIdentifier(this.playerInfoManager.getPlayerId())
                  )?.hostId || new UniqueIdentifier(),
                  this.playerInfoManager,
                  this.lobbyCommandInterface
                )
              }
            />
          )}
          {this.presenter.isShowingGame && (
            <GameView presenter={this.presenter.getGamePresenter()} />
          )}
        </section>
        <Button id='reset-button' variant='danger' onClick={() => this.hardReset()}>
          Hard Reset Server (Destroy All Games)
        </Button>
      </Fragment>
    )
  }

  private hardReset = (): void => {
    fetch('http://68.183.105.73:2020', {
      method: 'DELETE',
    }).then(() => {
      window.location.reload()
    })
  }
}

export default App
