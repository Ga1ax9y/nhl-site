import axios from 'axios';
import type { Team } from '../types/team';

const API_BASE = "http://172.20.10.2/api/"

export const nhlApi = axios.create({
    baseURL: API_BASE
})

export const fetchTeams = async (): Promise<Team[]> => {
    const response = await nhlApi.get("teams")
    return response.data.data
}
