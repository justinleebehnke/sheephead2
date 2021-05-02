import CardPlayedByData from '../Entities/DataStructures/CardPlayedByData'
import EndOfRoundViewData from '../Views/GamePlayViews/EndOfRoundReport/EndOfRoundViewData'
import IRoundTeamOutcome from './IRoundTeamOutcome'
import OppositionTeamMemberIdentifier from '../OppositionTeamMemberIdentifier/OppositionTeamMemberIdentifier'
import PlayerData from '../Views/GamePlayViews/EndOfRoundReport/PlayerData'
import TrickData from '../Entities/DataStructures/TrickData'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class RoundTeamOutcome implements IRoundTeamOutcome {
  private readonly identifier: OppositionTeamMemberIdentifier
  private readonly _oppositionTeamScore: number
  private readonly _oppositionTricksWon: number

  constructor(private readonly endOfRoundViewData: EndOfRoundViewData) {
    this.identifier = new OppositionTeamMemberIdentifier(this.endOfRoundViewData)
    this._oppositionTeamScore = this.endOfRoundViewData.players.reduce(
      (oppositionScore: number, player: PlayerData): number => {
        if (this.identifier.isMemberOfOpposition(new UniqueIdentifier(player.id))) {
          return oppositionScore + this.getPlayerScore(new UniqueIdentifier(player.id))
        }
        return oppositionScore
      },
      0
    )
    this._oppositionTricksWon = this.endOfRoundViewData.players.reduce(
      (oppositionTricksWon: number, player: PlayerData) => {
        if (this.identifier.isMemberOfOpposition(new UniqueIdentifier(player.id))) {
          return oppositionTricksWon + this.getPlayerTricksWon(new UniqueIdentifier(player.id))
        }
        return oppositionTricksWon
      },
      0
    )
  }

  public isMemberOfOpposition(playerId: UniqueIdentifier): boolean {
    return this.identifier.isMemberOfOpposition(playerId)
  }

  public get oppositionTeamScore(): number {
    return this._oppositionTeamScore
  }

  public get pickingTeamScore(): number {
    return 120 - this._oppositionTeamScore
  }

  public get oppositionTricksWon(): number {
    return this._oppositionTricksWon
  }

  public get pickingTeamTricksWon(): number {
    return 6 - this._oppositionTricksWon
  }

  public get pickerId(): UniqueIdentifier {
    if (this.endOfRoundViewData.pickerIndex !== undefined) {
      return new UniqueIdentifier(
        this.endOfRoundViewData.players[this.endOfRoundViewData.pickerIndex].id
      )
    }
    return new UniqueIdentifier()
  }

  public get pickerTricksWon(): number {
    return this.getPlayerTricksWon(this.pickerId)
  }

  public getPlayerScore = (id: UniqueIdentifier): number => {
    return this.getTricksWonByPlayer(id).reduce((total: number, trick: TrickData) => {
      return (
        total +
        trick.cards.reduce((trickValue: number, card: CardPlayedByData) => {
          return trickValue + card.pointValue
        }, 0)
      )
    }, 0)
  }

  private getPlayerTricksWon = (id: UniqueIdentifier): number => {
    return this.getTricksWonByPlayer(id).length
  }

  private getTricksWonByPlayer = (id: UniqueIdentifier): TrickData[] => {
    const report = this.endOfRoundViewData.endOfRoundReport
    if (!report) {
      return []
    }
    return report.tricks.filter((trick: TrickData) => {
      return new UniqueIdentifier(trick.cards[trick.winningCardIndex].playedByPlayerId).equals(id)
    })
  }
}

export default RoundTeamOutcome
