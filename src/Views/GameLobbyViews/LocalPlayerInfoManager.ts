import ILocalPlayerInfoManager from './LobbyEntranceView/ILocalPlayerInfoManager'

class LocalPlayerInfoManager implements ILocalPlayerInfoManager {
  public getPlayerId(): string {
    return localStorage.getItem('playerId') || ''
  }
  public getPlayerName(): string {
    return localStorage.getItem('playerName') || ''
  }
  public setPlayerId(id: string): void {
    localStorage.setItem('playerId', id)
  }
  public setPlayerName(playerName: string): void {
    localStorage.setItem('playerName', playerName)
  }
}

export default LocalPlayerInfoManager
