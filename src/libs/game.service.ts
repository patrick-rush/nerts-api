import Websocket from "../modules/websocket/websocket";

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

    private updateSockets(game) {
        const io = Websocket.getInstance();
        console.log("In updateSockets")
        io.emit('game_updated', { data: [game] });
        // io.of('game').emit('game_updated', { data: [game] });
    }
}

export default GameService;