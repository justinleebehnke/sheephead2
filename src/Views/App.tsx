import './App.css'
import GameLobby from './GameLobbyViews/GameLobby'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

function App() {
  return (
    <section>
      <GameLobby
        presenter={{
          getJoinableGames: () => [
            {
              gameNumber: 278,
              players: [
                { getName: () => 'John', getId: () => new UniqueIdentifier() },
                { getName: () => 'Jake', getId: () => new UniqueIdentifier() },
              ],
            },
            {
              gameNumber: 368,
              players: [{ getName: () => 'Hoss', getId: () => new UniqueIdentifier() }],
            },
            {
              gameNumber: 402,
              players: [
                { getName: () => 'Carly', getId: () => new UniqueIdentifier() },
                { getName: () => 'Jesse', getId: () => new UniqueIdentifier() },
                { getName: () => 'Justin', getId: () => new UniqueIdentifier() },
              ],
            },
          ],
        }}
      />
    </section>
  )
}

export default App
