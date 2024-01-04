import { Socket } from "socket.io"
import MySocketInterface from "./mySocketInterface"

import { MongoClient, ServerApiVersion } from 'mongodb'
import GameService from "../../libs/game.service"
import { Card } from "../../types/nerts"

// var globalGamestate = globalGamestate || new Map{}

class GameSocket implements MySocketInterface {
    
    async handleConnection(socket: Socket) {
        
        socket.on('request_game', ({ code, playerId }: { code: string; playerId: string; }, callback: (...args: any) => any) => {
            // join room
            socket.join(code)
            const gameService = new GameService()
            const game = gameService.getGame(code)
            callback({
                game: game
            })
            console.log("request_game")
        })

        socket.emit('ping', 'Hi! I am a live socket connection')

        socket.on('add_to_lake', (msg) => {
            console.log("msg in add_to_lake", msg)
            const { code, playerId, cardToMove, destination } = msg
            let gameService = new GameService()
            const updatedLake = gameService.addCardToLake({code, playerId, cardToMove, destination})
            // console.log("emitting event to code:", code)
            // TODO: needs to be updated to send scores when updates to lake are made
            socket.to(code).emit('update_lake', { data: updatedLake })
        })

        socket.on('update_piles', ({ code, playerId, piles }: { code: string; playerId: string; piles: { location: string, updatedPile: number[] | number[][] }[] }) => {
            console.log("event received")
            let gameService = new GameService()
            const updatedLake = gameService.updatePiles({ code, playerId, piles })
            console.log("updated lake", updatedLake)
            socket.to(code).emit('update_lake', { data: updatedLake })
        })

    }

//    //optional middleware implementation
//    middlewareImplementation(socket: Socket, next) {
//        //Implement your middleware for games here
//        return next()
//    }
}

export default GameSocket