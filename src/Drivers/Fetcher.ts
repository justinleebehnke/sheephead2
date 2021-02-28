import IFetch from '../InterfaceAdapters/IFetch'

class Fetcher implements IFetch {
  public async get(url: string): Promise<object> {
    return (await fetch(url)).json()
  }

  public async post(url: string, request: any): Promise<object> {
    return (
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
    ).json()
  }
}

export default Fetcher
