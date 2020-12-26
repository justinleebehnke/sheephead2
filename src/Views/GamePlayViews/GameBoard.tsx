import { Component } from 'react'
import EndOfRoundReport from './EndOfRoundReport'
import GamePresenter from '../../InterfaceAdapters/GamePresenter/GamePresenter'
import Hand from './Hand'
import ICommandInterface from '../../InterfaceAdapters/ICommandInterface'
import IReadOnlyGameModel from '../../Entities/ReadOnlyEntities/IReadOnlyGameModel'
import ISubscriber from '../../Entities/ISubscriber'
import PassOrPick from './PassOrPick'
import PlayerLayout from './PlayerLayout'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

const localPlayerId = '79dbc191-2b0e-4dc3-83d7-7696c4abcb61'

type Props = {
  game: IReadOnlyGameModel
}

class GameBoard extends Component<Props> implements ISubscriber {
  private presenter: GamePresenter

  constructor(props: Props) {
    super(props)
    const localGameCommandInterface: ICommandInterface = {
      giveCommand: (): Promise<void> => {
        return new Promise(() => {})
      },
    }
    this.presenter = new GamePresenter(
      localGameCommandInterface,
      new UniqueIdentifier(localPlayerId),
      this,
      props.game
    )
  }

  render() {
    return (
      <div>
        {this.presenter.isShowingPassOrPickForm() && <PassOrPick presenter={this.presenter} />}
        <PlayerLayout presenter={this.presenter} />
        <Hand cardsInHand={this.presenter.getHand()} />
        {this.presenter.isShowEndOfRoundReport() && <EndOfRoundReport presenter={this.presenter} />}
      </div>
    )
  }

  update = (): void => {
    this.setState({})
  }
}

export default GameBoard
