import FpsText from '../objects/fpsText'
import Field from '../objects/Field'
import { client, Colyseus } from '../utils/colyseus'
import { FieldState, PlayerSide } from '../utils/fieldState'

enum SceneState {
  preparing,
  waitingPlayer,
  playing,
}

export default class OnlineMultiScene extends Phaser.Scene {
  fpsText
  field: Field
  private room: Colyseus.Room<FieldState>
  private playerSide: PlayerSide
  private opponentSide: PlayerSide
  private state = SceneState.preparing

  constructor() {
    super({ key: 'OnlineMultiScene' })
  }

  create() {
    this.field = this.add.existing(
      new Field(this, this.cameras.main.centerX, this.cameras.main.centerY)
    )
    this.setState(SceneState.preparing)

    this.fpsText = new FpsText(this)

    this.events.on('player-drag', (x, y) => {
      this.room.send('move', { x, y })
    })

    this.events.on('hit-puck', (data) => {
      if (data.side !== this.playerSide) return
      this.room.send('puck', data)
    })

    this.joinRoom()
  }

  async joinRoom() {
    this.setState(SceneState.waitingPlayer)

    try {
      const room = await client.joinOrCreate<FieldState>('my_room')
      console.log('Joined room ', room.id)
      room.state.players.onAdd = (player) => {
        if (player.sessionId === room.sessionId) {
          const isRight = player.side === PlayerSide.right
          this.field.setPlayer(isRight, !isRight)

          this.playerSide = player.side
          this.field.setStickColor(this.playerSide, 0x0000ff)
        } else {
          this.opponentSide = player.side
          this.field.setStickColor(this.opponentSide, 0x00ff00)
        }
        if (this.playerSide !== undefined && this.opponentSide !== undefined) {
          this.start()
        }
      }

      this.room = room
    } catch (e) {
      console.log('JOIN ERROR', e)
    }
  }

  setState(state: SceneState) {
    this.state = state
  }

  start() {
    console.log('start')
    this.setState(SceneState.playing)
  }

  update() {
    if (this.state === SceneState.playing) {
      const { x, y } = this.room.state.players[this.opponentSide]
      if (x === undefined) return
      this.field.setStickPosition(this.opponentSide, x, y)
    }
  }
}
