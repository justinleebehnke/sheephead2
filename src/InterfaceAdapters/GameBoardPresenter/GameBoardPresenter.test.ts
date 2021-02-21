import ISubscriber from '../../Entities/ISubscriber'
import IGameBoardPresenter from '../../Views/GamePlayViews/IGameBoardPresenter'
import ICommandInterface from '../ICommandInterface'
import IGameBoardModel from '../IGameBoardModel'
import GameBoardPresenter from './GameBoardPresenter'

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

  describe('Commands', () => {
    //   play(cardId: string
    //   playAgain(): void {
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
  })
})

export {}
