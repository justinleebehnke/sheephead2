interface IPayablePlayer {
  getId(): string
  giveCentsForRound(cents: number): void
}

export default IPayablePlayer
