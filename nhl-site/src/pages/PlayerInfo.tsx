import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlayerById, fetchTeams } from "../services/nhlApi";
import Loader from "../components/layout/loader/Loader";
import type { IDraftDetails, IPlayer, ISeasonTotal } from "../types/player";
import type { ITeam } from "../types/team";

interface INhlTeamTotal {
    name: string;
    gamesPlayed: number;
}

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

interface IStatBlock {
    hero: IStatItem;
    secondary: IStatItem[];
    rest: IStatItem[];
}

const formatSeason = (season: number): string => {
    const text = String(season);
    return text.length === 8 ? `${text.slice(0, 4)}-${text.slice(6)}` : text;
};

const formatDecimal = (value?: number): string =>
    value === undefined || Number.isNaN(value) ? '—' : value.toFixed(2);

const formatPct = (value?: number): string =>
    value === undefined || Number.isNaN(value) ? '—' : (value * 100).toFixed(1);

const formatPlusMinus = (value?: number): string =>
    value !== undefined && value > 0 ? `+${value}` : String(value ?? 0);

const buildStatBlock = (line: IStatLine, isGoalie: boolean): IStatBlock => {
    if (isGoalie) {
        return {
            hero: { label: 'SV%', value: formatPct(line.savePctg) },
            secondary: [
                { label: 'W', value: line.wins ?? 0 },
                { label: 'GAA', value: formatDecimal(line.goalsAgainstAvg) },
            ],
            rest: [
                { label: 'GP', value: line.gamesPlayed ?? 0 },
                { label: 'L', value: line.losses ?? 0 },
                { label: 'OT', value: line.otLosses ?? 0 },
                { label: 'SO', value: line.shutouts ?? 0 },
            ],
        };
    }

    return {
        hero: { label: 'P', value: line.points ?? 0 },
        secondary: [
            { label: 'G', value: line.goals ?? 0 },
            { label: 'A', value: line.assists ?? 0 },
        ],
        rest: [
            { label: 'GP', value: line.gamesPlayed ?? 0 },
            { label: '+/-', value: formatPlusMinus(line.plusMinus) },
        ],
    };
};

function StatsGroup({ title, block }: { title: string; block: IStatBlock | null }) {
    if (!block) {
        return null;
    }

    return (
        <div className="player__stat-group">
            <h2 className="player__stats-title">{title}</h2>

            <div className="player__stat-body">
                <div className="player__hero">
                    <span className="player__hero-label">{block.hero.label}</span>
                    <span className="player__hero-value">{block.hero.value}</span>
                </div>

                <div className="player__hero-secondary">
                    {block.secondary.map((item) => (
                        <div className="player__secondary" key={item.label}>
                            <span className="player__secondary-label">{item.label}</span>
                            <span className="player__secondary-value">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="player__stat-rest">
                {block.rest.map((item) => (
                    <span className="player__stat-rest-item" key={item.label}>
                        <span className="player__stat-rest-label">{item.label}</span>
                        <span className="player__stat-rest-value">{item.value}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

const getNhlTeamTotals = (seasons: ISeasonTotal[]): INhlTeamTotal[] => {
    const totals = new Map<string, number>();

    for (const season of seasons) {
        if (season.leagueAbbrev !== 'NHL' || !season.teamName) continue;
        const name = season.teamName.default;
        totals.set(name, (totals.get(name) ?? 0) + (season.gamesPlayed ?? 0));
    }

    return [...totals.entries()]
        .map(([name, gamesPlayed]) => ({ name, gamesPlayed }))
        .sort((a, b) => b.gamesPlayed - a.gamesPlayed || a.name.localeCompare(b.name))
        .slice(0, 3);
};

function TeamsPanel({
    teams,
    logos,
    draft,
}: {
    teams: INhlTeamTotal[];
    logos: Map<string, ITeam>;
    draft?: IDraftDetails;
}) {
    if (teams.length === 0 && !draft) {
        return null;
    }

    return (
        <div className="player__teams">
            {teams.length > 0 && (
                <>
                    <h2 className="player__teams-title">NHL teams</h2>
                    <ul className="player__teams-list">
                        {teams.map((team) => {
                            const info = logos.get(team.name);
                            return (
                                <li className="player__teams-item" key={team.name}>
                                    {info ? (
                                        <img
                                            className="player__teams-logo"
                                            src={info.teamLogo}
                                            alt={info.teamAbbrev.default}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className="player__teams-logo" aria-hidden="true" />
                                    )}
                                    <span className="player__teams-abbrev">
                                        {info?.teamAbbrev.default ?? team.name}
                                    </span>
                                    <span className="player__teams-name">
                                        {info ? team.name : ''}
                                    </span>
                                    <span className="player__teams-gp">
                                        <strong>{team.gamesPlayed}</strong> GP
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}

            {draft && (
                <p className="player__draft">
                    <span className="player__draft-label">Draft</span>
                    {draft.year} · {draft.teamAbbrev} · Round {draft.round} · #{draft.overallPick} overall
                </p>
            )}
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
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadTeams = async () => {
            try {
                setTeams(await fetchTeams());
            } catch (err) {
                console.error(err);
            }
        }

        loadTeams();
    }, []);

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

    const regularBlock = regularSeason?.subSeason
        ? buildStatBlock(regularSeason.subSeason, isGoalie)
        : null;
    const playoffBlock = playoffs?.subSeason
        ? buildStatBlock(playoffs.subSeason, isGoalie)
        : null;
    const careerBlock = regularSeason?.career
        ? buildStatBlock(regularSeason.career, isGoalie)
        : null;

    const hasStats = Boolean(regularBlock || playoffBlock || careerBlock);

    const topTeams = getNhlTeamTotals(player.seasonTotals ?? []);
    const teamLogos = new Map(teams.map((team) => [team.teamName.default, team]));

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

                    <TeamsPanel teams={topTeams} logos={teamLogos} draft={player.draftDetails} />
                </div>

                {hasStats && (
                    <div className="player__stats">
                        <StatsGroup title="Regular season" block={regularBlock} />
                        <StatsGroup title="Playoffs" block={playoffBlock} />
                        <StatsGroup title="Career" block={careerBlock} />
                    </div>
                )}
            </div>

            <SeasonTable seasons={player.seasonTotals ?? []} isGoalie={isGoalie} />
        </section>
    );
}
