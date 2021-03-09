import { Component, ReactElement } from 'react'
import AppPresenter from './AppPresenter/AppPresenter'
import CommandExecutor from '../InterfaceAdapters/CommandExecutor/CommandExecutor'
import Fetcher from '../Drivers/Fetcher'
import GameManager from '../Entities/GameManager/GameManager'
import IAppPresenter from './AppPresenter/IAppPresenter'
import LobbyCommandFactory from '../InterfaceAdapters/CommandExecutor/LobbyCommands/LobbyCommandFactory'
import LobbyCommandInterface from '../InterfaceAdapters/LobbyCommandInterface/LobbyCommandInterface'
import LobbyEntrancePresenter from './GameLobbyViews/LobbyEntranceView/LobbyEntrancePresenter'
import LobbyEntranceView from './GameLobbyViews/LobbyEntranceView/LobbyEntranceView'
import LocalPlayerInfoManager from './GameLobbyViews/LocalPlayerInfoManager'
import JoinableGamesPresenter from './GameLobbyViews/JoinableGamesView/JoinableGamesPresenter'
import UserNotifier from './GameLobbyViews/UserNotifier'
import './App.css'
import HostPreGameView from './GameLobbyViews/PreGameView/HostPreGameView'
import PreGamePresenter from './GameLobbyViews/PreGameView/PreGamePresenter'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import ICommandInterface from '../InterfaceAdapters/ICommandInterface'

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
      'http://localhost:2020/lobby',
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
    console.log('this.gameManager :>> ', this.gameManager)
    this.setState({})
  }

  render(): ReactElement {
    return (
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
        {this.presenter.isShowingPreGameAsNonHost && <div>I am the PreGame as NOT HOST View</div>}
        {this.presenter.isShowingGame && <div>I am the GAME VIEW</div>}
      </section>
    )
  }
}

export default App
