import Card from '../Card'
import TrickData from '../DataStructures/TrickData'

interface IReadOnlyTrick {
  getLeadCard(): Card | undefined
  getTrickData(): TrickData
}

export default IReadOnlyTrick
