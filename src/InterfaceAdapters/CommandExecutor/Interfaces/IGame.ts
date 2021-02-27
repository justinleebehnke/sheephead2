import IRound from './IRound'

interface IGame {
  getCurrentRound(): IRound | null
  playAgain(): void
}

export default IGame
