import { pause } from '../../Utilities/TestingUtilities'
import GameBoardPresenter from './GameBoardPresenter'
import GameBoardViewData from '../../Views/GamePlayViews/GameBoardViewData'
import ICommandInterface from '../ICommandInterface'
import IGameBoardModel from '../IGameBoardModel'
import ISubscriber from '../../Entities/ISubscriber'
import PlayerData from '../../Views/GamePlayViews/EndOfRoundReport/PlayerData'
import PlayerLayoutData from '../GamePresenter/PlayerLayoutData'

describe('Game Board Presenter', () => {
  let view: ISubscriber
  let presenter: GameBoardPresenter
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
    presenter = new GameBoardPresenter(commandInterface, model, 400)
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

    describe('Pause when the trick is full before clearing', () => {
      beforeEach(() => {
        view = {
          update: jest.fn(),
        }
      })
      it('Should pause for 4 seconds before clearing the trick', async () => {
        let triggeringState: GameBoardViewData = {
          allPlayerData: {
            dataForLocalPlayer: {
              name: 'Luis (You)',
              isTurn: false,
              isDealer: false,
              isPicker: true,
              cardPlayed: 'qh',
            },
            dataForPlayerAcross: {
              name: 'Andres',
              isTurn: true,
              isDealer: false,
              isPicker: false,
              cardPlayed: 'js',
            },
            dataForPlayerToLeft: {
              name: 'Fernando',
              isTurn: false,
              isDealer: false,
              isPicker: false,
              cardPlayed: 'ac',
            },
            dataForPlayerToRight: {
              name: 'George',
              isTurn: false,
              isDealer: true,
              isPicker: false,
              cardPlayed: 'qs',
            },
          },
          passOrPickViewData: {
            isLoading: false,
            isPicking: false,
            isShowingPassOrPickForm: false,
            hand: ['jc', 'jd', '9s', '9h'],
          },
          handViewData: {
            isLoading: false,
            isTurn: false,
            playableCardIds: ['jc', 'jd'],
            hand: ['jc', 'jd', '9s', '9h'],
          },
          endOfRoundViewData: {
            endOfRoundReport: undefined,
            players: [
              { name: 'George', id: '45c78893-ac7b-4999-bd08-dbb557e851c7' },
              { name: 'Luis', id: '07d23498-c980-4a7d-810f-ff780af7fa94' },
              { name: 'Fernando', id: 'e4858617-0a61-4568-b19e-374a1668a5f2' },
              { name: 'Andres', id: '9a959c1f-9124-4b7a-b84a-ed8c9ea46354' },
            ],
            pickerIndex: 1,
          },
        }
        let followingState: GameBoardViewData = {
          allPlayerData: {
            dataForLocalPlayer: {
              name: 'Luis (You)',
              isTurn: false,
              isDealer: false,
              isPicker: true,
              cardPlayed: 'none',
            },
            dataForPlayerAcross: {
              name: 'Andres',
              isTurn: false,
              isDealer: false,
              isPicker: false,
              cardPlayed: 'none',
            },
            dataForPlayerToLeft: {
              name: 'Fernando',
              isTurn: false,
              isDealer: false,
              isPicker: false,
              cardPlayed: 'none',
            },
            dataForPlayerToRight: {
              name: 'George',
              isTurn: true,
              isDealer: true,
              isPicker: false,
              cardPlayed: 'turn',
            },
          },
          passOrPickViewData: {
            isLoading: false,
            isPicking: false,
            isShowingPassOrPickForm: false,
            hand: ['jc', 'jd', '9s', '9h'],
          },
          handViewData: {
            isLoading: false,
            isTurn: false,
            playableCardIds: ['jc', 'jd', '9s', '9h'],
            hand: ['jc', 'jd', '9s', '9h'],
          },
          endOfRoundViewData: {
            endOfRoundReport: undefined,
            players: [
              { name: 'George', id: '45c78893-ac7b-4999-bd08-dbb557e851c7' },
              { name: 'Luis', id: '07d23498-c980-4a7d-810f-ff780af7fa94' },
              { name: 'Fernando', id: 'e4858617-0a61-4568-b19e-374a1668a5f2' },
              { name: 'Andres', id: '9a959c1f-9124-4b7a-b84a-ed8c9ea46354' },
            ],
            pickerIndex: 1,
          },
        }
        model = {
          addSubscriber: jest.fn(),
          removeSubscriber: jest.fn(),
          getDataForLocalPlayer: jest
            .fn()
            .mockReturnValueOnce(triggeringState.allPlayerData.dataForLocalPlayer)
            .mockReturnValue(followingState.allPlayerData.dataForLocalPlayer),
          getDataForPlayerAcross: jest
            .fn()
            .mockReturnValueOnce(triggeringState.allPlayerData.dataForPlayerAcross)
            .mockReturnValue(followingState.allPlayerData.dataForPlayerAcross),
          getDataForPlayerToLeft: jest
            .fn()
            .mockReturnValueOnce(triggeringState.allPlayerData.dataForPlayerToLeft)
            .mockReturnValue(followingState.allPlayerData.dataForPlayerToLeft),
          getDataForPlayerToRight: jest
            .fn()
            .mockReturnValueOnce(triggeringState.allPlayerData.dataForPlayerToRight)
            .mockReturnValue(followingState.allPlayerData.dataForPlayerToRight),
          isPicking: jest.fn().mockReturnValue(false),
          isShowingPassOrPickForm: jest.fn().mockReturnValue(false),
          getHand: jest.fn().mockReturnValue(['jc', 'jd', '9s', '9h']),
          getPlayableCardIds: jest
            .fn()
            .mockReturnValueOnce(['jc', 'jd'])
            .mockReturnValue(['jc', 'jd', '9s', '9h']),
          getPlayersData: jest.fn().mockReturnValue(triggeringState.endOfRoundViewData.players),
          getPickerIndex: jest.fn().mockReturnValue(1),
          getEndOfRoundReport: jest.fn().mockReturnValue(undefined),
        }
        presenter = new GameBoardPresenter(commandInterface, model, 400)
        presenter.setView(view)
        presenter.update()
        expect(presenter.getGameBoardViewData()).toEqual(triggeringState)
        expect(view.update).toHaveBeenCalledTimes(1)
        presenter.update()
        presenter.update()
        presenter.update()
        expect(view.update).toHaveBeenCalledTimes(4)
        await pause(150)
        expect(presenter.getGameBoardViewData()).toEqual(triggeringState)
        expect(view.update).toHaveBeenCalledTimes(4)
        await pause(400)
        expect(view.update).toHaveBeenCalledTimes(5)
        expect(presenter.getGameBoardViewData()).toEqual(followingState)
      })
    })
  })
})

export {}
