import installJsDom from 'jsdom-global'

// Phaser depends on globals being present, jsdom-global patches most of those in.
const uninstallJsDom = installJsDom('', {
  // Add RAF functionality:
  pretendToBeVisual: true,
  // Required for Phaser's TextureManager to boot (because it loads two base64 images):
  resources: 'usable',
})
// Globals that are missing from jsdom-global:
global.performance = global.window.performance
global.window.focus = () => {}

function shutdown() {
  global.window.close()
  uninstallJsDom()
}

import 'phaser'
import HeadlessMultiScene from '../../client/src/scripts/scenes/HeadlessMultiScene'

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  type: Phaser.HEADLESS,
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  physics: {
    default: 'arcade',
  },
  scene: [HeadlessMultiScene],
  customEnvironment: true,
}

export function createHeadlessGame() {
  return new Phaser.Game(config)
}
