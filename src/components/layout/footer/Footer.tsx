import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">NHL Tracker</h3>
            <p className="footer__description">
              NHL Tracker is a website that provides information about the NHL.
              All data provided by NHL API.
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Navigation</h4>
            <ul className="footer__links">
              <li><Link to="/" className="footer__link">Home</Link></li>
              <li><Link to="/teams" className="footer__link">Teams</Link></li>
              <li><Link to="/standings" className="footer__link">Standings</Link></li>
              <li><Link to="/schedule" className="footer__link">Schedule</Link></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Links</h4>
            <ul className="footer__links">
              <li><a href="https://www.nhl.com" className="footer__link" target="_blank" rel="noopener noreferrer">Official NHL website</a></li>
              <li><a href="https://github.com/Zmalski/NHL-API-Reference" className="footer__link" target="_blank" rel="noopener noreferrer">NHL API</a></li>
              <li><a href="/privacy" className="footer__link">Privacy Policy</a></li>
              <li><a href="/terms" className="footer__link">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            © {currentYear} NHL Tracker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
