import UniqueIdentifier from '../Utilities/UniqueIdentifier'

interface PlayerDTO {
  getId(): UniqueIdentifier
  getName(): string
}

export default PlayerDTO
