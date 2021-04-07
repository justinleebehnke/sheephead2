import BellePlaineRulesCardRanker from '../../BellePlaineRulesCardRanker'
import Card from '../../Card'
import FindingPickerState from '../FindingPickerState'

describe('End Of Round State', () => {
  it("Should throw errors on the operations that aren't allowed", () => {
    const cardA = new Card('qc', new BellePlaineRulesCardRanker())
    const cardB = new Card('qc', new BellePlaineRulesCardRanker())

    // @ts-ignore
    const findingPickerState = new FindingPickerState(null)
    expect(() => findingPickerState.bury(cardA, cardB)).toThrow(
      `Cannot bury "${cardA.getCardId()}" & "${cardB.getCardId()}" in FindingPickerState`
    )
    expect(() => findingPickerState.play(cardA)).toThrow(
      `Cannot play "${cardA.getCardId()}" in FindingPickerState`
    )
    expect(() => findingPickerState.getEndOfRoundReport()).toThrow(
      'Round not over in FindingPickerState'
    )
  })
})
