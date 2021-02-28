interface ILocalPlayerInfoManager {
  getPlayerId(): string
  getPlayerName(): string
  setPlayerId(id: string): void
  setPlayerName(playerName: string): void
}

export default ILocalPlayerInfoManager
