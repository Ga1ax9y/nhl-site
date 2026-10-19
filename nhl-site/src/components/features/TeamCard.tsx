import { Link } from "react-router-dom"
import type { ITeam } from "../../types/team"

interface TeamCardProps {
    team: ITeam
}

export default function TeamCard({team}: TeamCardProps){
    return (
        <Link to={`/roster/${team.teamAbbrev.default}` } className="teams__card-link">
            <li className="teams__card-item">
                <img className="teams__card-logo" src={team.teamLogo} alt={team.teamName.default+ ' logo'} ></img>
                <h2 className="teams__card-title">{team.teamName.default}</h2>
            </li>
        </Link>
    )
}
