import { useEffect, useState } from "react";
import type { ITeam } from "../types/team";
import { fetchTeams } from "../services/nhlApi";
import TeamCard from "../components/features/TeamCard";

export default function Teams() {
    const [teams, setTeams] = useState<ITeam[]>([])
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    document.title = 'NHL | Teams'
    useEffect(() => {
        const loadTeams = async () =>{
          try{
            const data: ITeam[] = await fetchTeams()
            setTeams(data)
          }
          catch(err){
            setError('Ошибка загрузки команд')
            console.error(err)
          }
          finally{
            setLoading(false)
          }
        }
        loadTeams()
    }, [])
    if (loading){
      return (
        <section className="teams container">
          <div className="teams__loader loader">
            <h1 className="teams__title">Teams</h1>
            <p>Loading...</p>
          </div>
        </section>
      )
    }
  return (
    <section className="teams container">
        <h1 className="teams__title">Teams</h1>
        <ul className="teams__card">
          {teams
          .sort((a, b) => a.teamName.default.localeCompare(b.teamName.default))
          .map((team) => (
            <TeamCard key={team.teamAbbrev.default} team={team} />
          ))}
        </ul>
    </section>
  );
}
