import axios from 'axios';
import type { ITeam } from '../types/team';
import type { IPlayer } from '../types/player';

// http://localhost:3000
const API_BASE = "http://localhost:3000/api"

export const nhlApi = axios.create({
    baseURL: API_BASE
})

export const fetchTeams = async (): Promise<ITeam []> => {
    const response = await nhlApi.get("standings")
    return response.data.standings
}

export const fetchRoster = async (teamAbbrev: string): Promise<IPlayer []> => {
    const response = await nhlApi.get(`roster/${teamAbbrev}`)
    const {forwards = [], defensemen = [], goalies = []} = response.data
    return [...forwards, ...defensemen, ...goalies]
}

export const fetchPlayerById = async (playerId: string): Promise<IPlayer> => {
    const response = await nhlApi.get(`player/${playerId}`)
    return response.data
}
