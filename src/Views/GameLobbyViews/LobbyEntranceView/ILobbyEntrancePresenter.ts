interface ILobbyEntrancePresenter {
  getLocalPlayerName(): string
  hostNewGame(): void
  nameInputBlurred(): void
  setLocalPlayerName(name: string): string
}

export default ILobbyEntrancePresenter
