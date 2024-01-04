import { SuitName, SuitSymbol, SuitType } from "../constants/nerts";

export interface Suit {
    name: SuitName;
    symbol: SuitSymbol;
    type: SuitType;
}

export interface RankDetails {
    display: string,
    name: string,
    position: number
}

export interface Card {
    lookup: number;
    suit: Suit;
    rank: RankDetails;
}

export interface Deal {
    nertStack: Card[];
    river: Card[][];
    stream: Card[];
    waste: Card[];
}
export interface Player {
    id: string;
    name: string;
    deal: Deal;
    score: number;
}
export interface Gamestate {
    startedAt: Date | string;
    players: Player[];
    lake: Card[][];
}