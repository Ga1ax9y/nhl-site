
export interface ITeam{
    teamName: {
        default: string
    }
    teamAbbrev: {
        default: string
    }
    conferenceName: string
    divisionName: string
    gamesPlayed: number
    goalDifferential: number
    goalAgainst: number
    goalFor: number
    losses: number
    points: number
    wins: number
    teamLogo: string

}
