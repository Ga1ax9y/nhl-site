import type { GameState } from './schedule';

interface ILocalizedName {
    default: string;
}

export interface IGameTeam {
    id: number;
    commonName: ILocalizedName;
    placeName: ILocalizedName;
    abbrev: string;
    logo: string;
    score?: number;
    sog?: number;
    record?: string;
}

export interface IGameGoal {
    name: ILocalizedName;
    teamAbbrev: ILocalizedName;
    timeInPeriod: string;
    awayScore: number;
    homeScore: number;
    strength?: string;
    assists?: Array<{ name: ILocalizedName }>;
}

export interface IGameScoringPeriod {
    periodDescriptor: { number: number; periodType: string };
    goals: IGameGoal[];
}

export interface IGamePenalty {
    timeInPeriod: string;
    duration: number;
    type: string;
    descKey: string;
    teamAbbrev: ILocalizedName;
    committedByPlayer?: {
        firstName?: ILocalizedName;
        lastName?: ILocalizedName;
        sweaterNumber?: number;
    };
    drawnBy?: {
        firstName?: ILocalizedName;
        lastName?: ILocalizedName;
        sweaterNumber?: number;
    };
}

export interface IGamePenaltiesPeriod {
    periodDescriptor: { number: number; periodType: string };
    penalties: IGamePenalty[];
}

export interface IGameStar {
    star: number;
    name: ILocalizedName;
    teamAbbrev: string;
    position: string;
    headshot?: string;
    goals?: number;
    assists?: number;
    points?: number;
    savePctg?: number;
}

export interface IMatchupLeader {
    category: string;
    awayLeader: { name: ILocalizedName; value: number };
    homeLeader: { name: ILocalizedName; value: number };
}

export interface IGameLanding {
    id: number;
    gameDate: string;
    gameState: GameState;
    startTimeUTC: string;
    venue: ILocalizedName;
    periodDescriptor?: { number: number; periodType: string };
    awayTeam: IGameTeam;
    homeTeam: IGameTeam;
    clock?: { timeRemaining: string; inIntermission: boolean };
    matchup?: {
        skaterComparison?: { leaders: IMatchupLeader[] };
    };
    summary?: {
        scoring?: IGameScoringPeriod[];
        penalties?: IGamePenaltiesPeriod[];
        threeStars?: IGameStar[];
    };
    gameOutcome?: { lastPeriodType?: string };
}
