import Game from './Game'
import Player from './Player'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class CPUPlayer extends Player {
  private game: Game
  private interval: NodeJS.Timeout
  constructor(name: string, id: UniqueIdentifier, game: Game) {
    super(name, id)
    this.game = game
    this.interval = this.setCheckTurnInterval()
  }

  private setCheckTurnInterval(): NodeJS.Timeout {
    return setInterval(async () => {
      if (this.game.getCurrentRound()?.getCurrentTurnPlayer().getId() === this.getId()) {
        console.log(this.game.getCurrentRound()?.getCurrentTurnPlayer().getPlayableCardIds())
        if (this.getName() === 'Jake' || this.getName() === 'Jesse') {
          const round = this.game.getCurrentRound()
          if (round) {
            const player = round.getCurrentTurnPlayer()
            if (player) {
              const playableCards = player.getPlayableCardIds()
              round.play(player.removeCardFromHand(playableCards[0]))
            }
          }
        }
        if (this.getName() === 'John') {
          const round = this.game.getCurrentRound()
          if (round) {
            try {
              round.pick()

              const player = round.getCurrentTurnPlayer()
              if (player) {
                const playableCards = player?.getPlayableCardIds()
                round.bury(
                  player.removeCardFromHand(playableCards[0]),
                  player.removeCardFromHand(playableCards[1])
                )
                round.play(player.removeCardFromHand(playableCards[0]))
                await new Promise((r) => setTimeout(r, 2000))
              }
            } catch (err) {
              console.log(round.getCurrentTurnPlayer().getName())
              try {
                const player = round.getCurrentTurnPlayer()
                if (player) {
                  const playableCards = player.getPlayableCardIds(
                    round.getCurrentTrick().getLeadCard()
                  )
                  console.log('John', playableCards.length)
                  round.play(player.removeCardFromHand(playableCards[0]))
                  await new Promise((r) => setTimeout(r, 2000))
                }
              } catch (err) {
                console.log(round.getEndOfRoundReport())
                clearInterval(this.interval)
              }
            }
          }
        }
      }
    }, 1000)
  }
}

export default CPUPlayer
