import 'phaser'
import OnlineMultiScene from './scenes/OnlineMultiScene'
import MenuScene from './scenes/MenuScene'
import PreloadScene from './scenes/preloadScene'
import OfflineMultiScene from './scenes/OfflineMultiScene'

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [PreloadScene, MenuScene, OnlineMultiScene, OfflineMultiScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
