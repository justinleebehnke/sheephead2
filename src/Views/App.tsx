import GameManagerOld from '../UseCase/GameManagerOld'
import './App.css'
import GameBoard from './GamePlayViews/GameBoard'
import IReadOnlyGameModel from '../Entities/ReadOnlyEntities/IReadOnlyGameModel'

function App() {
  const game: IReadOnlyGameModel = GameManagerOld.getPlayersCurrentGame()
  return (
    <section>
      <GameBoard game={game} />
    </section>
  )
}

export default App
