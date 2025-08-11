export interface IPlayer{
    id: number,
    headshot: string,
    firstName: {
        default: string
    },
    lastName: {
        default: string
    },
    sweaterNumber: number,
    positionCode: string,
    shootsCatches: string,
    heightInCentimeters: number,
    weightInKilograms: number,
    birthDate: string,
    birthCountry: string,
    
}
