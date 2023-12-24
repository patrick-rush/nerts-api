import { JsonController, Post, Body, QueryParam, QueryParams, Get } from "routing-controllers"
import GameService from "../../libs/game.service"

@JsonController('/game', { transformResponse: true })
class GameController {

    @Post('/')
    insertGame(@Body() game: any) {
        let gameService = new GameService()
        gameService.insertGame(game)
        return {
            status: 200,
            success: true
        }
    }

    @Post('/create')
    createGame(@Body() params: { name: string }) {
        const { name } = params
        let gameService = new GameService()
        console.log(">>>name in /create", name)
        // gameService.insertGame(game)
        const { gameCode, newPlayer } = gameService.createGame(name)
        return {
            status: 200,
            success: true,
            gameCode: gameCode,
            playerId: newPlayer.id
        }
    }
    
    @Post('/join')
    joinGame(@Body() params: { name: string, code: string }) {
        const { name, code } = params
        let gameService = new GameService()
        // gameService.insertGame(game)
        const newPlayer = gameService.joinGame(name, code)
        return {
            status: 200,
            success: true,
            gameCode: code,
            playerId: newPlayer.id
        }
    }

    @Get('/players')
    getPlayers(@QueryParam("code") code: string) {
        let gameService = new GameService()
        let players = gameService.getPlayers(code)
        return {
            status: 200,
            success: true,
            players: players
        }
    }
}

export default GameController