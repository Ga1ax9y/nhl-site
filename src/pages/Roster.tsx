import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { IPlayer } from "../types/player";
import { fetchRoster } from "../services/nhlApi";
import PlayerCard from "../components/features/PlayerCard";

export default function Roster() {
  const { teamAbbrev } = useParams<{ teamAbbrev: string }>();
  const [roster, setRoster] = useState<IPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  document.title = `NHL | Состав команды ${teamAbbrev}`

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
        <section className="roster container">
          <div className="teams__loader loader">
            <h1 className="teams__title">Состав команды: {teamAbbrev}</h1>
            <p>Загрузка состава команды...</p>
          </div>
        </section>
      )
    }
  if (error) return <div>{error}</div>;

  return (
    <div className="roster container">
      <h2 className="roster__title">Состав команды: {teamAbbrev}</h2>
      <ul className="roster__list">
        {roster.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </ul>
    </div>
  );
}
