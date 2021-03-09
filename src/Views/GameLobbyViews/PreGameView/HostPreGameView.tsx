import { Component, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import IPreGamePresenter from './IPreGamePresenter'

type Props = {
  presenter: IPreGamePresenter
}

class HostPreGameView extends Component<Props> {
  componentDidMount(): void {
    this.props.presenter.setView(this)
  }

  render(): ReactElement {
    return (
      <div className='lobby'>
        <h1>Host Game Screen</h1>
        <Form.Group controlId='firstDealer'>
          <div className='split'>
            <div className='split'>
              <Form.Label>Who should deal first?</Form.Label>
              <Form.Control
                as='select'
                value={this.props.presenter.getFirstDealerIndex()}
                onChange={this.updateFirstDealerIndex}
              >
                <option value={0}>Host (You)</option>
                <option value={1}>Player 2</option>
                <option value={2}>Player 3</option>
                <option value={3}>Player 4</option>
              </Form.Control>
            </div>
            <div></div>
          </div>
        </Form.Group>
        <Table bordered hover variant='dark'>
          <thead>
            <tr>
              <th>Host</th>
              <th>Player 2</th>
              <th>Player 3</th>
              <th>Player 4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{`${this.props.presenter.getPlayers()[0].name} (You)`}</td>
              <td className='light'>{'Computer by default'}</td>
              <td className='light'>{'Computer by default'}</td>
              <td className='light'>{'Computer by default'}</td>
            </tr>
          </tbody>
        </Table>
        <div className='split'>
          <div></div>
          <div>
            <Button variant='outline-primary' onClick={() => this.props.presenter.leaveGame()}>
              Leave
            </Button>{' '}
            <Button onClick={() => this.props.presenter.startGame()}>Start Game</Button>
          </div>
        </div>
      </div>
    )
  }

  private updateFirstDealerIndex = (event: React.ChangeEvent): void => {
    const target = event.target as HTMLInputElement
    this.props.presenter.setFirstDealerIndex(parseInt(target.value, 10))
  }

  public update = (): void => {
    this.setState({})
  }
}

export default HostPreGameView
