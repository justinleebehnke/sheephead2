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
    const oppositionTeamMemberCentsWon = this.getOppositionTeamMemberWinnings(teamOutcome)
    const pickingTeamMemberCentsWon = -1 * oppositionTeamMemberCentsWon * choppingMultiplier

    players.forEach((player) => {
      if (teamOutcome.isMemberOfOpposition(new UniqueIdentifier(player.getId()))) {
        player.giveCentsForRound(oppositionTeamMemberCentsWon)
      } else {
        player.giveCentsForRound(pickingTeamMemberCentsWon)
      }
    })
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
    if (teamOutcome.oppositionTeamScore === 0) {
      return -75
    }
    if (teamOutcome.oppositionTeamScore === 120) {
      return 150
    }
    if (teamOutcome.oppositionTeamScore <= 30) {
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
