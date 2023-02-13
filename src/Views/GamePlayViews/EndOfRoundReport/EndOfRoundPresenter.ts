interface EndOfRoundPresenter {
  playAgain(): void
  getWaitingOnString(): string
  getNumHandsCompleted(): number
}

export default EndOfRoundPresenter
