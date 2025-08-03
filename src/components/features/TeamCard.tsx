import type { Team } from "../../types/team";

interface TeamCardProps {
    team: Team
}

export default function TeamCard({team}: TeamCardProps){
    return (
        <div>
            <h2>{team.fullName}</h2>
            <p>{team.teamCommonName}</p>
            <p>{team.teamPlaceName}</p>
        </div>
    )
}
