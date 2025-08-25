import type { ISkater } from "./player";

export interface IStats {
    goals: ISkater[],
    assists: ISkater[],
    points: ISkater[],
    plusMinus: ISkater[]
}
