import IObservable from '../Entities/IObservable'

interface IGameBoardModel extends IObservable {
  pick(): void
}

export default IGameBoardModel
