import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlayerById } from "../services/nhlApi";
import type { IPlayer } from "../types/player";

export default function PlayerInfo() {
    const { playerId } = useParams<{ playerId: string }>()
    const [player, setPlayer] = useState<IPlayer>()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    document.title = 'NHL | Информация о игроке'

    useEffect(() => {
        const loadPlayer = async () => {
            try {
                setLoading(true);
                if (!playerId) return;
                const data: IPlayer = await fetchPlayerById(playerId);
                setPlayer(data);
            } catch(err){
                setError('Не удалось загрузить информацию о игроке');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadPlayer();
    }, [playerId])

    if (loading){
      return (
        <section className="player container">
          <div className="player__loader loader">
            <p>Загрузка состава команды...</p>
          </div>
        </section>
      )
    }
  if (error) return <div className="error-message">{error}</div>;
  if (!player) return <div className="error-message">Игрок не найден</div>;

    return (
        <section className="player container">
            <div className="player__header">
                <div className="player__avatar-container">
                    <img
                        src={player.headshot}
                        alt={`${player.firstName.default} ${player.lastName.default}`}
                        className="player__avatar"
                    />
                </div>

                <div className="player__info">
                    <h1 className="player__name">
                        {player.firstName.default} <strong>{player.lastName.default}</strong>
                    </h1>

                    <div className="player__meta">
                        <span className="player__jersey">#{player.sweaterNumber}</span>
                        <span className="player__position">{player.positionCode}</span>
                        <span className="player__team">
                            <img
                                src={player.teamLogo}
                                alt={player.fullTeamName.default}
                                className="player__team-logo"
                            />
                            {player.currentTeamAbbrev}
                        </span>
                    </div>
                </div>
            </div>

            <div className="player__stats">
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">Игры</span>
                        <span className="stat-value">{player.featuredStats.regularSeason.subSeason.gamesPlayed || 0}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Голы</span>
                        <span className="stat-value">{player.featuredStats.regularSeason.subSeason.goals || 0}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Передачи</span>
                        <span className="stat-value">{player.featuredStats.regularSeason.subSeason.assists || 0}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Очки</span>
                        <span className="stat-value">{player.featuredStats.regularSeason.subSeason.points || 0}</span>
                    </div>
                    {player.positionCode !== 'G' && (
                        <>
                            <div className="stat-card">
                                <span className="stat-label">+/-</span>
                                <span className="stat-value">{player.featuredStats.regularSeason.subSeason.plusMinus || 0}</span>
                            </div>
                        </>
                    )}
                    {player.positionCode === 'G' && (
                        <>
                            <div className="stat-card">
                                <span className="stat-label">% сейвов</span>
                                <span className="stat-value">
                                    {/* {player.savePercentage ? player.savePercentage.toFixed(2) : '0.00'} */}
                                </span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Сухие игры</span>
                                {/* <span className="stat-value">{player.shutouts || 0}</span> */}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
