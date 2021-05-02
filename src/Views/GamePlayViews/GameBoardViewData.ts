import EndOfRoundViewData from './EndOfRoundReport/EndOfRoundViewData'
import LocalPlayerHandViewData from './LocalPlayerHandViewData'
import PassOrPickViewData from './PassOrPickViewData'
import PlayerLayoutDisplayData from './PlayerLayout/PlayerLayoutDisplayData'

interface GameBoardViewData {
  allPlayerData: PlayerLayoutDisplayData
  endOfRoundViewData: EndOfRoundViewData
  handViewData: LocalPlayerHandViewData
  passOrPickViewData: PassOrPickViewData
  shouldShowDoublesBadge: boolean
}

export default GameBoardViewData
