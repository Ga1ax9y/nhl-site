import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlayerById } from "../services/nhlApi";
import type { IPlayer } from "../types/player";

export default function PlayerInfo() {
    const { playerId } = useParams<{ playerId: string }>()
    const [player, setPlayer] = useState<IPlayer>()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    document.title = 'NHL | Information about player'

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
            <p>Loading...</p>
          </div>
        </section>
      )
    }
  if (error) return <div className="error-message">{error}</div>;
  if (!player) return <div className="error-message">Player not found</div>;

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
            <div className="player__details">
                <div className="player__details-grid">
                    <div className="player__detail-card">
                        <span className="player__detail-label">Хват</span>
                        <span className="player__detail-value">{player.shootsCatches === 'L' ? 'Левый' : 'Правый'}</span>
                    </div>
                    <div className="player__detail-card">
                        <span className="player__detail-label">Рост</span>
                        <span className="player__detail-value">{player.heightInCentimeters}</span>
                    </div>
                    <div className="player__detail-card">
                        <span className="player__detail-label">Вес</span>
                        <span className="player__detail-value">{player.weightInKilograms}</span>
                    </div>
                    <div className="player__detail-card">
                        <span className="player__detail-label">Дата рождения</span>
                        <span className="player__detail-value">{player.birthDate}</span>
                    </div>
                    <div className="player__detail-card">
                        <span className="player__detail-label">Страна</span>
                        <span className="player__detail-value">{player.birthCountry}</span>
                    </div>
                </div>
            </div>

            <div className="player__stats">
                <div className="player__stats-grid">
                    <div className="player__stat-card">
                        <span className="player__stat-label">Игры</span>
                        <span className="player__stat-value">{player.featuredStats.regularSeason.subSeason.gamesPlayed || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Голы</span>
                        <span className="player__stat-value">{player.featuredStats.regularSeason.subSeason.goals || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Передачи</span>
                        <span className="player__stat-value">{player.featuredStats.regularSeason.subSeason.assists || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Очки</span>
                        <span className="player__stat-value">{player.featuredStats.regularSeason.subSeason.points || 0}</span>
                    </div>
                    {player.positionCode !== 'G' && (
                        <>
                            <div className="player__stat-card">
                                <span className="player__stat-label">+/-</span>
                                <span className="player__stat-value">{player.featuredStats.regularSeason.subSeason.plusMinus || 0}</span>
                            </div>
                        </>
                    )}
                    {player.positionCode === 'G' && (
                        <>
                            <div className="player__stat-card">
                                <span className="player__stat-label">% сейвов</span>
                                <span className="player__stat-value">
                                    {/* {player.savePercentage ? player.savePercentage.toFixed(2) : '0.00'} */}
                                </span>
                            </div>
                            <div className="player__stat-card">
                                <span className="player__stat-label">Сухие игры</span>
                                {/* <span className="stat-value">{player.shutouts || 0}</span> */}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
