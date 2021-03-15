import INotifier from './LobbyEntranceView/INotifier'

class UserNotifier implements INotifier {
  public notify(message: string): void {
    alert(message)
  }
}

export default UserNotifier
