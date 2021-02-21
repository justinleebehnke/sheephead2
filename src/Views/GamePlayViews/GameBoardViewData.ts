import EndOfRoundViewData from './EndOfRoundReport/EndOfRoundViewData'
import LocalPlayerHandViewData from './LocalPlayerHandViewData'
import PassOrPickViewData from './PassOrPickViewData'
import PlayerLayoutDisplayData from './PlayerLayout/PlayerLayoutDisplayData'

interface GameBoardViewData {
  allPlayerData: PlayerLayoutDisplayData
  handViewData: LocalPlayerHandViewData
  passOrPickViewData: PassOrPickViewData
  endOfRoundViewData: EndOfRoundViewData
}

export default GameBoardViewData
