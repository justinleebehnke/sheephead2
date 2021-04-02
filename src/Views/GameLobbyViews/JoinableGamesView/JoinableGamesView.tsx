import { Component, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import IJoinableGamesPresenter from './IJoinableGamesPresenter'
import ISubscriber from '../../../Entities/ISubscriber'
import JoinableGameData from './JoinableGameData'

type Props = {
  presenter: IJoinableGamesPresenter
}

const NUM_PLAYERS_IN_GAME = 4

class JoinableGamesView extends Component<Props> implements ISubscriber {
  componentDidMount(): void {
    this.props.presenter.setView(this)
  }

  render(): ReactElement {
    return (
      <div>
        <h4 className='joinable-games-header'>Here are the games you can join</h4>
        <div className='wrap'>
          <Table bordered hover variant='dark'>
            <thead>
              <tr>
                <th>#</th>
                <th>Host</th>
                <th>Player 2</th>
                <th>Player 3</th>
                <th>Player 4</th>
                <th>Join</th>
              </tr>
            </thead>
            <tbody>
              {this.props.presenter
                .getJoinableGameData()
                .map((game: JoinableGameData, index: number) => {
                  return (
                    <tr key={game.hostId.getId()}>
                      <td>{index + 1}</td>
                      {game.playerNames.map((playerName: string) => {
                        return <td key={playerName}>{playerName}</td>
                      })}
                      {new Array(NUM_PLAYERS_IN_GAME - game.playerNames.length).fill(0).map(() => (
                        <td></td>
                      ))}
                      <td>
                        {this.props.presenter.isLoading ? (
                          <Spinner animation='border' />
                        ) : (
                          <Button
                            variant='primary'
                            disabled={this.props.presenter.isLoading}
                            onClick={() => this.props.presenter.joinGame(game.hostId.getId())}
                          >
                            Join
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }

  update = (): void => {
    this.setState({})
  }
}

export default JoinableGamesView
