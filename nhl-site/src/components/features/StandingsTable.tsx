import { Fragment } from "react/jsx-runtime";
import type { ITeam } from "../../types/team";
import StandingsCell from "./StandingsCell";

interface StandingsTableProps {
  title: string;
  teams: ITeam[];
  showLineAfter?: number;
}

export default function StandingsTable({ title, teams, showLineAfter }: StandingsTableProps) {
  return (
    <>
      <h3 className="standings__title">{title}</h3>
      <table className="standings__table">
        <thead>
          <tr className="table-header">
            <th className="table-header__item"></th>
            <th className="table-header__item">Team</th>
            <th className="table-header__item" data-short="G">
              <span className="long-text">Games</span>
            </th>
            <th className="table-header__item" data-short="W">
              <span className="long-text">Wins</span>
            </th>
            <th className="table-header__item" data-short="L">
              <span className="long-text">Losses</span>
            </th>
            <th className="table-header__item" data-short="P">
              <span className="long-text">Points</span>
            </th>
          </tr>
        </thead>
        <tbody>
        {teams.map((team, index) => (
            <Fragment key={team.teamName.default}>
            <StandingsCell team={team} />
            {showLineAfter !== undefined && showLineAfter === index && (
                <tr className="playoff-cutline">
                <td colSpan={6}>
                    <div className="playoff-cutline__line"></div>
                </td>
                </tr>
            )}
            </Fragment>
        ))}
        </tbody>
      </table>
    </>
  );
}
