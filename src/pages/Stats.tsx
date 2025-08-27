import { useEffect, useState } from "react";
import { fetchStats } from "../services/nhlApi";
import type { IGoalie, IPlayer, ISkater } from "../types/player";
import type { IStats } from "../types/stats";
import { useNavigate } from "react-router-dom";
import StatsControls from "../components/features/Controls";
import type { StatsCategory} from "../types/statsCategory";

export default function Stats() {
  const [stats, setStats] = useState<IStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skaterCategory, setSkaterCategory] = useState<StatsCategory>('points');
  const [goalieCategory, setGoalieCategory] = useState<StatsCategory>('savePctg');

  const navigate = useNavigate();

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

  const getCurrentStatsSkaters = (): IPlayer[] => {
    if (!stats) return [];
    switch (skaterCategory) {
      case 'points': return stats.points;
      case 'goals': return stats.goals;
      case 'assists': return stats.assists;
      case 'plusMinus': return stats.plusMinus;

      default: return [];
    }
  };

  const getCurrentStatsGoalies = (): IPlayer[] => {
    if (!stats) return [];
    switch (goalieCategory) {
      case 'savePctg': return stats.savePctg;
      case 'goalsAgainstAverage': return stats.goalsAgainstAverage;
      case 'shutouts': return stats.shutouts;
      case 'wins': return stats.wins;
      default: return [];
    }
  };

  const getSkaterCategoryLabel = () => {
    switch (skaterCategory) {
      case 'points': return 'points';
      case 'goals': return 'goals';
      case 'assists': return 'assists';
      case 'plusMinus': return '+/-';
    }
  };

  const getGoalieCategoryLabel = () => {
    switch (goalieCategory) {
      case 'savePctg': return 'SV %';
      case 'goalsAgainstAverage': return 'GAA';
      case 'shutouts': return 'shutouts';
      case 'wins': return 'wins';
      default: return '';
    }
  };

  const getStatValueSkater = (player: IPlayer) => {
    switch (skaterCategory) {
      case 'points': return (player as ISkater).value || 0;
      case 'goals': return (player as ISkater).value || 0;
      case 'assists': return (player as ISkater).value || 0;
      case 'plusMinus': return (player as ISkater).value || 0;
      default: return 0;
    }
  };

  const getStatValueGoalie = (player: IPlayer) => {
    switch (goalieCategory) {
      case 'savePctg': return (player as IGoalie).value * 100 || 0;
      case 'goalsAgainstAverage': return (player as IGoalie).value || 0;
      case 'shutouts': return (player as IGoalie).value || 0;
      case 'wins': return (player as IGoalie).value || 0;
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

  const currentStatsSkaters = getCurrentStatsSkaters();
  const currentStatsGoalies = getCurrentStatsGoalies();

  // TODO: move to separate component
  return (
    <section className="stats container">
      <h1 className="stats__title">Skater stats</h1>
        <StatsControls
          category={skaterCategory}
          setCategory={setSkaterCategory}
          type="skater"
        />
        <div className="stats__content">
        <div className="stats__table-container">
            <table className="stats__table">
            <thead>
                <tr className="stats__header">
                <th className="stats__header-cell">#</th>
                <th className="stats__header-cell">Skater</th>
                <th className="stats__header-cell">Team</th>
                <th className="stats__header-cell">{getSkaterCategoryLabel()}</th>
                </tr>
            </thead>
            <tbody>
                {currentStatsSkaters.map((player, index) => (
                <tr key={`${skaterCategory}-${player.id}-${index}`} className="stats__row" onClick={() => navigate(`/player/${player.id}`)}>
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
                        {getStatValueSkater(player)}
                    </p>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
        <h1 className="stats__title">Goalie stats</h1>
        <StatsControls
          category={goalieCategory}
          setCategory={setGoalieCategory}
          type="goalie"
        />
        <div className="stats__content">
        <div className="stats__table-container">
            <table className="stats__table">
            <thead>
                <tr className="stats__header">
                <th className="stats__header-cell">#</th>
                <th className="stats__header-cell">Goalie</th>
                <th className="stats__header-cell">Team</th>
                <th className="stats__header-cell">{getGoalieCategoryLabel()}</th>
                </tr>
            </thead>
            <tbody>
                {currentStatsGoalies.map((player, index) => (
                <tr key={`${goalieCategory}-${player.id}-${index}`} className="stats__row" onClick={() => navigate(`/player/${player.id}`)}>
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
                        { goalieCategory === "savePctg" || goalieCategory === "goalsAgainstAverage" ?
                        getStatValueGoalie(player).toFixed(2) :
                        getStatValueGoalie(player)}
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
