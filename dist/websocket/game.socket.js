"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameSocket {
    handleConnection(socket) {
        const gameState = [];
        socket.emit('ping', 'Hi! I am a live socket connection');
        socket.on('game', (msg) => {
            gameState.push(msg);
            console.log(">>> gameState after message", gameState);
        });
    }
}
exports.default = GameSocket;
//# sourceMappingURL=game.socket.js.map