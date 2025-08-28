import { useEffect, useState } from "react";
import type { ITeam} from "../types/team";
import { fetchSeasonById, fetchSeasons, fetchTeams } from "../services/nhlApi";
import StandingsTable from "../components/features/StandingsTable";
import { useNavigate, useParams } from "react-router-dom";
import Controls from "../components/features/Controls";
import type { StandingsCategory } from "../types/statsCategory";
import type { ISeason } from "../types/season";
import SeasonSelector from "../components/features/Dropdown";

type StandingsView = 'wildcard' | 'conference' | 'division' | 'league'
export default function Standings() {
  const { season } = useParams<{ season: string }>();
  const navigate = useNavigate();
  const [standings, setStandings] = useState<ITeam[]>([]);
  const [seasons, setSeasons] = useState<ISeason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<StandingsView>('conference');

  document.title = 'NHL | Standings';

  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const seasonsData = await fetchSeasons();
        setSeasons(seasonsData);
      } catch (err) {
        console.error('Error loading seasons:', err);
      }
    };

    loadSeasons();
  }, []);

  useEffect(() => {
    const loadStandings = async () => {
      try {
        setLoading(true);
        const currentSeason = await fetchSeasonById(season as string);
        const data: ITeam[] = await fetchTeams(currentSeason);
        setStandings(data);
      } catch (err) {
        setError('Error loading standings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (season) {
      loadStandings();
    }
  }, [season]);

  const handleSeasonChange = (seasonValue: string) => {
    navigate(`/standings/${seasonValue}`);
  };

  if (loading) {
    return (
      <section className="standings container">
        <Controls<StandingsCategory>
        category={currentView}
        setCategory={setCurrentView}
        type="standings"
        season={season || ''}/>
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
        <Controls<StandingsCategory>
          category={currentView}
          setCategory={setCurrentView}
          type="standings"
          season={season || ''}
        />
        <SeasonSelector
          seasons={seasons}
          selectedSeason={season || ''}
          onSeasonChange={handleSeasonChange}
          className="standings"

        />

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
