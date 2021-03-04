import IRound from './IRound'
import UniqueIdentifier from '../../../../Utilities/UniqueIdentifier'

interface IGame {
  getCurrentRound(): IRound | null
  playAgain(playerId: UniqueIdentifier): void
}

export default IGame
