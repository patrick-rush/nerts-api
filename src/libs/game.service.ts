import Websocket from "../modules/websocket/websocket";
import { v4 as uuidv4 } from 'uuid';

var globalGamestate = globalGamestate || new Map()
class GameService {

    public insertGame(game) {
        //save in your database
        console.log("this is where we save to table")
        console.log(">>>", game)
        // globalGamestate.push(game)

        //send the update to the browser
        this.updateSockets(globalGamestate);
    }

    public createGame(name: string) {
        console.log(">>> creating new game")
        const gameCode = this.generateGameCode()
        const playerId = uuidv4()
        const newPlayer = {
            name,
            id: playerId
        }
        const players = []
        players.push(newPlayer)
        globalGamestate.set(gameCode, {
            startedAt: new Date(),
            lake: [],
            players: players,
        })
        return { gameCode, newPlayer }
    }

    public joinGame(name: string, code: string) {
        const playerId = uuidv4()
        const newPlayer = {
            name,
            id: playerId
        }
        globalGamestate.get(code).players.push(newPlayer)
        return newPlayer
    }

    public getPlayers(code: string) {
        return globalGamestate.get(code)?.players
    }

    public addCardToLake({ code, playerId, cardToMove, destination }) {
        globalGamestate.get(code).lake[destination]?.push(cardToMove)
        this.updateSockets(globalGamestate.get(code).lake)
    }

    private updateSockets(lake) {
        const io = Websocket.getInstance();
        // we need to narrow this down to the particular game's lake
        io.emit('update_lake', { data: [lake] });
        // io.of('game').emit('game_updated', { data: [game] });
    }

    private generateGameCode() {
        let code = (Math.floor(Math.random() * 1000000)).toString().padStart(6, '0')
        if (globalGamestate.has(code)) return this.generateGameCode()
        return code
    }

}

export default GameService;