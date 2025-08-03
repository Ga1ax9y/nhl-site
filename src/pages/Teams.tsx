import { useEffect, useState } from "react";
import type { Team } from "../types/team";
import { fetchTeams } from "../services/nhlApi";
import TeamCard from "../components/features/TeamCard";

export default function Teams() {
    const [teams, setTeams] = useState<Team[]>([])
    useEffect(() => {
        const loadTeams = async () =>{
            const data = await fetchTeams()
            setTeams(data)
        }

        loadTeams()
    }, [])
  return (
    <div>
      <h1>Команды NHL</h1>
      <div>
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
