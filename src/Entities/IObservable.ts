import ISubscriber from './ISubscriber'

interface IObservable {
  addSubscriber(newSubscriber: ISubscriber): void
  removeSubscriber(subscriberToRemove: ISubscriber): void
}

export default IObservable
