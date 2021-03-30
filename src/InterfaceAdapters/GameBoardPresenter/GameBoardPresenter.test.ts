import GameBoardPresenter from './GameBoardPresenter'
import GameBoardViewData from '../../Views/GamePlayViews/GameBoardViewData'
import ICommandInterface from '../ICommandInterface'
import IGameBoardModel from '../IGameBoardModel'
import IGameBoardPresenter from '../../Views/GamePlayViews/IGameBoardPresenter'
import ISubscriber from '../../Entities/ISubscriber'
import PlayerData from '../../Views/GamePlayViews/EndOfRoundReport/PlayerData'
import PlayerLayoutData from '../GamePresenter/PlayerLayoutData'

describe('Game Board Presenter', () => {
  let view: ISubscriber
  let presenter: IGameBoardPresenter
  let model: IGameBoardModel
  let commandInterface: ICommandInterface
  let localPlayerData: PlayerLayoutData
  let acrossPlayerData: PlayerLayoutData
  let leftPlayerData: PlayerLayoutData
  let rightPlayerData: PlayerLayoutData
  let playersData: PlayerData[]

  beforeEach(() => {
    view = {
      update: jest.fn(),
    }
    localPlayerData = {
      cardPlayed: 'qc',
      isDealer: true,
      isPicker: true,
      isTurn: false,
      name: 'George',
    }
    acrossPlayerData = {
      cardPlayed: 'none',
      isDealer: false,
      isPicker: false,
      isTurn: true,
      name: 'David',
    }
    leftPlayerData = {
      ...acrossPlayerData,
      isTurn: false,
      cardPlayed: 'none',
      name: 'Luis',
    }
    rightPlayerData = {
      ...leftPlayerData,
      name: 'Eliza',
    }
    playersData = [
      {
        name: 'George',
        id: 'georges-id',
      },
      {
        name: 'Luis',
        id: 'luis-id',
      },
      {
        name: 'David',
        id: 'davids-id',
      },
      {
        name: 'Eliza',
        id: 'eliza-id',
      },
    ]
    model = {
      addSubscriber: jest.fn(),
      removeSubscriber: jest.fn(),
      getDataForLocalPlayer: jest.fn().mockReturnValue(localPlayerData),
      getDataForPlayerAcross: jest.fn().mockReturnValue(acrossPlayerData),
      getDataForPlayerToLeft: jest.fn().mockReturnValue(leftPlayerData),
      getDataForPlayerToRight: jest.fn().mockReturnValue(rightPlayerData),
      isPicking: jest.fn().mockReturnValue(true),
      isShowingPassOrPickForm: jest.fn().mockReturnValue(true),
      getHand: jest.fn().mockReturnValue(['ac', 'ad']),
      getPlayableCardIds: jest.fn().mockReturnValue(['ad']),
      getPlayersData: jest.fn().mockReturnValue(playersData),
      getPickerIndex: jest.fn().mockReturnValueOnce(0).mockReturnValueOnce(1).mockReturnValue(0),
      getEndOfRoundReport: jest.fn().mockReturnValue(undefined),
    }
    commandInterface = {
      giveCommand: jest.fn(),
    }
    presenter = new GameBoardPresenter(commandInterface, model)
  })

  it('Should be able to have a view subscribe to it', () => {
    presenter.setView(view)
  })

  it('Should subscribe to a simplified model', () => {
    expect(model.addSubscriber).toHaveBeenCalledWith(presenter)
  })

  describe('Game Board View Data', () => {
    let expected1stResponse: GameBoardViewData
    beforeEach(() => {
      expected1stResponse = {
        allPlayerData: {
          dataForLocalPlayer: localPlayerData,
          dataForPlayerAcross: acrossPlayerData,
          dataForPlayerToLeft: leftPlayerData,
          dataForPlayerToRight: rightPlayerData,
        },
        handViewData: {
          isLoading: false,
          isTurn: localPlayerData.isTurn,
          hand: ['ac', 'ad'],
          playableCardIds: ['ad'],
        },
        passOrPickViewData: {
          isLoading: false,
          isPicking: true,
          isShowingPassOrPickForm: true,
          hand: ['ac', 'ad'],
        },
        endOfRoundViewData: {
          endOfRoundReport: undefined,
          pickerIndex: 0,
          players: playersData,
        },
      }
    })

    it('Should return exactly what the model says initially', () => {
      const res = presenter.getGameBoardViewData()
      expect(res).toEqual(expected1stResponse)
    })

    describe('Commands', () => {
      it('Should stop loading after every update', () => {
        presenter.pass()
        expect(presenter.getGameBoardViewData().passOrPickViewData.isLoading).toBe(true)
        // @ts-ignore pretending that the model called update on him
        presenter.update()
        expect(presenter.getGameBoardViewData().passOrPickViewData.isLoading).toBe(false)
      })

      it('Should delegate the call to bury to the command interface object it is given', () => {
        presenter.bury(['cardA', 'cardB'])
        expect(presenter.getGameBoardViewData().passOrPickViewData.isLoading).toBe(true)
        expect(commandInterface.giveCommand).toHaveBeenCalledWith({
          name: 'bury',
          params: {
            cards: ['cardA', 'cardB'],
          },
        })
      })

      it('Should delegate the call to pass to the command interface object it is given', () => {
        presenter.pass()
        expect(presenter.getGameBoardViewData().passOrPickViewData.isLoading).toBe(true)
        expect(commandInterface.giveCommand).toHaveBeenCalledWith({
          name: 'pass',
          params: null,
        })
      })

      it('Should delegate the call to pick to the model', () => {
        presenter.pick()
        expect(presenter.getGameBoardViewData().passOrPickViewData.isLoading).toBe(true)
        expect(commandInterface.giveCommand).toHaveBeenCalledWith({
          name: 'pick',
          params: null,
        })
      })

      it('Should delegate the call to play to the command interface object', () => {
        presenter.play('cardA')
        expect(presenter.getGameBoardViewData().passOrPickViewData.isLoading).toBe(true)
        expect(commandInterface.giveCommand).toHaveBeenCalledWith({
          name: 'play',
          params: { card: 'cardA' },
        })
      })

      it('Should delegate the call to play again to the command interface object', () => {
        presenter.playAgain()
        expect(presenter.getGameBoardViewData().passOrPickViewData.isLoading).toBe(true)
        expect(commandInterface.giveCommand).toHaveBeenCalledWith({
          name: 'playAgain',
          params: {
            playerId: 'georges-id',
          },
        })
      })
    })
  })
})

export {}
