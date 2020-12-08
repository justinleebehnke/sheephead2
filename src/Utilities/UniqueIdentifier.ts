import { v4, validate } from 'uuid'

/**
 * To allow users to play without creating an account we need to generate unique identifiers for them.
 * This library generates uuids which are a fixed length and therefore can collide
 *
 * "Assuming perfect randomness, you can expect the first collision at around 2^61 generated UUIDs"
 */
class UniqueIdentifier {
  private id: string

  constructor(id?: string) {
    if (id === undefined) {
      this.id = v4()
    } else if (validate(id)) {
      this.id = id
    } else {
      throw Error(`Id: "${id}" is not a valid UniqueIdentifier`)
    }
  }

  public getId(): string {
    return this.id
  }
}

export default UniqueIdentifier
