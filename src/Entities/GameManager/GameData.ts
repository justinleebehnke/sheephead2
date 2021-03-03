import GameConfigurationDTO from './GameConfigurationDTO'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

interface GameData {
  config: GameConfigurationDTO
  hostId: UniqueIdentifier
  isStarted: boolean
  players: PlayerDTO[]
}

export default GameData
