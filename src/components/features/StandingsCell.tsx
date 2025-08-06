import type { IStandings } from "../../types/standings"

interface StandingsCellProps {
    position: IStandings
}

export default function StandingsCell({position}: StandingsCellProps){
    return (
        <tr className="standings__row">
            <img className="standings__row__cell-logo" src="nhl-logo.png" height="40" width="40" ></img>
            <td className="standings__row-cell">
                <h2 className="standings__row-cell__title">{position.teamName.default}</h2>
            </td>
            <td className="standings__row-cell">
                <p className="standings__row-cell__stat">{position.gamesPlayed}</p>
            </td>
            <td className="standings__row-cell">
                <p className="standings__row-cell__stat standings__row-cell__stat--wins">{position.wins}</p>
            </td>
            <td className="standings__row-cell">
                <p className="standings__row-cell__stat standings__row-cell__stat--losses">{position.losses}</p>
            </td>
            <td className="standings__row-cell">
                <p className="standings__row-cell__stat standings__row-cell__stat--points">{position.points}</p>
            </td>
        </tr>
    )
}
