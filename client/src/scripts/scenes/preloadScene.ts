import { images } from '../../assets/list'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    images.forEach(({ key, url }) => this.load.image(key, url))
  }

  create() {
    this.scene.start('MenuScene')
  }
}
