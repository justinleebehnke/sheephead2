import PlayerDTO from './PlayerDTO'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class PreGame {
  private host: PlayerDTO
  private players: PlayerDTO[]
  constructor(host: PlayerDTO) {
    this.host = host
    this.players = [host]
  }

  public getHost(): PlayerDTO {
    return this.host
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

export default PreGame
