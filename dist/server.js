"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = __importDefault(require("./websocket/websocket"));
const http_1 = require("http");
const game_socket_1 = __importDefault(require("./websocket/game.socket"));
require('dotenv').config();
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const port = process.env.APP_PORT || 3001;
const routingControllerOptions = {
    routePrefix: 'v1',
    controllers: [`${__dirname}/modules/http/*.controller.*`],
    validation: true,
    classTransformer: true,
    cors: true,
    defaultErrorHandler: true
};
const app = routing_controllers_1.createExpressServer(routingControllerOptions);
const httpServer = http_1.createServer(app);
const io = websocket_1.default.getInstance(httpServer);
io.initializeHandlers([
    { path: '/game', handler: new game_socket_1.default() }
]);
httpServer.listen(port, () => {
    console.log(`This is working in port ${port}`);
});
//# sourceMappingURL=server.js.map