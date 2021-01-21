import GameLobby from '../../UseCase/GameLobby'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import AddPlayerCommand from '../CommandTypes/AddPlayerCommand'
import HostNewGameCommand from '../CommandTypes/HostNewGameCommand'
import RemovePlayerCommand from '../CommandTypes/RemovePlayerCommand'
import StartGameCommand from '../CommandTypes/StartGameCommand'
import ICommandCommunicatorRequest from '../ICommandCommunicatorRequest'
import ICommandCommunicatorResponse from '../ICommandCommunicatorResponse'
import ICommandInterface from '../ICommandInterface'
import ICommandObject from '../ICommandObject'
import IFetch from './IFetch'
import { serverUrl } from './constants'

const POLLING_FREQUENCY_IN_MILLISECONDS = 1000

class LobbyCommandProxy implements ICommandInterface {
  private fetcher: IFetch
  private indexOfNextCommand: number
  private gameLobby: GameLobby
  private static interval: NodeJS.Timeout

  constructor(fetcher: IFetch, gameLobby: GameLobby) {
    this.fetcher = fetcher
    this.indexOfNextCommand = 0
    this.gameLobby = gameLobby
  }

  public start(): void {
    this.getCommands()
  }

  public async giveCommand(command: ICommandObject): Promise<void> {
    const request: ICommandCommunicatorRequest = {
      indexOfNextCommand: this.indexOfNextCommand,
      newCommand: command,
    }

    const res: JSON = await this.fetcher.post(`${serverUrl}/lobby`, request)
    this.handleNewCommands(res)
  }

  private isICommandCommunicatorResponse(res: any): res is ICommandCommunicatorResponse {
    return res && res.indexOfNextCommand >= 0 && res.newCommands
  }

  private async getCommands(): Promise<void> {
    if (LobbyCommandProxy.interval) {
      clearTimeout(LobbyCommandProxy.interval)
    }
    const res = await this.fetcher.get(`${serverUrl}/lobby/${this.indexOfNextCommand}`)
    this.handleNewCommands(res)
    this.setTimeout()
  }

  private setTimeout(): void {
    LobbyCommandProxy.interval = setTimeout(
      () => this.getCommands(),
      POLLING_FREQUENCY_IN_MILLISECONDS
    )
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
      const hostId = new UniqueIdentifier(command.params.hostId)
      this.gameLobby.startGameByHostId(
        hostId,
        command.params.shuffleSeed,
        command.params.firstDealerIndex
      )
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
