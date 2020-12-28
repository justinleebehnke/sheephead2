import ICommandObject from '../ICommandObject'

interface BuryCommand extends ICommandObject {
  name: 'bury'
  params: {
    cards: string[]
  }
}
export default BuryCommand
