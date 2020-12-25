import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import Game from '../Entities/Game'
import Player from '../Entities/Player'
import CPUPlayer from './CPUPlayer'
import BellePlaineRulesCardRanker from '../Entities/BellePlaineRulesCardRanker'

const randomNames = [
  'Liam',
  'Noah',
  'William',
  'James',
  'Logan',
  'Benjamin',
  'Mason',
  'Elijah',
  'Oliver',
  'Jacob',
  'Lucas',
  'Michael',
  'Alexander',
  'Ethan',
  'Daniel',
  'Matthew',
  'Aiden',
  'Henry',
  'Joseph',
  'Jackson',
  'Samuel',
  'Sebastian',
  'David',
  'Carter',
  'Wyatt',
  'Jayden',
  'John',
  'Owen',
  'Dylan',
  'Luke',
  'Gabriel',
  'Anthony',
  'Isaac',
  'Grayson',
  'Jack',
  'Julian',
  'Levi',
  'Christopher',
  'Joshua',
  'Andrew',
  'Lincoln',
  'Mateo',
  'Ryan',
  'Jaxon',
  'Nathan',
  'Aaron',
  'Isaiah',
  'Thomas',
  'Charles',
  'Caleb',
  'Josiah',
  'Christian',
  'Hunter',
  'Eli',
  'Jonathan',
  'Connor',
  'Landon',
  'Adrian',
  'Asher',
  'Cameron',
  'Leo',
  'Theodore',
  'Jeremiah',
  'Hudson',
  'Robert',
  'Easton',
  'Nolan',
  'Nicholas',
  'Ezra',
  'Colton',
  'Angel',
  'Brayden',
  'Jordan',
  'Dominic',
  'Austin',
  'Emma',
  'Olivia',
  'Ava',
  'Isabella',
  'Sophia',
  'Mia',
  'Charlotte',
  'Amelia',
  'Evelyn',
  'Abigail',
  'Harper',
  'Emily',
  'Elizabeth',
  'Avery',
  'Sofia',
  'Ella',
  'Madison',
  'Scarlett',
  'Victoria',
  'Aria',
  'Grace',
  'Chloe',
  'Camila',
  'Penelope',
  'Riley',
  'Layla',
  'Lillian',
  'Nora',
  'Zoey',
  'Mila',
  'Aubrey',
  'Hannah',
  'Lily',
  'Addison',
  'Eleanor',
  'Natalie',
  'Luna',
  'Savannah',
  'Brooklyn',
  'Leah',
  'Zoe',
  'Stella',
  'Hazel',
  'Ellie',
  'Paisley',
  'Audrey',
  'Skylar',
  'Violet',
  'Claire',
  'Bella',
]
class GameManagerOld {
  private static playersCurrentGame: Game

  private static getRandomNumberBetweenZeroAndMax(max: number): number {
    return Math.floor(Math.random() * max)
  }

  public static getPlayersCurrentGame(): Game {
    if (!this.playersCurrentGame) {
      const ranker = new BellePlaineRulesCardRanker()
      const numPlayers = 4
      const firstDealerIndex = this.getRandomNumberBetweenZeroAndMax(numPlayers)
      this.playersCurrentGame = new Game([], firstDealerIndex)
      this.playersCurrentGame.addPlayer(
        new CPUPlayer(
          randomNames[this.getRandomNumberBetweenZeroAndMax(randomNames.length)],
          new UniqueIdentifier('4d2f43c3-224d-46ba-bb76-0e383d9ceb5c'),
          this.playersCurrentGame,
          ranker
        )
      )
      this.playersCurrentGame.addPlayer(
        new CPUPlayer(
          randomNames[this.getRandomNumberBetweenZeroAndMax(randomNames.length)],
          new UniqueIdentifier('32b62508-4e72-4028-8794-fd075b0393b5'),
          this.playersCurrentGame,
          ranker
        )
      )
      this.playersCurrentGame.addPlayer(
        new Player('You', new UniqueIdentifier('79dbc191-2b0e-4dc3-83d7-7696c4abcb61'))
      )
      this.playersCurrentGame.addPlayer(
        new CPUPlayer(
          randomNames[this.getRandomNumberBetweenZeroAndMax(randomNames.length)],
          new UniqueIdentifier('81756fd4-3f61-4833-b012-43fbc407b688'),
          this.playersCurrentGame,
          ranker
        )
      )
    }
    return this.playersCurrentGame
  }
}

export default GameManagerOld
