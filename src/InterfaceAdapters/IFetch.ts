interface IFetch {
  get(url: string): Promise<JSON>
  post(url: string, request: any): Promise<JSON>
}

export default IFetch
