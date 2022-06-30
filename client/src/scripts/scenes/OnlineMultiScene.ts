import FpsText from '../objects/fpsText'
import Field from '../objects/Field'
import { client, Colyseus } from '../utils/colyseus'
import { FieldState, PlayerSide } from '../utils/fieldState'
import Toast from '../objects/Toast'
import { DataChange } from '@colyseus/schema'

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
  private toast: Toast

  constructor() {
    super({ key: 'OnlineMultiScene' })
  }

  create() {
    this.field = this.add.existing(
      new Field(
        this,
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        false
      )
    )
    this.setState(SceneState.preparing)

    this.toast = this.add.existing(new Toast(this))
    this.toast.hide()

    this.fpsText = new FpsText(this)

    this.events.on('player-drag', (x, y) => {
      this.room.send('move', { x, y })
    })

    // this.events.on('hit-puck', (data) => {
    //   if (data.side !== this.playerSide) return
    //   this.room.send('puck', data)
    // })

    this.joinRoom()
  }

  async joinRoom() {
    this.setState(SceneState.waitingPlayer)

    try {
      const room = await client.joinOrCreate<FieldState>('my_room')
      console.log('Joined room ', room.id)

      room.state.puck.onChange = (changes: DataChange[]) => {
        changes.forEach((change) => {
          const { field, value } = change
          this.field.puck[field] = value
        })
      }

      room.state.players.onAdd = (player) => {
        if (player.sessionId === room.sessionId) {
          const isRight = player.side === PlayerSide.right
          this.field.setPlayer(isRight, !isRight)

          this.playerSide = player.side
          this.field.setStickColor(this.playerSide, 0x0000ff)
        } else {
          this.opponentSide = player.side
          this.field.setStickColor(this.opponentSide, 0x00ff00)
          player.onChange = this.onOpponentChange.bind(this)
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
    const prvState = this.state
    this.state = state

    this.onStateChange(prvState, state)
  }

  start() {
    console.log('start')
    this.setState(SceneState.playing)
  }

  // update() {
  //   if (this.state === SceneState.playing) {
  //     // const player = this.room.state.players[this.playerSide]
  //     // this.field.setStickPosition(this.playerSide, player.x, player.y)
  //   }
  // }

  onStateChange(prvState: SceneState, newState: SceneState) {
    switch (prvState) {
      case SceneState.waitingPlayer:
        this.toast.hide()
        break

      default:
        break
    }

    switch (newState) {
      case SceneState.waitingPlayer:
        this.toast.show('Waiting for player')
        break

      default:
        break
    }
  }

  onOpponentChange(changes: DataChange[]) {
    changes.forEach((change) => {
      const { field, value } = change
      if (field === 'x') {
        this.field.sticks[this.opponentSide].target.x = value
      } else if (field === 'y') {
        this.field.sticks[this.opponentSide].target.y = value
      }
    })
  }
}
