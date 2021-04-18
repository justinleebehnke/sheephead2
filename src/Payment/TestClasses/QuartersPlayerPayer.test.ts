import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import EndOfRoundViewData from '../../Views/GamePlayViews/EndOfRoundReport/EndOfRoundViewData'
import IPayablePlayer from '../IPayablePlayer'
import IPlayerPayer from '../IPlayerPayer'
import IRoundTeamOutcome from '../../RoundOutcomeDeterminer/IRoundTeamOutcome'
import IRoundTeamOutcomeGetter from '../../RoundOutcomeDeterminer/IRoundTeamOutcomeGetter'
import QuartersPlayerPayer from '../QuartersPlayerPayer'

describe('Quarters Player Payer', () => {
  let scoreOutcomeGetter: IRoundTeamOutcomeGetter
  let teamOutcome: IRoundTeamOutcome
  let player1Id: UniqueIdentifier
  let player2Id: UniqueIdentifier
  let player3Id: UniqueIdentifier
  let player4Id: UniqueIdentifier
  let player1: IPayablePlayer
  let player2: IPayablePlayer
  let player3: IPayablePlayer
  let player4: IPayablePlayer
  let players: IPayablePlayer[]
  let playerPayer: IPlayerPayer
  let endOfRoundViewData: EndOfRoundViewData

  beforeEach(() => {
    player1Id = new UniqueIdentifier()
    player2Id = new UniqueIdentifier()
    player3Id = new UniqueIdentifier()
    player4Id = new UniqueIdentifier()

    player1 = {
      giveCentsForRound: jest.fn(),
      getId: jest.fn().mockReturnValue(player1Id.getId()),
    }
    player2 = {
      giveCentsForRound: jest.fn(),
      getId: jest.fn().mockReturnValue(player2Id.getId()),
    }
    player3 = {
      giveCentsForRound: jest.fn(),
      getId: jest.fn().mockReturnValue(player3Id.getId()),
    }
    player4 = {
      giveCentsForRound: jest.fn(),
      getId: jest.fn().mockReturnValue(player4Id.getId()),
    }
    players = [player1, player2, player3, player4]
    teamOutcome = {
      isMemberOfOpposition: jest.fn().mockImplementation((playerId: UniqueIdentifier) => {
        return playerId.equals(player3Id) || playerId.equals(player4Id)
      }),
      getPlayerScore: jest.fn(),
      pickingTeamScore: 89,
      oppositionTeamScore: 31,
    }
    scoreOutcomeGetter = {
      getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
    }
    playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
  })

  it('Should pay one quarter to the picking team if they win and it should charge one quarter to the losing team if they lose and the score is 31 to 89', () => {
    playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
    expect(player1.giveCentsForRound).toHaveBeenCalledWith(25)
    expect(player2.giveCentsForRound).toHaveBeenCalledWith(25)
    expect(player3.giveCentsForRound).toHaveBeenCalledWith(-25)
    expect(player3.giveCentsForRound).toHaveBeenCalledWith(-25)
  })
})

export {}
