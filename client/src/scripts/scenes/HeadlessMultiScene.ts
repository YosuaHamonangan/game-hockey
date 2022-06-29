import { PlayerSide, PlayerState } from '../utils/fieldState'
import Field from '../objects/Field'

export default class HeadlessMultiScene extends Phaser.Scene {
  field: Field

  constructor() {
    super({ key: 'HeadlessMultiScene' })
  }

  create() {
    this.field = this.add.existing(
      new Field(
        this,
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        true
      )
    )

    this.field.setPlayer(true, true)
    this.field.setStickColor(PlayerSide.right, 0x0000ff)
    this.field.setStickColor(PlayerSide.left, 0x00ff00)

    this.game.events.on('move', this.onPlayerMove)
  }

  onPlayerMove = this._onPlayerMove.bind(this)

  _onPlayerMove(player: PlayerState) {
    this.field.setStickPosition(player.side, player.x, player.y)
  }

  update(): void {
    this.game.events.emit('update', this.field.getFieldInfo())
  }
}
