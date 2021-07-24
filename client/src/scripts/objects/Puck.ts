import Field from './Field'

export default class Puck extends Phaser.Physics.Arcade.Sprite {
  static size = 80
  static radius = Puck.size / 2
  body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'puck')

    scene.physics.add.existing(this)
    this.body.setCircle(this.width / 2)
    this.setBounce(1)
    this.setMaxVelocity(2000)
    this.setCollideWorldBounds(true)
    this.setScale(Puck.size / this.width)
  }
}
