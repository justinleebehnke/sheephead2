import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import AbbreviatedCard from '../AbbreviatedCard'

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

describe('Abbreviated Card', () => {
  it('Should figure out what symbol to display', () => {
    act(() => {
      render(<AbbreviatedCard card='as' />, container)
    })
    expect(container?.innerHTML).toMatch('A♠')
    act(() => {
      render(<AbbreviatedCard card='td' />, container)
    })
    expect(container?.innerHTML).toMatch('T♦')
    act(() => {
      render(<AbbreviatedCard card='jc' />, container)
    })
    expect(container?.innerHTML).toMatch('J♣')
    act(() => {
      render(<AbbreviatedCard card='9h' />, container)
    })
    expect(container?.innerHTML).toMatch('9♥')

    expect(() => {
      render(<AbbreviatedCard card='a' />, container)
    }).toThrow('Not recognized char: undefined')
  })

  it('Should figure out the right color', () => {
    act(() => {
      render(<AbbreviatedCard card='as' />, container)
    })
    expect(container?.innerHTML).toMatch('black')
    act(() => {
      render(<AbbreviatedCard card='td' />, container)
    })
    expect(container?.innerHTML).toMatch('red')
  })
})

export {}
