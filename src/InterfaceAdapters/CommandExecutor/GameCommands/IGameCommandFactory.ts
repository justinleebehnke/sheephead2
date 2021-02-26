import ICommand from './ICommand'
import ICommandObject from '../../ICommandObject'

interface IGameCommandFactory {
  getCommand(commandDTO: ICommandObject): ICommand
}

export default IGameCommandFactory
