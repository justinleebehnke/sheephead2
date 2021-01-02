import GameLobby from '../../UseCase/GameLobby'
import GameManager from '../../UseCase/GameManager'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import AddPlayerCommand from '../CommandTypes/AddPlayerCommand'
import HostNewGameCommand from '../CommandTypes/HostNewGameCommand'
import RemovePlayerCommand from '../CommandTypes/RemovePlayerCommand'
import StartGameCommand from '../CommandTypes/StartGameCommand'
import ICommandCommunicator from '../ICommandCommunicator'
import ICommandCommunicatorRequest from '../ICommandCommunicatorRequest'
import ICommandCommunicatorResponse from '../ICommandCommunicatorResponse'
import ICommandObject from '../ICommandObject'
import IFetch from './IFetch'

const POLLING_FREQUENCY_IN_MILLISECONDS = 500

class LobbyCommandProxy implements ICommandCommunicator {
  private fetcher: IFetch
  private indexOfNextCommand: number
  private gameLobby: GameLobby
  private interval: NodeJS.Timeout | undefined

  constructor(fetcher: IFetch, gameLobby: GameLobby) {
    this.fetcher = fetcher
    this.indexOfNextCommand = 0
    this.gameLobby = gameLobby
  }

  public watchForCommands(): void {
    this.interval = setInterval(async () => {
      await this.getCommands()
    }, POLLING_FREQUENCY_IN_MILLISECONDS)
  }

  public stopWatchingForCommands(): void {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  public async giveCommand(command: ICommandObject): Promise<void> {
    const request: ICommandCommunicatorRequest = {
      indexOfNextCommand: this.indexOfNextCommand,
      newCommand: command,
    }

    const res: JSON = await this.fetcher.post('http://localhost:2020/lobby', request)
    this.handleNewCommands(res)
  }

  private isICommandCommunicatorResponse(res: any): res is ICommandCommunicatorResponse {
    return res && res.indexOfNextCommand >= 0 && res.newCommands
  }

  private async getCommands(): Promise<void> {
    const res: JSON = await this.fetcher.get(
      `http://localhost:2020/lobby/${this.indexOfNextCommand}`
    )
    this.handleNewCommands(res)
  }

  private handleNewCommands(res: any) {
    if (this.isICommandCommunicatorResponse(res)) {
      this.indexOfNextCommand = res.indexOfNextCommand
      res.newCommands.forEach((command: ICommandObject) => {
        this.executeCommand(command)
      })
    } else {
      throw new Error(`Response did not match expected format: ${JSON.stringify(res)}`)
    }
  }

  private executeCommand(command: ICommandObject): void {
    if (this.isCreateNewGameCommand(command)) {
      const host: PlayerDTO = {
        getId: () => new UniqueIdentifier(command.params.hostId),
        getName: () => command.params.hostName,
      }
      this.gameLobby.addNewGame(host)
    } else if (this.isStartGameCommand(command)) {
      const gameManagers: GameManager[] = this.gameLobby.getAllGames()
      const hostId = new UniqueIdentifier(command.params.hostId)
      const gameToStart = gameManagers.find((gameManager: GameManager) =>
        gameManager.getPlayerById(hostId)
      )
      if (gameToStart) {
        gameToStart.startGame(command.params.shuffleSeed)
      } else {
        throw Error('Game to start was not found')
      }
    } else if (this.isRemovePlayerCommand(command)) {
      const playerId = new UniqueIdentifier(command.params.playerId)
      this.gameLobby.removePlayerFromGame(playerId)
    } else if (this.isAddPlayerCommand(command)) {
      this.gameLobby.addPlayerToGame(
        {
          getId: () => new UniqueIdentifier(command.params.playerId),
          getName: () => command.params.playerName,
        },
        new UniqueIdentifier(command.params.hostId)
      )
    } else {
      throw Error(`Did not recognize command: ${JSON.stringify(command)}`)
    }
  }

  private isCreateNewGameCommand(command: ICommandObject): command is HostNewGameCommand {
    return command.name === 'hostNewGame'
  }

  private isStartGameCommand(command: ICommandObject): command is StartGameCommand {
    return command.name === 'startGame'
  }

  private isRemovePlayerCommand(command: ICommandObject): command is RemovePlayerCommand {
    return command.name === 'removePlayer'
  }

  private isAddPlayerCommand(command: ICommandObject): command is AddPlayerCommand {
    return command.name === 'addPlayer'
  }
}

export default LobbyCommandProxy
