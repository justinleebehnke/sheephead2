import IRound from './IRound'

interface IGame {
  getCurrentRound(): IRound | undefined
}

export default IGame
