import { Socket } from "socket.io"
import MySocketInterface from "./mySocketInterface"

import { MongoClient, ServerApiVersion } from 'mongodb'



class GameSocket implements MySocketInterface {
    
    async handleConnection(socket: Socket) {
        const uri = `mongodb+srv://nerts_admin:${encodeURIComponent(process.env.MONGO_DB_PASSWORD)}@nerts.kyvvyac.mongodb.net/?retryWrites=true&w=majority`
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        })
        console.log("uri:", uri)
        try {
            await client.connect()
            await client.db("nerts_db").command({ ping: 1 })
            console.log("pinged db")
        } catch (err) {
            console.error("error connecting to db")
        } finally {
            await client.close()
        }
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