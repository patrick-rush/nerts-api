import { Socket } from "socket.io"
import MySocketInterface from "./mySocketInterface"

import { MongoClient, ServerApiVersion } from 'mongodb'
import GameService from "../../libs/game.service"

var globalGamestate = globalGamestate || []

class GameSocket implements MySocketInterface {
    
    async handleConnection(socket: Socket) {
        // const uri = `mongodb+srv://nerts_admin:${encodeURIComponent(process.env.MONGO_DB_PASSWORD)}@nerts.kyvvyac.mongodb.net/?retryWrites=true&w=majority`
        // const client = new MongoClient(uri, {
        //     serverApi: {
        //         version: ServerApiVersion.v1,
        //         strict: true,
        //         deprecationErrors: true
        //     }
        // })
        // console.log("uri:", uri)
        // try {
        //     await client.connect()
        //     await client.db("nerts_db").command({ ping: 1 })
        //     console.log("pinged db")
        // } catch (err) {
        //     console.error("error connecting to db")
        // } finally {
        //     await client.close()
        // }
        
        socket.emit('ping', 'Hi! I am a live socket connection')

        socket.on('add_to_lake', (msg) => {
            console.log(msg)
            const { code, playerId, cardToMove, destination } = msg
            let gameService = new GameService()
            const updatedLake = gameService.addCardToLake({code, playerId, cardToMove, destination})
        })

        // socket.on('game', (msg) => {
        //     globalGamestate.push(msg)
        //     console.log(">>> globalGamestate after message", globalGamestate)
        // })
    }

//    //optional middleware implementation
//    middlewareImplementation(socket: Socket, next) {
//        //Implement your middleware for games here
//        return next()
//    }
}

export default GameSocket