import ICommandInterface from '../ICommandInterface'
import ICommandObject from '../ICommandObject'
import IFetch from './IFetch'
import Game from '../../Entities/Game'
import ICommandCommunicatorRequest from '../ICommandCommunicatorRequest'
import ICommandCommunicatorResponse from '../ICommandCommunicatorResponse'
import { serverUrl } from './constants'
import PlayCommand from '../CommandTypes/PlayCommand'
import BuryCommand from '../CommandTypes/BuryCommand'
import { Console } from 'console'

const POLLING_FREQUENCY_IN_MILLISECONDS = 1000

class GameCommandProxy implements ICommandInterface {
  private fetcher: IFetch
  private indexOfNextCommand: number
  private game: Game
  private static interval: NodeJS.Timeout | undefined

  constructor(fetcher: IFetch, game: Game) {
    this.fetcher = fetcher
    this.indexOfNextCommand = 0
    this.game = game
  }

  public start(): void {
    this.getCommands()
  }

  private hostId(): string {
    return this.game.getPlayerByIndex(0).getId()
  }

  private async getCommands(): Promise<void> {
    if (GameCommandProxy.interval) {
      clearTimeout(GameCommandProxy.interval)
    }
    const res: JSON = await this.fetcher.get(
      `${serverUrl}/game/${this.hostId()}/${this.indexOfNextCommand}`
    )
    console.log('res', JSON.stringify(res), Date.now())
    this.handleNewCommands(res)
    this.setTimeout()
  }

  private setTimeout(): void {
    GameCommandProxy.interval = setTimeout(
      () => this.getCommands(),
      POLLING_FREQUENCY_IN_MILLISECONDS
    )
  }

  private isICommandCommunicatorResponse(res: any): res is ICommandCommunicatorResponse {
    return res && res.indexOfNextCommand >= 0 && res.newCommands
  }

  private handleNewCommands(res: any) {
    if (this.isICommandCommunicatorResponse(res)) {
      this.indexOfNextCommand = res.indexOfNextCommand

      res.newCommands.forEach((command: ICommandObject) => {
        console.log('command', command)
        this.executeCommand(command)
      })
    } else {
      throw new Error(`Response did not match expected format: ${JSON.stringify(res)}`)
    }
  }

  private executeCommand(command: ICommandObject): void {
    console.log('command', command)
    const currentTurnPlayer = this.game.getCurrentRound()?.getCurrentTurnPlayer()
    if (command.name === 'pass') {
      console.log('TRYING TO PASS')
      this.game.getCurrentRound()?.pass()
    } else if (command.name === 'playAgain') {
      this.game.playAnotherRound()
    } else if (this.isBuryCommand(command)) {
      if (currentTurnPlayer) {
        this.pickIfHasNotPicked()
        const [cardA, cardB] = command.params.cards
        this.game
          .getCurrentRound()
          ?.bury(
            currentTurnPlayer.removeCardFromHand(cardA),
            currentTurnPlayer.removeCardFromHand(cardB)
          )
      }
    } else if (this.isPlayCommand(command)) {
      console.log('TRYING TO PLAY')
      if (currentTurnPlayer) {
        this.game.getCurrentRound()?.play(currentTurnPlayer.removeCardFromHand(command.params.card))
      }
    } else {
      throw new Error(`Game command not implemented ${command}`)
    }
  }

  private pickIfHasNotPicked(): void {
    try {
      this.game.pick()
    } catch (err) {
      // it must be the local player's machine because they already picked
    }
  }

  private isPlayCommand(command: ICommandObject): command is PlayCommand {
    return command.name === 'play'
  }

  private isBuryCommand(command: ICommandObject): command is BuryCommand {
    return command.name === 'bury'
  }

  public async giveCommand(command: ICommandObject): Promise<void> {
    const request: ICommandCommunicatorRequest = {
      indexOfNextCommand: this.indexOfNextCommand,
      newCommand: command,
    }

    const res: JSON = await this.fetcher.post(`${serverUrl}/game/${this.hostId()}`, request)
    this.handleNewCommands(res)
  }
}

export default GameCommandProxy
