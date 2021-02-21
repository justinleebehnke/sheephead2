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

  beforeEach(() => {
    view = {
      update: jest.fn(),
    }
    model = {
      addSubscriber: jest.fn(),
      removeSubscriber: jest.fn(),
      pick: jest.fn(),
      getDataForLocalPlayer: jest.fn(),
      getDataForPlayerAcross: jest.fn(),
      getDataForPlayerToLeft: jest.fn(),
      getDataForPlayerToRight: jest.fn(),
      isPicking: jest.fn(),
      isShowingPassOrPickForm: jest.fn(),
      getHand: jest.fn(),
      getPlayableCardIds: jest.fn(),
      getPlayersData: jest.fn(),
      getPickerIndex: jest.fn(),
      getEndOfRoundReport: jest.fn(),
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
    let localPlayerData: PlayerLayoutData
    let acrossPlayerData: PlayerLayoutData
    let leftPlayerData: PlayerLayoutData
    let rightPlayerData: PlayerLayoutData
    let playersData: PlayerData[]
    beforeEach(() => {
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
        ...model,
        getDataForLocalPlayer: jest.fn().mockReturnValueOnce(localPlayerData),
        getDataForPlayerAcross: jest.fn().mockReturnValueOnce(acrossPlayerData),
        getDataForPlayerToLeft: jest.fn().mockReturnValueOnce(leftPlayerData),
        getDataForPlayerToRight: jest.fn().mockReturnValueOnce(rightPlayerData),
        isPicking: jest.fn().mockReturnValueOnce(true),
        isShowingPassOrPickForm: jest.fn().mockReturnValueOnce(true),
        getHand: jest.fn().mockReturnValueOnce(['ac', 'ad']),
        getPlayableCardIds: jest.fn().mockReturnValueOnce(['ad']),
        getPlayersData: jest.fn().mockReturnValueOnce(playersData),
        getPickerIndex: jest.fn().mockReturnValueOnce(0),
        getEndOfRoundReport: jest.fn().mockReturnValueOnce(undefined),
      }
      presenter = new GameBoardPresenter(commandInterface, model)
    })
    it('Should return exactly what the model says initially', () => {
      const res = presenter.getGameBoardViewData()
      const expectedResponse: GameBoardViewData = {
        allPlayerData: {
          dataForLocalPlayer: localPlayerData,
          dataForPlayerAcross: acrossPlayerData,
          dataForPlayerToLeft: leftPlayerData,
          dataForPlayerToRight: rightPlayerData,
        },
        handViewData: {
          isTurn: localPlayerData.isTurn,
          hand: ['ac', 'ad'],
          playableCardIds: ['ad'],
        },
        passOrPickViewData: {
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

      // it would be nice if the model was a system that could just tell me all of this stuff
      // but then if the model changes it should be the same thing
      // but then if it doesn't change
      // if the model is updated but it remains the same from our perspective and then it is also updated to say that something else happened that is actually different, after a SINGLE interval it should update even though 2 changes occurred, the first change was meaningless
      expect(res).toEqual(expectedResponse)
    })
  })

  describe('Commands', () => {
    it('Should delegate the call to bury to the command interface object it is given', () => {
      presenter.bury(['cardA', 'cardB'])
      expect(commandInterface.giveCommand).toHaveBeenCalledWith({
        name: 'bury',
        params: {
          cards: ['cardA', 'cardB'],
        },
      })
    })
    it('Should delegate the call to pass to the command interface object it is given', () => {
      presenter.pass()
      expect(commandInterface.giveCommand).toHaveBeenCalledWith({
        name: 'pass',
        params: null,
      })
    })
    it('Should delegate the call to pick to the model', () => {
      presenter.pick()
      expect(model.pick).toHaveBeenCalled()
    })
    it('Should delegate the call to play to the command interface object', () => {
      presenter.play('cardA')
      expect(commandInterface.giveCommand).toHaveBeenCalledWith({
        name: 'play',
        params: { card: 'cardA' },
      })
    })
    it('Should delegate the call to play again to the command interface object', () => {
      presenter.playAgain()
      expect(commandInterface.giveCommand).toHaveBeenCalledWith({
        name: 'playAgain',
        params: null,
      })
    })
  })
})

export {}
