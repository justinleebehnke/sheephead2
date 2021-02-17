import React, { Component, Fragment, ReactElement } from 'react'
import './AbbreviatedCard.css'

type Props = {
  card: string
}

class AbbreviatedCard extends Component<Props> {
  render() {
    const [firstPart, secondPart] = this.props.card.split('')

    return (
      <div className={`cardBox ${this.props.card === 'jd' ? 'yellow' : ''}`}>
        <div className={`abbreviated-card ${this.getColor(secondPart)}`}>
          {this.getFirstChar(firstPart)}
          {this.getSymbol(secondPart)}
        </div>
      </div>
    )
  }

  getColor = (char: string): string => {
    return char === 's' || char === 'c' ? 'black' : 'red'
  }

  getFirstChar = (char: string): string => {
    return char.toUpperCase()
  }

  getSymbol = (char: string): ReactElement => {
    switch (char) {
      case 's':
        return <Fragment>&spades;</Fragment>
      case 'd':
        return <Fragment>&diams;</Fragment>
      case 'h':
        return <Fragment>&hearts;</Fragment>
      case 'c':
        return <Fragment>&clubs;</Fragment>
      default:
        throw Error('Not recognized char: ' + char)
    }
  }
}
export default AbbreviatedCard
