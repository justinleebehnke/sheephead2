/*
So the idea of the command interface is that rather than
everyone talking directly to the use case and entities whenever something happens
they should instead send actions to the Command interface
 */
/* 
And whenever a command comes into the command interface
rather than applying the command to the local state
it should post the command to the server
Then the server will give the command right back to him along with any others that may have come in while he was away
 */

import ICommandInterface from './ICommandInterface'
import CommandDTO from './CommandExecutor/GameCommandDTOs/CommandDTO'

/*
 If all other players are CPU, then there is no need to go to the server...
 we can just play locally so we don't waste the trips
 */

/* Whether these commands are for the lobby or for the game I think they both can go to the command interface?? */
/* Lobby Command Interface
Game Command Interface
 */
class LobbyCommandInterface implements ICommandInterface {
  giveCommand(command: CommandDTO): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

export default LobbyCommandInterface
