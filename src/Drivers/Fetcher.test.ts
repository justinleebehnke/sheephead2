import IFetch from '../InterfaceAdapters/IFetch'
import Fetcher from './Fetcher'

describe('Fetcher', () => {
  const originalFetch = window.fetch
  let fetcher: IFetch
  let response: any

  beforeEach(() => {
    response = {
      json: jest.fn().mockReturnValue({
        indexOfNextCommand: 0,
        newCommands: [],
      }),
    }
    global.window.fetch = jest.fn().mockReturnValue(response)
    fetcher = new Fetcher()
  })

  afterEach(() => {
    global.window.fetch = originalFetch
  })

  it('Should call window.fetch with what ever it is given on a get request', async () => {
    const res = await fetcher.get('https://example.com')
    expect(global.window.fetch).toHaveBeenCalledWith('https://example.com')
    expect(res).toEqual({
      indexOfNextCommand: 0,
      newCommands: [],
    })
  })
})

export {}
