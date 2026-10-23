import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPlayerById, fetchTeams } from "../services/nhlApi";
import Loader from "../components/layout/loader/Loader";
import type { ICareerLine, ILast5Game, IPlayer, ISeasonTotal } from "../types/player";
import type { ITeam } from "../types/team";

interface INhlTeamSpan {
    name: string;
    gamesPlayed: number;
    firstSeason: number;
    lastSeason: number;
}

interface IStatCell {
    label: string;
    value: string | number;
}

const formatSeason = (season: number): string => {
    const text = String(season);
    return text.length === 8 ? `${text.slice(0, 4)}-${text.slice(6)}` : text;
};

const formatSeasonSpan = (first: number, last: number): string =>
    first === last ? formatSeason(first) : `${formatSeason(first)}–${formatSeason(last)}`;

const formatDecimal = (value?: number): string =>
    value === undefined || Number.isNaN(value) ? '—' : value.toFixed(2);

const formatPct = (value?: number): string =>
    value === undefined || Number.isNaN(value) ? '—' : (value * 100).toFixed(1);

const formatPlusMinus = (value?: number): string =>
    value !== undefined && value > 0 ? `+${value}` : String(value ?? 0);

const formatGameDate = (date: string): string => {
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime())
        ? date
        : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
};

const buildSkaterCells = (line: ISeasonTotal | ICareerLine): IStatCell[] => [
    { label: 'GP', value: line.gamesPlayed ?? '—' },
    { label: 'G', value: line.goals ?? '—' },
    { label: 'A', value: line.assists ?? '—' },
    { label: 'P', value: line.points ?? '—' },
    { label: '+/-', value: formatPlusMinus(line.plusMinus) },
    { label: 'PIM', value: line.pim ?? '—' },
    { label: 'PPG', value: line.powerPlayGoals ?? '—' },
    { label: 'SOG', value: line.shots ?? '—' },
    { label: 'TOI', value: line.avgToi ?? '—' },
];

const buildGoalieCells = (line: ISeasonTotal | ICareerLine): IStatCell[] => [
    { label: 'GP', value: line.gamesPlayed ?? '—' },
    { label: 'W', value: line.wins ?? '—' },
    { label: 'L', value: line.losses ?? '—' },
    { label: 'OT', value: line.otLosses ?? '—' },
    { label: 'GAA', value: formatDecimal(line.goalsAgainstAvg) },
    { label: 'SV%', value: formatPct(line.savePctg) },
    { label: 'SO', value: line.shutouts ?? '—' },
    { label: 'SA', value: line.shotsAgainst ?? '—' },
    { label: 'TOI', value: line.timeOnIce ?? '—' },
];

const buildCareerRows = (line: ICareerLine, isGoalie: boolean): IStatCell[] =>
    isGoalie
        ? [
            ...buildGoalieCells(line),
            { label: 'G', value: line.goals ?? '—' },
            { label: 'A', value: line.assists ?? '—' },
            { label: 'PIM', value: line.pim ?? '—' },
        ]
        : [
            ...buildSkaterCells(line),
            { label: 'PPP', value: line.powerPlayPoints ?? '—' },
            { label: 'S%', value: formatPct(line.shootingPctg) },
        ];

const getNhlTeams = (seasons: ISeasonTotal[]): INhlTeamSpan[] => {
    const spans = new Map<string, INhlTeamSpan>();

    for (const season of seasons) {
        if (season.leagueAbbrev !== 'NHL' || !season.teamName) continue;
        const name = season.teamName.default;
        const existing = spans.get(name);

        if (existing) {
            existing.gamesPlayed += season.gamesPlayed ?? 0;
            existing.firstSeason = Math.min(existing.firstSeason, season.season);
            existing.lastSeason = Math.max(existing.lastSeason, season.season);
        } else {
            spans.set(name, {
                name,
                gamesPlayed: season.gamesPlayed ?? 0,
                firstSeason: season.season,
                lastSeason: season.season,
            });
        }
    }

    return [...spans.values()].sort(
        (a, b) => a.firstSeason - b.firstSeason || b.gamesPlayed - a.gamesPlayed
    );
};

function Panel({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="player__panel">
            <h2 className="player__panel-title">{title}</h2>
            {children}
        </section>
    );
}

function SeasonStats({ title, line, isGoalie }: { title: string; line: ISeasonTotal | ICareerLine; isGoalie: boolean }) {
    const cells = isGoalie ? buildGoalieCells(line) : buildSkaterCells(line);

    return (
        <Panel title={title}>
            <div className="player__table-scroll">
                <table className="player__stat-table">
                    <thead>
                        <tr>
                            {cells.map((cell) => (
                                <th key={cell.label} scope="col">{cell.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {cells.map((cell) => (
                                <td key={cell.label}>{cell.value}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}

function CareerStats({
    regular,
    playoffs,
    isGoalie,
}: {
    regular: ICareerLine;
    playoffs?: ICareerLine;
    isGoalie: boolean;
}) {
    const [split, setSplit] = useState<'regular' | 'playoffs'>('regular');
    const hasPlayoffs = Boolean(playoffs && playoffs.gamesPlayed);
    const line = split === 'playoffs' && hasPlayoffs && playoffs ? playoffs : regular;
    const rows = buildCareerRows(line, isGoalie);

    return (
        <Panel title="Career">
            {hasPlayoffs && (
                <div className="player__career-tabs" role="tablist" aria-label="Career splits">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={split === 'regular'}
                        className={`player__career-tab${split === 'regular' ? ' player__career-tab--active' : ''}`}
                        onClick={() => setSplit('regular')}
                    >
                        Regular
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={split === 'playoffs'}
                        className={`player__career-tab${split === 'playoffs' ? ' player__career-tab--active' : ''}`}
                        onClick={() => setSplit('playoffs')}
                    >
                        Playoffs
                    </button>
                </div>
            )}

            <div className="player__career-list">
                {rows.map((row) => (
                    <div className="player__career-item" key={row.label}>
                        <span className="player__career-label">{row.label}</span>
                        <span className="player__career-value">{row.value}</span>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

function FormChart({ games, isGoalie }: { games: ILast5Game[]; isGoalie: boolean }) {
    if (games.length === 0) {
        return null;
    }

    const recent = games.slice(0, 5);
    const maxPoints = Math.max(...recent.map((game) => game.points ?? 0), 1);

    const getRatio = (game: ILast5Game): number => {
        if (isGoalie) {
            const savePctg = game.savePctg ?? 0.5;
            return Math.min(1, Math.max(0.08, (savePctg - 0.5) / 0.5));
        }

        return Math.max(0.08, (game.points ?? 0) / maxPoints);
    };

    const getValue = (game: ILast5Game): string => {
        if (isGoalie) {
            return game.savePctg === undefined ? '—' : (game.savePctg * 100).toFixed(0);
        }

        return String(game.points ?? 0);
    };

    return (
        <Panel title={`Last 5 games · ${isGoalie ? 'SV%' : 'PTS'}`}>
            <div className="player__form-chart">
                {recent.map((game) => (
                    <div className="player__form-game" key={game.gameId}>
                        <span className="player__form-value">{getValue(game)}</span>
                        <div
                            className="player__form-track"
                            title={`${formatGameDate(game.gameDate)} vs ${game.opponentAbbrev}`}
                        >
                            <div
                                className="player__form-bar"
                                style={{ height: `${getRatio(game) * 100}%` }}
                            />
                        </div>
                        <Link
                            className="player__form-opp"
                            to={`/game/${game.gameId}`}
                            aria-label={`Game against ${game.opponentAbbrev} on ${formatGameDate(game.gameDate)}`}
                        >
                            vs {game.opponentAbbrev}
                        </Link>
                        <span className="player__form-date">{formatGameDate(game.gameDate)}</span>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

function TeamsTimeline({ teams, logos }: { teams: INhlTeamSpan[]; logos: Map<string, ITeam> }) {
    if (teams.length === 0) {
        return null;
    }

    const maxGames = Math.max(...teams.map((team) => team.gamesPlayed), 1);

    return (
        <Panel title="NHL teams">
            <div className="player__teams-list">
                {teams.map((team) => {
                    const info = logos.get(team.name);

                    return (
                        <div className="player__team" key={team.name}>
                            {info ? (
                                <img
                                    className="player__team-logo"
                                    src={info.teamLogo}
                                    alt={info.teamAbbrev.default}
                                    loading="lazy"
                                    title={team.name}
                                />
                            ) : (
                                <span className="player__team-logo" aria-hidden="true" />
                            )}
                            <div className="player__team-info">
                                <span className="player__team-abbrev">
                                    {info?.teamAbbrev.default ?? team.name}
                                </span>
                                <span className="player__team-span">
                                    {formatSeasonSpan(team.firstSeason, team.lastSeason)}
                                </span>
                            </div>
                            <span className="player__team-gp">
                                <strong>{team.gamesPlayed}</strong> GP
                            </span>
                            <div className="player__team-bar">
                                <div
                                    className="player__team-bar-fill"
                                    style={{ width: `${(team.gamesPlayed / maxGames) * 100}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </Panel>
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
        <div className="player__seasons player__panel">
            <h2 className="player__panel-title">Season totals</h2>
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
    const seasons = player.seasonTotals ?? [];
    const nhlSeasons = seasons.filter((season) => season.leagueAbbrev === 'NHL');
    const latestSeason = nhlSeasons.reduce((max, season) => Math.max(max, season.season), 0);
    const currentRegular = nhlSeasons.find(
        (season) => season.season === latestSeason && season.gameTypeId === 2
    );
    const currentPlayoffs = nhlSeasons.find(
        (season) => season.season === latestSeason && season.gameTypeId === 3
    );

    const careerLine: ICareerLine | undefined =
        player.careerTotals?.regularSeason ?? player.featuredStats?.regularSeason?.career;
    const careerPlayoffs = player.careerTotals?.playoffs;

    const teamsTimeline = getNhlTeams(seasons);
    const teamLogos = new Map(teams.map((team) => [team.teamName.default, team]));

    const honors: string[] = [];
    if (player.inHHOF) honors.push('HHOF');
    if (player.inTop100AllTime) honors.push('NHL Top 100');

    return (
        <section className="player container">
            <div className="player__layout">
                <aside className="player__profile">
                    <div className="player__hero-card">
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

                            {player.draftDetails && (
                                <p className="player__draft-inline">
                                    <span className="player__draft-label">Draft</span>
                                    {player.draftDetails.year} · {player.draftDetails.teamAbbrev} · R{player.draftDetails.round} #{player.draftDetails.overallPick}
                                </p>
                            )}

                            {honors.length > 0 && (
                                <div className="player__honors">
                                    {honors.map((honor) => (
                                        <span className="player__honor" key={honor}>{honor}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="player__details player__panel">
                        <h2 className="player__panel-title">Profile</h2>
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
                </aside>

                <div className="player__main">
                    {currentRegular && (
                        <SeasonStats
                            title={`Regular season · ${formatSeason(latestSeason)}`}
                            line={currentRegular}
                            isGoalie={isGoalie}
                        />
                    )}

                    {currentPlayoffs && (
                        <SeasonStats
                            title={`Playoffs · ${formatSeason(latestSeason)}`}
                            line={currentPlayoffs}
                            isGoalie={isGoalie}
                        />
                    )}

                    <FormChart games={player.last5Games ?? []} isGoalie={isGoalie} />
                </div>

                <aside className="player__side">
                    {careerLine && (
                        <CareerStats
                            regular={careerLine}
                            playoffs={careerPlayoffs}
                            isGoalie={isGoalie}
                        />
                    )}

                    <TeamsTimeline teams={teamsTimeline} logos={teamLogos} />
                </aside>
            </div>

            <SeasonTable seasons={seasons} isGoalie={isGoalie} />
        </section>
    );
}
