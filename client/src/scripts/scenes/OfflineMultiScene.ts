import FpsText from '../objects/fpsText'
import { PlayerSide } from '../utils/fieldState'
import Field from '../objects/Field'

export default class OfflineMultiScene extends Phaser.Scene {
  fpsText
  field: Field

  constructor() {
    super({ key: 'OfflineMultiScene' })
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

    this.fpsText = new FpsText(this)

    this.field.setPlayer(true, true)
    this.field.setStickColor(PlayerSide.bottom, 0x0000ff)
    this.field.setStickColor(PlayerSide.top, 0x00ff00)
  }
}
