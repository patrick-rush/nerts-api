import { JsonController, Post, Body } from "routing-controllers"
import GameService from "../libs/game.service"

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
}

export default GameController