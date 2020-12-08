import BellePlaineRulesCardRanker from '../../BellePlaineRulesCardRanker'
import Card from '../../Card'
import PickerHasNotBuriedState from '../PickerHasNotBuriedState'

describe('Picker Has Not Buried State', () => {
  it("Should throw errors on the operations that aren't allowed", () => {
    const card = new Card('qc', new BellePlaineRulesCardRanker())

    // @ts-ignore
    const pickerHasNotBuriedState = new PickerHasNotBuriedState(null)
    expect(() => pickerHasNotBuriedState.pass()).toThrow('Cannot pass in PickerHasNotBuriedState')
    expect(() => pickerHasNotBuriedState.pick()).toThrow('Cannot pick in PickerHasNotBuriedState')
    expect(() => pickerHasNotBuriedState.play(card)).toThrow(
      `Cannot play "${card.getCardId()}" in PickerHasNotBuriedState`
    )
    expect(() => pickerHasNotBuriedState.getEndOfRoundReport()).toThrow(
      'Round not over in PickerHasNotBuriedState'
    )
  })
})
