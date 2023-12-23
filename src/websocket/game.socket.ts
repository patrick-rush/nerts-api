import { Socket } from "socket.io"
import MySocketInterface from "./mySocketInterface"

class GameSocket implements MySocketInterface {

   handleConnection(socket: Socket) {
        const gameState = []
        socket.emit('ping', 'Hi! I am a live socket connection')
        socket.on('game', (msg) => {
            gameState.push(msg)
            console.log(">>> gameState after message", gameState)
        })
    }

//    //optional middleware implementation
//    middlewareImplementation(socket: Socket, next) {
//        //Implement your middleware for games here
//        return next()
//    }
}

export default GameSocket