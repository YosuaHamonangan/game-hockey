import * as Colyseus from 'colyseus.js'
const client = new Colyseus.Client(process.env.SERVER_URL)

export { client, Colyseus }
