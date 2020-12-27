import GameManagerOld from '../UseCase/GameManagerOld'
import './App.css'
import GameBoard from './GamePlayViews/GameBoard'
import Game from '../Entities/Game'
import LocalGameCommandInterface from '../InterfaceAdapters/LocalGameCommandInterface'
import GamePresenter from '../InterfaceAdapters/GamePresenter/GamePresenter'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

const localPlayerId = '79dbc191-2b0e-4dc3-83d7-7696c4abcb61'

function App() {
  const game: Game = GameManagerOld.getPlayersCurrentGame()
  const presenter = new GamePresenter(
    new LocalGameCommandInterface(game),
    new UniqueIdentifier(localPlayerId),
    game
  )
  return (
    <section>
      <GameBoard presenter={presenter} />
    </section>
  )
}

export default App
