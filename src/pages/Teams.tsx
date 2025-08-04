import { useEffect, useState } from "react";
import type { Team } from "../types/team";
import { fetchTeams } from "../services/nhlApi";
import TeamCard from "../components/features/TeamCard";

export default function Teams() {
    const [teams, setTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    useEffect(() => {
        const loadTeams = async () =>{
          try{
            const data: Team[] = await fetchTeams()
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
        <div className="teams__loader loader">
          <p>Загрузка команд...</p>
        </div>
      )
    }
  return (
    <section className="teams container">
        <h1 className="teams__title">Команды NHL</h1>
        <ul className="teams__card">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </ul>
    </section>
  );
}
