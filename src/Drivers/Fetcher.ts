import IFetch from '../InterfaceAdapters/IFetch'

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

class Fetcher implements IFetch {
  public async get(url: string): Promise<object> {
    return this.fetchRetry(url, {})
  }

  public async post(url: string, request: any): Promise<object> {
    return this.fetchRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
  }

  private async fetchRetry(url: string, options: any, n: number = 60): Promise<object> {
    try {
      return (await fetch(url, options)).json()
    } catch (err) {
      console.log('Pausing one second before retrying... number of retries remaining', n)
      await pause(1000)
      if (n === 1) throw err
      return await this.fetchRetry(url, options, n - 1)
    }
  }
}

export default Fetcher
