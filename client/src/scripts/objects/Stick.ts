const Vector2 = Phaser.Math.Vector2

export default class Stick extends Phaser.Physics.Arcade.Sprite {
  static size = 100

  body: Phaser.Physics.Arcade.Body
  target: Phaser.Math.Vector2

  private isControlable = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'stick')

    scene.physics.add.existing(this)
    this.body.setCircle(this.width / 2)
    this.setCollideWorldBounds(true)

    this.setScale(Stick.size / this.width)

    this.target = new Vector2(x, y)
    this.scene.events.on('update', this.update, this)
  }

  public setControllable(isControlable: boolean) {
    if (this.isControlable === isControlable) return
    if (isControlable) {
      this.enableControl()
    } else {
      this.disableControl()
    }
    this.isControlable = isControlable
  }

  private enableControl() {
    this.setInteractive({ draggable: true })
    this.on('drag', this.onDrag, this)
  }

  private disableControl() {
    this.setInteractive(false)
    this.off('drag', this.onDrag, this)
  }

  private onDrag(pointer: Phaser.Input.Pointer, x, y) {
    this.target.set(x, y)
    this.scene.events.emit('player-drag', x, y)
  }

  update() {
    if (this.target) {
      const vel = new Vector2(this.x, this.y).subtract(this.target).scale(-10)
      if (vel.length() < 1) {
        this.setVelocity(0, 0)
      } else {
        this.setVelocity(vel.x, vel.y)
      }
    }
  }
}
