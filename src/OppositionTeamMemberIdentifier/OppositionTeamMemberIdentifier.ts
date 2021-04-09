import EndOfRoundViewData from '../Views/GamePlayViews/EndOfRoundReport/EndOfRoundViewData'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class OppositionTeamMemberIdentifier {
  private readonly idOfPlayerWhoPlayedTheJackOfDiamonds: UniqueIdentifier | undefined

  constructor(private readonly endOfRoundData: EndOfRoundViewData) {
    if (endOfRoundData.endOfRoundReport) {
      for (let i = 0; i < endOfRoundData.endOfRoundReport.tricks.length; i++) {
        const trick = endOfRoundData.endOfRoundReport.tricks[i]
        for (let j = 0; j < trick.cards.length; j++) {
          const card = trick.cards[j]
          if (card.cardId === 'jd') {
            this.idOfPlayerWhoPlayedTheJackOfDiamonds = new UniqueIdentifier(card.playedByPlayerId)
            break
          }
        }
        if (this.idOfPlayerWhoPlayedTheJackOfDiamonds) {
          break
        }
      }
    }
  }

  public isMemberOfOpposition(id: UniqueIdentifier): boolean {
    const referencedPlayerIndex: number = this.endOfRoundData.players.findIndex((player) =>
      new UniqueIdentifier(player.id).equals(id)
    )

    if (referencedPlayerIndex === -1) {
      throw Error(`Player not found with id: ${id.getId()}`)
    }

    if (referencedPlayerIndex === this.endOfRoundData.pickerIndex) {
      return false
    }

    if (
      !this.endOfRoundData.pickerWentAlone &&
      id.equals(this.idOfPlayerWhoPlayedTheJackOfDiamonds)
    ) {
      return false
    }

    return true
  }
}

export default OppositionTeamMemberIdentifier
