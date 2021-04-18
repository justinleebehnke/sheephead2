import PlayerData from './PlayerData'

interface PlayerDataWithWinnings extends PlayerData {
  currentHandCentsWon: number
  totalCentsWon: number
}

export default PlayerDataWithWinnings
