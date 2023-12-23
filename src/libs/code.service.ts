import Websocket from "../modules/websocket/websocket";

var globalGamestate = globalGamestate || new Map()

class CodeService {

    public generateCode() {
        //save in your database
        console.log("this is where we save to table")
        const gameCode = this.generateGameCode()
        return gameCode

        //send the update to the browser
        // this.updateSockets(globalGamestate);
    }

    public createGlobalGamestateEntry(code: string) {
        //save in your database

        globalGamestate.set(code, {
            startedAt: new Date(),
            lake: {},
            players: {}
        })
        console.log(">>> globalGamestate", globalGamestate)
        //send the update to the browser
        // this.updateSockets(globalGamestate);
    }

    private generateGameCode() {
        let code = (Math.floor(Math.random() * 1000000)).toString().padStart(6, '0')
        if (globalGamestate.has(code)) return this.generateGameCode()
        return code
    }
}

export default CodeService;