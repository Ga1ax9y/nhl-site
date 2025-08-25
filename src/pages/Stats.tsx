import { useEffect, useState } from "react";
import { fetchStats } from "../services/nhlApi";
import type { IPlayer, ISkater } from "../types/player";
import type { IStats } from "../types/stats";

type StatsCategory = 'points' | 'goals' | 'assists' | 'plusMinus';

export default function Stats() {
  const [stats, setStats] = useState<IStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<StatsCategory>('points');

  document.title = 'NHL | Stats';

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        setError('Error loading stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const getCurrentStats = (): IPlayer[] => {
    if (!stats) return [];
    switch (category) {
      case 'points': return stats.points;
      case 'goals': return stats.goals;
      case 'assists': return stats.assists;
      case 'plusMinus': return stats.plusMinus;
      default: return [];
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'points': return 'points';
      case 'goals': return 'goals';
      case 'assists': return 'assists';
      case 'plusMinus': return '+/-';
      default: return '';
    }
  };

  const getStatValue = (player: IPlayer) => {
    switch (category) {
      case 'points': return (player as ISkater).value || 0;
      case 'goals': return (player as ISkater).value || 0;
      case 'assists': return (player as ISkater).value || 0;
      case 'plusMinus': return (player as ISkater).value || 0;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <section className="stats container">
        <div className="stats__loader">
          <div className="loader-spinner"></div>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="stats container">
        <div className="stats__error">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="stats container">
        <div className="stats__error">
          <p>Stats not found</p>
        </div>
      </section>
    );
  }

  const currentStats = getCurrentStats();

  return (
    <section className="stats container">
      <h1 className="stats__title">Skater stats</h1>
        <div className="stats__controls controls">
            {["points", "goals", "assists", "plusMinus"].map(ctg => (
            <button
                key={ctg}
                className={`controls__button ${
                category === ctg ? "controls__button--active" : ""
                }`}
                onClick={() => setCategory(ctg as StatsCategory)}
                type="button"
            >
                {ctg === "plusMinus" ? "+/-" : ctg.charAt(0).toUpperCase() + ctg.slice(1)}
            </button>
            ))}
        </div>
        <div className="stats__content">
        <div className="stats__table-container">
            <table className="stats__table">
            <thead>
                <tr className="stats__header">
                <th className="stats__header-cell">#</th>
                <th className="stats__header-cell">Skater</th>
                <th className="stats__header-cell">Team</th>
                <th className="stats__header-cell">{getCategoryLabel()}</th>
                </tr>
            </thead>
            <tbody>
                {currentStats.map((player, index) => (
                <tr key={`${category}-${player.id}-${index}`} className="stats__row">
                    <td className="stats__cell stats__cell--rank">{index + 1}</td>
                    <td className="stats__cell stats__cell--player">
                    <div className="stats__player-info">
                        <img
                        src={player.headshot}
                        alt={`${player.firstName.default} ${player.lastName.default}`}
                        className="stats__player-logo"
                        />
                        <h2 className="stats__player-title">
                        {player.firstName.default} {player.lastName.default}
                        </h2>
                    </div>
                    </td>
                    <td className="stats__cell stats__cell--team">
                    <div className="stats__team-info">
                        <img
                        src={player.teamLogo}
                        alt="team logo"
                        className="stats__team-logo"
                        />
                        <span className="stats__team-name">{player.currentTeamAbbrev}</span>
                    </div>
                    </td>
                    <td className="stats__cell stats__cell--stat">
                    <p className="stats__stat-value stats__stat-value--points">
                        {getStatValue(player)}
                    </p>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </section>
  );
}
