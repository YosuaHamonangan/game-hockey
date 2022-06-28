export default class Toast extends Phaser.GameObjects.Container {
  private text: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    super(scene, scene.cameras.main.width / 2, 10)
    scene.add.existing(this)

    this.text = scene.add.text(0, 0, '', {
      color: 'black',
      fontSize: '28px',
    })
    this.text.setOrigin(0.5, 0)
    this.add(this.text)
  }

  show(text: string) {
    this.text.text = text
    this.alpha = 1
  }

  hide() {
    this.alpha = 0
  }
}
