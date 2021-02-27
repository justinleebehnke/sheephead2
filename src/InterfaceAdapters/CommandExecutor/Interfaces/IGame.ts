import IRound from './IRound'

interface IGame {
  getCurrentRound(): IRound | null
}

export default IGame
