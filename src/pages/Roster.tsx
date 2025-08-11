import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IPlayer } from "../types/player";
import { fetchRoster } from "../services/nhlApi";

export default function Roster() {
  const { teamAbbrev } = useParams<{ teamAbbrev: string }>();
  const [roster, setRoster] = useState<IPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRoster = async () => {
      try {
        setLoading(true);
        if (!teamAbbrev) return;
        const data: IPlayer[] = await fetchRoster(teamAbbrev);
        setRoster(data);
      } catch (err) {
        setError('Не удалось загрузить состав команды');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRoster();
  }, [teamAbbrev]);

    if (loading){
      return (
        <section className="teams container">
          <div className="teams__loader loader">
            <h1 className="teams__title">Состав команды {teamAbbrev}</h1>
            <p>Загрузка состава команды...</p>
          </div>
        </section>
      )
    }
  if (error) return <div>{error}</div>;

  return (
    <div className="roster-container">
      <h2>Состав команды: {teamAbbrev}</h2>
      <div className="players-grid">
        {roster.map(player => (
          <div key={player.id} className="player-card">
            <div className="player-number">{player.sweaterNumber}</div>
            <div className="player-info">
              <div className="player-name">
                {player.firstName.default} {player.lastName.default}
              </div>
              <div className="player-position">{player.positionCode}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
