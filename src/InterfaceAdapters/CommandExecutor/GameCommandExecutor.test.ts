import GameCommandExecutor from './GameCommandExecutor'
import ICommand from './GameCommands/ICommand'
import IGameCommandFactory from './GameCommands/IGameCommandFactory'

describe('Game Command Executor', () => {
  let gameCommandFactory: IGameCommandFactory
  let gameCommandExecutor: GameCommandExecutor
  let command: ICommand
  beforeEach(() => {
    command = {
      execute: jest.fn(),
    }
    gameCommandFactory = {
      getCommand: jest.fn().mockReturnValue(command),
    }
    gameCommandExecutor = new GameCommandExecutor(gameCommandFactory)
  })

  it('Should call execute on the command that the game returns', () => {
    gameCommandExecutor.execute({ name: 'hello', params: null })
    expect(command.execute).toHaveBeenCalled()
  })
})

export {}
