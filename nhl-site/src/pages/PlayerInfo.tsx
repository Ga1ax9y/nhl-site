import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlayerById } from "../services/nhlApi";
import Loader from "../components/layout/loader/Loader";
import type { IPlayer, ISeasonTotal } from "../types/player";

interface IStatLine {
    gamesPlayed?: number;
    goals?: number;
    assists?: number;
    points?: number;
    plusMinus?: number;
    wins?: number;
    losses?: number;
    otLosses?: number;
    goalsAgainstAvg?: number;
    savePctg?: number;
    shutouts?: number;
}

interface IStatItem {
    label: string;
    value: string | number;
}

const formatSeason = (season: number): string => {
    const text = String(season);
    return text.length === 8 ? `${text.slice(0, 4)}-${text.slice(6)}` : text;
};

const formatDecimal = (value?: number): string =>
    value === undefined || Number.isNaN(value) ? '—' : value.toFixed(2);

const formatPct = (value?: number): string =>
    value === undefined || Number.isNaN(value) ? '—' : (value * 100).toFixed(1);

const buildStatItems = (line: IStatLine, isGoalie: boolean): IStatItem[] => {
    if (isGoalie) {
        return [
            { label: 'GP', value: line.gamesPlayed ?? 0 },
            { label: 'W', value: line.wins ?? 0 },
            { label: 'L', value: line.losses ?? 0 },
            { label: 'OT', value: line.otLosses ?? 0 },
            { label: 'GAA', value: formatDecimal(line.goalsAgainstAvg) },
            { label: 'SV%', value: formatPct(line.savePctg) },
            { label: 'SO', value: line.shutouts ?? 0 },
        ];
    }

    return [
        { label: 'GP', value: line.gamesPlayed ?? 0 },
        { label: 'G', value: line.goals ?? 0 },
        { label: 'A', value: line.assists ?? 0 },
        { label: 'P', value: line.points ?? 0 },
        { label: '+/-', value: line.plusMinus ?? 0 },
    ];
};

function StatsGroup({ title, items }: { title: string; items: IStatItem[] }) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="player__stats-group">
            <h2 className="player__stats-title">{title}</h2>
            <div className="player__stats-grid">
                {items.map((item) => (
                    <div className="player__stat-card" key={item.label}>
                        <span className="player__stat-label">{item.label}</span>
                        <span className="player__stat-value">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SeasonTable({ seasons, isGoalie }: { seasons: ISeasonTotal[]; isGoalie: boolean }) {
    if (seasons.length === 0) {
        return null;
    }

    const sorted = [...seasons].sort(
        (a, b) => b.season - a.season || a.gameTypeId - b.gameTypeId
    );

    return (
        <div className="player__seasons">
            <h2 className="player__seasons-title">Season totals</h2>
            <div className="player__seasons-scroll">
                <table className="player__season-table">
                    <thead>
                        <tr>
                            <th>Season</th>
                            <th>Team</th>
                            <th>League</th>
                            <th>GP</th>
                            {isGoalie ? (
                                <>
                                    <th>W</th>
                                    <th>L</th>
                                    <th>OT</th>
                                    <th>SV%</th>
                                    <th>GAA</th>
                                    <th>SO</th>
                                </>
                            ) : (
                                <>
                                    <th>G</th>
                                    <th>A</th>
                                    <th>P</th>
                                    <th>+/-</th>
                                    <th>PIM</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((season, index) => (
                            <tr key={`${season.season}-${season.gameTypeId}-${season.teamName?.default}-${index}`}>
                                <td className="player__season-cell--season">
                                    {formatSeason(season.season)}
                                    {season.gameTypeId === 3 && (
                                        <span className="player__season-tag">PO</span>
                                    )}
                                </td>
                                <td className="player__season-cell--team">
                                    {season.teamName?.default ?? '—'}
                                </td>
                                <td>{season.leagueAbbrev}</td>
                                <td>{season.gamesPlayed ?? 0}</td>
                                {isGoalie ? (
                                    <>
                                        <td>{season.wins ?? '—'}</td>
                                        <td>{season.losses ?? '—'}</td>
                                        <td>{season.otLosses ?? '—'}</td>
                                        <td>{formatPct(season.savePctg)}</td>
                                        <td>{formatDecimal(season.goalsAgainstAvg)}</td>
                                        <td>{season.shutouts ?? '—'}</td>
                                    </>
                                ) : (
                                    <>
                                        <td>{season.goals ?? 0}</td>
                                        <td>{season.assists ?? 0}</td>
                                        <td>{season.points ?? 0}</td>
                                        <td>{season.plusMinus ?? 0}</td>
                                        <td>{season.pim ?? 0}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function PlayerInfo() {
    const { playerId } = useParams<{ playerId: string }>()
    const [player, setPlayer] = useState<IPlayer>()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
          <Loader />
        </section>
      )
    }
    if (error) return <div className="error-message">{error}</div>;
    if (!player) return <div className="error-message">Player not found</div>;

    document.title = `NHL | ${player.firstName.default} ${player.lastName.default}`;

    const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);

    if (isNaN(birth.getTime())) {
        throw new Error('Invalid date string');
    }

    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
    };

    const isGoalie = player.position === 'G';
    const featured = player.featuredStats;
    const regularSeason = featured?.regularSeason;
    const playoffs = featured?.playoffs;

    const regularItems = regularSeason?.subSeason
        ? buildStatItems(regularSeason.subSeason, isGoalie)
        : [];
    const playoffItems = playoffs?.subSeason
        ? buildStatItems(playoffs.subSeason, isGoalie)
        : [];
    const careerItems = regularSeason?.career
        ? buildStatItems(regularSeason.career, isGoalie)
        : [];

    const hasStats = regularItems.length + playoffItems.length + careerItems.length > 0;

    return (
        <section className="player container">
            <div className="player__layout">
                <div className="player__profile">
                    <div className="player__avatar-container">
                        <img
                            src={player.headshot}
                            alt={`${player.firstName.default} ${player.lastName.default}`}
                            className="player__avatar"
                        />
                    </div>

                    <div className="player__identity">
                        <h1 className="player__name">
                            {player.firstName.default} <strong>{player.lastName.default}</strong>
                        </h1>

                        <div className="player__meta">
                            <span className="player__jersey">#{player.sweaterNumber}</span>
                            <span className="player__position">{player.positionCode}</span>
                            <span className="player__team">
                                <img
                                    src={player.isActive ? player.teamLogo : '/nhl-logo.png'}
                                    alt={player.isActive ? player.fullTeamName.default : 'inactive player'}
                                    className="player__team-logo"
                                />
                                {player.currentTeamAbbrev}
                            </span>
                        </div>
                    </div>

                    <div className="player__details">
                        <div className="player__details-list">
                            <div className="player__details-item">
                                <span className="player__detail-label">Grip</span>
                                <span className="player__detail-value">{player.shootsCatches === 'L' ? 'Left' : 'Right'}</span>
                            </div>
                            <div className="player__details-item">
                                <span className="player__detail-label">Height</span>
                                <span className="player__detail-value">{player.heightInCentimeters} cm</span>
                            </div>
                            <div className="player__details-item">
                                <span className="player__detail-label">Weight</span>
                                <span className="player__detail-value">{player.weightInKilograms} kg</span>
                            </div>
                            <div className="player__details-item">
                                <span className="player__detail-label">Born</span>
                                <span className="player__detail-value">{player.birthDate} (Age: {calculateAge(player.birthDate)})</span>
                            </div>
                            <div className="player__details-item">
                                <span className="player__detail-label">Country</span>
                                <span className="player__detail-value">{player.birthCountry}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {hasStats && (
                    <div className="player__stats">
                        <StatsGroup title="Regular season" items={regularItems} />
                        <StatsGroup title="Playoffs" items={playoffItems} />
                        <StatsGroup title="Career" items={careerItems} />
                    </div>
                )}
            </div>

            <SeasonTable seasons={player.seasonTotals ?? []} isGoalie={isGoalie} />
        </section>
    );
}
