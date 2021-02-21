import LocalPlayerHandViewData from './LocalPlayerHandViewData'
import PassOrPickViewData from './PassOrPickViewData'
import PlayerLayoutDisplayData from './PlayerLayout/PlayerLayoutDisplayData'

interface GameBoardViewData {
  allPlayerData: PlayerLayoutDisplayData
  handViewData: LocalPlayerHandViewData
  isShowEndOfRoundReport: boolean
  passOrPickViewData: PassOrPickViewData
}

export default GameBoardViewData
