import { Component, Fragment } from 'react'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import BellePlaineRulesCardRanker from '../../Entities/BellePlaineRulesCardRanker'
import CPUPlayer from '../../UseCase/CPUPlayer'
import Game from '../../Entities/Game'
import GameBoard from './../GamePlayViews/GameBoard'
import GamePresenter from '../../InterfaceAdapters/GamePresenter/GamePresenter'
import LocalGameCommandInterface from '../../InterfaceAdapters/LocalGameCommandInterface'
import Player from '../../Entities/Player'
import RandomName from '../../UseCase/RandomName'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import './GameLobby.css'

const localPlayerId = '79dbc191-2b0e-4dc3-83d7-7696c4abcb61'

function getRandomNumberBetweenZeroAndMax(max: number): number {
  return Math.floor(Math.random() * max)
}

type State = {
  isInStartedGame: boolean
  localPlayerName: string
}

class GameLobby extends Component<{}, State> {
  state = {
    isInStartedGame: false,
    localPlayerName: '',
  }

  render() {
    const ranker = new BellePlaineRulesCardRanker()
    const game: Game = new Game([], getRandomNumberBetweenZeroAndMax(4), Date.now())
    const commandInterface = new LocalGameCommandInterface(game)
    const playerNames: string[] = [new RandomName([this.state.localPlayerName]).getName()]
    playerNames.push(new RandomName([...playerNames, this.state.localPlayerName]).getName())
    playerNames.push(new RandomName([...playerNames, this.state.localPlayerName]).getName())

    game.addPlayer(
      new CPUPlayer(
        playerNames[0],
        new UniqueIdentifier('4d2f43c3-224d-46ba-bb76-0e383d9ceb5c'),
        game,
        ranker,
        commandInterface
      )
    )
    game.addPlayer(
      new CPUPlayer(
        playerNames[1],
        new UniqueIdentifier('32b62508-4e72-4028-8794-fd075b0393b5'),
        game,
        ranker,
        commandInterface
      )
    )
    game.addPlayer(
      new Player(`${this.state.localPlayerName} (You)`, new UniqueIdentifier(localPlayerId))
    )
    game.addPlayer(
      new CPUPlayer(
        playerNames[2],
        new UniqueIdentifier('81756fd4-3f61-4833-b012-43fbc407b688'),
        game,
        ranker,
        commandInterface
      )
    )

    const presenter = new GamePresenter(
      new LocalGameCommandInterface(game),
      new UniqueIdentifier(localPlayerId),
      game
    )

    return (
      <Fragment>
        {!this.state.isInStartedGame && (
          <div className='lobby'>
            <div className='split'>
              <div>
                <h1>Game Lobby</h1>
              </div>
              <div>
                <InputGroup size='lg'>
                  <InputGroup.Prepend>
                    <InputGroup.Text id='inputGroup-sizing-lg'>Your Displayed Name</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    onChange={this.updateName}
                    aria-label='Large'
                    aria-describedby='inputGroup-sizing-sm'
                  />
                </InputGroup>
              </div>
            </div>
            <Button onClick={() => this.setState({ isInStartedGame: true })}>
              Host a new Game
            </Button>
          </div>
        )}
        {this.state.isInStartedGame && <GameBoard presenter={presenter} />}
      </Fragment>
    )
  }

  private updateName = (event: React.ChangeEvent): void => {
    const target = event.target as HTMLInputElement
    this.setState({ localPlayerName: target.value })
  }
}

export default GameLobby
