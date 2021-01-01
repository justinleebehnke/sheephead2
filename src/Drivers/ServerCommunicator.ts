import IFetch from '../InterfaceAdapters/Communicators/IFetch'

class ServerCommunicator implements IFetch {
  public async get(url: string): Promise<JSON> {
    const res = await fetch(url)
    return res.json()
  }

  public async post(url: string, request: any): Promise<JSON> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    return res.json()
  }
}

export default ServerCommunicator
