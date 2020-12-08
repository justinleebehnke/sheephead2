import BellePlaineRulesCardRanker from '../../BellePlaineRulesCardRanker'
import Card from '../../Card'
import EndOfRoundState from '../EndOfRoundState'

describe('End Of Round State', () => {
  it("Should throw errors on the operations that aren't allowed", () => {
    const cardA = new Card('qc', new BellePlaineRulesCardRanker())
    const cardB = new Card('qc', new BellePlaineRulesCardRanker())

    // @ts-ignore
    const endOfRoundState = new EndOfRoundState(null)
    expect(() => endOfRoundState.pass()).toThrow('Cannot pass in EndOfRoundState.')
    expect(() => endOfRoundState.pick()).toThrow('Cannot pick in EndOfRoundState.')
    expect(() => endOfRoundState.bury(cardA, cardB)).toThrow(
      `Cannot bury "${cardA.getCardId()}" & "${cardB.getCardId()}" in EndOfRoundState.`
    )
    expect(() => endOfRoundState.play(cardA)).toThrow(
      `Cannot play "${cardA.getCardId()}" in EndOfRoundState.`
    )
  })
})
