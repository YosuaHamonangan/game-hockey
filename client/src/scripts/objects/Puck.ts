import Field from './Field'

export default class Puck extends Phaser.Physics.Arcade.Sprite {
  static size = 80
  static radius = Puck.size / 2
  body: Phaser.Physics.Arcade.Body

  constructor(
    private field: Field,
    x: number,
    y: number,
    physicsActive: boolean
  ) {
    super(field.scene, x, y, 'puck')
    if (physicsActive) this.initPhysics()
    this.setScale(Puck.size / this.width)
  }

  initPhysics() {
    this.scene.physics.add.existing(this)
    this.body.setCircle(this.width / 2)
    this.setBounce(1)
    this.setMaxVelocity(2000)
    this.setCollideWorldBounds(true)

    const { field } = this

    this.body.setBoundsRectangle(
      new Phaser.Geom.Rectangle(
        field.x - field.bg.width / 2 - Field.GOAL_DEPTH,
        field.y - field.height / 2,
        field.width + Field.GOAL_DEPTH * 2,
        field.height
      )
    )
  }
}
