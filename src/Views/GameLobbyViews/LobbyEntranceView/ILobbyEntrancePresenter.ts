import ISubscriber from '../../../Entities/ISubscriber'

interface ILobbyEntrancePresenter {
  getLocalPlayerName(): string
  hostNewGame(): void
  nameInputBlurred(): void
  setLocalPlayerName(name: string): void
  setView(view: ISubscriber): void
}

export default ILobbyEntrancePresenter
