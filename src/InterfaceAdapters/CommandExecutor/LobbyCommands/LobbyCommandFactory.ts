import AddPlayerToGameCommand from './AddPlayerToGameCommand'
import AddPlayerToGameCommandDTO from './LobbyCommandDTOs/AddPlayerToGameCommandDTO'
import CommandDTO from '../CommandDTO'
import HostNewGameCommand from './HostNewGameCommand'
import HostNewGameCommandDTO from './LobbyCommandDTOs/HostNewGameCommandDTO'
import ICommand from '../ICommand'
import ICommandFactory from '../ICommandFactory'
import IGameManager from '../../../Entities/GameManager/IGameManager'
import RemovePlayerFromGameCommandDTO from './LobbyCommandDTOs/RemovePlayerFromGameCommandDTO'
import RemovePlayerFromGameCommand from './RemovePlayerFromGameCommand'
import StartGameCommand from './StartGameCommand'
import StartGameCommandDTO from './LobbyCommandDTOs/StartGameCommandDTO'
import UnStartGameCommand from './UnStartGameCommand'
import UnStartGameCommandDTO from './LobbyCommandDTOs/UnStartGameCommandDTO'

class LobbyCommandFactory implements ICommandFactory {
  constructor(private readonly gameManager: IGameManager) {}

  getCommand(commandDTO: CommandDTO): ICommand {
    if (this.isHostNewGameCommandDTO(commandDTO)) {
      return new HostNewGameCommand(
        this.gameManager,
        commandDTO.params.hostName,
        commandDTO.params.hostId
      )
    }
    if (this.isAddPlayerCommandDTO(commandDTO)) {
      return new AddPlayerToGameCommand(this.gameManager, {
        newPlayerName: commandDTO.params.playerName,
        newPlayerId: commandDTO.params.playerId,
        hostId: commandDTO.params.hostId,
      })
    }
    if (this.isRemovePlayerCommandDTO(commandDTO)) {
      return new RemovePlayerFromGameCommand(this.gameManager, {
        hostId: commandDTO.params.hostId,
        playerToRemoveId: commandDTO.params.playerId,
      })
    }
    if (this.isStartGameCommandDTO(commandDTO)) {
      return new StartGameCommand(this.gameManager, commandDTO.params.hostId, {
        shuffleSeed: commandDTO.params.shuffleSeed,
        firstDealerIndex: commandDTO.params.firstDealerIndex,
      })
    }
    if (this.isUnStartGameCommandDTO(commandDTO)) {
      return new UnStartGameCommand(this.gameManager, commandDTO.params.hostId)
    }
    throw new Error(`Lobby Command not recognized: ${JSON.stringify(commandDTO)}`)
  }

  private isHostNewGameCommandDTO(commandDTO: CommandDTO): commandDTO is HostNewGameCommandDTO {
    return commandDTO.name === 'hostNewGame'
  }

  private isAddPlayerCommandDTO(commandDTO: CommandDTO): commandDTO is AddPlayerToGameCommandDTO {
    return commandDTO.name === 'addPlayer'
  }

  private isRemovePlayerCommandDTO(
    commandDTO: CommandDTO
  ): commandDTO is RemovePlayerFromGameCommandDTO {
    return commandDTO.name === 'removePlayer'
  }

  private isStartGameCommandDTO(commandDTO: CommandDTO): commandDTO is StartGameCommandDTO {
    return commandDTO.name === 'startGame'
  }

  private isUnStartGameCommandDTO(commandDTO: CommandDTO): commandDTO is UnStartGameCommandDTO {
    return commandDTO.name === 'unStartGame'
  }
}

export default LobbyCommandFactory
