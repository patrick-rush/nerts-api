import { JsonController, Post, Body, Get, Req, Res } from "routing-controllers"
import CodeService from "../../libs/code.service"

var globalGamestate = globalGamestate || new Map()

@JsonController('/code', { transformResponse: true })
class CodeController {

    @Post('/')
    createGameCode(@Req() request: any, @Res() response: any) {
        let codeService = new CodeService()
        const gameCode = codeService.generateCode()
        codeService.createGlobalGamestateEntry(gameCode)
        return response.send(JSON.stringify({
            status: 200,
            success: true,
            gameCode: gameCode
        }))
    }
}

export default CodeController