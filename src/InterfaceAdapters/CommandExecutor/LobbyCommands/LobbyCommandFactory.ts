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
}

export default LobbyCommandFactory
