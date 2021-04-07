import Card from '../../Entities/Card'
import TrickData from '../../Entities/DataStructures/TrickData'

interface IReadOnlyTrick {
  getLeadCard(): Card | undefined
  getTrickData(): TrickData
}

export default IReadOnlyTrick
