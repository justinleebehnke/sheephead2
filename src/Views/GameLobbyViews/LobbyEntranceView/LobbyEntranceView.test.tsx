import { act, fireEvent } from '@testing-library/react'
import { render, unmountComponentAtNode } from 'react-dom'
import LobbyEntranceView from './LobbyEntranceView'
import ILobbyEntrancePresenter from './ILobbyEntrancePresenter'
import IJoinableGamesPresenter from '../JoinableGamesView/IJoinableGamesPresenter'

describe('Lobby Entrance View', () => {
  let container: HTMLElement | null = null
  let lobbyEntrancePresenter: ILobbyEntrancePresenter
  let joinableGamesPresenter: IJoinableGamesPresenter

  const consoleLog = console.error
  beforeEach(() => {
    console.error = jest.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    joinableGamesPresenter = {
      isLoading: false,
      joinGame: jest.fn(),
      getJoinableGameData: jest.fn().mockReturnValue([]),
      setView: jest.fn(),
    }
    lobbyEntrancePresenter = {
      hostNewGame: jest.fn(),
      getLocalPlayerName: jest.fn(),
      setLocalPlayerName: jest.fn(),
      nameInputBlurred: jest.fn(),
      setView: jest.fn(),
    }
  })

  afterEach(() => {
    console.error = consoleLog
    if (container) {
      unmountComponentAtNode(container)
      container.remove()
    }
    container = null
  })

  it('Should contain an H1 tag saying Game Lobby', () => {
    act(() => {
      render(
        <LobbyEntranceView
          presenter={lobbyEntrancePresenter}
          joinableGames={joinableGamesPresenter}
        />,
        container
      )
    })
    expect(container?.getElementsByTagName('h1')?.[0]?.innerHTML).toBe('Game Lobby')
  })

  it('Should contain an input box for the players name', () => {
    act(() => {
      render(
        <LobbyEntranceView
          presenter={lobbyEntrancePresenter}
          joinableGames={joinableGamesPresenter}
        />,
        container
      )
    })
    expect(container?.getElementsByTagName('h1')?.[0]?.innerHTML).toBe('Game Lobby')
  })

  it('Should display a button for hosting a game', () => {
    act(() => {
      render(
        <LobbyEntranceView
          presenter={lobbyEntrancePresenter}
          joinableGames={joinableGamesPresenter}
        />,
        container
      )
    })
    const button = container?.querySelector('#host-new-game-button')
    expect(button).toBeTruthy()
    if (button) {
      act(() => {
        fireEvent.click(button)
      })
    }
    expect(lobbyEntrancePresenter.hostNewGame).toHaveBeenCalled()
  })
})

export {}
