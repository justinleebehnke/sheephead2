import { Component } from 'react'
import Badge from 'react-bootstrap/esm/Badge'
import './Rules.css'

class Rules extends Component {
  render() {
    return (
      <div className='split'>
        <div></div>
        <h2>
          <Badge variant='info' className='rules-button'>
            Rules
          </Badge>
        </h2>
      </div>
    )
  }
}

export default Rules
