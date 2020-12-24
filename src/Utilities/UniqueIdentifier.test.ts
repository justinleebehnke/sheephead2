import UniqueIdentifier from './UniqueIdentifier'

describe('Unique Identifier', () => {
  it('Should return the correct equality', () => {
    const original = new UniqueIdentifier()
    expect(original.equals(original)).toBe(true)
    expect(new UniqueIdentifier(original.getId()).equals(original)).toBe(true)
    expect(original.equals(null)).toBe(false)
  })
})

export {}
