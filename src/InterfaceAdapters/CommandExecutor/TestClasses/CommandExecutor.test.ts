import CommandExecutor from '../CommandExecutor'
import ICommand from '../ICommand'
import ICommandFactory from '../ICommandFactory'

describe('Command Executor', () => {
  let commandFactory: ICommandFactory
  let commandExecutor: CommandExecutor
  let command: ICommand

  beforeEach(() => {
    command = {
      execute: jest.fn(),
    }
    commandFactory = {
      getCommand: jest.fn().mockReturnValue(command),
    }
    commandExecutor = new CommandExecutor(commandFactory)
  })

  it('Should call execute on the command that the factory returns', () => {
    commandExecutor.execute({ name: 'hello', params: null })
    expect(command.execute).toHaveBeenCalled()
  })
})

export {}
