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
    powerPlayGoals?: number,
    powerPlayPoints?: number,
    shootingPctg?: number,
    avgToi?: string,
    timeOnIce?: string,
    wins?: number,
    losses?: number,
    otLosses?: number,
    goalsAgainst?: number,
    goalsAgainstAvg?: number,
    savePctg?: number,
    shutouts?: number,
    shotsAgainst?: number
}

export interface ICareerLine {
    gamesPlayed?: number,
    goals?: number,
    assists?: number,
    points?: number,
    plusMinus?: number,
    pim?: number,
    shots?: number,
    powerPlayGoals?: number,
    powerPlayPoints?: number,
    shootingPctg?: number,
    avgToi?: string,
    timeOnIce?: string,
    wins?: number,
    losses?: number,
    otLosses?: number,
    goalsAgainstAvg?: number,
    savePctg?: number,
    shutouts?: number,
    shotsAgainst?: number
}

export interface ICareerTotals {
    regularSeason?: ICareerLine,
    playoffs?: ICareerLine
}

export interface ILast5Game {
    gameId: number,
    gameDate: string,
    gameTypeId?: number,
    teamAbbrev: string,
    opponentAbbrev: string,
    homeRoadFlag: 'H' | 'R',
    goals?: number,
    assists?: number,
    points?: number,
    plusMinus?: number,
    pim?: number,
    shots?: number,
    toi?: string,
    decision?: string,
    goalsAgainst?: number,
    savePctg?: number,
    shotsAgainst?: number
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
    careerTotals?: ICareerTotals,
    last5Games?: ILast5Game[],
    badges?: string[],
    inHHOF?: number,
    inTop100AllTime?: number,
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
