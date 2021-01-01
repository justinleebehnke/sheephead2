import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import IGameLobbyPresenter from '../../InterfaceAdapters/IGameLobbyPresenter'
import GameLobby from './GameLobby'

let container: HTMLElement | null = null
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  if (container) {
    unmountComponentAtNode(container)
    container.remove()
  }
  container = null
})

describe('Game Lobby', () => {
  it('Should ask the presenter immediately for the games that can be joined', () => {
    const mockPresenter: IGameLobbyPresenter = {
      getJoinableGames: jest.fn().mockReturnValue([]),
    }
    act(() => {
      render(<GameLobby presenter={mockPresenter} />, container)
    })
    expect(mockPresenter.getJoinableGames).toHaveBeenCalled()
  })
})

export {}
