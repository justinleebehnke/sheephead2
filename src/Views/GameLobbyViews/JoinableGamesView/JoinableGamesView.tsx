import { Component, ReactElement } from 'react'
import IJoinableGamesPresenter from './IJoinableGamesPresenter'
import ISubscriber from '../../../Entities/ISubscriber'

type Props = {
  presenter: IJoinableGamesPresenter
}

class JoinableGamesView extends Component<Props> implements ISubscriber {
  componentDidMount(): void {
    this.props.presenter.setView(this)
  }

  render(): ReactElement {
    return <div>I AM THE GAME LIST</div>
  }

  update = (): void => {
    this.setState({})
  }
}

export default JoinableGamesView
