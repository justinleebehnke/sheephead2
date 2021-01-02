import ISubscriber from '../Entities/ISubscriber'
import IGameData from '../UseCase/IGameData'
import PlayerDTO from '../UseCase/PlayerDTO'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import GamePresenter from './GamePresenter/GamePresenter'

interface IGameLobbyPresenter {
  getJoinedGameNumber(): number
  shouldRenderLobby(): boolean
  shouldRenderHostGameSetupView(): boolean
  shouldRenderPlayerGameSetupView(): boolean
  shouldRenderGameBoardView(): boolean
  getJoinedGamePlayers(): PlayerDTO[]
  joinGame(hostId: UniqueIdentifier): void
  getGamePresenter(): GamePresenter
  startGame(firstDealerIndex: number): void
  getLocalPlayerName(): string
  getLocalPlayerId(): UniqueIdentifier
  setLocalPlayerName(newName: string): void
  leaveGame(): void
  hostNewGame(): void
  getJoinableGames(): IGameData[]
  setView(view: ISubscriber): void
  unSetView(): void
}

export default IGameLobbyPresenter
