import { useEffect, useRef, useState, type AnimationEvent } from "react";
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

export default function Stats() {
  const { season } = useParams<{ season: string }>();
  const navigate = useNavigate();
  const [seasons, setSeasons] = useState<ISeason[]>([]);
  const [stats, setStats] = useState<IStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skaterCategory, setSkaterCategory] = useState<StatsCategory>('points');
  const [goalieCategory, setGoalieCategory] = useState<StatsCategory>('savePctg');
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const bodyScrollPositionRef = useRef(0);

  const [modalType, setModalType] = useState<'skater' | 'goalie' | null>(null);
  const [isClosing, setIsClosing] = useState(false);


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
    if (modalType) {
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
  }, [modalType]);

  useEffect(() => {
    if (!modalType) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsClosing(true);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalType]);

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
  const top5Skaters = allSkaters.slice(0, 5);
  const skatersForModal = allSkaters.slice(0, 51);

  const allGoalies = getCurrentStatsGoalies();
  const top5Goalies = allGoalies.slice(0, 5);
  const goaliesForModal = allGoalies.slice(0, 51);

  const openModal = (type: 'skater' | 'goalie', trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setIsClosing(false);
    setModalType(type);
  };

  const closeModal = () => {
    if (isClosing) return;
    setIsClosing(true);
  };

  const handleOverlayAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !isClosing) return;
    setModalType(null);
    setIsClosing(false);
    lastTriggerRef.current?.focus();
  };

  const modalPlayers = modalType === 'skater' ? skatersForModal : goaliesForModal;

  return (
    <section className="stats container">
      <h1 className="page-title">Skater stats</h1>
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
            onClick={(event) => openModal('skater', event.currentTarget)}
            aria-haspopup="dialog"
            aria-label="Show all skater stats"
            type="button"
          >
            See all {skatersForModal.length}
            <svg
              className="stats__button-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <h1 className="page-title">Goalie stats</h1>
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
            onClick={(event) => openModal('goalie', event.currentTarget)}
            aria-haspopup="dialog"
            aria-label="Show all goalie stats"
            type="button"
          >
            See all {goaliesForModal.length}
            <svg
              className="stats__button-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {modalType && (
        <div
          className={`stats__modal-overlay${isClosing ? ' stats__modal-overlay--closing' : ''}`}
          onClick={closeModal}
          onAnimationEnd={handleOverlayAnimationEnd}
        >
          <div
            className={`stats__modal${isClosing ? ' stats__modal--closing' : ''}`}
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="stats-modal-title"
          >
            <div className="stats__modal-header">
              <h2 className="stats__modal-title" id="stats-modal-title">
                {modalType === 'skater' ? 'Skater stats' : 'Goalie stats'} (1–{modalPlayers.length})
              </h2>
              <button
                className="stats__modal-close"
                onClick={closeModal}
                ref={closeButtonRef}
                aria-label="Close dialog"
                type="button"
              >
                ×
              </button>
            </div>
            <div className="stats__modal-body">
              <StatsTable
                players={modalPlayers}
                category={modalType === 'skater' ? skaterCategory : goalieCategory}
                categoryLabel={modalType === 'skater' ? getSkaterCategoryLabel() : getGoalieCategoryLabel()}
                getStatValue={modalType === 'skater' ? getStatValueSkater : getStatValueGoalie}
                showDecimal={
                  modalType === 'goalie' &&
                  (goalieCategory === 'savePctg' || goalieCategory === 'goalsAgainstAverage')
                }
                type={modalType}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
