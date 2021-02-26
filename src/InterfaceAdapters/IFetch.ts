interface IFetch {
  get(url: string): Promise<object>
  post(url: string, request: any): Promise<object>
}

export default IFetch
