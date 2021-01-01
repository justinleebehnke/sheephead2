import { ReactElement } from 'react'
import GameLobby from '../UseCase/GameLobby'
import GameLobbyView from './GameLobbyViews/GameLobbyView'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import GameLobbyPresenter from '../InterfaceAdapters/GameLobbyPresenter'
import LobbyCommandProxy from '../InterfaceAdapters/Communicators/LobbyCommandProxy'
import ServerCommunicator from '../Drivers/ServerCommunicator'
import './App.css'

localStorage.setItem('localPlayerId', new UniqueIdentifier().getId())

function App(): ReactElement {
  const localPlayerId = localStorage.getItem('localPlayerId')
  const localPlayerName = localStorage.getItem('localPlayerName') || ''

  const gameLobby = new GameLobby()
  if (localPlayerId) {
    const lobbyPresenter = new GameLobbyPresenter(
      { getName: () => localPlayerName, getId: () => new UniqueIdentifier(localPlayerId) },
      new LobbyCommandProxy(new ServerCommunicator(), gameLobby),
      gameLobby
    )

    return (
      <section>
        <GameLobbyView presenter={lobbyPresenter} />
      </section>
    )
  } else {
    return <div></div>
  }
}

export default App
