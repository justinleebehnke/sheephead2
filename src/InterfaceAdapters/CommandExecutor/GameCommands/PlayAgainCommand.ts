import IGame from './Interfaces/IGame'
import ICommand from '../ICommand'

class PlayAgainCommand implements ICommand {
  constructor(private readonly game: IGame) {}

  execute(): void {
    this.game.playAgain()
  }
}

export default PlayAgainCommand
