import IFetch from '../InterfaceAdapters/IFetch'

class Fetcher implements IFetch {
  public async get(url: string): Promise<object> {
    return (await fetch(url)).json()
  }

  post(url: string, request: any): Promise<object> {
    throw new Error('Method not implemented.')
  }
}

export default Fetcher
