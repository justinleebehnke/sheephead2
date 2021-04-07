import SelectableCardHandPresenter from './SelectableCardHandPresenter'

interface PassOrPickPresenter extends SelectableCardHandPresenter {
  pass(): void
  pick(): void
}

export default PassOrPickPresenter
