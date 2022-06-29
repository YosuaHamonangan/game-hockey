import Puck from './Puck'
import Stick from './Stick'
import { PlayerSide } from '../utils/fieldState'
import { FieldInfo } from '../interfaces/Field'

export default class Field extends Phaser.GameObjects.Container {
  static WIDTH = 1000
  static HEIGHT = 600
  static GOAL_WIDTH = 200
  static GOAL_DEPTH = 30

  bg: Phaser.GameObjects.Image
  walls: Phaser.Physics.Arcade.Image[]
  middleWall: Phaser.Physics.Arcade.Image
  puck: Puck
  sticks: Stick[]
  sideGoals: Phaser.Physics.Arcade.Image[]
  goals: Phaser.Physics.Arcade.Image[]

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    physicsActive: boolean
  ) {
    super(scene, x, y)

    this.setSize(Field.WIDTH, Field.HEIGHT)

    this.bg = scene.add.image(0, 0, 'field')
    this.bg.setSize(Field.WIDTH, Field.HEIGHT)
    this.add(this.bg)

    this.createGoals()
    this.createPuck(physicsActive)

    this.sticks = []
    this.createStick(PlayerSide.right)
    this.createStick(PlayerSide.left)
  }

  private createStick(side: PlayerSide): void {
    if (this.sticks[side]) {
      throw new TypeError(`Player ${side} already exist`)
    }
    const isRight = side === PlayerSide.right
    const x = isRight ? this.bg.width / 4 : -this.bg.width / 4

    const stick = new Stick(this.scene, x, 0)

    stick.body.setBoundsRectangle(
      new Phaser.Geom.Rectangle(
        this.x - (isRight ? Puck.radius : this.bg.width / 2),
        this.y - this.height / 2,
        this.width / 2 + Puck.radius,
        this.height
      )
    )
    this.add(stick)

    this.scene.physics.add.collider(this.puck, stick, () => {
      const data = {
        side,
        velX: this.puck.body.velocity.x,
        velY: this.puck.body.velocity.y,
      }
      this.scene.events.emit('hit-puck', data)
    })
    this.sticks[side] = stick
  }

  private createPuck(physicsActive: boolean) {
    const puck = new Puck(this, 0, 0, physicsActive)
    this.add(puck)

    this.sideGoals.forEach((goal) => {
      this.scene.physics.add.collider(goal, puck)
    })

    this.goals.forEach((goal) => {
      this.scene.physics.add.collider(goal, puck, () => {
        puck.body.reset(0, 0)
        console.log('goal')
      })
    })

    this.puck = puck
  }

  private createGoals() {
    const sideWidth = (this.height - Field.GOAL_WIDTH) / 2
    let x: number, y: number

    // Side goal wall
    x = this.width / 2 + Field.GOAL_DEPTH / 2
    y = (Field.GOAL_WIDTH + sideWidth) / 2
    const sideGoalsPos = [
      // Right Top
      [this.x + x, this.y - y],
      // Right Bot
      [this.x + x, this.y + y],
      // Left Top
      [this.x - x, this.y - y],
      // Left Bot
      [this.x - x, this.y + y],
    ]
    this.sideGoals = sideGoalsPos.map(([x, y]) => {
      const goal = this.scene.physics.add.staticImage(x, y, '')
      goal.setBodySize(Field.GOAL_DEPTH, sideWidth)
      goal.setVisible(false)
      this.add(goal)
      return goal
    })

    // middle
    const thickness = 10
    x = this.width / 2 + Field.GOAL_DEPTH
    y = 0
    const goalsPos = [
      [x, y],
      [-x, y],
    ]
    this.goals = goalsPos.map(([x, y]) => {
      const goal = this.scene.physics.add.image(x, y, '')
      goal.setBodySize(thickness, Field.GOAL_WIDTH)
      goal.setVisible(false)
      goal.setDebugBodyColor(0xff0000)
      goal.setPushable(false)
      this.add(goal)
      return goal
    })
  }

  public setPlayer(hasPlayerRight: boolean, hasPlayerLeft: boolean) {
    this.sticks[PlayerSide.right].setControllable(hasPlayerRight)
    this.sticks[PlayerSide.left].setControllable(hasPlayerLeft)
  }

  public getStickPosition(playerSide: PlayerSide): { x: number; y: number } {
    const { x, y } = this.sticks[playerSide].target
    return { x, y }
  }

  public setStickPosition(playerSide: PlayerSide, x: number, y: number) {
    this.sticks[playerSide].target.x = x
    this.sticks[playerSide].target.y = y
  }

  public setStickColor(playerSide: PlayerSide, color: number) {
    this.sticks[playerSide].setTint(color)
  }

  public getFieldInfo(): FieldInfo {
    return {
      puck: {
        x: this.puck.x,
        y: this.puck.y,
      },
      sticks: this.sticks.map(({ x, y }) => ({ x, y })),
    }
  }
}
