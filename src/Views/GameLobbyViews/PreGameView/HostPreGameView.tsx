import { Component, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/esm/Spinner'
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
              <Form.Control as='select' onChange={this.updateFirstDealerIndex}>
                <option selected={this.props.presenter.getFirstDealerIndex() === 0} value={0}>
                  Host (You)
                </option>
                <option selected={this.props.presenter.getFirstDealerIndex() === 1} value={1}>
                  Player 2
                </option>
                <option selected={this.props.presenter.getFirstDealerIndex() === 2} value={2}>
                  Player 3
                </option>
                <option selected={this.props.presenter.getFirstDealerIndex() === 3} value={3}>
                  Player 4
                </option>
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
              <td>{`${this.props.presenter.getPlayers()[0]?.name} (You)`}</td>
              <td>{`${this.props.presenter.getPlayers()[1]?.name || 'waiting...'}`}</td>
              <td>{`${this.props.presenter.getPlayers()[2]?.name || 'waiting...'}`}</td>
              <td>{`${this.props.presenter.getPlayers()[3]?.name || 'waiting...'}`}</td>
            </tr>
          </tbody>
        </Table>

        <div className='split'>
          <div></div>
          {this.props.presenter.isLoading ? (
            <Spinner animation='border' />
          ) : (
            <div>
              <Button variant='outline-primary' onClick={() => this.props.presenter.leaveGame()}>
                Leave
              </Button>{' '}
              <Button
                disabled={this.props.presenter.getPlayers().length < 4}
                onClick={() => this.props.presenter.startGame()}
              >
                Start Game
              </Button>
            </div>
          )}
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
