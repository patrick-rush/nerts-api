import { ranks, suits } from "../constants/nerts";
import Websocket from "../modules/websocket/websocket";
import { v4 as uuidv4 } from 'uuid';
import { Card } from "../types/nerts";

var globalGamestate = globalGamestate || new Map()
class GameService {

    public connectGame(code: string) {
        // responsible for initial connection
        console.log(">>> initial connection", code)
    }

    public createGame(name: string) {
        console.log(">>> creating new game")

        const gameCode = this.generateGameCode()
        const playerId = uuidv4()
        const players = []
        const deal = this.dealCards()
        const newPlayer = {
            id: playerId,
            name,
            deal,
        }
        players.push(newPlayer)
        globalGamestate.set(gameCode, {
            startedAt: new Date(),
            lake: Array.from({ length: 4 }, () => []),
            players: players,
        })

        return { gameCode, newPlayer }
    }

    public joinGame(name: string, code: string) {
        const playerId = uuidv4()
        const deal = this.dealCards()
        const newPlayer = {
            id: playerId,
            name,
            deal,
        }
        const lakeAdditions = Array.from({ length: 4 }, () => [])
        const game = globalGamestate.get(code)
        game.players.push(newPlayer)
        game.lake.push(...lakeAdditions)
        return newPlayer
    }

    public getGame(code: string) {
        return globalGamestate.get(code)
    }

    public addCardToLake({ code, playerId, cardToMove, destination }) {
        console.log("adding card to Lake", code, playerId, cardToMove, destination);
        const stateOfGame = globalGamestate.get(code)
        const lakeLength = stateOfGame.lake?.length
        let finalDestination = destination
        let isCompatible = false

        // account for aces landing on an already filled spot
        if (cardToMove.rank.position === 1) {
            for (let i = destination + 1; i !== destination; i = ++i%lakeLength) {
                isCompatible = this.checkLakeCompatibility({code, cardToMove, destination: i - 1})
                if (isCompatible) {
                    finalDestination = i - 1
                    break
                }
            }
        } else {
            isCompatible = this.checkLakeCompatibility({ code, cardToMove, destination })
        }
        // console.log("finalDestination", finalDestination)
        // console.log("isCompatible", isCompatible)
        if (isCompatible) stateOfGame.lake[finalDestination]?.push(cardToMove)
        // console.log("stateOfGame", stateOfGame)
        return stateOfGame
    }

    public moveCard({ code, to, from }) {
        const stateOfGame = this.getGame(code)
        const player = stateOfGame.players.find((player) => player.id = to.playerId) // TODO: define player
        const card = player.deal[from.source].pop()
        player.deal[to.destination].push(card)
    }


    public updatePiles({ code, playerId, piles }: { code: string; playerId: string; piles: { location: string, updatedPile: Card[] | Card[][] }[] }) {
        piles.forEach(pile => {
            const deal = this.getGame(code)?.players.find(player => player.id === playerId)?.deal
            deal[pile.location] = pile.updatedPile
            deal[pile.location]
        })
        return this.getGame(code)
    }

    private generateGameCode() {
        let code = (Math.floor(Math.random() * 1000000)).toString().padStart(6, '0')
        if (globalGamestate.has(code)) return this.generateGameCode()
        return code
    }

    private dealCards() {
        const shuffle = (array: Card[]) => array.sort(() => 0.5 - Math.random())
        const deck = suits.flatMap(suit => {
            return ranks.map(rank => {
                return {
                    suit,
                    rank,
                }
            })
        })
        const shuffledDeck: Card[] = shuffle(deck)
        const nertStack = shuffledDeck.splice(0, 13)
        const river = [
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
        ]
        const stream = shuffledDeck
        const waste = []
        return {
            nertStack,
            river,
            stream,
            waste
        }
    }

    private checkLakeCompatibility({ code, cardToMove, destination }: { code: string; cardToMove: Card; destination: number; }) {
        const pile = globalGamestate.get(code).lake[destination]
        const topCard = pile[pile.length - 1]
        console.log("topCard", topCard)
        if (cardToMove.rank.position === 1) return !topCard

        const isOneMore = cardToMove.rank.position - 1 === topCard.rank.position
        const isSameSuit = cardToMove.suit.name === topCard.suit.name
        return isOneMore && isSameSuit
    }

}

export default GameService;