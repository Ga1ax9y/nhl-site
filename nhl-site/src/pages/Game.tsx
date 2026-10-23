import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchGameBoxscore, fetchGameLanding } from "../services/nhlApi";
import type {
  IGameBoxscore,
  IGameGoal,
  IGameLanding,
  IGamePenalty,
  IGameStar,
  IGameTeam,
  IMatchupLeader,
} from "../types/game";
import Loader from "../components/layout/loader/Loader";

const FINISHED_STATES = new Set<string>(["FINAL", "OFF", "OVER"]);
const LIVE_STATES = new Set<string>(["LIVE", "CRIT"]);

const STRENGTH_LABELS: Record<string, string> = {
  ev: "EV",
  pp: "PP",
  sh: "SH",
};

const formatTime = (startTimeUTC: string): string =>
  new Date(startTimeUTC).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const formatDate = (startTimeUTC: string): string =>
  new Date(startTimeUTC).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const periodLabel = (period: number): string => {
  const suffix = period === 1 ? "st" : period === 2 ? "nd" : period === 3 ? "rd" : "th";
  return `${period}${suffix} period`;
};

const toSeconds = (timeInPeriod: string): number => {
  const [minutes, seconds] = timeInPeriod.split(":").map(Number);
  return minutes * 60 + seconds;
};

const penaltyPlayer = (penalty: IGamePenalty): string => {
  const player = penalty.committedByPlayer;
  if (!player) return "Unknown player";
  const name = `${player.firstName?.default ?? ""} ${player.lastName?.default ?? ""}`.trim();
  return name || "Unknown player";
};

const penaltyPlayerId = (
  penalty: IGamePenalty,
  playerIds: Map<string, number>,
): number | undefined => {
  const player = penalty.committedByPlayer;
  if (!player) return undefined;
  if (player.playerId) return player.playerId;
  if (player.sweaterNumber === undefined) return undefined;
  return playerIds.get(`${penalty.teamAbbrev.default}:${player.sweaterNumber}`);
};

const boxscorePlayerIndex = (boxscore: IGameBoxscore): Map<string, number> => {
  const index = new Map<string, number>();
  const teams: Array<[IGameTeam, IGameBoxscore["playerByGameStats"]["awayTeam"]]> = [
    [boxscore.awayTeam, boxscore.playerByGameStats.awayTeam],
    [boxscore.homeTeam, boxscore.playerByGameStats.homeTeam],
  ];

  for (const [team, stats] of teams) {
    for (const player of [...stats.forwards, ...stats.defense, ...stats.goalies]) {
      index.set(`${team.abbrev}:${player.sweaterNumber}`, player.playerId);
    }
  }

  return index;
};

function PlayerLink({
  playerId,
  strong,
  children,
}: {
  playerId?: number;
  strong?: boolean;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  if (!playerId) {
    return strong ? <strong>{children}</strong> : <>{children}</>;
  }

  return (
    <button
      className={strong ? "game__player-link game__player-link--strong" : "game__player-link"}
      type="button"
      onClick={() => navigate(`/player/${playerId}`)}
    >
      {children}
    </button>
  );
}

const statusLabel = (game: IGameLanding): string => {
  if (FINISHED_STATES.has(game.gameState)) {
    if (game.gameOutcome?.lastPeriodType === "OT") return "Final / OT";
    if (game.gameOutcome?.lastPeriodType === "SO") return "Final / SO";
    return "Final";
  }

  if (LIVE_STATES.has(game.gameState)) {
    if (game.clock?.inIntermission) return "Intermission";
    const period = game.periodDescriptor?.number;
    return period
      ? `${periodLabel(period)} · ${game.clock?.timeRemaining ?? ""}`.trim()
      : "Live";
  }

  return `${formatDate(game.startTimeUTC)} · ${formatTime(game.startTimeUTC)}`;
};

function TeamBlock({ team }: { team: IGameTeam }) {
  return (
    <div className="game__team">
      <img className="game__logo" src={team.logo} alt={`${team.commonName.default} logo`} />
      <span className="game__team-name">{team.commonName.default}</span>
      {team.record && <span className="game__team-record">{team.record}</span>}
    </div>
  );
}

function MatchupPlayer({
  leader,
  side,
  onClick,
}: {
  leader: IMatchupLeader["awayLeader"];
  side: "away" | "home";
  onClick: () => void;
}) {
  return (
    <button
      className={`game__matchup-player game__matchup-player--${side}`}
      type="button"
      onClick={onClick}
    >
      {leader.headshot && (
        <img
          className="game__matchup-photo"
          src={leader.headshot}
          alt={leader.name.default}
          loading="lazy"
        />
      )}
      <span className="game__matchup-name">{leader.name.default}</span>
      <span className="game__matchup-value">{leader.value}</span>
    </button>
  );
}

function Preview({ game }: { game: IGameLanding }) {
  const navigate = useNavigate();
  const leaders = game.matchup?.skaterComparison?.leaders ?? [];

  if (leaders.length === 0) return null;

  return (
    <div className="game__panel">
      <h2 className="game__subtitle">Matchup</h2>
      <ul className="game__matchup">
        {leaders.map((leader) => (
          <li key={leader.category} className="game__matchup-row">
            <MatchupPlayer
              leader={leader.awayLeader}
              side="away"
              onClick={() => navigate(`/player/${leader.awayLeader.playerId}`)}
            />
            <span className="game__matchup-category">{leader.category}</span>
            <MatchupPlayer
              leader={leader.homeLeader}
              side="home"
              onClick={() => navigate(`/player/${leader.homeLeader.playerId}`)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function starStats(star: IGameStar): string {
  if (star.points !== undefined) {
    return `${star.goals ?? 0}G ${star.assists ?? 0}A ${star.points}P`;
  }
  if (star.savePctg !== undefined) {
    return `${(star.savePctg * 100).toFixed(1)} SV%`;
  }
  return "";
}

function ThreeStars({ stars }: { stars?: IGameStar[] }) {
  const navigate = useNavigate();

  if (!stars || stars.length === 0) return null;

  return (
    <div className="game__panel">
      <h2 className="game__subtitle">Three stars</h2>
      <ul className="game__stars">
        {stars.map((star) => (
          <li key={star.star}>
            <button
              className="game__star"
              type="button"
              onClick={() => navigate(`/player/${star.playerId}`)}
            >
              <span className="game__star-number">{star.star}</span>
              {star.headshot && (
                <img
                  className="game__star-photo"
                  src={star.headshot}
                  alt={star.name.default}
                  loading="lazy"
                />
              )}
              <span className="game__star-name">{star.name.default}</span>
              <span className="game__star-team">
                {star.teamAbbrev} · {star.position}
              </span>
              <span className="game__star-stat">{starStats(star)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreByPeriod({ game }: { game: IGameLanding }) {
  const periods = game.periodDescriptor?.number ?? 0;

  if (periods === 0) return null;

  const scoring = game.summary?.scoring ?? [];
  const awayPeriods: number[] = [];
  const homePeriods: number[] = [];
  let awayScore = 0;
  let homeScore = 0;

  for (let period = 1; period <= periods; period += 1) {
    const goals = scoring.find((entry) => entry.periodDescriptor.number === period)?.goals ?? [];
    const lastGoal = goals[goals.length - 1];

    if (lastGoal) {
      awayScore = lastGoal.awayScore;
      homeScore = lastGoal.homeScore;
    }

    awayPeriods.push(awayScore);
    homePeriods.push(homeScore);
  }

  const periodColumns = Array.from({ length: periods }, (_, index) => index + 1);

  return (
    <div className="game__panel">
      <h2 className="game__subtitle">Score by period</h2>
      <table className="game__table">
        <thead>
          <tr>
            <th>Team</th>
            {periodColumns.map((period) => (
              <th key={period}>{period}</th>
            ))}
            <th>T</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{game.awayTeam.abbrev}</td>
            {awayPeriods.map((value, index) => (
              <td key={index}>{value}</td>
            ))}
            <td className="game__table-total">{game.awayTeam.score ?? awayScore}</td>
          </tr>
          <tr>
            <td>{game.homeTeam.abbrev}</td>
            {homePeriods.map((value, index) => (
              <td key={index}>{value}</td>
            ))}
            <td className="game__table-total">{game.homeTeam.score ?? homeScore}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type ProtocolEvent =
  | { kind: "goal"; time: number; goal: IGameGoal }
  | { kind: "penalty"; time: number; penalty: IGamePenalty };

function Protocol({
  game,
  playerIds,
}: {
  game: IGameLanding;
  playerIds: Map<string, number>;
}) {
  const scoring = game.summary?.scoring ?? [];
  const penalties = game.summary?.penalties ?? [];
  const periodNumbers = Array.from(
    new Set([
      ...scoring.map((entry) => entry.periodDescriptor.number),
      ...penalties.map((entry) => entry.periodDescriptor.number),
    ]),
  ).sort((a, b) => a - b);

  if (periodNumbers.length === 0) return null;

  return (
    <div className="game__panel">
      <h2 className="game__subtitle">Protocol</h2>

      {periodNumbers.map((period) => {
        const goals = scoring.find((entry) => entry.periodDescriptor.number === period)?.goals ?? [];
        const periodPenalties =
          penalties.find((entry) => entry.periodDescriptor.number === period)?.penalties ?? [];

        const events: ProtocolEvent[] = [
          ...goals.map((goal): ProtocolEvent => ({
            kind: "goal",
            time: toSeconds(goal.timeInPeriod),
            goal,
          })),
          ...periodPenalties.map((penalty): ProtocolEvent => ({
            kind: "penalty",
            time: toSeconds(penalty.timeInPeriod),
            penalty,
          })),
        ].sort((a, b) => a.time - b.time);

        return (
          <div key={period} className="game__period">
            <h3 className="game__period-title">{periodLabel(period)}</h3>
            <ul className="game__events">
              {events.map((event) => {
                if (event.kind === "goal") {
                  const { goal } = event;
                  const strength = goal.strength ? STRENGTH_LABELS[goal.strength] : undefined;
                  const assists = goal.assists ?? [];

                  return (
                    <li key={`goal-${event.time}-${goal.playerId}`} className="game__event">
                      <span className="game__event-time">{goal.timeInPeriod}</span>
                      <span className="game__event-team">{goal.teamAbbrev.default}</span>
                      <span className="game__event-text">
                        <PlayerLink playerId={goal.playerId} strong>
                          {goal.name.default}
                        </PlayerLink>
                        {strength && <span className="game__event-badge">{strength}</span>}
                        {assists.length > 0 && (
                          <span className="game__event-assists">
                            {" ("}
                            {assists.map((assist, index) => (
                              <Fragment key={assist.playerId}>
                                {index > 0 && ", "}
                                <PlayerLink playerId={assist.playerId}>
                                  {assist.name.default}
                                </PlayerLink>
                              </Fragment>
                            ))}
                            {")"}
                          </span>
                        )}
                      </span>
                      <span className="game__event-score">
                        {goal.awayScore} : {goal.homeScore}
                      </span>
                    </li>
                  );
                }

                const { penalty } = event;
                return (
                  <li
                    key={`penalty-${event.time}-${penaltyPlayer(penalty)}`}
                    className="game__event game__event--penalty"
                  >
                    <span className="game__event-time">{penalty.timeInPeriod}</span>
                    <span className="game__event-team">{penalty.teamAbbrev.default}</span>
                    <span className="game__event-text">
                      <PlayerLink playerId={penaltyPlayerId(penalty, playerIds)}>
                        {penaltyPlayer(penalty)}
                      </PlayerLink>
                      {" · "}
                      {penalty.duration} min {penalty.descKey}
                    </span>
                    <span className="game__event-score">{penalty.duration}:00</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<IGameLanding | null>(null);
  const [playerIds, setPlayerIds] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        setError("");
        setPlayerIds(new Map());
        if (!gameId) return;
        const landing = await fetchGameLanding(gameId);
        setGame(landing);
        if (landing.summary?.penalties?.length) {
          fetchGameBoxscore(gameId)
            .then((boxscore) => setPlayerIds(boxscorePlayerIndex(boxscore)))
            .catch((err) => console.error(err));
        }
      } catch (err) {
        setError("Error loading game");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  if (loading) {
    return (
      <section className="game container">
        <h1 className="page-title">Game</h1>
        <Loader label="Loading game..." />
      </section>
    );
  }

  if (error) return <div className="error-message container">{error}</div>;
  if (!game) return <div className="error-message container">Game not found</div>;

  document.title = `NHL | ${game.awayTeam.abbrev} @ ${game.homeTeam.abbrev}`;

  const finished = FINISHED_STATES.has(game.gameState);
  const live = LIVE_STATES.has(game.gameState);
  const awayWins = (game.awayTeam.score ?? 0) > (game.homeTeam.score ?? 0);
  const homeWins = (game.homeTeam.score ?? 0) > (game.awayTeam.score ?? 0);

  return (
    <section className="game container">
      <Link className="game__back" to="/schedule">
        ← Back to schedule
      </Link>

      <h1 className="page-title">
        {game.awayTeam.abbrev} @ {game.homeTeam.abbrev}
      </h1>

      <div className="game__header">
        <TeamBlock team={game.awayTeam} />

        <div className="game__status">
          {finished || live ? (
            <span className="game__score">
              <span className={awayWins ? "game__score-value game__score-value--win" : "game__score-value"}>
                {game.awayTeam.score ?? 0}
              </span>
              <span className="game__score-sep">:</span>
              <span className={homeWins ? "game__score-value game__score-value--win" : "game__score-value"}>
                {game.homeTeam.score ?? 0}
              </span>
            </span>
          ) : (
            <span className="game__time">{formatTime(game.startTimeUTC)}</span>
          )}

          <span className={live ? "game__status-label game__status-label--live" : "game__status-label"}>
            {statusLabel(game)}
          </span>
          <span className="game__venue">{game.venue.default}</span>
        </div>

        <TeamBlock team={game.homeTeam} />
      </div>

      <Preview game={game} />
      <ThreeStars stars={game.summary?.threeStars} />
      <ScoreByPeriod game={game} />
      <Protocol game={game} playerIds={playerIds} />
    </section>
  );
}
