import { Room, Client } from 'colyseus'
import { createHeadlessGame } from '../headlessGame'
import {
  FieldState,
  PlayerSide,
  PlayerState,
  getOppositeSide,
} from './schema/FieldState'

export class MyRoom extends Room<FieldState> {
  maxClients = 2

  game: Phaser.Game

  onCreate(options: any) {
    this.setState(new FieldState())

    this.game = createHeadlessGame()
    this.game.events.on('update', this.onGameUpdate.bind(this))

    this.onMessage('move', (client, { x, y }) => {
      const player = this.getPlayerBySessionId(client.sessionId)
      if (!player) return

      player.x = x
      player.y = y
    })
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!')

    const player = new PlayerState()
    player.connected = true
    player.sessionId = client.sessionId
    player.side = this.state.players[0] ? 1 : 0

    // ToDo
    player.name = 'something'

    this.state.players[player.side] = player
  }

  onGameUpdate(info: FieldInfo) {
    const { puck, players } = this.state

    puck.x = info.puck.x
    puck.y = info.puck.y

    players.forEach((player, side) => {
      player.x = info.sticks[side].x
      player.y = info.sticks[side].y
    })
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!')
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
  }

  getPlayerBySessionId(sessionId: string): PlayerState | null {
    return this.state.players.find((player) => player.sessionId === sessionId)
  }

  getOpponent(side: PlayerSide): PlayerState {
    return this.state.players[getOppositeSide(side)]
  }
}
