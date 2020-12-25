import Game from '../Entities/Game'
import Player from '../Entities/Player'
import PlayerDTO from './PlayerDTO'
import RandomName from './RandomName'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class GameManager {
  private host: PlayerDTO
  private players: PlayerDTO[]
  private firstDealerIndex!: number
  private game: Game | undefined

  constructor(host: PlayerDTO) {
    this.host = host
    this.players = [host]
    this.setFirstDealerIndex(0)
  }

  public getHost(): PlayerDTO {
    return this.host
  }

  public setFirstDealerIndex(index: number): void {
    if (index < 0 || index > 3) {
      throw Error('First dealer index must be between 0 and 3')
    }
    this.firstDealerIndex = index
  }

  public getFirstDealerIndex(): number {
    return this.firstDealerIndex
  }

  public addPlayer(player: PlayerDTO): void {
    if (this.getPlayerById(player.getId())) {
      throw Error('Cannot have two players with same id in game')
    }
    this.players.push(player)
  }

  public getPlayerById(id: UniqueIdentifier): PlayerDTO | undefined {
    return this.players.find((player) => player.getId().equals(id))
  }

  public removePlayerById(id: UniqueIdentifier): void {
    this.players = this.players.filter((player) => !player.getId().equals(id))
  }

  public startGame(): void {
    if (this.game !== undefined) {
      throw 'Game already started'
    }
    while (this.players.length < 4) {
      this.addPlayer({
        getId: () => new UniqueIdentifier(),
        getName: () => new RandomName().getName(),
      })
    }
    this.game = new Game(
      this.players.map((playerDto) => new Player(playerDto.getName(), playerDto.getId())),
      this.firstDealerIndex
    )
  }

  public getGame(): undefined | Game {
    return this.game
  }
}

export default GameManager
