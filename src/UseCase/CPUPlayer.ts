import Game from '../Entities/Game'
import Player from '../Entities/Player'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

/*
Some ideas:
When deciding whether to pick:
-> The two high Queens and are leading or on the end.
-> Any two Queens plus another trump, plus some points to bury.
-> Any Queen plus another 3 trump, plus some points to bury.
-> Any 5 trump.

When deciding what to bury:
  -> Bury as many points as possible

Are you leading?
Are you the picker/partner? -> Lead With Trump
ELSE -> Lead with lowest point cards 

When deciding what to play:
1. Has anyone from my team played yet? Yes / No / Not Sure
  Yes -> Go to 1a
  No or Not Sure -> go to 2.
  1a. Will my any of my team probably win the trick? Yes / No
    Yes -> Play the highest point value card you can
    No -> Continue
  1b. Will my team probably lose the trick? Yes / No
    Yes -> Play the lowest point value card you can
    No -> Continue

4. Can I probably win the trick? Yes / No
  Yes -> Play the highest ranking card
  No -> Continue

6. Will I probably lose the trick? Yes / No
  Yes -> Play the lowest point value card that you can
  No -> Continue

7. Schmeer, 60% of the time it's the right move

*/
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
      if (this.game.getCurrentRound()?.getCurrentTurnPlayer()?.getId() === this.getId()) {
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
              }
            } catch (err) {
              try {
                const player = round.getCurrentTurnPlayer()
                if (player) {
                  const playableCards = player.getPlayableCardIds(
                    round.getCurrentTrick().getLeadCard()
                  )
                  console.log('John', playableCards.length)
                  round.play(player.removeCardFromHand(playableCards[0]))
                }
              } catch (err) {
                console.log(round.getEndOfRoundReport())
                clearInterval(this.interval)
              }
            }
          }
        }
      }
    }, 250)
  }
}

export default CPUPlayer
