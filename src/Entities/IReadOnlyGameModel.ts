import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import Player from './Player'

interface IReadOnlyGameModel {
  getPlayerById: (id: UniqueIdentifier) => Player | undefined
  pick(): void
}

export default IReadOnlyGameModel
