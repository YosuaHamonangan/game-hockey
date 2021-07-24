function addBtnEvtToImg(img: Phaser.GameObjects.Image, onClick: Function) {
  img.setInteractive()
  img.on(Phaser.Input.Events.POINTER_DOWN, () => {
    img.setScale(1.1)
  })
  img.on(Phaser.Input.Events.POINTER_OUT, () => {
    img.setScale(1)
  })
  img.on(Phaser.Input.Events.POINTER_UP, (pointer) => {
    if (img.scale === 1) return
    img.setScale(1)
    onClick()
  })
}

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  create() {
    this.createOnlineButton()
    this.createOfflineButton()
  }

  private createOnlineButton() {
    const x = this.cameras.main.centerX
    const y = this.cameras.main.height / 4
    const btn = this.add.image(x, y, 'online-multi-btn')
    addBtnEvtToImg(btn, () => {
      this.scene.start('OnlineMultiScene')
    })
  }

  private createOfflineButton() {
    const x = this.cameras.main.centerX
    const y = (this.cameras.main.height * 3) / 4
    const btn = this.add.image(x, y, 'offline-multi-btn')
    addBtnEvtToImg(btn, () => {
      this.scene.start('OfflineMultiScene')
    })
  }
}
