import axios from 'axios';
import type { Team } from '../types/team';
import type { IStandings } from '../types/standings';

// http://localhost:3000
const API_BASE = "http://localhost:3000/api"

export const nhlApi = axios.create({
    baseURL: API_BASE
})

export const fetchTeams = async (): Promise<Team[]> => {
    const response = await nhlApi.get("teams")
    return response.data.data
}

export const fetchStandings = async (): Promise<IStandings []> => {
    const response = await nhlApi.get("standings")
    return response.data.standings
}
