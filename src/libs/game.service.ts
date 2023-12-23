import Websocket from "../websocket/websocket";

class GameService {

    public insertGame(game) {
        //save in your database
        console.log("this is where we save to table")
        console.log(">>>", game)
        //send the update to the browser
        this.updateSockets(game);
    }

    private updateSockets(game) {
        const io = Websocket.getInstance();
        io.of('game').emit('game_updated', { data: [game] });
        console.log("In updateSockets")
    }
}

export default GameService;