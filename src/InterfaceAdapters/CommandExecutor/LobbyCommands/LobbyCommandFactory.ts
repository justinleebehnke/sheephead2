import AddPlayerToGameCommand from './AddPlayerToGameCommand'
import AddPlayerToGameCommandDTO from './LobbyCommandDTOs/AddPlayerToGameCommandDTO'
import CommandDTO from '../CommandDTO'
import ICommand from '../ICommand'
import ICommandFactory from '../ICommandFactory'
import HostNewGameCommand from './HostNewGameCommand'
import IGameManager from '../../../Entities/GameManager/IGameManager'
import HostNewGameCommandDTO from './LobbyCommandDTOs/HostNewGameCommandDTO'

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
    throw new Error(`Lobby Command not recognized: ${JSON.stringify(commandDTO)}`)
  }

  private isHostNewGameCommandDTO(commandDTO: CommandDTO): commandDTO is HostNewGameCommandDTO {
    return commandDTO.name === 'hostNewGame'
  }

  private isAddPlayerCommandDTO(commandDTO: CommandDTO): commandDTO is AddPlayerToGameCommandDTO {
    return commandDTO.name === 'addPlayer'
  }
}

export default LobbyCommandFactory