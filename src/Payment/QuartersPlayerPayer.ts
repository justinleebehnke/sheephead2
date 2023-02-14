import EndOfRoundViewData from '../Views/GamePlayViews/EndOfRoundReport/EndOfRoundViewData'
import IPayablePlayer from './IPayablePlayer'
import IPlayerPayer from './IPlayerPayer'
import IRoundTeamOutcome from '../RoundOutcomeDeterminer/IRoundTeamOutcome'
import IRoundTeamOutcomeGetter from '../RoundOutcomeDeterminer/IRoundTeamOutcomeGetter'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class QuartersPlayerPayer implements IPlayerPayer {
  constructor(private readonly scoreOutcomeGetter: IRoundTeamOutcomeGetter) {}

  givePlayersTheirPay(players: IPayablePlayer[], endOfRoundViewData: EndOfRoundViewData): void {
    const teamOutcome = this.scoreOutcomeGetter.getRoundTeamOutcome(endOfRoundViewData)
    const choppingMultiplier = this.pickerWentAlone(players, teamOutcome) ? 3 : 1
    const doublesMultiplier = endOfRoundViewData.isDoubleRound ? 2 : 1
    const oppositionTeamMemberCentsWon =
      this.getOppositionTeamMemberWinnings(teamOutcome) * choppingMultiplier * doublesMultiplier
    const pickingTeamMemberCentsWon = -1 * oppositionTeamMemberCentsWon * choppingMultiplier

    const noTrickPickPayment = teamOutcome.pickerTricksWon === 0 ? 100 : 0

    players.forEach((player) => {
      if (teamOutcome.isMemberOfOpposition(new UniqueIdentifier(player.getId()))) {
        player.giveCentsForRound(oppositionTeamMemberCentsWon + noTrickPickPayment)
      } else {
        player.giveCentsForRound(
          pickingTeamMemberCentsWon +
            (this.isPicker(player.getId(), teamOutcome)
              ? -3 * noTrickPickPayment
              : noTrickPickPayment)
        )
      }
    })
  }

  private isPicker(playerId: string, teamOutcome: IRoundTeamOutcome): boolean {
    return new UniqueIdentifier(playerId).equals(teamOutcome.pickerId)
  }

  private pickerWentAlone(players: IPayablePlayer[], teamOutcome: IRoundTeamOutcome): boolean {
    const numPickingTeamMembers = players.reduce(
      (numMembersOfPickingTeam: number, currentPlayer: IPayablePlayer) => {
        if (!teamOutcome.isMemberOfOpposition(new UniqueIdentifier(currentPlayer.getId()))) {
          return numMembersOfPickingTeam + 1
        }
        return numMembersOfPickingTeam
      },
      0
    )
    return numPickingTeamMembers === 1
  }

  private getOppositionTeamMemberWinnings(teamOutcome: IRoundTeamOutcome): number {
    if (teamOutcome.oppositionTricksWon === 0) {
      return -75
    }
    if (teamOutcome.oppositionTricksWon === 6) {
      return 150
    }
    if (teamOutcome.oppositionTeamScore < 30) {
      return -50
    }
    if (teamOutcome.oppositionTeamScore < 60) {
      return -25
    }
    if (teamOutcome.oppositionTeamScore >= 90) {
      return 100
    }
    return 50
  }
}

export default QuartersPlayerPayer
