import IFetch from '../IFetch'
import OnlineMultiplayerGameCommandInterface from './OnlineMultiplayerGameCommandInterface'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import { pause } from '../../Utilities/TestingUtilities'

describe('Online Multiplayer Game Command Interface', () => {
  let baseRoute: string
  let pollingIntervalInMilliseconds: number
  let fetcher: IFetch
  let hostId: string
  beforeEach(() => {
    hostId = new UniqueIdentifier().getId()
    baseRoute = 'http://localhost:2020/game/'
    pollingIntervalInMilliseconds = 100
    fetcher = {
      get: jest
        .fn()
        .mockReturnValueOnce({
          indexOfNextCommand: 15,
          newCommands: [],
        })
        .mockReturnValue({
          indexOfNextCommand: 17,
          newCommands: [],
        }),
      post: jest.fn(),
    }
    new OnlineMultiplayerGameCommandInterface(
      pollingIntervalInMilliseconds,
      fetcher,
      baseRoute,
      hostId
    )
  })
  it('Should poll the server for any new commands according to the interval it was constructed with', async () => {
    expect(fetcher.get).toHaveBeenCalledTimes(1)
    await pause(pollingIntervalInMilliseconds / 2)
    expect(fetcher.get).toHaveBeenCalledTimes(1)
    await pause(pollingIntervalInMilliseconds / 2)
    expect(fetcher.get).toHaveBeenCalledTimes(2)
    await pause(pollingIntervalInMilliseconds / 2)
    expect(fetcher.get).toHaveBeenCalledTimes(2)
    await pause(pollingIntervalInMilliseconds / 2)
    expect(fetcher.get).toHaveBeenCalledTimes(3)
    await pause(pollingIntervalInMilliseconds * 5)
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

  // TODO should give the commands over to a command executor
  // TODO that command executor should be the same one that the local system uses
  // TODO when given a command it should post and then update the response the same way that it does when given one.
  // TODO while waiting for a response to come back from polling it should not be able to get into a situation where it asks for the same POLL twice before a poll can answer back, so basically we want to create a test where the fetch response takes longer than a poll would normally take, just to make sure he is handling that well.
})

export {}
