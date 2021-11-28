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

  it('Should call window.fetch with what ever it is given on a GET request', async () => {
    const res = await fetcher.get('https://example.com')
    expect(global.window.fetch).toHaveBeenCalledWith('https://example.com', {})
    expect(res).toEqual({
      indexOfNextCommand: 0,
      newCommands: [],
    })
  })

  it('Should call window.fetch with what ever it is given on a POST request', async () => {
    const body = {
      indexOfNextCommand: 0,
      newCommand: {
        name: 'hostNewGame',
        params: {
          hostId: '6c6414bf-bc91-47c5-b743-4bc867c855a5',
          hostName: 'YetAnotherPerson',
        },
      },
    }
    const res = await fetcher.post('https://example.com', body)

    expect(global.window.fetch).toHaveBeenCalledWith('https://example.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    expect(res).toEqual({
      indexOfNextCommand: 0,
      newCommands: [],
    })
  })
})

export {}
