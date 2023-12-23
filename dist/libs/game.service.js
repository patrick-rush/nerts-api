"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = __importDefault(require("../websocket/websocket"));
class GameService {
    insertGame(game) {
        //save in your database
        console.log("this is where we save to table");
        console.log(">>>", game);
        //send the update to the browser
        this.updateSockets(game);
    }
    updateSockets(game) {
        const io = websocket_1.default.getInstance();
        io.of('game').emit('game_updated', { data: [game] });
        console.log("In updateSockets");
    }
}
exports.default = GameService;
//# sourceMappingURL=game.service.js.map