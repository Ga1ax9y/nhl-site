import axios from 'axios';
import type { ITeam } from '../types/team';

// http://localhost:3000
const API_BASE = "http://localhost:3000/api"

export const nhlApi = axios.create({
    baseURL: API_BASE
})

export const fetchTeams = async (): Promise<ITeam []> => {
    const response = await nhlApi.get("standings")
    return response.data.standings
}
