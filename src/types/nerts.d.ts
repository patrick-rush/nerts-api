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
    suit: Suit;
    rank: RankDetails;
}