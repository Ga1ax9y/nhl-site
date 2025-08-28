import axios from 'axios';
import type { ITeam } from '../types/team';
import type { IPlayer } from '../types/player';
import type { INews } from '../types/news';
import type { IStats } from '../types/stats';
import type { ISeason } from '../types/season';

// http://localhost:3000
const API_BASE = "http://localhost:3000/api"

export const nhlApi = axios.create({
    baseURL: API_BASE
})

export const fetchSeasons = async (): Promise<ISeason[]> => {
    const response = await nhlApi.get("standings-season")
    return response.data.seasons.reverse().slice(0, 26)
}

export const fetchSeasonById = async (seasonId: string): Promise<ISeason | undefined> => {
    const seasons = await fetchSeasons()
    return seasons.find(season => season.id === Number(seasonId))
}
export const fetchTeams = async (season?: ISeason): Promise<ITeam[]> => {
  const seasonEnd: string = season?.standingsEnd || "now";
  const response = await nhlApi.get(`standings/${seasonEnd}`);
  return response.data.standings || [];
};


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

export const fetchStats = async (season?: ISeason): Promise<IStats> =>{
    const seasonId: number | string = season?.id || "current";
    const response = await nhlApi.get(`stats/${seasonId}`)
    return response.data
}
