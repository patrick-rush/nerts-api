import type { Gamestate } from './nerts'

export { }

declare global {
    namespace NodeJS {
        interface Global {
            globalGamestate: Map<string, Gamestate>;
        }
    }
}