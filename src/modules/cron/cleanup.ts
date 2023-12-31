// import { cron } from 'node-cron'
import { CronJob } from 'cron'

// @ts-ignore: Unreachable code error
if (!global.globalGamestate) {
    // @ts-ignore: Unreachable code error
    global.globalGamestate = new Map<string, Gamestate>()
}
// @ts-ignore: Unreachable code error
var globalGamestate: Map<string, Gamestate> = global.globalGamestate

class CleanupJob {

    cronJob: CronJob;

    constructor() {
        this.cronJob = new CronJob('0 3 * * *', async () => {
            try {
                await this.cleanup()
            } catch (err) {
                console.log(err)
            }
        })
    }

    public start(): void {
        this.cronJob.start()
    }

    private async cleanup() {
        const currentGamesRunning = global.globalGamestate.size
        if (!currentGamesRunning) {
            console.log("There are 0 games to check. Ending cleanup job.")
            return
        }
        console.log("Checking %d game(s) in Global Gamestate for EOL.", currentGamesRunning);
        const iterator = globalGamestate[Symbol.iterator]()
    
        let twoDaysAgo = new Date()
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

        let retained = 0,
            deleted = 0
    
        for (const [gameCode, game] of iterator) {
            const startDate = new Date(game.startedAt)
            if (startDate < twoDaysAgo) {
                globalGamestate.delete(gameCode)
                deleted++
            } else {
                retained++
            }
        }
        console.log("%d game(s) retained.", retained)
        console.log("%d game(s) deleted.", deleted)
    }
}

export default CleanupJob