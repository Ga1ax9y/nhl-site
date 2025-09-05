import { useEffect, useRef, useState } from "react";
import { fetchSeasonById, fetchSeasons, fetchStats } from "../services/nhlApi";
import type { IGoalie, IPlayer, ISkater } from "../types/player";
import type { IStats } from "../types/stats";
import type { StatsCategory} from "../types/statsCategory";
import StatsTable from "../components/features/StatsTable";
import ScrollToTop from "../components/layout/scrollToTop/ScrollToTop";
import Controls from "../components/features/Controls";
import { useNavigate, useParams } from "react-router-dom";
import type { ISeason } from "../types/season";
import SeasonSelector from "../components/features/Dropdown";

export default function Stats() {
  const { season } = useParams<{ season: string }>();
  const navigate = useNavigate();
  const [seasons, setSeasons] = useState<ISeason[]>([]);
  const [stats, setStats] = useState<IStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skaterCategory, setSkaterCategory] = useState<StatsCategory>('points');
  const [goalieCategory, setGoalieCategory] = useState<StatsCategory>('savePctg');
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const bodyScrollPositionRef = useRef(0);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'skater' | 'goalie'>('skater');


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
    if (showModal) {
      bodyScrollPositionRef.current = window.scrollY;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${bodyScrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      window.scrollTo(0, bodyScrollPositionRef.current);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [showModal]);

  useEffect(() => {

    const loadStats = async () => {
      try {
        setLoading(true);
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

  if (loading) {
    return (
      <section className="stats container">
        <div className="stats__loader">
          <div className="loader-spinner"></div>
          <p>Loading...</p>
        </div>
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
  const top5Skaters = allSkaters.slice(0, 5);
  const skatersForModal = allSkaters.slice(0, 51);

  const allGoalies = getCurrentStatsGoalies();
  const top5Goalies = allGoalies.slice(0, 5);
  const goaliesForModal = allGoalies.slice(0, 51);

  const openModal = (type: 'skater' | 'goalie') => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <section className="stats container">
      <h1 className="stats__title">Skater stats</h1>
        <Controls<StatsCategory>
          category={skaterCategory}
          setCategory={setSkaterCategory}
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
            players={top5Skaters}
            category={skaterCategory}
            categoryLabel={getSkaterCategoryLabel()}
            getStatValue={getStatValueSkater}
            type="skater"
          />
          <button
            className="stats__button"
            onClick={() => openModal('skater')}
            aria-label="Show more skater stats"
            type="button"
          >
            See more
          </button>
        </div>

        <h1 className="stats__title">Goalie stats</h1>
        <Controls<StatsCategory>
          category={goalieCategory}
          setCategory={setGoalieCategory }
          type="goalie"
          season={season || ''}
        />
        <div className="stats__table-wrapper">
          <StatsTable
            players={top5Goalies}
            category={goalieCategory}
            categoryLabel={getGoalieCategoryLabel()}
            getStatValue={getStatValueGoalie}
            showDecimal={goalieCategory === "savePctg" || goalieCategory === "goalsAgainstAverage"}
            type="goalie"
          />
          <button
            className="stats__button"
            onClick={() => openModal('goalie')}
            aria-label="Show more goalie stats"
            type="button"
          >
            See more
          </button>
        </div>

        {showModal && (
        <div className="stats__modal-overlay" onClick={closeModal}>
          <div className="stats__modal" onClick={(e) => e.stopPropagation()} ref={modalContainerRef }>
            <button className="stats__modal-close" onClick={closeModal} aria-label="Close modal">
              ×
            </button>
            <h2 className="stats__modal-title">
              {modalType === 'skater' ? 'Skater stats' : 'Goalie stats'} (1–50)
            </h2>
            <StatsTable
              players={modalType === 'skater' ? skatersForModal : goaliesForModal}
              category={modalType === 'skater' ? skaterCategory : goalieCategory}
              categoryLabel={modalType === 'skater' ? getSkaterCategoryLabel() : getGoalieCategoryLabel()}
              getStatValue={modalType === 'skater' ? getStatValueSkater : getStatValueGoalie}
              showDecimal={
                modalType === 'goalie' &&
                (goalieCategory === 'savePctg' || goalieCategory === 'goalsAgainstAverage')
              }
              type={modalType}
            />
            <ScrollToTop container={modalContainerRef as React.RefObject<HTMLElement>} />
          </div>
        </div>
      )}
    </section>
  );
}
