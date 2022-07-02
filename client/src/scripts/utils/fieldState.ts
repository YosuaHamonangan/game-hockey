import { Schema, ArraySchema, type } from '@colyseus/schema'

export enum PlayerSide {
  bottom = 0,
  top = 1,
}

export function getOppositeSide(side: PlayerSide): PlayerSide {
  return side === PlayerSide.bottom ? PlayerSide.top : PlayerSide.bottom
}

export class PuckState extends Schema {
  @type('number') x: number
  @type('number') y: number
}

export class PlayerState extends Schema {
  @type('boolean') connected: boolean
  @type('string') name: string
  @type('string') sessionId: string
  @type('number') side: PlayerSide
  @type('number') x: number
  @type('number') y: number
}

export class FieldState extends Schema {
  @type(PuckState) puck = new PuckState()
  @type([PlayerState]) players = new ArraySchema<PlayerState>()
}
