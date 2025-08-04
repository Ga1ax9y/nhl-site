import type { Team } from "../../types/team";

interface TeamCardProps {
    team: Team
}

export default function TeamCard({team}: TeamCardProps){
    return (
        <li className="teams__card-item">
            <img className="teams__card-logo" src="nhl-logo.png" ></img>
            <h2 className="teams__card-title">{team.fullName}</h2>
        </li>
    )
}
