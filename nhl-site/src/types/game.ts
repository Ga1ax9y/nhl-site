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

export interface IGameAssist {
    playerId: number;
    name: ILocalizedName;
}

export interface IGameGoal {
    playerId: number;
    name: ILocalizedName;
    teamAbbrev: ILocalizedName;
    timeInPeriod: string;
    awayScore: number;
    homeScore: number;
    strength?: string;
    assists?: IGameAssist[];
}

export interface IGameScoringPeriod {
    periodDescriptor: { number: number; periodType: string };
    goals: IGameGoal[];
}

export interface IGamePenaltyPlayer {
    firstName?: ILocalizedName;
    lastName?: ILocalizedName;
    playerId?: number;
    sweaterNumber?: number;
}

export interface IGamePenalty {
    timeInPeriod: string;
    duration: number;
    type: string;
    descKey: string;
    teamAbbrev: ILocalizedName;
    committedByPlayer?: IGamePenaltyPlayer;
    drawnBy?: IGamePenaltyPlayer;
}

export interface IGamePenaltiesPeriod {
    periodDescriptor: { number: number; periodType: string };
    penalties: IGamePenalty[];
}

export interface IGameStar {
    star: number;
    playerId: number;
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
    awayLeader: {
        playerId: number;
        name: ILocalizedName;
        headshot?: string;
        value: number;
    };
    homeLeader: {
        playerId: number;
        name: ILocalizedName;
        headshot?: string;
        value: number;
    };
}

export interface IGameBoxscorePlayer {
    playerId: number;
    sweaterNumber: number;
    name: ILocalizedName;
}

export interface IGameBoxscoreTeamStats {
    forwards: IGameBoxscorePlayer[];
    defense: IGameBoxscorePlayer[];
    goalies: IGameBoxscorePlayer[];
}

export interface IGameBoxscore {
    awayTeam: IGameTeam;
    homeTeam: IGameTeam;
    playerByGameStats: {
        awayTeam: IGameBoxscoreTeamStats;
        homeTeam: IGameBoxscoreTeamStats;
    };
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
