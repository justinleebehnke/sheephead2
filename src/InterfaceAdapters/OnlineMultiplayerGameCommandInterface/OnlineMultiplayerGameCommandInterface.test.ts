import IFetch from '../IFetch'
import OnlineMultiplayerGameCommandInterface from './OnlineMultiplayerGameCommandInterface'
import { pause } from '../../Utilities/TestingUtilities'

describe('Online Multiplayer Game Command Interface', () => {
  let pollingIntervalInMilliseconds: number
  beforeEach(() => {
    pollingIntervalInMilliseconds = 100
  })
  it('Should poll the server for any new commands according to the interval it was constructed with', async () => {
    const fetcher: IFetch = {
      get: jest.fn(),
      post: jest.fn(),
    }
    new OnlineMultiplayerGameCommandInterface(pollingIntervalInMilliseconds, fetcher)
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
})

export {}
