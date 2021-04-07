import BellePlaineRulesCardRanker from '../../BellePlaineRulesCardRanker'
import Card from '../../Card'
import TrickState from '../TrickState'

describe('End Of Round State', () => {
  it("Should throw errors on the operations that aren't allowed", () => {
    const cardA = new Card('qc', new BellePlaineRulesCardRanker())
    const cardB = new Card('qc', new BellePlaineRulesCardRanker())

    // @ts-ignore
    const trickState = new TrickState(null)
    expect(() => trickState.pass()).toThrow('Cannot pass in TrickState')
    expect(() => trickState.pick()).toThrow('Cannot pick in TrickState')
    expect(() => trickState.oldBury(cardA, cardB)).toThrow(
      `Cannot bury "${cardA.getCardId()}" & "${cardB.getCardId()}" in TrickState`
    )
    expect(() => trickState.getEndOfRoundReport()).toThrow('Round not over in TrickState')
  })
})
