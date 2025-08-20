import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlayerById } from "../services/nhlApi";
import type { IGoalie, IPlayer, ISkater } from "../types/player";

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
                <div className="player__details-list">
                    <div className="player__details-item">
                        <span className="player__detail-label">Grip: </span>
                        <span className="player__detail-value">{player.shootsCatches === 'L' ? 'Left' : 'Right'}</span>
                    </div>
                    <div className="player__details-item">
                        <span className="player__detail-label">Height: </span>
                        <span className="player__detail-value">{player.heightInCentimeters} cm</span>
                    </div>
                    <div className="player__details-item">
                        <span className="player__detail-label">Weight: </span>
                        <span className="player__detail-value">{player.weightInKilograms} kg</span>
                    </div>
                    <div className="player__details-item">
                        <span className="player__detail-label">Birthdate: </span>
                        <span className="player__detail-value">{player.birthDate}</span>
                    </div>
                    <div className="player__details-item">
                        <span className="player__detail-label">Country: </span>
                        <span className="player__detail-value">{player.birthCountry}</span>
                    </div>
                </div>
            </div>

            <div className="player__stats">
                <h2 className="player__stats-title">Regular Season</h2>
                <div className="player__stats-grid">
                    <div className="player__stat-card">
                        <span className="player__stat-label">Games</span>
                        <span className="player__stat-value">{player.featuredStats.regularSeason.subSeason.gamesPlayed || 0}</span>
                    </div>
                {player.position !== 'G' && (
                <>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Goals</span>
                        <span className="player__stat-value">{(player as ISkater).featuredStats.regularSeason.subSeason.goals || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Assists</span>
                        <span className="player__stat-value">{(player as ISkater).featuredStats.regularSeason.subSeason.assists || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Points</span>
                        <span className="player__stat-value">{(player as ISkater).featuredStats.regularSeason.subSeason.points || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">+/-</span>
                        <span className="player__stat-value">{(player as ISkater).featuredStats.regularSeason.subSeason.plusMinus || 0}</span>
                    </div>
                </>
                )}
                {player.position === 'G' && (
                <>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Save %</span>
                        <span className="player__stat-value">
                            {((player as IGoalie).featuredStats.regularSeason.subSeason.savePctg * 100).toFixed(2) || 0}</span>
                            </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Shutouts</span>
                        <span className="player__stat-value">{(player as IGoalie).featuredStats.regularSeason.subSeason.shutouts || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">GAA</span>
                        <span className="player__stat-value">{((player as IGoalie).featuredStats.regularSeason.subSeason.goalsAgainstAvg).toFixed(2) || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Wins</span>
                        <span className="player__stat-value">{(player as IGoalie).featuredStats.regularSeason.subSeason.wins || 0}</span>
                    </div>
                </>
                )}
                </div>
                {player.featuredStats.playoffs && (
                <>
                    <h2 className="player__stats-title">Playoffs</h2>
                    <div className="player__stats-grid">
                        <div className="player__stat-card">
                            <span className="player__stat-label">Games</span>
                            <span className="player__stat-value">{player.featuredStats.playoffs.subSeason.gamesPlayed || 0}</span>
                        </div>
                    {player.position !== 'G' && (
                    <>
                        <div className="player__stat-card">
                            <span className="player__stat-label">Goals</span>
                            <span className="player__stat-value">{(player as ISkater).featuredStats.playoffs.subSeason.goals || 0}</span>
                        </div>
                        <div className="player__stat-card">
                            <span className="player__stat-label">Assists</span>
                            <span className="player__stat-value">{(player as ISkater).featuredStats.playoffs.subSeason.assists || 0}</span>
                        </div>
                        <div className="player__stat-card">
                            <span className="player__stat-label">Points</span>
                            <span className="player__stat-value">{(player as ISkater).featuredStats.playoffs.subSeason.points || 0}</span>
                        </div>
                        <div className="player__stat-card">
                            <span className="player__stat-label">+/-</span>
                            <span className="player__stat-value">{(player as ISkater).featuredStats.playoffs.subSeason.plusMinus || 0}</span>
                        </div>
                    </>
                    )}
                    {player.position === 'G' && (
                    <>
                        <div className="player__stat-card">
                            <span className="player__stat-label">Save %</span>
                            <span className="player__stat-value">
                                {((player as IGoalie).featuredStats.playoffs.subSeason.savePctg * 100).toFixed(2) || 0}</span>
                                </div>
                        <div className="player__stat-card">
                            <span className="player__stat-label">Shutouts</span>
                            <span className="player__stat-value">{(player as IGoalie).featuredStats.playoffs.subSeason.shutouts || 0}</span>
                        </div>
                        <div className="player__stat-card">
                            <span className="player__stat-label">GAA</span>
                            <span className="player__stat-value">{((player as IGoalie).featuredStats.playoffs.subSeason.goalsAgainstAvg).toFixed(2) || 0}</span>
                        </div>
                        <div className="player__stat-card">
                            <span className="player__stat-label">Wins</span>
                            <span className="player__stat-value">{(player as IGoalie).featuredStats.playoffs.subSeason.wins || 0}</span>
                        </div>
                    </>
                    )}
                    </div>
                </>)}
                <h2 className="player__stats-title">Career</h2>
                <div className="player__stats-grid">
                    <div className="player__stat-card">
                        <span className="player__stat-label">Games</span>
                        <span className="player__stat-value">{player.featuredStats.regularSeason.career.gamesPlayed || 0}</span>
                    </div>
                {player.position !== 'G' && (
                <>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Goals</span>
                        <span className="player__stat-value">{(player as ISkater).featuredStats.regularSeason.career.goals || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Assists</span>
                        <span className="player__stat-value">{(player as ISkater).featuredStats.regularSeason.career.assists || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Points</span>
                        <span className="player__stat-value">{(player as ISkater).featuredStats.regularSeason.career.points || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">+/-</span>
                        <span className="player__stat-value">{(player as ISkater).featuredStats.regularSeason.career.plusMinus || 0}</span>
                    </div>
                </>
                )}
                {player.position === 'G' && (
                <>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Save %</span>
                        <span className="player__stat-value">
                            {((player as IGoalie).featuredStats.regularSeason.career.savePctg * 100).toFixed(2) || 0}</span>
                            </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Shutouts</span>
                        <span className="player__stat-value">{(player as IGoalie).featuredStats.regularSeason.career.shutouts || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">GAA</span>
                        <span className="player__stat-value">{((player as IGoalie).featuredStats.regularSeason.career.goalsAgainstAvg).toFixed(2) || 0}</span>
                    </div>
                    <div className="player__stat-card">
                        <span className="player__stat-label">Wins</span>
                        <span className="player__stat-value">{(player as IGoalie).featuredStats.regularSeason.career.wins || 0}</span>
                    </div>
                </>
                )}
                </div>


            </div>
        </section>
    );
}
