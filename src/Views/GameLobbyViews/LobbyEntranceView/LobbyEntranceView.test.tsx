import { act, fireEvent } from '@testing-library/react'
import { render, unmountComponentAtNode } from 'react-dom'
import LobbyEntranceView from './LobbyEntranceView'
import ILobbyEntrancePresenter from './ILobbyEntrancePresenter'

describe('Lobby Entrance View', () => {
  let container: HTMLElement | null = null
  let lobbyEntrancePresenter: ILobbyEntrancePresenter

  const consoleLog = console.error
  beforeEach(() => {
    console.error = jest.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    lobbyEntrancePresenter = {
      hostNewGame: jest.fn(),
      getLocalPlayerName: jest.fn(),
      setLocalPlayerName: jest.fn(),
      nameInputBlurred: jest.fn(),
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
      render(<LobbyEntranceView presenter={lobbyEntrancePresenter} />, container)
    })
    expect(container?.getElementsByTagName('h1')?.[0]?.innerHTML).toBe('Game Lobby')
  })

  it('Should contain an input box for the players name', () => {
    act(() => {
      render(<LobbyEntranceView presenter={lobbyEntrancePresenter} />, container)
    })
    expect(container?.getElementsByTagName('h1')?.[0]?.innerHTML).toBe('Game Lobby')
  })

  it('Should display a button for hosting a game', () => {
    act(() => {
      render(<LobbyEntranceView presenter={lobbyEntrancePresenter} />, container)
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

  // it should display the games that it gets...
  // it should ask the presenter for a list of joinable games
  // it should offer a person the ability to join those games
  // as the list of game changes, the presenter should update it
  // and the list should actually update
  // if a person changes their name in the input box, the presenter should be notified
  // the presenter should notify the alert system if the person tries to start a game without having checked that box.
})

export {}
