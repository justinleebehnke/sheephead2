import CommandDTO from '../GameCommandDTOs/CommandDTO'
import ICommand from './ICommand'

interface ICommandFactory {
  getCommand(commandDTO: CommandDTO): ICommand
}

export default ICommandFactory
