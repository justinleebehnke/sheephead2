import ICommandObject from '../ICommandObject'

interface BuryCommandDTO extends ICommandObject {
  name: 'bury'
  params: {
    cards: string[]
  }
}
export default BuryCommandDTO
