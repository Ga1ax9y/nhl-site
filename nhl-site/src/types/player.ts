export interface ISeasonTotal {
    season: number,
    gameTypeId: number,
    leagueAbbrev: string,
    teamName?: {
        default: string
    },
    gamesPlayed: number,
    goals?: number,
    assists?: number,
    points?: number,
    plusMinus?: number,
    pim?: number,
    shots?: number,
    wins?: number,
    losses?: number,
    otLosses?: number,
    goalsAgainstAvg?: number,
    savePctg?: number,
    shutouts?: number
}

export interface IDraftDetails {
    year: number,
    teamAbbrev: string,
    round: number,
    pickInRound: number,
    overallPick: number
}

interface IPlayerBase{
    id: number,
    headshot: string,
    isActive: boolean,
    firstName: {
        default: string
    },
    lastName: {
        default: string
    },
    fullTeamName: {
        default: string
    }
    currentTeamAbbrev: string,
    teamLogo: string,
        sweaterNumber: number,
    positionCode?: 'L' | 'R' | 'C' | 'D' | 'G',
    position?: 'L' | 'R' | 'C' | 'D' | 'G',
    shootsCatches: string,
    heightInCentimeters: number,
    weightInKilograms: number,
    birthDate: string,
    birthCountry: string,
    value: number,
    draftDetails?: IDraftDetails,
    seasonTotals?: ISeasonTotal[]
}

export interface ISkater extends IPlayerBase{
    featuredStats: {
        season: string,
        regularSeason: {
            subSeason:{
                gamesPlayed: number,
                goals: number,
                assists: number
                plusMinus: number,
                points: number

            },
            career: {
                gamesPlayed: number,
                goals: number,
                assists: number
                plusMinus: number,
                points: number
            }
        },
        playoffs: {
            subSeason: {
                gamesPlayed: number,
                goals: number,
                assists: number
                plusMinus: number,
                points: number
            },
            career: {
                gamesPlayed: number,
                goals: number,
                assists: number
                plusMinus: number,
                points: number
            }
        }
    }
}

export interface IGoalie extends IPlayerBase{
    featuredStats: {
        season: string,
        regularSeason: {
            subSeason: {
                gamesPlayed: number,
                goalsAgainstAvg: number,
                losses: number,
                otLosses: number,
                savePctg: number,
                shutouts: number,
                wins: number
            },
            career: {
                gamesPlayed: number,
                goalsAgainstAvg: number,
                losses: number,
                otLosses: number,
                savePctg: number,
                shutouts: number,
                wins: number
            }
        },
        playoffs: {
            subSeason: {
                gamesPlayed: number,
                goalsAgainstAvg: number,
                losses: number,
                otLosses: number,
                savePctg: number,
                shutouts: number,
                wins: number
            },
            career: {
                gamesPlayed: number,
                goalsAgainstAvg: number,
                losses: number,
                otLosses: number,
                savePctg: number,
                shutouts: number,
                wins: number
            }
        }
    }
}
export type IPlayer = ISkater | IGoalie
