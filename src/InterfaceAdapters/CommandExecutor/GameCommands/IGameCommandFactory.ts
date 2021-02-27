import ICommand from './ICommand'
import CommandDTO from '../GameCommandDTOs/CommandDTO'

interface IGameCommandFactory {
  getCommand(commandDTO: CommandDTO): ICommand
}

export default IGameCommandFactory
