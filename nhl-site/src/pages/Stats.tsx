import { useEffect, useState } from "react";
import { fetchSeasonById, fetchSeasons, fetchStats } from "../services/nhlApi";
import type { IGoalie, IPlayer, ISkater } from "../types/player";
import type { IStats } from "../types/stats";
import type { StatsCategory} from "../types/statsCategory";
import StatsTable from "../components/features/StatsTable";
import Controls from "../components/features/Controls";
import Loader from "../components/layout/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import type { ISeason } from "../types/season";
import SeasonSelector from "../components/features/Dropdown";

const PAGE_SIZE = 5;

const getPageItems = (current: number, total: number): Array<number | 'gap'> => {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'gap', total];
  if (current >= total - 3) return [1, 'gap', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'gap', current - 1, current, current + 1, 'gap', total];
};

function Pagination({
  page,
  pageCount,
  onChange,
  label,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  label: string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav className="stats__pagination" aria-label={label}>
      <button
        className="stats__pagination-button stats__pagination-button--arrow"
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {getPageItems(page, pageCount).map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} className="stats__pagination-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            className={`stats__pagination-button ${
              item === page ? 'stats__pagination-button--active' : ''
            }`}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
          >
            {item}
          </button>
        )
      )}

      <button
        className="stats__pagination-button stats__pagination-button--arrow"
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}

export default function Stats() {
  const { season } = useParams<{ season: string }>();
  const navigate = useNavigate();
  const [seasons, setSeasons] = useState<ISeason[]>([]);
  const [stats, setStats] = useState<IStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skaterCategory, setSkaterCategory] = useState<StatsCategory>('points');
  const [goalieCategory, setGoalieCategory] = useState<StatsCategory>('savePctg');
  const [skaterPage, setSkaterPage] = useState(1);
  const [goaliePage, setGoaliePage] = useState(1);

  document.title = 'NHL | Stats';

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

    const loadStats = async () => {
      try {
        setLoading(true);
        setSkaterPage(1);
        setGoaliePage(1);
        const currentSeason = await fetchSeasonById(season as string);
        const data = await fetchStats(currentSeason);
        setStats(data);
      } catch (err) {
        setError('Error loading stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [season]);

  const getCurrentStatsSkaters = (): IPlayer[] => {
    if (!stats) return [];
    switch (skaterCategory) {
      case 'points': return stats.points;
      case 'goals': return stats.goals;
      case 'assists': return stats.assists;
      case 'plusMinus': return stats.plusMinus;

      default: return [];
    }
  };

  const getCurrentStatsGoalies = (): IPlayer[] => {
    if (!stats) return [];
    switch (goalieCategory) {
      case 'savePctg': return stats.savePctg;
      case 'goalsAgainstAverage': return stats.goalsAgainstAverage;
      case 'shutouts': return stats.shutouts;
      case 'wins': return stats.wins;
      default: return [];
    }
  };

  const getSkaterCategoryLabel = () => {
    switch (skaterCategory) {
      case 'points': return 'points';
      case 'goals': return 'goals';
      case 'assists': return 'assists';
      case 'plusMinus': return '+/-';
      default: return '';
    }
  };

  const getGoalieCategoryLabel = () => {
    switch (goalieCategory) {
      case 'savePctg': return 'SV %';
      case 'goalsAgainstAverage': return 'GAA';
      case 'shutouts': return 'SO';
      case 'wins': return 'wins';
      default: return '';
    }
  };

  const getStatValueSkater = (player: IPlayer) => {
    switch (skaterCategory) {
      case 'points': return (player as ISkater).value || 0;
      case 'goals': return (player as ISkater).value || 0;
      case 'assists': return (player as ISkater).value || 0;
      case 'plusMinus': return (player as ISkater).value || 0;
      default: return 0;
    }
  };

  const getStatValueGoalie = (player: IPlayer) => {
    switch (goalieCategory) {
      case 'savePctg': return (player as IGoalie).value * 100 || 0;
      case 'goalsAgainstAverage': return (player as IGoalie).value || 0;
      case 'shutouts': return (player as IGoalie).value || 0;
      case 'wins': return (player as IGoalie).value || 0;
      default: return 0;
    }
  };

  const handleSeasonChange = (seasonValue: string) => {
    navigate(`/stats/${seasonValue}`);
  };

  const handleSkaterCategoryChange = (category: StatsCategory) => {
    setSkaterCategory(category);
    setSkaterPage(1);
  };

  const handleGoalieCategoryChange = (category: StatsCategory) => {
    setGoalieCategory(category);
    setGoaliePage(1);
  };

  if (loading) {
    return (
      <section className="stats container">
        <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section className="stats container">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="stats container">
        <div className="stats__error">
          <p>Stats not found</p>
        </div>
      </section>
    );
  }

  const allSkaters = getCurrentStatsSkaters();
  const skaterPageCount = Math.ceil(allSkaters.length / PAGE_SIZE);
  const currentSkaterPage = Math.min(skaterPage, Math.max(skaterPageCount, 1));
  const skaterPagePlayers = allSkaters.slice(
    (currentSkaterPage - 1) * PAGE_SIZE,
    currentSkaterPage * PAGE_SIZE
  );

  const allGoalies = getCurrentStatsGoalies();
  const goaliePageCount = Math.ceil(allGoalies.length / PAGE_SIZE);
  const currentGoaliePage = Math.min(goaliePage, Math.max(goaliePageCount, 1));
  const goaliePagePlayers = allGoalies.slice(
    (currentGoaliePage - 1) * PAGE_SIZE,
    currentGoaliePage * PAGE_SIZE
  );

  return (
    <section className="stats container">
      <h1 className="page-title">Skater stats</h1>
        <Controls<StatsCategory>
          category={skaterCategory}
          setCategory={handleSkaterCategoryChange}
          type="skater"
          season={season || ''}
        />
        <SeasonSelector
          seasons={seasons}
          selectedSeason={season || ''}
          onSeasonChange={handleSeasonChange}
          className="stats"

                />
        <div className="stats__table-wrapper">
          <StatsTable
            players={skaterPagePlayers}
            category={skaterCategory}
            categoryLabel={getSkaterCategoryLabel()}
            getStatValue={getStatValueSkater}
            startIndex={(currentSkaterPage - 1) * PAGE_SIZE}
            type="skater"
          />
          <Pagination
            page={currentSkaterPage}
            pageCount={skaterPageCount}
            onChange={setSkaterPage}
            label="Skater stats pages"
          />
        </div>

        <h1 className="page-title">Goalie stats</h1>
        <Controls<StatsCategory>
          category={goalieCategory}
          setCategory={handleGoalieCategoryChange}
          type="goalie"
          season={season || ''}
        />
        <div className="stats__table-wrapper">
          <StatsTable
            players={goaliePagePlayers}
            category={goalieCategory}
            categoryLabel={getGoalieCategoryLabel()}
            getStatValue={getStatValueGoalie}
            showDecimal={goalieCategory === "savePctg" || goalieCategory === "goalsAgainstAverage"}
            startIndex={(currentGoaliePage - 1) * PAGE_SIZE}
            type="goalie"
          />
          <Pagination
            page={currentGoaliePage}
            pageCount={goaliePageCount}
            onChange={setGoaliePage}
            label="Goalie stats pages"
          />
        </div>
    </section>
  );
}
