import IGame from './Interfaces/IGame'
import ICommand from '../ICommand'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

class PlayAgainCommand implements ICommand {
  constructor(private readonly game: IGame, private readonly playerId: string) {}

  execute(): void {
    this.game.playAgain(new UniqueIdentifier(this.playerId))
  }
}

export default PlayAgainCommand
