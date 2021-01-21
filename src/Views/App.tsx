import { ReactElement } from 'react'
import GameLobby from '../UseCase/GameLobby'
import GameLobbyView from './GameLobbyViews/GameLobbyView'
import GameLobbyPresenter from '../InterfaceAdapters/GameLobbyPresenter'
import LobbyCommandProxy from '../InterfaceAdapters/Communicators/LobbyCommandProxy'
import ServerCommunicator from '../Drivers/ServerCommunicator'
import './App.css'

function App(): ReactElement {
  const gameLobby = new GameLobby()
  const lobbyPresenter = new GameLobbyPresenter(
    new LobbyCommandProxy(new ServerCommunicator(), gameLobby),
    gameLobby,
    new ServerCommunicator()
  )
  return (
    <section>
      <GameLobbyView presenter={lobbyPresenter} />
    </section>
  )
}

export default App
