import Websocket from './modules/websocket/websocket'
import { createServer } from 'http'
import GameSocket from './modules/websocket/game.socket'
require('dotenv').config()
import 'reflect-metadata'

import {
   createExpressServer,
   RoutingControllersOptions
} from 'routing-controllers'

const port = process.env.APP_PORT || 3001

const routingControllerOptions: RoutingControllersOptions = {
   routePrefix: 'v1',
   controllers: [`${__dirname}/modules/http/*.controller.*`],
   validation: true,
   classTransformer: true,
   cors: true,
   defaultErrorHandler: true
}

const app = createExpressServer(routingControllerOptions)
const httpServer = createServer(app)
const io = Websocket.getInstance(httpServer)
io.initializeHandlers([
   { path: '/game', handler: new GameSocket() }
])

httpServer.listen(port, () => {
   console.log(`This is working in port ${port}`)
})