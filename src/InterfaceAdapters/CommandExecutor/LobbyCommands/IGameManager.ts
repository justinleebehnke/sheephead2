import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

interface IGameManager {
  createGame(hostName: string, hostId: UniqueIdentifier): void
}

export default IGameManager
