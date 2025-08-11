import { useEffect, useState } from "react";
import type { ITeam} from "../types/team";
import { fetchTeams } from "../services/nhlApi";
import StandingsCell from "../components/features/StandingsCell";
export default function Standings() {
  const [standings, setStandings] = useState<ITeam[]>([])
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  document.title = 'NHL | Турнирная таблица'

  useEffect(() => {
    const loadStandings = async () => {
      try {
        const data: ITeam[] = await fetchTeams()
        setStandings(data)
      }
      catch (err) {
        setError('Ошибка загрузки команд')
        console.error(err)
      }
      finally {
        setLoading(false)
      }}
    loadStandings()}, [])
      if (loading){
      return (
        <section className="standings container">
          <div className="standings__loader loader">
            <h1 className="standings__title">Общая турнирная таблица</h1>
            <p>Загрузка команд...</p>
          </div>
        </section>
      )
    }
  return (
    <section className="standings container">
        <h1 className="standings__title">Общая турнирная таблица</h1>
        <table className="standings__table">
        <thead>
          <tr className="table-header">
            <th className="table-header__item"></th>
            <th className="table-header__item">Команда</th>
            <th className="table-header__item" data-short="И">
              <span className="long-text">Игры</span>
            </th>
            <th className="table-header__item" data-short="В">
              <span className="long-text">Победы</span>
            </th>
            <th className="table-header__item" data-short="П">
              <span className="long-text">Поражения</span>
            </th>
            <th className="table-header__item" data-short="О">
              <span className="long-text">Очки</span>
            </th>
          </tr>
        </thead>
          <tbody>
            {standings.map((team) => (
              <StandingsCell key={team.teamName.default} team={team} />
            ))}
          </tbody>
        </table>
    </section>
  );
}
