import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import IGameLobbyPresenter from '../../InterfaceAdapters/IGameLobbyPresenter'
import GameLobbyView from './GameLobbyView'

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
      joinGame: jest.fn(),
      getJoinableGames: jest.fn().mockReturnValue([]),
      setView: jest.fn(),
      unSetView: jest.fn(),
      getLocalPlayerName: jest.fn(),
      getLocalPlayerId: jest.fn(),
      setLocalPlayerName: jest.fn(),
      leaveGame: jest.fn(),
      hostNewGame: jest.fn(),
      shouldRenderGameBoardView: jest.fn(),
      shouldRenderHostGameSetupView: jest.fn(),
      shouldRenderLobby: jest.fn().mockReturnValue(true),
      shouldRenderPlayerGameSetupView: jest.fn(),
      startGame: jest.fn(),
      getJoinedGameNumber: jest.fn(),
      getJoinedGamePlayers: jest.fn(),
      getGamePresenter: jest.fn(),
    }
    act(() => {
      render(<GameLobbyView presenter={mockPresenter} />, container)
    })
    expect(mockPresenter.getJoinableGames).toHaveBeenCalled()
  })
})

export {}
