import ISubscriber from '../Entities/ISubscriber'
import IGameData from '../UseCase/IGameData'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import GamePresenter from './GamePresenter/GamePresenter'

interface IGameLobbyPresenter {
  getGamePresenter(): GamePresenter
  startGame(firstDealerIndex: number): void
  isInStartedGame(): boolean
  getLocalPlayerName(): string
  getLocalPlayerId(): UniqueIdentifier
  setLocalPlayerName(newName: string): void
  leaveGame(): void
  hostNewGame(): void
  getJoinableGames(): IGameData[]
  setView(view: ISubscriber): void
  unSetView(): void
  isHostingGame(): boolean
}

export default IGameLobbyPresenter
