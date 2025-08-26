import type { IGoalie, ISkater } from "./player";

export interface IStats {
    goals: ISkater[],
    assists: ISkater[],
    points: ISkater[],
    plusMinus: ISkater[]
    savePctg: IGoalie[],
    shutouts: IGoalie[],
    wins: IGoalie[],
    goalsAgainstAverage: IGoalie[]


}
