import CommandDTO from './CommandDTO'
import ICommand from './ICommand'

interface ICommandFactory {
  getCommand(commandDTO: CommandDTO): ICommand
}

export default ICommandFactory
