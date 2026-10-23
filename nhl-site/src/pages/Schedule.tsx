import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSchedule } from "../services/nhlApi";
import type { IGameDay, ILeagueSchedule, IScheduleGame } from "../types/schedule";
import Loader from "../components/layout/loader/Loader";

const getTodayISO = (): string => new Date().toLocaleDateString("en-CA");

const shiftDayISO = (dayISO: string, days: number): string => {
  const date = new Date(`${dayISO}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const formatDayTitle = (dateString: string): string =>
  new Date(`${dateString}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const formatTime = (startTimeUTC: string): string =>
  new Date(startTimeUTC).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const isFinished = (gameState: IScheduleGame["gameState"]): boolean =>
  gameState === "FINAL" || gameState === "OFF" || gameState === "OVER";

const isLive = (gameState: IScheduleGame["gameState"]): boolean =>
  gameState === "LIVE" || gameState === "CRIT";

const pickDay = (schedule: ILeagueSchedule, dayISO: string): IGameDay | undefined =>
  schedule.gameWeek.find((day) => day.date === dayISO) ??
  schedule.gameWeek.find((day) => day.games.length > 0) ??
  schedule.gameWeek[0];

export default function Schedule() {
  document.title = "NHL | Schedule";

  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [schedule, setSchedule] = useState<ILeagueSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const focusDate = selectedDate ?? getTodayISO();

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchSchedule(focusDate);
        setSchedule(data);
      } catch (err) {
        setError("Error loading schedule");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [focusDate]);

  const shiftDay = (days: number) => {
    setSelectedDate(shiftDayISO(focusDate, days));
  };

  if (loading) {
    return (
      <section className="schedule container">
        <h1 className="page-title">Schedule</h1>
        <Loader />
      </section>
    );
  }

  if (error) return <div className="error-message container">{error}</div>;
  if (!schedule) return <div className="error-message container">Schedule not found</div>;

  const currentDay = pickDay(schedule, focusDate);

  if (!currentDay) return <div className="error-message container">Schedule not found</div>;

  return (
    <section className="schedule container">
      <h1 className="page-title">Schedule</h1>

      <div className="schedule__nav">
        <button
          className="schedule__nav-button"
          onClick={() => shiftDay(-1)}
          aria-label="Previous day"
          type="button"
        >
          ←
        </button>
        <span className="schedule__nav-range">
          <span className="schedule__nav-date">{formatDayTitle(currentDay.date)}</span>
          <span className="schedule__nav-count">
            {currentDay.numberOfGames} games
          </span>
        </span>
        <button
          className="schedule__nav-button"
          onClick={() => shiftDay(1)}
          aria-label="Next day"
          type="button"
        >
          →
        </button>
        <button
          className="schedule__nav-button schedule__nav-button--wide"
          onClick={() => setSelectedDate(undefined)}
          type="button"
        >
          Today
        </button>
      </div>

      {currentDay.games.length === 0 && (
        <p className="schedule__no-games">No games on this day</p>
      )}

      {currentDay.games.length > 0 && (
        <ul className="schedule__list">
          {currentDay.games.map((game) => (
            <li key={game.id}>
              <Link className="schedule__game" to={`/game/${game.id}`}>
              <span className="schedule__game-logos">
                <img
                  className="schedule__team-logo"
                  src={game.homeTeam.logo}
                  alt={`${game.homeTeam.commonName.default} logo`}
                  loading="lazy"
                />
                <span className="schedule__team-name">
                  {game.homeTeam.commonName.default}
                </span>
              </span>

              <span className="schedule__game-status">
                {isFinished(game.gameState) && (
                  <span className="schedule__score">
                    <span className={game.homeTeam.score! >= game.awayTeam.score! ? "winner" : ""}>
                      {game.homeTeam.score}
                    </span>
                    <span>:</span>
                    <span className={game.awayTeam.score! > game.homeTeam.score! ? "winner" : ""}>
                      {game.awayTeam.score}
                    </span>
                  </span>
                )}
                {isLive(game.gameState) && (
                  <span className="schedule__status schedule__status--live">
                    {game.homeTeam.score ?? 0} : {game.awayTeam.score ?? 0} · {game.periodDescriptor?.number ?? ""}
                  </span>
                )}
                {(game.gameState === "FUT" || game.gameState === "PREG") && (
                  <span className="schedule__status">{formatTime(game.startTimeUTC)}</span>
                )}
                {game.gameType === 3 && (
                  <span className="schedule__tag schedule__tag--playoff">PO</span>
                )}
                {game.gameType === 1 && (
                  <span className="schedule__tag">PS</span>
                )}
              </span>

              <span className="schedule__game-logos">
                <span className="schedule__team-name">
                  {game.awayTeam.commonName.default}
                </span>
                <img
                  className="schedule__team-logo"
                  src={game.awayTeam.logo}
                  alt={`${game.awayTeam.commonName.default} logo`}
                  loading="lazy"
                />
              </span>

              <span className="schedule__game-venue">{game.venue.default}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
