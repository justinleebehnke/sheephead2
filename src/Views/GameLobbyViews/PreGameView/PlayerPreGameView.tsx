import { Component, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import IPreGamePresenter from './IPreGamePresenter'

type Props = {
  presenter: IPreGamePresenter
}

class PlayerPreGameView extends Component<Props> {
  componentDidMount(): void {
    this.props.presenter.setView(this)
  }

  render(): ReactElement {
    return (
      <div className='lobby'>
        <h1>Pre Game Screen</h1>
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
              <td>{`${this.props.presenter.getPlayers()[0]?.name}`}</td>
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
            </div>
          )}
        </div>
      </div>
    )
  }

  public update = (): void => {
    this.setState({})
  }
}
export default PlayerPreGameView
