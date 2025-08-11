import type { ITeam } from "../../types/team"

interface StandingsCellProps {
    team: ITeam
}

export default function StandingsCell({team}: StandingsCellProps){
    return (
        <tr className="standings__row">
            <td className="standings__row-cell">
                <img className="standings__row__cell-logo" src={team.teamLogo} height="60" width="60" ></img>
            </td>
            <td className="standings__row-cell">
                <h2 className="standings__row-cell__title">{team.teamName.default}</h2>
            </td>
            <td className="standings__row-cell">
                <p className="standings__row-cell__stat">{team.gamesPlayed}</p>
            </td>
            <td className="standings__row-cell">
                <p className="standings__row-cell__stat standings__row-cell__stat--wins">{team.wins}</p>
            </td>
            <td className="standings__row-cell">
                <p className="standings__row-cell__stat standings__row-cell__stat--losses">{team.losses}</p>
            </td>
            <td className="standings__row-cell">
                <p className="standings__row-cell__stat standings__row-cell__stat--points">{team.points}</p>
            </td>
        </tr>
    )
}
