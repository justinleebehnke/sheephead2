import ICommandExecutor from '../CommandExecutor/ICommandExecutor'
import ICommandInterface from '../ICommandInterface'
import IFetch from '../IFetch'
import OnlineMultiplayerGameCommandInterface from './OnlineMultiplayerGameCommandInterface'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import { pause } from '../../Utilities/TestingUtilities'

describe('Online Multiplayer Game Command Interface', () => {
  let baseRoute: string
  let pollingIntervalInMilliseconds: number
  let fetcher: IFetch
  let hostId: string
  let commandExecutor: ICommandExecutor

  beforeEach(() => {
    hostId = new UniqueIdentifier().getId()
    baseRoute = 'http://localhost:2020/game'
    pollingIntervalInMilliseconds = 100
    fetcher = {
      get: jest
        .fn()
        .mockReturnValueOnce({
          indexOfNextCommand: 15,
          newCommands: [{ name: 'Command 1', params: null }],
        })
        .mockReturnValueOnce({
          indexOfNextCommand: 17,
          newCommands: [
            { name: 'Command 2', params: null },
            { name: 'Command 3', params: null },
          ],
        })
        .mockReturnValue({
          indexOfNextCommand: 17,
          newCommands: [],
        }),
      post: jest.fn(),
    }
    commandExecutor = {
      execute: jest.fn(),
    }
    new OnlineMultiplayerGameCommandInterface(
      pollingIntervalInMilliseconds,
      fetcher,
      baseRoute,
      hostId,
      commandExecutor
    )
  })

  it('Should poll the server for any new commands according to the interval it was constructed with', async () => {
    const halfInterval = pollingIntervalInMilliseconds / 2
    expect(fetcher.get).toHaveBeenCalledTimes(1)
    await pause(halfInterval)
    expect(fetcher.get).toHaveBeenCalledTimes(1)
    await pause(halfInterval)
    expect(fetcher.get).toHaveBeenCalledTimes(2)
    await pause(halfInterval)
    expect(fetcher.get).toHaveBeenCalledTimes(2)
    await pause(halfInterval)
    expect(fetcher.get).toHaveBeenCalledTimes(3)
    await pause(pollingIntervalInMilliseconds * 5 + halfInterval) // this half interval is padding
    expect(fetcher.get).toHaveBeenCalledTimes(8)
  })

  it('Should call the route correctly based on how it was constructed', async () => {
    expect(fetcher.get).toHaveBeenNthCalledWith(1, `${baseRoute}/${hostId}/0`)
    await pause(pollingIntervalInMilliseconds)
    expect(fetcher.get).toHaveBeenNthCalledWith(2, `${baseRoute}/${hostId}/15`)
    await pause(pollingIntervalInMilliseconds)
    expect(fetcher.get).toHaveBeenNthCalledWith(3, `${baseRoute}/${hostId}/17`)
    await pause(pollingIntervalInMilliseconds)
    expect(fetcher.get).toHaveBeenNthCalledWith(4, `${baseRoute}/${hostId}/17`)
    await pause(pollingIntervalInMilliseconds)
    expect(fetcher.get).toHaveBeenNthCalledWith(5, `${baseRoute}/${hostId}/17`)
    await pause(pollingIntervalInMilliseconds)
  })

  it('Should give only the new commands that come back from each response over to his command executor', async () => {
    expect(commandExecutor.execute).toHaveBeenNthCalledWith(1, { name: 'Command 1', params: null })
    await pause(pollingIntervalInMilliseconds)
    expect(commandExecutor.execute).toHaveBeenNthCalledWith(2, { name: 'Command 2', params: null })
    expect(commandExecutor.execute).toHaveBeenNthCalledWith(3, { name: 'Command 3', params: null })
    await pause(pollingIntervalInMilliseconds)
    await pause(pollingIntervalInMilliseconds)
    expect(commandExecutor.execute).toHaveBeenCalledTimes(3)
  })

  describe('Sending Commands to the Server', () => {
    let gameCommandInterface: ICommandInterface

    beforeEach(() => {
      fetcher = {
        get: jest.fn().mockReturnValue({
          indexOfNextCommand: 10,
          newCommands: [],
        }),
        post: jest.fn().mockReturnValueOnce({
          indexOfNextCommand: 15,
          newCommands: [{ name: 'Command 1', params: null }],
        }),
      }
      gameCommandInterface = new OnlineMultiplayerGameCommandInterface(
        pollingIntervalInMilliseconds,
        fetcher,
        baseRoute,
        hostId,
        commandExecutor
      )
    })

    it('Should post a command and attempt to execute the response it receives', async () => {
      expect(fetcher.get).toHaveBeenNthCalledWith(1, `${baseRoute}/${hostId}/0`)
      await pause(pollingIntervalInMilliseconds)
      expect(fetcher.get).toHaveBeenNthCalledWith(2, `${baseRoute}/${hostId}/10`)

      await pause(pollingIntervalInMilliseconds / 2)
      await gameCommandInterface.giveCommand({ name: 'Command 1', params: null })
      expect(fetcher.post).toHaveBeenNthCalledWith(1, `${baseRoute}/${hostId}`, {
        name: 'Command 1',
        params: null,
      })

      await pause(pollingIntervalInMilliseconds)
      expect(fetcher.get).toHaveBeenNthCalledWith(3, `${baseRoute}/${hostId}/15`)
      await pause(pollingIntervalInMilliseconds)
      expect(fetcher.get).toHaveBeenNthCalledWith(4, `${baseRoute}/${hostId}/15`)
    })
  })

  // TODO that command executor should be the same one that the local system uses
  // TODO while waiting for a response to come back from polling it should not be able to get into a situation where it asks for the same POLL twice before a poll can answer back, so basically we want to create a test where the fetch response takes longer than a poll would normally take, just to make sure he is handling that well.

  // What would happen if it is given a command, while it was sending a command and awaiting the response?

  // it can only post one command at a time
  // and there could be like ten that come in all at once
  // we need to make sure that he is sending them in a way that keeps track of all that stuff flying around
})

export {}
