import axios from 'axios';
import type { ITeam } from '../types/team';
import type { IPlayer } from '../types/player';
import type { INews } from '../types/news';
import type { IStats } from '../types/stats';

// http://localhost:3000
const API_BASE = "http://172.20.10.2:3000/api"

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

export const fetchNews = async (): Promise<INews[]> => {
    const response = await nhlApi.get("news")
    return response.data.items
}

export const fetchStats = async (): Promise<IStats> =>{
    const response = await nhlApi.get("stats")
    return response.data
}
