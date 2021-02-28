import { act, fireEvent } from '@testing-library/react'
import { render, unmountComponentAtNode } from 'react-dom'
import HostOrJoinView from './HostOrJoinView'
import IHostOrJoinPresenter from './IHostOrJoinPresenter'

describe('Host Or Join View', () => {
  let container: HTMLElement | null = null
  let hostOrJoinPresenter: IHostOrJoinPresenter

  const consoleLog = console.error
  beforeEach(() => {
    console.error = jest.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    hostOrJoinPresenter = {
      hostNewGame: jest.fn(),
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

  it('Should display a button for hosting a game', () => {
    act(() => {
      render(<HostOrJoinView presenter={hostOrJoinPresenter} />, container)
    })
    const button = container?.querySelector('#host-new-game-button')
    expect(button).toBeTruthy()
    if (button) {
      act(() => {
        fireEvent.click(button)
      })
    }
    expect(hostOrJoinPresenter.hostNewGame).toHaveBeenCalled()
  })
})

export {}
