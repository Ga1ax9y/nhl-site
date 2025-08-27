import { useNavigate } from 'react-router-dom';
import type { IPlayer } from '../../types/player';


interface StatsTableProps {
  players: IPlayer[];
  category: string;
  categoryLabel: string;
  getStatValue: (player: IPlayer) => number;
  showDecimal?: boolean;
  type: 'skater' | 'goalie';
}

export default function StatsTable({
  players,
  category,
  categoryLabel,
  getStatValue,
  showDecimal = false,
  type
}: StatsTableProps) {
  const navigate = useNavigate();

  const handlePlayerClick = (playerId: number) => {
    navigate(`/player/${playerId}`);
  };

  const getPlayerName = (player: IPlayer) => {
    return `${player.firstName.default} ${player.lastName.default}`;
  };

  return (
    <div className="stats__content">
      <div className="stats__table-container">
        <table className="stats__table">
          <thead>
            <tr className="stats__header">
              <th className="stats__header-cell">#</th>
              <th className="stats__header-cell">{type === 'skater' ? 'Skater' : 'Goalie'}</th>
              <th className="stats__header-cell">Team</th>
              <th className="stats__header-cell">{categoryLabel}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr
                key={`${category}-${player.id}-${index}`}
                className="stats__row"
                onClick={() => handlePlayerClick(player.id)}
              >
                <td className="stats__cell stats__cell--rank">{index + 1}</td>
                <td className="stats__cell stats__cell--player">
                  <div className="stats__player-info">
                    <img
                      src={player.headshot}
                      alt={getPlayerName(player)}
                      className="stats__player-logo"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-player.png';
                      }}
                    />
                    <h2 className="stats__player-title">
                      {getPlayerName(player)}
                    </h2>
                  </div>
                </td>
                <td className="stats__cell stats__cell--team">
                  <div className="stats__team-info">
                    <img
                      src={player.teamLogo}
                      alt="team logo"
                      className="stats__team-logo"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-team.png';
                      }}
                    />
                    <span className="stats__team-name">{player.currentTeamAbbrev}</span>
                  </div>
                </td>
                <td className="stats__cell stats__cell--stat">
                  <p className="stats__stat-value stats__stat-value--points">
                    {showDecimal ? getStatValue(player).toFixed(2) : getStatValue(player)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
