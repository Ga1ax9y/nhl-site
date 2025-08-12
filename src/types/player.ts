export interface IPlayer{
    id: number,
    headshot: string,
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
        }
    }
    sweaterNumber: number,
    positionCode: string,
    shootsCatches: string,
    heightInCentimeters: number,
    weightInKilograms: number,
    birthDate: string,
    birthCountry: string,

}
