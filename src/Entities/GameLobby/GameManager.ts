import IGameManager from '../../InterfaceAdapters/CommandExecutor/LobbyCommands/IGameManager'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

class GameManager implements IGameManager {
  // how does this work now?
  createGame(hostName: string, hostId: UniqueIdentifier): void {
    throw new Error('Method not implemented.')
  }

  getJoinableGames(): any[] {
    return []
    // we don't actually want to create games unless we are talking about the local player
    // too much overhead...
    // we are just trying to describe the gathering of the game data as we prepare.
    // this thing can have players added to it...
    // games with 4 players are already started
    // what the presenter is really looking for is what games have been started
    // what games can be joined
  }
}

export default GameManager
