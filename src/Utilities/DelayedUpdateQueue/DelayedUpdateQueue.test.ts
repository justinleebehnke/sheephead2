import DelayedUpdateQueue from './DelayedUpdateQueue'
import ISubscriber from '../../Entities/ISubscriber'
import { pause } from '../TestingUtilities'

describe('Delayed Update Queue', () => {
  it('Should accept a time to expire queue item and correctly implement the basic interface', () => {
    const delayInMilliseconds = 100
    const dQ: DelayedUpdateQueue<string> = new DelayedUpdateQueue(delayInMilliseconds)
    expect(dQ.isEmpty()).toBe(true)
    expect(() => dQ.peekLastEnqueued()).toThrow('Cannot peek last entry on empty queue')
    expect(() => dQ.peek()).toThrow('Cannot peek on empty queue')
    dQ.push('Hello')
    expect(dQ.peekLastEnqueued()).toEqual('Hello')
    expect(dQ.peek()).toEqual('Hello')
  })

  it('Should update all subscribers when changed from an empty state', () => {
    const subscriber: ISubscriber = {
      update: jest.fn(),
    }
    const delayInMilliseconds = 100
    const dQ: DelayedUpdateQueue<string> = new DelayedUpdateQueue(delayInMilliseconds)
    dQ.addSubscriber(subscriber)
    dQ.push('Hello')
    expect(subscriber.update).toHaveBeenCalled()
  })

  it('Should update all subscribers as soon as the response to peek has updated', async () => {
    const subscriber: ISubscriber = {
      update: jest.fn(),
    }
    const delayInMilliseconds = 100
    const dQ: DelayedUpdateQueue<string> = new DelayedUpdateQueue(delayInMilliseconds)
    dQ.addSubscriber(subscriber)
    dQ.push('Hello')
    dQ.push('Hello2')
    dQ.push('Hello3')
    expect(subscriber.update).toHaveBeenCalled()
    expect(dQ.peek()).toEqual('Hello')
    await pause(delayInMilliseconds)
    expect(subscriber.update).toHaveBeenCalledTimes(2)
    expect(dQ.peek()).toEqual('Hello2')
    await pause(delayInMilliseconds)
    expect(subscriber.update).toHaveBeenCalledTimes(3)
    expect(dQ.peek()).toEqual('Hello3')
    await pause(delayInMilliseconds)
    expect(subscriber.update).toHaveBeenCalledTimes(3)
    expect(dQ.peek()).toEqual('Hello3')

    // if the delay has already finished I would expect to be notified immediately when another is added
    dQ.push('Hello4')
    dQ.push('Hello5')
    expect(subscriber.update).toHaveBeenCalledTimes(4)
    expect(dQ.peek()).toEqual('Hello4')
    await pause(delayInMilliseconds)
    expect(subscriber.update).toHaveBeenCalledTimes(5)
    expect(dQ.peek()).toEqual('Hello5')
    await pause(delayInMilliseconds)
    expect(subscriber.update).toHaveBeenCalledTimes(5)
    expect(dQ.peek()).toEqual('Hello5')
  })
})

export {}
