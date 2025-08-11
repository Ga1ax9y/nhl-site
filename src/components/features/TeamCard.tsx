import type { ITeam } from "../../types/team"

interface TeamCardProps {
    team: ITeam
}

export default function TeamCard({team}: TeamCardProps){
    team.teamLogo.replace('light', 'dark')
    return (
        <li className="teams__card-item">
            <img className="teams__card-logo" src={team.teamLogo} ></img>
            <h2 className="teams__card-title">{team.teamName.default}</h2>
        </li>
    )
}
