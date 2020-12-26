import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import IObservable from './IObservable'
import Player from './Player'

interface IReadOnlyGameModel extends IObservable {
  getPlayerById(id: UniqueIdentifier): Player | undefined
  pick(): void
  updateSubscribers(): void
}

export default IReadOnlyGameModel
