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

  public getPlayerScore = (id: UniqueIdentifier): number => {
    const report = this.endOfRoundViewData.endOfRoundReport
    if (!report) {
      return 0
    }
    return report.tricks.reduce((total: number, trick: TrickData) => {
      const winningCardId = trick.cards[trick.winningCardIndex].cardId
      const cardPlayedByPlayer:
        | CardPlayedByData
        | undefined = trick.cards.find((card: CardPlayedByData) =>
        new UniqueIdentifier(card.playedByPlayerId).equals(id)
      )
      if (cardPlayedByPlayer && cardPlayedByPlayer.cardId === winningCardId) {
        return (
          total +
          trick.cards.reduce((trickValue: number, card: CardPlayedByData) => {
            return trickValue + card.pointValue
          }, 0)
        )
      }
      return total
    }, 0)
  }
}

export default RoundTeamOutcome
