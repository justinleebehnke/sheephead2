import PlayerDTO from './PlayerDTO'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class GameManager {
  private host: PlayerDTO
  private players: PlayerDTO[]
  private firstDealerIndex!: number
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
}

export default GameManager
