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
    } else if (UniqueIdentifier.isValidIdString(id)) {
      this.id = id
    } else {
      throw Error(`Id: "${id}" is not a valid UniqueIdentifier`)
    }
  }

  public getId(): string {
    return this.id
  }

  public equals(compare: any): boolean {
    if (compare instanceof UniqueIdentifier) {
      return compare.getId() === this.getId()
    }
    return false
  }

  public static isValidIdString(id: string): boolean {
    return validate(id)
  }
}

export default UniqueIdentifier
