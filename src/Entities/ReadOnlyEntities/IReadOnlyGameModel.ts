import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import IObservable from '../IObservable'
import Player from '../Player'
import IReadOnlyRound from './IReadOnlyRound'

interface IReadOnlyGameModel extends IObservable {
  getIndexOfPlayerById(id: UniqueIdentifier): number
  getNextIndex(index: number): number
  getPlayerById(id: UniqueIdentifier): Player
  getPlayerByIndex(index: number): Player
  getCurrentRound(): IReadOnlyRound | null
  updateSubscribers(): void
}

export default IReadOnlyGameModel
