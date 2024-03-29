import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import IObservable from '../../Entities/IObservable'
import Player from '../../Entities/Player'
import IReadOnlyRound from './IReadOnlyRound'

interface IReadOnlyGameModel extends IObservable {
  getIndexOfPlayerById(id: UniqueIdentifier): number
  getNextIndex(index: number): number
  getPlayerById(id: UniqueIdentifier): Player
  getPlayerByIndex(index: number): Player
  getCurrentRound(): IReadOnlyRound | null
  isHandOfDoubles(): boolean
  updateSubscribers(): void
  getPlayersNotReady(): string[]
  getNumHandsCompleted(): number
  getBuryCards(): string[]
}

export default IReadOnlyGameModel
