import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__container">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__text">Страница не найдена</p>
        <p className="not-found__description">
          Запрошенная страница не существует или была перемещена
        </p>
        <Link to="/" className="not-found__link">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
