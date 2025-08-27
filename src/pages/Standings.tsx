import { useEffect, useState } from "react";
import type { ITeam} from "../types/team";
import { fetchTeams } from "../services/nhlApi";
import StandingsTable from "../components/features/StandingsTable";

type StandingsView = 'wildcard' | 'conference' | 'division' | 'league'
export default function Standings() {
  const [standings, setStandings] = useState<ITeam[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<StandingsView>('conference')

  document.title = 'NHL | Standings'

  useEffect(() => {
    const loadStandings = async () => {
      try {
        const data: ITeam[] = await fetchTeams()
        setStandings(data)
      }
      catch (err) {
        setError('Error loading standings')
        console.error(err)
      }
      finally {
        setLoading(false)
      }}
    loadStandings()}, [])


  if (loading) {
    return (
      <section className="standings container">
        <div className="standings__controls controls">
          {["wildcard", "division", "conference", "league"].map((view) => (
            <button
              key={view}
              className={`controls__button ${
                currentView === view ? "controls__button--active" : ""
              }`}
              onClick={() => setCurrentView(view as StandingsView)}
              type="button"
            >
              {view === "wildcard" ? "Wild Card" : view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
        <div className="standings__loader loader">
          <h1 className="standings__title">
            {currentView === "wildcard" ? "Wild Card" : currentView.charAt(0).toUpperCase() + currentView.slice(1)} Standings
          </h1>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error) return <div className="error-message container">{error}</div>
  const getWildcardTeams = (conference: string) => {
    const conferenceTeams = standings.filter((team) => team.conferenceName === conference);
    const top3Map: Record<string, number> = {};

    return conferenceTeams.filter((team) => {
      const division = team.divisionName;
      top3Map[division] = top3Map[division] || 0;
      if (top3Map[division] < 3) {
        top3Map[division]++;
        return false;
      }
      return true;
    });
  };
  return (
    <section className="standings container">
        <div className="standings__controls controls">
          {["wildcard", "division", "conference", "league"].map((view) => (
            <button
              key={view}
              className={`controls__button ${
                currentView === view ? "controls__button--active" : ""
              }`}
              onClick={() => setCurrentView(view as StandingsView)}
              type="button"
            >
              {view === "wildcard" ? "Wild Card" : view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

      {currentView === "league" && (
        <StandingsTable title="League Standings" teams={standings} />
      )}

      {currentView === "division" && (
        <>
          {(["Atlantic", "Metropolitan", "Central", "Pacific"] as const).map((division) => (
            <StandingsTable
              key={division}
              title={division}
              teams={standings.filter((t) => t.divisionName === division)}
            />
          ))}
        </>
      )}

      {currentView === "conference" && (
        <>
          <StandingsTable
            title="Eastern"
            teams={standings.filter((t) => t.conferenceName === "Eastern")}
          />
          <StandingsTable
            title="Western"
            teams={standings.filter((t) => t.conferenceName === "Western")}
          />
        </>
      )}

      {currentView === "wildcard" && (
        <>
          <StandingsTable
            title="Atlantic"
            teams={standings
              .filter((t) => t.conferenceName === "Eastern" && t.divisionName === "Atlantic")
              .slice(0, 3)}
          />
          <StandingsTable
            title="Metropolitan"
            teams={standings
              .filter((t) => t.conferenceName === "Eastern" && t.divisionName === "Metropolitan")
              .slice(0, 3)}
          />

          <StandingsTable
            title="Wild Card (Eastern)"
            teams={getWildcardTeams("Eastern")}
            showLineAfter={1}
          />

          <StandingsTable
            title="Central"
            teams={standings
              .filter((t) => t.conferenceName === "Western" && t.divisionName === "Central")
              .slice(0, 3)}
          />
          <StandingsTable
            title="Pacific"
            teams={standings
              .filter((t) => t.conferenceName === "Western" && t.divisionName === "Pacific")
              .slice(0, 3)}
          />

          <StandingsTable
            title="Wild Card (Western)"
            teams={getWildcardTeams("Western")}
            showLineAfter={1}
          />
        </>
      )}
    </section>
  );
}
