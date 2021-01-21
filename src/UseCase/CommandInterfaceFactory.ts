import Game from '../Entities/Game'
import ICommandInterface from '../InterfaceAdapters/ICommandInterface'
import CPUPlayer from '../Entities/Game'
import LocalGameCommandInterface from '../InterfaceAdapters/LocalGameCommandInterface'
import GameCommandProxy from '../InterfaceAdapters/Communicators/GameCommandProxy'
import ServerCommunicator from '../Drivers/ServerCommunicator'

export function gameCommandInterfaceFactorMethod(game: Game): ICommandInterface {
  const localPlayerId = localStorage.getItem('localPlayerId')
  const players = game.getPlayers()
  if (players.every((player) => player instanceof CPUPlayer || player.getId() === localPlayerId)) {
    return new LocalGameCommandInterface(game)
  } else {
    return new GameCommandProxy(new ServerCommunicator(), game)
  }
}
