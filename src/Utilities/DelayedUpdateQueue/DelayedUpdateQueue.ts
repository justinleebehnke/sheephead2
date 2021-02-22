import ISubscriber from '../../Entities/ISubscriber'

class DelayedUpdateQueue<T> {
  private readonly delayInMilliseconds: number
  private readonly internalArray: T[]
  private readonly subscribers: ISubscriber[]
  private timeout: NodeJS.Timeout | undefined

  constructor(delayInMilliseconds: number) {
    this.delayInMilliseconds = delayInMilliseconds
    this.internalArray = []
    this.subscribers = []
  }

  private processTimeout(): void {
    if (this.internalArray.length > 1) {
      this.internalArray.shift()
      this.updateSubscribers()
      this.timeout = setTimeout(() => this.processTimeout(), this.delayInMilliseconds)
    } else {
      this.timeout = undefined
    }
  }

  public addSubscriber(subscriber: ISubscriber): void {
    this.subscribers.push(subscriber)
  }

  private updateSubscribers(): void {
    this.subscribers.forEach((subscriber: ISubscriber) => subscriber.update())
  }

  public isEmpty(): boolean {
    return this.internalArray.length === 0
  }

  public peekLastEnqueued(): T {
    if (this.isEmpty()) {
      throw Error('Cannot peek last entry on empty queue')
    }
    return this.internalArray[this.internalArray.length - 1]
  }

  public peek(): T {
    if (this.isEmpty()) {
      throw Error('Cannot peek on empty queue')
    }
    return this.internalArray[0]
  }

  public push(arg: T): void {
    const wasEmptyBeforeArg = this.isEmpty()
    this.internalArray.push(arg)
    if (wasEmptyBeforeArg) {
      this.timeout = setTimeout(() => this.processTimeout(), this.delayInMilliseconds)
      this.updateSubscribers()
    }
    if (!wasEmptyBeforeArg && this.timeout === undefined) {
      this.processTimeout()
    }
  }
}

export default DelayedUpdateQueue
