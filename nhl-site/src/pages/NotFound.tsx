import { Link } from "react-router-dom";

export default function NotFoundPage() {
  document.title = "NHL | Page not found";
  return (
    <div className="not-found">
      <div className="not-found__container">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__text">Page not found</p>
        <p className="not-found__description">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="not-found__link button">
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
