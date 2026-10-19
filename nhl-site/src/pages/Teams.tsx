import { useEffect, useState } from "react";
import type { ITeam } from "../types/team";
import { fetchTeams } from "../services/nhlApi";
import TeamCard from "../components/features/TeamCard";
import Loader from "../components/layout/loader/Loader";

export default function Teams() {
    const [teams, setTeams] = useState<ITeam[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    document.title = 'NHL | Teams'
    useEffect(() => {
        const loadTeams = async () =>{
          try{
            const data: ITeam[] = await fetchTeams()
            setTeams(data)
          }
          catch(err){
            setError('Error loading teams')
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
          <Loader />
        </section>
      )
    }
    if (error) return <div className="error-message container">{error}</div>
  return (
    <section className="teams container">
        <h1 className="teams__title">Teams</h1>
        {(["Eastern", "Western"] as const).map((conference) => (
          <div key={conference}>
            <h2 className="teams__section-title">{conference}</h2>
            <ul className="teams__card">
              {teams
              .filter((team) => team.conferenceName === conference)
              .sort((a, b) => a.teamName.default.localeCompare(b.teamName.default))
              .map((team) => (
                <TeamCard key={team.teamAbbrev.default} team={team} />
              ))}
            </ul>
          </div>
        ))}
    </section>
  );
}
