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
    // @ts-ignore
    endOfRoundViewData = {
      isDoubleRound: false,
    }
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
      pickerId: player1Id,
      isMemberOfOpposition: jest.fn().mockImplementation((playerId: UniqueIdentifier) => {
        return playerId.equals(player3Id) || playerId.equals(player4Id)
      }),
      getPlayerScore: jest.fn(),
      pickerTricksWon: 1,
      pickingTeamScore: 89,
      oppositionTeamScore: 31,
      pickingTeamTricksWon: 4,
      oppositionTricksWon: 2,
    }
    scoreOutcomeGetter = {
      getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
    }
    playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
  })

  describe('No Chop', () => {
    describe('Picking Team Lost (SET)', () => {
      it('Should pay 2 quarters to the opposition with a score of 60 to 60', () => {
        teamOutcome.pickingTeamScore = 60
        teamOutcome.oppositionTeamScore = 60
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(-50)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(-50)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(50)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(50)
      })

      it("Should pay 2 quarters to the opposition with a score of 60 to 60 AND the picker should pay 1 dollar to everyone if they didn't even get a trick", () => {
        teamOutcome.pickingTeamScore = 60
        teamOutcome.oppositionTeamScore = 60
        teamOutcome.pickerTricksWon = 0
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(-50 - 300)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(-50 + 100)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(50 + 100)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(50 + 100)
      })

      it('Should pay 4 quarters to the opposition is 90 to 30', () => {
        teamOutcome.pickingTeamScore = 30
        teamOutcome.oppositionTeamScore = 90
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(-100)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(-100)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(100)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(100)
      })

      it('Should pay 4 quarters to the opposition as long as at least one trick was won', () => {
        teamOutcome.pickingTeamScore = 0
        teamOutcome.oppositionTeamScore = 120
        teamOutcome.pickingTeamTricksWon = 1
        teamOutcome.oppositionTricksWon = 5
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(-100)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(-100)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(100)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(100)
      })

      it('Should pay 6 quarters to the opposition is 21 to 99 if no tricks were won', () => {
        teamOutcome.pickingTeamScore = 21
        teamOutcome.oppositionTeamScore = 99
        teamOutcome.pickingTeamTricksWon = 0
        teamOutcome.oppositionTricksWon = 6
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(-150)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(-150)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(150)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(150)
      })

      it('Should pay 6 quarters to the opposition is 110 to 10 and the Picker won no Tricks', () => {
        teamOutcome.pickingTeamScore = 10
        teamOutcome.oppositionTeamScore = 110
        teamOutcome.pickingTeamTricksWon = 0
        teamOutcome.oppositionTricksWon = 6
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(-150)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(-150)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(150)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(150)
      })
    })
    describe('Picking Team Won', () => {
      it('Should pay one quarter to the picking team if the score is 31 to 89', () => {
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(25)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(25)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-25)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-25)
      })
      it('Should pay two quarters to the picking team if the score is 30 to 90', () => {
        teamOutcome.pickingTeamScore = 90
        teamOutcome.oppositionTeamScore = 30
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(50)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(50)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-50)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-50)
      })
      it('Should pay two quarters to the picking team if the score is 0 to 120 but they won a trick', () => {
        teamOutcome.pickingTeamScore = 90
        teamOutcome.oppositionTeamScore = 30
        teamOutcome.oppositionTricksWon = 1
        teamOutcome.pickingTeamTricksWon = 5
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(50)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(50)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-50)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-50)
      })
      it('Should pay 3 quarters to the picking team if the score is 0 to 120 and no tricks were won', () => {
        teamOutcome.pickingTeamScore = 120
        teamOutcome.oppositionTeamScore = 0
        teamOutcome.oppositionTricksWon = 0
        teamOutcome.pickingTeamTricksWon = 6
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(75)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(75)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-75)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-75)
      })
    })
  })

  describe('With Chop', () => {
    beforeEach(() => {
      teamOutcome.isMemberOfOpposition = jest
        .fn()
        .mockImplementation((playerId: UniqueIdentifier) => {
          return !player1Id.equals(playerId)
        })
    })
    describe('Picker Lost (SET)', () => {
      it('Should pay 6 quarters to the opposition with a score of 60 to 60', () => {
        teamOutcome.pickingTeamScore = 60
        teamOutcome.oppositionTeamScore = 60
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(-1 * (150 + 150 + 150))
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(150)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(150)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(150)
      })

      it('Should pay 4 quarters to the opposition is 90 to 30', () => {
        teamOutcome.pickingTeamScore = 30
        teamOutcome.oppositionTeamScore = 90
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(-900)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(300)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(300)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(300)
      })

      it('Should pay 6 quarters to the opposition is 120 to 0 and no tricks won', () => {
        teamOutcome.pickingTeamScore = 0
        teamOutcome.oppositionTeamScore = 120
        teamOutcome.oppositionTricksWon = 6
        teamOutcome.pickingTeamTricksWon = 0

        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(-450 * 3)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(450)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(450)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(450)
      })
    })
    describe('Picking Team Won', () => {
      it('Should pay one quarter to the picking team if the score is 31 to 89', () => {
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(75 * 3)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(-75)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-75)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-75)
      })
      it('Should pay two quarters to the picking team if the score is 30 to 90', () => {
        teamOutcome.pickingTeamScore = 90
        teamOutcome.oppositionTeamScore = 30
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(150 * 3)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(-150)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-150)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-150)
      })
      it('Should pay 3 quarters to the picking team if the score is 0 to 120', () => {
        teamOutcome.pickingTeamScore = 120
        teamOutcome.oppositionTeamScore = 0
        teamOutcome.pickingTeamTricksWon = 6
        teamOutcome.oppositionTricksWon = 0
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(225 * 3)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(-225)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-225)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-225)
      })

      it('Should pay 6 quarters to the picking team if the score is 0 to 120 AND it is a hand of doubles', () => {
        teamOutcome.pickingTeamScore = 120
        teamOutcome.oppositionTeamScore = 0
        teamOutcome.pickingTeamTricksWon = 6
        teamOutcome.oppositionTricksWon = 0
        endOfRoundViewData.isDoubleRound = true
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(225 * 3 * 2)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(-225 * 2)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-225 * 2)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(-225 * 2)
      })

      it('The picker should pay a dollar to everyone if they did not personally win a trick even if the picking team got a clean sweep', () => {
        teamOutcome.pickingTeamScore = 120
        teamOutcome.oppositionTeamScore = 0
        teamOutcome.pickingTeamTricksWon = 6
        teamOutcome.oppositionTricksWon = 0
        teamOutcome.pickerTricksWon = 0
        endOfRoundViewData.isDoubleRound = true
        scoreOutcomeGetter = {
          getRoundTeamOutcome: jest.fn().mockReturnValue(teamOutcome),
        }
        playerPayer = new QuartersPlayerPayer(scoreOutcomeGetter)
        playerPayer.givePlayersTheirPay(players, endOfRoundViewData)
        expect(player1.giveCentsForRound).toHaveBeenCalledWith(225 * 3 * 2 - 300)
        expect(player2.giveCentsForRound).toHaveBeenCalledWith(100 + -225 * 2)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(100 + -225 * 2)
        expect(player3.giveCentsForRound).toHaveBeenCalledWith(100 + -225 * 2)
      })
    })
  })
})

export {}
