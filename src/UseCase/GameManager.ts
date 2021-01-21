import Game from '../Entities/Game'
import Player from '../Entities/Player'
import PlayerDTO from './PlayerDTO'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import CPUPlayer from './CPUPlayer'
import BellePlaineRulesCardRanker from '../Entities/BellePlaineRulesCardRanker'
import GameCommandProxy from '../InterfaceAdapters/Communicators/GameCommandProxy'
import ServerCommunicator from '../Drivers/ServerCommunicator'

class GameManager {
  private host: PlayerDTO
  private players: PlayerDTO[]
  private firstDealerIndex!: number
  private game: Game | undefined
  private gameId: number

  constructor(host: PlayerDTO, gameId: number) {
    this.host = host
    this.players = [host]
    this.gameId = gameId
    this.setFirstDealerIndex(0)
  }

  public getGameId(): number {
    return this.gameId
  }

  public getPlayers(): PlayerDTO[] {
    return this.players.slice()
  }

  public getHost(): PlayerDTO {
    return this.host
  }

  public setFirstDealerIndex(index: number): void {
    if (index < 0 || index > 3) {
      throw new Error('First dealer index must be between 0 and 3')
    }
    this.firstDealerIndex = index
  }

  public getFirstDealerIndex(): number {
    return this.firstDealerIndex
  }

  public addPlayer(player: PlayerDTO): void {
    if (this.getPlayerById(player.getId())) {
      return // player is already in game
    }
    if (this.gameIsStarted()) {
      throw new Error('Cannot add player to started game')
    }
    this.players.push(player)
  }

  public gameIsStarted(): boolean {
    return this.game !== undefined
  }

  public getPlayerById(id: UniqueIdentifier): PlayerDTO | undefined {
    return this.players.find((player) => player.getId().equals(id))
  }

  public removePlayerById(id: UniqueIdentifier): void {
    if (this.gameIsStarted()) {
      this.game = undefined
    }
    if (id.equals(this.host.getId())) {
      this.players = []
    }
    this.players = this.players.filter((player) => !player.getId().equals(id))
  }

  public startGame(seed: number, firstDealerIndex: number): void {
    if (this.gameIsStarted()) {
      throw new Error('Game already started')
    }
    if (this.players.length < 4) {
      throw new Error('Not enough players to start game')
    }
    if (this.host.getId().getId() === localStorage.getItem('localPlayerId')) {
      const realPlayers: PlayerDTO[] = this.players.filter((player) => this.playerIsReal(player))
      const cpuPlayers: PlayerDTO[] = this.players.filter((player) => !this.playerIsReal(player))
      const newGame = new Game(
        realPlayers.map((playerDto) => new Player(playerDto.getName(), playerDto.getId())),
        firstDealerIndex,
        seed
      )
      cpuPlayers.forEach((cpuPlayer) =>
        newGame.addPlayer(
          new CPUPlayer(
            cpuPlayer.getName(),
            cpuPlayer.getId(),
            newGame,
            new BellePlaineRulesCardRanker(),
            new GameCommandProxy(new ServerCommunicator(), newGame)
          )
        )
      )
      this.game = newGame
    } else {
      this.game = new Game(
        this.players.map((playerDto) => new Player(playerDto.getName(), playerDto.getId())),
        firstDealerIndex,
        seed
      )
    }
  }

  private playerIsReal(player: PlayerDTO): boolean {
    return !player.getName().includes(' (CPU)')
  }

  public getGame(): undefined | Game {
    return this.game
  }
}

export default GameManager
