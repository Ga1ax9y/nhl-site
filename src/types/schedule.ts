export interface IScheduleTeam {
    id: number
    commonName: {
        default: string
    }
    placeName: {
        default: string
    }
    abbrev: string
    logo: string
    darkLogo: string
    score?: number
}

export type GameType = 1 | 2 | 3
export type GameState = 'FUT' | 'PREG' | 'OFF' | 'FINAL' | 'OVER' | 'LIVE' | 'CRIT'

export interface IScheduleGame {
    id: number
    season: number
    gameType: GameType
    gameDate: string
    venue: {
        default: string
    }
    neutralSite: boolean
    startTimeUTC: string
    gameState: GameState
    gameScheduleState: string
    periodDescriptor?: {
        number: number
        periodType: string
        maxRegulationPeriods: number
    }
    gameOutcome?: {
        lastPeriodType?: string
    }
    homeTeam: IScheduleTeam
    awayTeam: IScheduleTeam
}

export interface IGameDay {
    date: string
    dayAbbrev: string
    numberOfGames: number
    games: IScheduleGame[]
}

export interface ILeagueSchedule {
    gameWeek: IGameDay[]
    numberOfGames: number
    previousStartDate?: string
    nextStartDate?: string
}
