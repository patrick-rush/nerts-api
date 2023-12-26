import { CardSource, cardLookup, deck } from "../constants/nerts";
import Websocket from "../modules/websocket/websocket";
import { v4 as uuidv4 } from 'uuid';
import type { Card, Deal, Gamestate } from "../types/nerts";

// @ts-ignore: Unreachable code error
if (!global.globalGamestate) {
    // @ts-ignore: Unreachable code error
    global.globalGamestate = new Map<string, Gamestate>()
}
// @ts-ignore: Unreachable code error
var globalGamestate: Map<string, Gamestate> = global.globalGamestate
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
        console.log("New player's deal:", newPlayer.deal)
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
        game?.players.push(newPlayer)
        game?.lake.push(...lakeAdditions)
        return newPlayer
    }

    public getGame(code: string) {
        return globalGamestate.get(code)
    }

    public addCardToLake({ code, playerId, cardToMove, destination }: { code: string, playerId: string, cardToMove: Card, destination: number }) {
        console.log("adding card to Lake", code, playerId, cardToMove, destination);
        const stateOfGame = globalGamestate.get(code)
        const lakeLength = stateOfGame?.lake?.length || 0
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
        if (isCompatible) stateOfGame?.lake[finalDestination]?.push(cardToMove)
        const serializedLake = stateOfGame?.lake?.map(pile => {
            return pile.map(card => card.lookup)
        })
        return serializedLake
    }

    public updatePiles({ code, playerId, piles }: { code: string; playerId: string; piles: { location: string, updatedPile: number[] | number[][] }[] }) {
        piles.forEach(pile => {
            if (pile.location === CardSource.Lake) return
            const deal = this.getGame(code)?.players.find(player => player.id === playerId)?.deal
            if (!deal) return
            if (pile.location === CardSource.River) {
                const pileToUpdate = pile.updatedPile as number[][]
                this.updateRiver({ deal, pile: pileToUpdate})
            }
            else {
                const pileToUpdate = pile.updatedPile as number[]
                this.updateOther({ deal, pile: pileToUpdate, location: pile.location })
            }
        })
        console.log(globalGamestate.get(code).players.find(player => player.id === playerId))
        const serializedLake = this.getGame(code)?.lake?.map(pile => {
            return pile.map(card => card.lookup)
        })
        return serializedLake
    }

    private deserializePile(pile: number[]) {
        return pile.map((card: number) => cardLookup[card])
    }

    private updateRiver({ deal, pile: river }: { deal: Deal; pile: number[][] }) {
        deal.river = river.map((pile: number[]) => this.deserializePile(pile))
    }

    private updateOther({ deal, pile, location }: { deal: Deal; pile: number[]; location: string }) {
        switch (location) {
            case CardSource.Waste:
                deal.waste = this.deserializePile(pile)
                break
            case CardSource.Stream:
                deal.stream = this.deserializePile(pile)
                break
            case CardSource.Nert:
                deal.nertStack = this.deserializePile(pile)
                break
            default:
                throw new Error("Location is not compatible. Unable to update piles.")
        }
    }

    private generateGameCode(): string {
        let code = (Math.floor(Math.random() * 1000000)).toString().padStart(6, '0')
        if (globalGamestate.has(code)) return this.generateGameCode()
        return code
    }

    private dealCards() {
        const shuffle = (array: Card[]) => array.sort(() => 0.5 - Math.random())
        const freshDeck = [...deck]
        const shuffledDeck: Card[] = shuffle(freshDeck)
        const nertStack = shuffledDeck.splice(0, 13)
        const river = [
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
        ]
        const stream = shuffledDeck
        const waste: Card[] = []
        return {
            nertStack,
            river,
            stream,
            waste
        }
    }

    private checkLakeCompatibility({ code, cardToMove, destination }: { code: string; cardToMove: Card; destination: number; }) {
        // if (!globalGamestate) return
        const pile = globalGamestate?.get(code)?.lake[destination]
        const topCard = pile?.[pile.length - 1]
        console.log("topCard", topCard)
        if (cardToMove.rank.position === 1) return !topCard

        const isOneMore = cardToMove.rank.position - 1 === topCard?.rank.position
        const isSameSuit = cardToMove.suit.name === topCard?.suit.name
        return isOneMore && isSameSuit
    }

}

export default GameService;