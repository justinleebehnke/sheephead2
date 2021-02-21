import IObservable from '../../Entities/IObservable'
import ISubscriber from '../../Entities/ISubscriber'
import IGameBoardPresenter from '../../Views/GamePlayViews/IGameBoardPresenter'
import GameBoardPresenter from './GameBoardPresenter'

describe('Game Board Presenter', () => {
  let view: ISubscriber
  let presenter: IGameBoardPresenter
  let model: IObservable

  beforeEach(() => {
    view = {
      update: jest.fn(),
    }
    model = {
      addSubscriber: jest.fn(),
      removeSubscriber: jest.fn(),
    }
    presenter = new GameBoardPresenter(model)
  })

  it('Should be able to have a view subscribe to it', () => {
    presenter.setView(view)
  })

  it('Should subscribe to a simplified model', () => {
    expect(model.addSubscriber).toHaveBeenCalledWith(presenter)
  })
})

export {}
